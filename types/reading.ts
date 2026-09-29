export type ReadingSection = 'SECTION_1' | 'SECTION_2' | 'SECTION_3';

export type QuestionType = 
  | 'TRUE_FALSE_NOT_GIVEN' 
  | 'YES_NO_NOT_GIVEN' 
  | 'MATCHING_HEADINGS' 
  | 'MULTIPLE_CHOICE' 
  | 'SUMMARY_COMPLETION';

export interface Paragraph {
  id: string; // 'P1', 'P2', 'P3'
  label?: string; // 'A', 'B', 'C'
  content: string;
}

export interface Passage {
  id: string;
  section: ReadingSection;
  title: string;
  subTitle?: string;
  paragraphs: Paragraph[];
}

export interface QuestionEvidence {
  paragraphId: string;
  quoteText: string;
  explanation: string;
}

export interface BaseQuestion {
  id: string;
  questionNumber: number;
  type: QuestionType;
  prompt: string;
  correctAnswer: string | string[];
  evidence: QuestionEvidence;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'TRUE_FALSE_NOT_GIVEN' | 'YES_NO_NOT_GIVEN';
  correctAnswer: 'TRUE' | 'FALSE' | 'NOT GIVEN' | 'YES' | 'NO';
}

export interface HeadingOption {
  id: string;
  romanNumeral: string;
  text: string;
}

export interface MatchingHeadingsQuestion extends BaseQuestion {
  type: 'MATCHING_HEADINGS';
  paragraphIdToMatch: string; // paragraph id to match (e.g. 'P1')
  headingOptions: HeadingOption[];
}

export interface MultipleChoiceOption {
  label: string;
  text: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'MULTIPLE_CHOICE';
  options: MultipleChoiceOption[];
}

export interface SummaryCompletionQuestion extends BaseQuestion {
  type: 'SUMMARY_COMPLETION';
  contextSummaryWithBlanks: string;
  wordLimit: number;
}

export type ReadingQuestion = 
  | TrueFalseQuestion 
  | MatchingHeadingsQuestion 
  | MultipleChoiceQuestion 
  | SummaryCompletionQuestion;

export interface ReadingTestSet {
  id: string;
  title: string;
  description: string;
  difficulty: 'BAND_5_6' | 'BAND_6_7' | 'BAND_7_PLUS';
  passages: Passage[];
  questions: ReadingQuestion[];
  timeLimitMinutes: number;
}

export interface ReadingDetailedResult {
  questionId: string;
  questionNumber: number;
  userAnswer: string;
  correctAnswer: string | string[];
  isCorrect: boolean;
  evidence: QuestionEvidence;
}

export interface ReadingSubmission {
  id: string;
  testId: string;
  answers: Record<string, string>;
  score: number; // 맞은 개수
  totalQuestions: number;
  estimatedBand: number; // IELTS General 공식 환산표
  timeSpentSeconds: number;
  submittedAt: string;
  detailedResults: ReadingDetailedResult[];
}

export interface PassageAnnotation {
  id: string;
  testId: string;
  paragraphId: string;
  selectedText: string;
  color: 'yellow' | 'green' | 'blue' | 'pink';
  note?: string;
}
