import { db } from './db';
import { ReadingSubmission, PassageAnnotation } from '@/types/reading';

export const readingRepository = {
  // --- 제출 이력 ---
  async saveSubmission(submission: ReadingSubmission): Promise<string> {
    await db.readingSubmissions.put(submission);
    return submission.id;
  },

  async getSubmission(id: string): Promise<ReadingSubmission | undefined> {
    return await db.readingSubmissions.get(id);
  },

  async getAllSubmissions(): Promise<ReadingSubmission[]> {
    return await db.readingSubmissions.orderBy('submittedAt').reverse().toArray();
  },

  async getSubmissionsByTest(testId: string): Promise<ReadingSubmission[]> {
    return await db.readingSubmissions.where('testId').equals(testId).reverse().sortBy('submittedAt');
  },

  // --- 지문 하이라이트 & 메모 저장 ---
  async saveAnnotation(annotation: PassageAnnotation): Promise<string> {
    await db.readingAnnotations.put(annotation);
    return annotation.id;
  },

  async getAnnotationsByTest(testId: string): Promise<PassageAnnotation[]> {
    return await db.readingAnnotations.where('testId').equals(testId).toArray();
  },

  async deleteAnnotation(id: string): Promise<void> {
    await db.readingAnnotations.delete(id);
  },

  async clearAnnotationsByTest(testId: string): Promise<void> {
    const items = await this.getAnnotationsByTest(testId);
    await db.readingAnnotations.bulkDelete(items.map((i) => i.id));
  },
};
