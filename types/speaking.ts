export type SpeakingPart = 'part1' | 'part2' | 'part3';

export interface SpeakingQuestion {
  id: string;
  questionText: string;
  questionKo: string;
  cueCardBulletPoints?: string[]; // Part 2 큐카드 항목
  sampleBand7Answer?: string;
  recommendedCollocations: string[];
}

export interface SpeakingTopic {
  id: string;
  title: string;
  titleKo: string;
  part: SpeakingPart;
  description: string;
  preparationTimeSeconds?: number; // Part 2 준비 60초
  speechTimeSeconds?: number; // 60초~120초
  questions: SpeakingQuestion[];
}

export interface SpeakingEvaluationScores {
  fluency_coherence: number; // 25% 유창성 및 일관성
  lexical_resource: number; // 25% 어휘의 다양성
  grammatical_range_accuracy: number; // 25% 문법적 범위 및 정확성
  pronunciation_delivery: number; // 25% 발음 및 전달력
}

export interface SpeakingCritique {
  strengths: string;
  weaknesses: string;
  band_7_target_advice: string;
}

export interface SpeakingCorrection {
  original: string;
  improved: string;
  reason: string;
}

export interface SpeakingEvaluationResponse {
  overall_band: number;
  scores: SpeakingEvaluationScores;
  is_korean_response: boolean;
  korean_to_english_model_answer?: string; // 한국어로 말했을 때 자연스러운 Band 7.5+ 모범 영어 답안
  model_answer_explanation?: string; // 한국어 뉘앙스를 어떻게 영어식 Collocation으로 살렸는지 해설
  detailed_critique: {
    fluency_coherence: SpeakingCritique;
    lexical_resource: SpeakingCritique;
    grammatical_range: SpeakingCritique;
    pronunciation_delivery: SpeakingCritique;
  };
  corrections: SpeakingCorrection[];
  key_collocations: string[];
  examiner_feedback_summary: string;
}

export interface SpeakingEvaluationRequest {
  topicId: string;
  topicTitle: string;
  part: SpeakingPart;
  questionText: string;
  candidateAnswer: string;
  isKoreanInput?: boolean;
  custom_api_key?: string;
}

export interface SpeakingSubmission {
  id: string;
  topicId: string;
  topicTitle: string;
  part: SpeakingPart;
  questionText: string;
  candidateAnswer: string;
  isKoreanResponse: boolean;
  evaluation: SpeakingEvaluationResponse;
  submittedAt: string;
}
