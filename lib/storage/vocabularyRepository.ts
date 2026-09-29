import { db } from './db';
import { VocabularyItem } from '@/types/vocabulary';

export const vocabularyRepository = {
  async saveWord(
    item: Omit<VocabularyItem, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
  ): Promise<VocabularyItem> {
    const existing = await db.vocabulary
      .filter((v) => v.word.toLowerCase() === item.word.toLowerCase())
      .first();

    if (existing) {
      // 이미 저장된 경우 최신 문맥 정보 및 예문 업데이트
      const updated: VocabularyItem = {
        ...existing,
        ...item,
        id: existing.id,
        createdAt: existing.createdAt,
      };
      await db.vocabulary.put(updated);
      return updated;
    }

    const newItem: VocabularyItem = {
      ...item,
      id: item.id || `vocab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      isMastered: item.isMastered ?? false,
    };

    await db.vocabulary.add(newItem);
    return newItem;
  },

  async getAllWords(): Promise<VocabularyItem[]> {
    return await db.vocabulary.orderBy('createdAt').reverse().toArray();
  },

  async getWordByText(word: string): Promise<VocabularyItem | undefined> {
    const normalized = word.trim().toLowerCase();
    return await db.vocabulary
      .filter((v) => v.word.toLowerCase() === normalized)
      .first();
  },

  async isWordSaved(word: string): Promise<boolean> {
    const item = await this.getWordByText(word);
    return !!item;
  },

  async deleteWord(id: string): Promise<void> {
    await db.vocabulary.delete(id);
  },

  async toggleMastered(id: string): Promise<boolean> {
    const item = await db.vocabulary.get(id);
    if (!item) return false;
    const nextState = !item.isMastered;
    await db.vocabulary.update(id, { isMastered: nextState });
    return nextState;
  },

  async getStats(): Promise<{
    total: number;
    mastered: number;
    studying: number;
    band7Plus: number;
  }> {
    const all = await this.getAllWords();
    const total = all.length;
    const mastered = all.filter((w) => w.isMastered).length;
    const studying = total - mastered;
    const band7Plus = all.filter(
      (w) =>
        w.bandLevel.includes('7.0') ||
        w.bandLevel.includes('7.5') ||
        w.bandLevel.includes('8.0') ||
        w.bandLevel.includes('8.5')
    ).length;

    return { total, mastered, studying, band7Plus };
  },
};
