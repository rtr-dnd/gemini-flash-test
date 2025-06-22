import {GoogleGenerativeAI} from '@google/generative-ai';
import {NextRequest, NextResponse} from 'next/server';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const {query} = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json({suggestions: []});
    }

    // Use Gemini 2.5 Flash Lite model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite-preview-06-17',
    });

    const prompt = `あなたは検索サジェスト機能です。ユーザーが入力した検索クエリに対して、日本語で自然で役立つ検索候補を最大8個生成してください。

入力クエリ: "${query}"

以下の形式で回答してください：
- 各候補は改行で区切る
- 候補のみを出力し、説明や番号は不要
- Googleの検索サジェストのような自然な候補にする
- 入力クエリに関連する一般的な検索パターンを含める

例：
入力が「東京」の場合：
東京 天気
東京駅
東京都
東京タワー
東京 観光
東京 グルメ
東京 ホテル
東京 アクセス`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the response into suggestions array
    const suggestions = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 8); // Limit to 8 suggestions

    return NextResponse.json({suggestions});
  } catch (error) {
    console.error('Error generating suggestions:', error);

    // Fallback to mock suggestions if API fails
    const query = await request
      .json()
      .then(body => body.query)
      .catch(() => '');
    const fallbackSuggestions = [
      `${query} とは`,
      `${query} 意味`,
      `${query} 使い方`,
      `${query} 例文`,
    ].slice(0, 4);

    return NextResponse.json({
      suggestions: fallbackSuggestions,
      fallback: true,
    });
  }
}
