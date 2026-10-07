import Dexie, { type Table } from 'dexie';
import { WritingSubmission } from '@/types/writing';
import { ReadingSubmission, PassageAnnotation } from '@/types/reading';
import { VocabularyItem } from '@/types/vocabulary';
import { SpeakingSubmission } from '@/types/speaking';
import { ListeningSubmission } from '@/types/listening';

export interface UserProfile {
  id: string; // 'current-user'
  targetBand: number; // e.g. 7.0
  startingBand: number; // e.g. 5.0
  customGeminiApiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export class IELTSDatabase extends Dexie {
  writingSubmissions!: Table<WritingSubmission, string>;
  readingSubmissions!: Table<ReadingSubmission, string>;
  readingAnnotations!: Table<PassageAnnotation, string>;
  userProfile!: Table<UserProfile, string>;
  vocabulary!: Table<VocabularyItem, string>;
  speakingSubmissions!: Table<SpeakingSubmission, string>;
  listeningSubmissions!: Table<ListeningSubmission, string>;

  constructor() {
    super('IELTSPrepDB');
    this.version(1).stores({
      writingSubmissions: 'id, topicId, taskType, submittedAt, [taskType+submittedAt]',
      readingSubmissions: 'id, testId, submittedAt, estimatedBand',
      readingAnnotations: 'id, testId, paragraphId',
      userProfile: 'id',
    });
    this.version(2).stores({
      vocabulary: 'id, word, bandLevel, isMastered, createdAt, sourceType',
    });
    this.version(3).stores({
      speakingSubmissions: 'id, topicId, part, submittedAt, isKoreanResponse',
    });
    this.version(4).stores({
      listeningSubmissions: 'id, testId, section, submittedAt, bandScore',
    });
  }
}

export const db = new IELTSDatabase();
