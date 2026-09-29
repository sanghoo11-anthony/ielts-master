/**
 * IELTS 공식 기준 단어 수 계산 유틸리티
 */

export interface TextStats {
  wordCount: number;
  charCount: number;
  paragraphCount: number;
  readingTimeMinutes: number;
}

export function calculateTextStats(text: string): TextStats {
  if (!text || text.trim().length === 0) {
    return {
      wordCount: 0,
      charCount: 0,
      paragraphCount: 0,
      readingTimeMinutes: 0,
    };
  }

  // 문단 분리
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // 단어 분리: 알파벳/숫자/하이픈/어포스트로피 포함 단어 카운트
  const words = text
    .trim()
    .split(/\s+/)
    .filter((token) => {
      // 기호만 있는 토큰 제외 (예: "-", "...", ",")
      return /[a-zA-Z0-9\u00C0-\u024F]/.test(token);
    });

  const wordCount = words.length;
  const charCount = text.length;
  const paragraphCount = paragraphs.length;
  // 평균 분당 130단어 기준 리딩 타임
  const readingTimeMinutes = Math.ceil(wordCount / 130);

  return {
    wordCount,
    charCount,
    paragraphCount,
    readingTimeMinutes,
  };
}

/**
 * 목표 단어 수 충족 상태 판별
 */
export function getWordCountStatus(
  current: number,
  target: { min: number; recommended: number }
): {
  status: 'under' | 'good' | 'optimal';
  color: string;
  message: string;
  percentage: number;
} {
  const percentage = Math.min(Math.round((current / target.min) * 100), 100);

  if (current < target.min) {
    const remaining = target.min - current;
    return {
      status: 'under',
      color: 'text-amber-600 dark:text-amber-400',
      message: `${remaining}단어 더 작성해야 감점을 피할 수 있습니다 (최소 ${target.min}단어)`,
      percentage,
    };
  }

  if (current >= target.min && current < target.recommended) {
    return {
      status: 'good',
      color: 'text-blue-600 dark:text-blue-400',
      message: `최소 기준(${target.min}단어) 충족! 추천 권장량은 ${target.recommended}단어입니다.`,
      percentage: 100,
    };
  }

  return {
    status: 'optimal',
    color: 'text-emerald-600 dark:text-emerald-400',
    message: `최적의 길이 도달 (${current}단어). 논리와 표현 교정에 집중하세요.`,
    percentage: 100,
  };
}
