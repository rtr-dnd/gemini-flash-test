import {GoogleGenerativeAI} from '@google/generative-ai';
import {NextRequest, NextResponse} from 'next/server';

// Gemini APIの設定
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const {query} = await request.json();

    if (!query) {
      return NextResponse.json({error: 'Query is required'}, {status: 400});
    }

    // APIキーの存在確認
    if (!process.env.GOOGLE_AI_API_KEY) {
      console.error('GOOGLE_AI_API_KEY is not set');
      return NextResponse.json(
        {error: 'API key not configured'},
        {status: 500},
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite-preview-06-17',
    });

    const prompt = `
あなたはGoogle検索エンジンです。ユーザーの検索クエリ「${query}」に対して、実際のWeb検索結果のような情報を生成してください。

以下のJSON形式で8つの検索結果を一つずつ順番に生成してください。各結果は個別のJSONオブジェクトとして出力し、最初に{"isComplete":false}を出力してから各結果を出力し、最後に{"isComplete":true,"totalResults":"約 X 件","time":"X 秒"}を出力してください：

{"isComplete":false}
{"title": "検索結果のタイトル1", "url": "実際にありそうなURL", "description": "検索結果の説明文", "hasImage": true/false}
{"title": "検索結果のタイトル2", "url": "実際にありそうなURL", "description": "検索結果の説明文", "hasImage": true/false}
{"title": "検索結果のタイトル3", "url": "実際にありそうなURL", "description": "検索結果の説明文", "hasImage": true/false}
{"title": "検索結果のタイトル4", "url": "実際にありそうなURL", "description": "検索結果の説明文", "hasImage": true/false}
{"title": "検索結果のタイトル5", "url": "実際にありそうなURL", "description": "検索結果の説明文", "hasImage": true/false}
{"title": "検索結果のタイトル6", "url": "実際にありそうなURL", "description": "検索結果の説明文", "hasImage": true/false}
{"title": "検索結果のタイトル7", "url": "実際にありそうなURL", "description": "検索結果の説明文", "hasImage": true/false}
{"title": "検索結果のタイトル8", "url": "実際にありそうなURL", "description": "検索結果の説明文", "hasImage": true/false}
{"isComplete":true,"totalResults":"約 X 件","time":"X 秒"}

要求事項：
- 各行は有効なJSONオブジェクトである必要があります
- 実際に存在しそうなWebサイトの検索結果を模擬
- タイトルは魅力的で関連性の高いもの
- URLは実際のドメイン名を使用（ただし架空のパス）
- 説明文は有用で具体的な情報を含む
- hasImageは結果によって適切に設定
- 日本語で回答
- 各JSONオブジェクトを改行で区切る
- 他の説明やマークダウンは不要
`;

    // ストリーミング生成を開始
    const result = await model.generateContentStream(prompt);

    // ReadableStreamを作成してストリーミングレスポンスを返す
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let buffer = '';

          for await (const chunk of result.stream) {
            const text = chunk.text();
            buffer += text;

            // 改行で分割して各JSONオブジェクトを処理
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // 最後の不完全な行をバッファに保持

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine) {
                try {
                  // JSONとして有効かチェック
                  JSON.parse(trimmedLine);
                  // 有効なJSONの場合、チャンクとして送信
                  // eslint-disable-next-line n/no-unsupported-features/node-builtins
                  controller.enqueue(
                    new TextEncoder().encode(`data: ${trimmedLine}\n\n`),
                  );
                } catch {
                  // 無効なJSONの場合はスキップ
                }
              }
            }
          }

          // 残りのバッファを処理
          if (buffer.trim()) {
            try {
              JSON.parse(buffer.trim());
              // eslint-disable-next-line n/no-unsupported-features/node-builtins
              controller.enqueue(
                new TextEncoder().encode(`data: ${buffer.trim()}\n\n`),
              );
            } catch {
              // 無効なJSONの場合はスキップ
            }
          }

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);

          // エラーの場合はフォールバック結果をストリーミング
          const fallbackResults = [
            {
              title: `${query}について - Wikipedia`,
              url: `https://ja.wikipedia.org/wiki/${encodeURIComponent(query)}`,
              description: `${query}に関する詳細な情報をWikipediaで確認できます。歴史、概要、関連情報などを包括的に解説しています。`,
              hasImage: false,
            },
            {
              title: `${query} - Google検索`,
              url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
              description: `${query}に関する最新の情報と関連サイトを検索できます。ニュース、画像、動画など様々な形式の結果を確認できます。`,
              hasImage: true,
            },
          ];

          // eslint-disable-next-line n/no-unsupported-features/node-builtins
          controller.enqueue(
            new TextEncoder().encode('data: {"isComplete":false}\n\n'),
          );

          for (const result of fallbackResults) {
            // eslint-disable-next-line n/no-unsupported-features/node-builtins
            controller.enqueue(
              new TextEncoder().encode(`data: ${JSON.stringify(result)}\n\n`),
            );
          }

          // eslint-disable-next-line n/no-unsupported-features/node-builtins
          controller.enqueue(
            new TextEncoder().encode(
              `data: {"isComplete":true,"totalResults":"約 ${Math.floor(Math.random() * 1000000).toLocaleString()} 件","time":"${(Math.random() * 0.5 + 0.1).toFixed(2)} 秒"}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Search API error:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate search results',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      {status: 500},
    );
  }
}
