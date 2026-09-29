export type TaskType = 'TASK_1' | 'TASK_2';
export type LetterTone = 'FORMAL' | 'SEMI_FORMAL' | 'INFORMAL';
export type EssayType = 
  | 'OPINION' 
  | 'DISCUSSION' 
  | 'PROBLEM_SOLUTION' 
  | 'ADVANTAGES_DISADVANTAGES' 
  | 'DOUBLE_QUESTION';

export interface WritingTopic {
  id: string;
  taskType: TaskType;
  tone?: LetterTone;
  essayType?: EssayType;
  title: string;
  prompt: string;
  bulletPoints?: string[]; // Task 1에서 반드시 포함해야 할 3개 조건
  targetWordCount: { min: number; recommended: number }; // Task 1: 150/170, Task 2: 250/280
  timeLimitMinutes: number; // Task 1: 20, Task 2: 40
  difficulty: 'BAND_5_6' | 'BAND_6_7' | 'BAND_7_PLUS';
  sampleAnswers?: {
    bandScore: number;
    answerText: string;
    examinerComment: string;
  }[];
}

export interface CriterionScore {
  score: number; // 0.0 ~ 9.0 in 0.5 increments
  bandDescription: string;
  strengths: string[];
  weaknesses: string[];
  actionableTips: string[]; // Band 7.0+ 도달 팁
}

export interface SentenceFeedback {
  id: string;
  originalSentence: string;
  improvedSentence: string;
  category: 'GRAMMAR' | 'VOCABULARY' | 'COHESION' | 'TASK_ACHIEVEMENT';
  explanation: string;
  alternativeExpressions: string[];
}

export interface AdvancedVocabularySuggestion {
  originalWord: string;
  recommendedReplacements: string[];
  contextExample: string;
}

export interface WritingEvaluationResult {
  overallBand: number;
  criteria: {
    taskAchievementOrResponse: CriterionScore;
    coherenceAndCohesion: CriterionScore;
    lexicalResource: CriterionScore;
    grammaticalRangeAndAccuracy: CriterionScore;
  };
  wordCount: number;
  paragraphAnalysis: {
    paragraphIndex: number;
    wordCount: number;
    mainIdea: string;
    flowAssessment: string;
  }[];
  sentenceFeedbacks: SentenceFeedback[];
  advancedVocabularySuggestions: AdvancedVocabularySuggestion[];
  summaryVerdict: string;
}

export interface WritingSubmission {
  id: string;
  topicId: string;
  taskType: TaskType;
  essayText: string;
  wordCount: number;
  timeSpentSeconds: number;
  submittedAt: string;
  evaluation?: WritingEvaluationResult;
}
