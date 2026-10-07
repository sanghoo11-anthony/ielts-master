export interface VocabularyItem {
  id: string;
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  meaningKo: string;
  definitionEn?: string;
  contextSentence: string;
  contextTranslation: string;
  examples: {
    en: string;
    ko: string;
  }[];
  collocations: string[];
  synonyms: string[];
  bandLevel: string; // e.g. 'Band 7.0+', 'Band 7.5+', 'Band 8.0+'
  isMastered: boolean;
  createdAt: string;
  sourceType: 'reading' | 'writing' | 'speaking' | 'listening' | 'manual';
  sourceTitle?: string;
}

export interface WordLookupRequest {
  word: string;
  sentence?: string;
  sourceTitle?: string;
  sourceType?: 'reading' | 'writing' | 'speaking' | 'listening' | 'manual';
  customApiKey?: string;
}

export interface WordLookupResponse {
  word: string;
  phonetic?: string;
  partOfSpeech: string;
  meaningKo: string;
  definitionEn?: string;
  contextSentence: string;
  contextTranslation: string;
  examples: {
    en: string;
    ko: string;
  }[];
  collocations: string[];
  synonyms: string[];
  bandLevel: string;
  examinerTip?: string;
}
