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

以下のJSON形式で5つの検索結果を生成してください：

[
  {
    "title": "検索結果のタイトル",
    "url": "実際にありそうなURL（例：https://example.com）",
    "description": "検索結果の説明文（2-3行程度）",
    "hasImage": true/false
  }
]

要求事項：
- 実際に存在しそうなWebサイトの検索結果を模擬
- タイトルは魅力的で関連性の高いもの
- URLは実際のドメイン名を使用（ただし架空のパス）
- 説明文は有用で具体的な情報を含む
- hasImageは結果によって適切に設定
- 日本語で回答
- JSONのみを返し、他の説明は不要
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // JSONのみを抽出（マークダウンコードブロックがある場合は削除）
    text = text
      .replace(/```json\n?/, '')
      .replace(/```\n?$/, '')
      .trim();

    try {
      const searchResults = JSON.parse(text);

      // 結果の検証
      if (!Array.isArray(searchResults)) {
        throw new Error('Invalid response format');
      }

      return NextResponse.json({
        results: searchResults,
        query,
        totalResults: `約 ${Math.floor(Math.random() * 10000000).toLocaleString()} 件`,
        time: `${(Math.random() * 0.5 + 0.1).toFixed(2)} 秒`,
      });
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Raw response:', text);

      // フォールバック: 基本的な検索結果を生成
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

      return NextResponse.json({
        results: fallbackResults,
        query,
        totalResults: `約 ${Math.floor(Math.random() * 1000000).toLocaleString()} 件`,
        time: `${(Math.random() * 0.5 + 0.1).toFixed(2)} 秒`,
      });
    }
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
