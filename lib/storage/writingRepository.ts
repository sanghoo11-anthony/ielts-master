import { db, UserProfile } from './db';
import { WritingSubmission } from '@/types/writing';

const DRAFT_PREFIX = 'ielts_writing_draft_';

export const writingRepository = {
  // --- 임시 저장 (LocalStorage - 작성 중 이탈 방지) ---
  saveDraft(topicId: string, text: string, timeSpentSeconds: number): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        `${DRAFT_PREFIX}${topicId}`,
        JSON.stringify({ text, timeSpentSeconds, updatedAt: new Date().toISOString() })
      );
    } catch (e) {
      console.error('Failed to save draft', e);
    }
  },

  getDraft(topicId: string): { text: string; timeSpentSeconds: number } | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`${DRAFT_PREFIX}${topicId}`);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clearDraft(topicId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${DRAFT_PREFIX}${topicId}`);
  },

  // --- IndexedDB 영속 저장 (제출 및 첨삭 결과) ---
  async saveSubmission(submission: WritingSubmission): Promise<string> {
    await db.writingSubmissions.put(submission);
    return submission.id;
  },

  async getSubmission(id: string): Promise<WritingSubmission | undefined> {
    return await db.writingSubmissions.get(id);
  },

  async getAllSubmissions(): Promise<WritingSubmission[]> {
    return await db.writingSubmissions.orderBy('submittedAt').reverse().toArray();
  },

  async getSubmissionsByTopic(topicId: string): Promise<WritingSubmission[]> {
    return await db.writingSubmissions.where('topicId').equals(topicId).reverse().sortBy('submittedAt');
  },

  async deleteSubmission(id: string): Promise<void> {
    await db.writingSubmissions.delete(id);
  },

  // --- 유저 프로필 및 목표 Band ---
  async getUserProfile(): Promise<UserProfile> {
    const existing = await db.userProfile.get('current-user');
    if (existing) return existing;

    const defaultProfile: UserProfile = {
      id: 'current-user',
      targetBand: 7.0,
      startingBand: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.userProfile.put(defaultProfile);
    return defaultProfile;
  },

  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    const current = await this.getUserProfile();
    await db.userProfile.put({
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  },
};
