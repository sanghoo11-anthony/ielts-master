'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { MOCK_WRITING_TOPICS } from '@/lib/mock-data/writingTopics';
import { WritingTopic, WritingSubmission } from '@/types/writing';
import { writingRepository } from '@/lib/storage/writingRepository';
import BandScoreCard from '@/components/writing/BandScoreCard';
import SentenceFeedbackList from '@/components/writing/SentenceFeedbackList';
import LexicalUpgradeSuggestions from '@/components/writing/LexicalUpgradeSuggestions';
import {
  ArrowLeft,
  RotateCcw,
  Printer,
  Sparkles,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  Share2,
} from 'lucide-react';

export default function WritingResultPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;
  const submissionId = params.submissionId as string;

  const [topic, setTopic] = useState<WritingTopic | null>(null);
  const [submission, setSubmission] = useState<WritingSubmission | null>(null);
  const [showOriginalText, setShowOriginalText] = useState(true);
  const [targetBand, setTargetBand] = useState(7.0);

  useEffect(() => {
    const foundTopic = MOCK_WRITING_TOPICS.find((t) => t.id === topicId) || null;
    setTopic(foundTopic);

    writingRepository.getSubmission(submissionId).then((sub) => {
      if (sub) {
        setSubmission(sub);
        // Band 7.0 이상 달성 시 축하 콘페티
        if (sub.evaluation && sub.evaluation.overallBand >= 7.0) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    });

    writingRepository.getUserProfile().then((p) => {
      if (p.targetBand) setTargetBand(p.targetBand);
    });
  }, [topicId, submissionId]);

  if (!submission || !topic) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-slate-600 font-medium">첨삭 리포트를 불러오는 중입니다...</p>
      </div>
    );
  }

  const evalData = submission.evaluation;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Top Bar */}
      <div className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/writing"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                  {topic.taskType === 'TASK_1' ? 'Task 1 (Letter)' : 'Task 2 (Essay)'}
                </span>
                <span className="text-xs text-slate-400">
                  제출 일시: {new Date(submission.submittedAt).toLocaleString('ko-KR')}
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-900 line-clamp-1 sm:text-lg">
                {topic.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-100"
            >
              <Printer className="h-4 w-4" />
              <span>리포트 인쇄</span>
            </button>
            <Link
              href={`/writing/${topic.id}/practice`}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>이 토픽 다시 쓰기</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 space-y-8">
        {evalData ? (
          <>
            {/* Overall Verdict Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white shadow-lg sm:p-8">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-4 w-4" />
                IELTS 수석 채점관 종합 총평
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-slate-100 font-medium">
                "{evalData.summaryVerdict}"
              </p>
            </div>

            {/* Band Score Card (4 Criteria & Tips) */}
            <BandScoreCard evaluation={evalData} targetBand={targetBand} />

            {/* Sentence Feedback List */}
            <SentenceFeedbackList feedbacks={evalData.sentenceFeedbacks} />

            {/* Advanced Lexical Upgrades */}
            <LexicalUpgradeSuggestions suggestions={evalData.advancedVocabularySuggestions} />

            {/* Original Essay Drawer / Accordion */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <button
                type="button"
                onClick={() => setShowOriginalText(!showOriginalText)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    작성한 원문 에세이 전체 보기
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    작성 단어 수: {submission.wordCount} words | 소요 시간:{' '}
                    {Math.floor(submission.timeSpentSeconds / 60)}분 {submission.timeSpentSeconds % 60}초
                  </p>
                </div>
                {showOriginalText ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
              </button>

              {showOriginalText && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="rounded-2xl bg-slate-50 p-6 font-serif text-sm leading-relaxed text-slate-800 whitespace-pre-line border border-slate-200/70">
                    {submission.essayText}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600 font-semibold">채점 데이터가 아직 존재하지 않습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
