export type ListeningSection = 'SECTION_1' | 'SECTION_2' | 'SECTION_3' | 'SECTION_4';

export type ListeningQuestionType =
  | 'FORM_COMPLETION'
  | 'NOTE_COMPLETION'
  | 'MULTIPLE_CHOICE'
  | 'MATCHING'
  | 'MAP_LABELLING';

export interface ListeningDialogueTurn {
  speaker: string;
  gender: 'female' | 'male';
  accent?: 'en-GB' | 'en-AU' | 'en-US';
  text: string;
  evidenceForQuestionId?: number;
  highlightNote?: string;
}

export interface ListeningQuestion {
  id: number;
  type: ListeningQuestionType;
  prompt: string;
  instruction?: string; // e.g. "Write NO MORE THAN TWO WORDS AND/OR A NUMBER"
  options?: string[]; // for MULTIPLE_CHOICE or MATCHING
  correctAnswers: string[]; // case-insensitive acceptable variants e.g. ["25th August", "25 August"]
  explanation: string;
  distractorTrap?: string; // 채점관의 함정 해설
  evidenceSentence?: string;
}

export interface ListeningSet {
  id: string;
  title: string;
  section: ListeningSection;
  sectionNumber: 1 | 2 | 3 | 4;
  context: string;
  scenarioDescription: string;
  wordLimitRule?: string; // e.g. "NO MORE THAN TWO WORDS AND/OR A NUMBER"
  dialogue: ListeningDialogueTurn[];
  questions: ListeningQuestion[];
  totalQuestions: number;
}

export interface ListeningSubmission {
  id: string;
  testId: string;
  section: ListeningSection;
  answers: Record<number, string>;
  score: number;
  totalQuestions: number;
  bandScore: number;
  timeSpentSeconds: number;
  submittedAt: string;
}

export interface ListeningStats {
  totalAttempts: number;
  averageBand: number;
  bestBand: number;
  recentScore?: number;
}
