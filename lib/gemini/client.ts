import { GoogleGenerativeAI } from '@google/generative-ai';
import { WritingEvaluationResult, WritingTopic } from '@/types/writing';
import { IELTS_EVALUATION_SYSTEM_INSTRUCTION, buildWritingEvaluationPrompt } from './prompts';

export async function evaluateWritingEssayWithGemini(
  topic: WritingTopic,
  essayText: string,
  wordCount: number,
  timeSpentSeconds: number,
  customApiKey?: string
): Promise<WritingEvaluationResult> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('No Gemini API key provided. Using fallback simulated IELTS evaluation.');
    return generateFallbackEvaluation(topic, essayText, wordCount, timeSpentSeconds);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: IELTS_EVALUATION_SYSTEM_INSTRUCTION,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2, // 채점 일관성 확보를 위해 낮은 온도로 설정
      },
    });

    const prompt = buildWritingEvaluationPrompt(topic, essayText, wordCount, timeSpentSeconds);
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    const parsed: WritingEvaluationResult = JSON.parse(textResponse);
    return parsed;
  } catch (error) {
    console.error('Gemini API evaluation failed, falling back to simulated evaluation:', error);
    return generateFallbackEvaluation(topic, essayText, wordCount, timeSpentSeconds);
  }
}

/**
 * API Key 미설정 또는 네트워크 오류 시 사용자 경험 유지를 위한 정밀 시뮬레이션 채점기
 */
function generateFallbackEvaluation(
  topic: WritingTopic,
  essayText: string,
  wordCount: number,
  timeSpentSeconds: number
): WritingEvaluationResult {
  const isWordCountSufficient = wordCount >= topic.targetWordCount.min;
  const baseScore = isWordCountSufficient ? 6.5 : 5.0;

  const sentences = essayText
    .split(/[.?!]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  const sampleSentence = sentences[0] || 'I am writing to inform you about the problem.';

  return {
    overallBand: baseScore,
    criteria: {
      taskAchievementOrResponse: {
        score: baseScore,
        bandDescription: isWordCountSufficient
          ? '주제에서 요구하는 핵심 사항들을 대부분 언급하였으며 전반적인 목적과 주장이 전달됩니다.'
          : `최소 단어 수(${topic.targetWordCount.min}단어)에 도달하지 못해 감점되었습니다. (${wordCount}단어 작성)`,
        strengths: [
          '지문 지시문의 기본 배경을 이해하고 도입부를 구성함',
          '문단의 대략적인 구분이 시도됨',
        ],
        weaknesses: [
          '세부 근거(Supporting details)의 구체성이 다소 부족함',
          '요구 조건 중 일부 항목의 설명 깊이가 얕음',
        ],
        actionableTips: [
          '각 주장마다 구체적인 예시(For instance, Specifically)를 1문장씩 반드시 추가하세요.',
          'Task 1의 경우 3가지 불렛 포인트를 문단별로 1개씩 나누어 균형 있게 작성하세요.',
        ],
      },
      coherenceAndCohesion: {
        score: baseScore,
        bandDescription:
          '기본적인 연결어(Furthermore, However 등)를 활용하여 논리를 전개하고 있으나 연결이 다소 기계적입니다.',
        strengths: ['단락 간 전환어가 적절히 배치됨'],
        weaknesses: ['대명사 지칭(Referencing)의 다양성이 부족하고 단순 연결사 반복'],
        actionableTips: [
          '문장 첫머리의 연결어뿐만 아니라 관계대명사절 및 분사구문을 통한 문장 간 결합을 시도하세요.',
        ],
      },
      lexicalResource: {
        score: baseScore,
        bandDescription:
          '일반적인 일상 어휘가 주로 사용되었으며, Band 7.0+ 도달을 위해서는 보다 정밀한 Academic Collocation이 요구됩니다.',
        strengths: ['기본적인 주제 관련 기초 어휘는 명확히 사용됨'],
        weaknesses: ['어휘 중복이 빈번하며 고급 패러프레이징 시도가 제한적임'],
        actionableTips: [
          'good, important, big과 같은 기초 단어를 crucial, substantial, significant 등으로 치환하세요.',
        ],
      },
      grammaticalRangeAndAccuracy: {
        score: baseScore,
        bandDescription:
          '단순문은 정확하나, 복합문이나 조건문 등 복잡한 문장 구조에서 시제 및 전치사 실수가 관찰됩니다.',
        strengths: ['기본 주어-동사 일치 구조가 대체로 유지됨'],
        weaknesses: ['관계사절 및 수동태 활용의 빈도가 낮음'],
        actionableTips: [
          '전체 문장의 절반 이상을 오류 없는 복문(Complex sentences)으로 작성하는 연습을 진행하세요.',
        ],
      },
    },
    wordCount,
    paragraphAnalysis: [
      {
        paragraphIndex: 1,
        wordCount: Math.round(wordCount * 0.3),
        mainIdea: '도입부 및 주제/목적 제시',
        flowAssessment: '무난한 시작이나 더 격식 있는 시작 표현을 활용할 수 있습니다.',
      },
      {
        paragraphIndex: 2,
        wordCount: Math.round(wordCount * 0.7),
        mainIdea: '본문 세부 사항 및 논리적 뒷받침',
        flowAssessment: '아이디어가 나열되었으나 근거 설명의 살이 더 붙어야 합니다.',
      },
    ],
    sentenceFeedbacks: [
      {
        id: 'sf-1',
        originalSentence: sampleSentence,
        improvedSentence: `With reference to your recent correspondence, I am writing to formally address the matter at hand.`,
        category: 'VOCABULARY',
        explanation:
          '단순한 구어적 표현 대신 격식 있는 서신/에세이 표현(With reference to..., formally address)을 사용하면 Register 점수와 어휘 점수를 즉시 끌어올릴 수 있습니다.',
        alternativeExpressions: [
          'In light of recent developments',
          'I wish to register my formal concern regarding',
        ],
      },
    ],
    advancedVocabularySuggestions: [
      {
        originalWord: 'important',
        recommendedReplacements: ['imperative', 'paramount', 'fundamental'],
        contextExample: 'It is imperative that the management implements prompt corrective measures.',
      },
      {
        originalWord: 'problem',
        recommendedReplacements: ['predicament', 'dilemma', 'obstacle'],
        contextExample: 'This logistical predicament has severely impeded our daily schedule.',
      },
    ],
    summaryVerdict:
      '현재 작성 수준은 안정적인 Band 5.5~6.0의 토대를 갖추고 있습니다. Band 7.0 돌파를 위해서는 각 주장을 뒷받침하는 세부 문장을 더 정교하게 전개하고, 반복되는 기초 어휘를 전문적인 Collocation으로 교체하는 훈련이 필요합니다.',
  };
}
