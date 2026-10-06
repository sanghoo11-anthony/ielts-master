import { db } from './db';
import { SpeakingSubmission } from '@/types/speaking';

export async function saveSpeakingSubmission(submission: SpeakingSubmission): Promise<string> {
  return await db.speakingSubmissions.put(submission);
}

export async function getAllSpeakingSubmissions(): Promise<SpeakingSubmission[]> {
  return await db.speakingSubmissions.orderBy('submittedAt').reverse().toArray();
}

export async function getSpeakingSubmissionById(id: string): Promise<SpeakingSubmission | undefined> {
  return await db.speakingSubmissions.get(id);
}

export async function deleteSpeakingSubmission(id: string): Promise<void> {
  await db.speakingSubmissions.delete(id);
}

export async function getSpeakingStats() {
  const all = await db.speakingSubmissions.toArray();
  if (all.length === 0) {
    return {
      totalCount: 0,
      averageBand: 0,
      koreanConvertedCount: 0,
      highestBand: 0,
    };
  }

  const totalScore = all.reduce((sum, item) => sum + item.evaluation.overall_band, 0);
  const highest = Math.max(...all.map((item) => item.evaluation.overall_band));
  const koreanCount = all.filter((item) => item.isKoreanResponse).length;

  return {
    totalCount: all.length,
    averageBand: Math.round((totalScore / all.length) * 10) / 10,
    koreanConvertedCount: koreanCount,
    highestBand: highest,
  };
}
