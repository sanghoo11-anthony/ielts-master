import { db } from './db';
import { ListeningSubmission, ListeningStats, ListeningSection } from '@/types/listening';

export const calculateListeningBand = (rawScore: number, totalQuestions: number): number => {
  if (totalQuestions <= 0) return 0;
  const percentage = (rawScore / totalQuestions) * 100;

  if (percentage >= 95) return 9.0;
  if (percentage >= 88) return 8.5;
  if (percentage >= 80) return 8.0;
  if (percentage >= 72) return 7.5;
  if (percentage >= 64) return 7.0;
  if (percentage >= 56) return 6.5;
  if (percentage >= 48) return 6.0;
  if (percentage >= 40) return 5.5;
  if (percentage >= 32) return 5.0;
  if (percentage >= 24) return 4.5;
  return 4.0;
};

export const listeningRepository = {
  async saveSubmission(submission: ListeningSubmission): Promise<string> {
    await db.listeningSubmissions.put(submission);
    return submission.id;
  },

  async getAllSubmissions(): Promise<ListeningSubmission[]> {
    return db.listeningSubmissions.orderBy('submittedAt').reverse().toArray();
  },

  async getSubmissionsBySection(section: ListeningSection): Promise<ListeningSubmission[]> {
    return db.listeningSubmissions
      .where('section')
      .equals(section)
      .reverse()
      .sortBy('submittedAt');
  },

  async getStats(): Promise<ListeningStats> {
    const subs = await db.listeningSubmissions.toArray();
    if (subs.length === 0) {
      return {
        totalAttempts: 0,
        averageBand: 0,
        bestBand: 0,
      };
    }

    const totalAttempts = subs.length;
    const bandScores = subs.map((s) => s.bandScore);
    const averageBand = Number(
      (bandScores.reduce((a, b) => a + b, 0) / totalAttempts).toFixed(1)
    );
    const bestBand = Math.max(...bandScores);
    const recentScore = subs.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )[0]?.bandScore;

    return {
      totalAttempts,
      averageBand,
      bestBand,
      recentScore,
    };
  },
};
