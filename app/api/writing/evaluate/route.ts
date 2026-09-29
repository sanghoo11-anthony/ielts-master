import { NextRequest, NextResponse } from 'next/server';
import { evaluateWritingEssayWithGemini } from '@/lib/gemini/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, essayText, wordCount, timeSpentSeconds, customApiKey } = body;

    if (!topic || !essayText) {
      return NextResponse.json(
        { error: '토픽과 에세이 본문은 필수 입력 사항입니다.' },
        { status: 400 }
      );
    }

    const evaluation = await evaluateWritingEssayWithGemini(
      topic,
      essayText,
      wordCount || 0,
      timeSpentSeconds || 0,
      customApiKey
    );

    return NextResponse.json({ evaluation });
  } catch (error: any) {
    console.error('API Error in /api/writing/evaluate:', error);
    return NextResponse.json(
      { error: error.message || 'AI 채점 처리 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
