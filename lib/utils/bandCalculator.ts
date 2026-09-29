/**
 * IELTS General 공식 점수 계산 및 밴드 환산 유틸리티
 */

/**
 * IELTS General Reading 공식 점수 -> Band Score 환산 (40문항 기준)
 */
export function calculateGeneralReadingBand(rawScore: number, totalQuestions: number = 40): number {
  // 40문항이 아닌 경우 비례 환산
  const normalizedScore = totalQuestions === 40 
    ? rawScore 
    : Math.round((rawScore / totalQuestions) * 40);

  if (normalizedScore >= 39) return 9.0;
  if (normalizedScore >= 37) return 8.5;
  if (normalizedScore >= 36) return 8.0;
  if (normalizedScore >= 34) return 7.5;
  if (normalizedScore >= 32) return 7.0;
  if (normalizedScore >= 30) return 6.5;
  if (normalizedScore >= 27) return 6.0;
  if (normalizedScore >= 23) return 5.5;
  if (normalizedScore >= 19) return 5.0;
  if (normalizedScore >= 15) return 4.5;
  if (normalizedScore >= 12) return 4.0;
  if (normalizedScore >= 8) return 3.5;
  if (normalizedScore >= 5) return 3.0;
  if (normalizedScore >= 3) return 2.5;
  return 2.0;
}

/**
 * IELTS Writing 4대 기준 점수 -> Overall Band 환산
 * IELTS 규칙: 4영역의 산술평균 후 0.25 또는 0.75 절상/절하 규칙
 * - 평균 .25 이상 -> .5로 올림 (예: 6.25 -> 6.5)
 * - 평균 .75 이상 -> 다음 정수로 올림 (예: 6.75 -> 7.0)
 * - 평균 .125 -> 6.0, 평균 .375 -> 6.5, 평균 .625 -> 6.5 등
 */
export function calculateOverallWritingBand(scores: {
  taskAchievementOrResponse: number;
  coherenceAndCohesion: number;
  lexicalResource: number;
  grammaticalRangeAndAccuracy: number;
}): number {
  const sum =
    scores.taskAchievementOrResponse +
    scores.coherenceAndCohesion +
    scores.lexicalResource +
    scores.grammaticalRangeAndAccuracy;
  const avg = sum / 4;

  const floor = Math.floor(avg);
  const decimal = avg - floor;

  if (decimal < 0.25) {
    return floor;
  } else if (decimal < 0.75) {
    return floor + 0.5;
  } else {
    return floor + 1.0;
  }
}

/**
 * Band별 레벨 설명 및 합격 기준 안내
 */
export function getBandDescriptor(band: number): {
  levelTitle: string;
  summary: string;
  badgeColor: string;
} {
  if (band >= 8.5) {
    return {
      levelTitle: 'Expert User (Band 8.5~9.0)',
      summary: '영어를 완전하고 유창하며 정확하게 구사하는 최고 전문가 수준입니다.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    };
  }
  if (band >= 7.5) {
    return {
      levelTitle: 'Very Good User (Band 7.5~8.0)',
      summary: '복잡하고 세부적인 논리 전개에 완전히 숙달된 고득점 레벨입니다.',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    };
  }
  if (band >= 7.0) {
    return {
      levelTitle: 'Good User (Band 7.0 - 목표 달성!)',
      summary: '이민 및 전문직 취업의 기준이 되는 안정적인 Band 7.0 고지 도달!',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    };
  }
  if (band >= 6.0) {
    return {
      levelTitle: 'Competent User (Band 6.0~6.5)',
      summary: '일반적인 상황에서 의사소통이 원활하나, 복잡한 문맥에서 간혹 부정확성이 존재합니다.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    };
  }
  if (band >= 5.0) {
    return {
      levelTitle: 'Modest User (Band 5.0~5.5)',
      summary: '기본적 문장 구사는 가능하나, 잦은 오류와 제한된 어휘로 개선이 집중적으로 필요한 단계입니다.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    };
  }
  return {
    levelTitle: 'Limited User (Band < 5.0)',
    summary: '기초 문법 및 빈출 어휘 훈련이 시급한 입문 단계입니다.',
    badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
  };
}
