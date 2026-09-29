'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { MOCK_READING_TESTS } from '@/lib/mock-data/readingTests';
import { readingRepository } from '@/lib/storage/readingRepository';
import { ReadingTestSet, ReadingSubmission, ReadingDetailedResult } from '@/types/reading';
import { getBandDescriptor } from '@/lib/utils/bandCalculator';
import PassageViewer from '@/components/reading/PassageViewer';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Bookmark,
  Target,
  Sparkles,
  Search,
  BookOpen,
} from 'lucide-react';

export default function ReadingResultPage() {
  const params = useParams();
  const testId = params.testId as string;
  const submissionId = params.submissionId as string;

  const test: ReadingTestSet | undefined = MOCK_READING_TESTS.find((t) => t.id === testId);

  const [submission, setSubmission] = useState<ReadingSubmission | null>(null);
  const [activePassageIndex, setActivePassageIndex] = useState(0);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [targetParagraphId, setTargetParagraphId] = useState<string | null>(null);
  const [targetQuote, setTargetQuote] = useState<string | null>(null);
  const [filterWrongOnly, setFilterWrongOnly] = useState(false);

  useEffect(() => {
    readingRepository.getSubmission(submissionId).then((sub) => {
      if (sub) {
        setSubmission(sub);
        if (sub.estimatedBand >= 7.0) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }
    });
  }, [submissionId]);

  if (!test || !submission) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        <p className="text-slate-600 font-medium">리딩 채점 결과를 불러오는 중입니다...</p>
      </div>
    );
  }

  const descriptor = getBandDescriptor(submission.estimatedBand);

  // 특정 문제를 클릭했을 때 지문 뷰어를 해당 근거 단락으로 이동시키는 핸들러
  const handleInspectEvidence = (item: ReadingDetailedResult) => {
    setSelectedQuestionId(item.questionId);
    setTargetParagraphId(item.evidence.paragraphId);
    setTargetQuote(item.evidence.quoteText);

    // 해당 단락이 속한 지문 인덱스 찾기
    const passageIdx = test.passages.findIndex((p) =>
      p.paragraphs.some((para) => para.id === item.evidence.paragraphId)
    );
    if (passageIdx !== -1) {
      setActivePassageIndex(passageIdx);
    }

    // 지문 엘리먼트로 부드럽게 스크롤 이동
    setTimeout(() => {
      const el = document.getElementById(`para-${item.evidence.paragraphId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const displayedResults = filterWrongOnly
    ? submission.detailedResults.filter((r) => !r.isCorrect)
    : submission.detailedResults;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-100 overflow-hidden">
      {/* Top Header Bar */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-2.5 shadow-sm sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/reading"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                  채점 결과 리포트
                </span>
                <span className="text-xs text-slate-400">
                  응시일: {new Date(submission.submittedAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <h1 className="text-sm font-bold text-slate-900 line-clamp-1">{test.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/reading/${test.id}/practice`}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>다시 풀기</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Split Layout: 좌측(지문 및 근거 하이라이트) / 우측(정오표 및 단락 근거 해설) */}
      <div className="flex-1 p-3 sm:p-4 overflow-hidden">
        <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Left: Passage Viewer (6 cols) */}
          <div className="h-full overflow-hidden lg:col-span-6">
            <PassageViewer
              passages={test.passages}
              activePassageIndex={activePassageIndex}
              onPassageChange={setActivePassageIndex}
              targetParagraphId={targetParagraphId}
              targetQuote={targetQuote}
            />
          </div>

          {/* Right: Results & Evidence Explanation Panel (6 cols) */}
          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden lg:col-span-6">
            {/* Top Score Banner */}
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 to-emerald-950 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-emerald-600 text-white font-black shadow-md">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200">
                      Band
                    </span>
                    <span className="font-mono text-2xl">
                      {submission.estimatedBand.toFixed(1)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-emerald-300">
                        {submission.score} / {submission.totalQuestions} 정답
                      </span>
                      <span className="text-xs text-slate-300 font-mono">
                        소요: {Math.floor(submission.timeSpentSeconds / 60)}분{' '}
                        {submission.timeSpentSeconds % 60}초
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-200">{descriptor.summary}</p>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                    목표 Band 7.0 대비{' '}
                    {submission.estimatedBand >= 7.0 ? '달성 완료!' : '취약점 보완 필요'}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-slate-600">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>문항별 정답 및 단락 근거 매칭</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterWrongOnly(false)}
                  className={`rounded-lg px-2.5 py-1 font-bold ${
                    !filterWrongOnly ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  전체 ({submission.detailedResults.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterWrongOnly(true)}
                  className={`rounded-lg px-2.5 py-1 font-bold ${
                    filterWrongOnly ? 'bg-rose-600 text-white' : 'text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  오답만 보기 ({submission.detailedResults.filter((r) => !r.isCorrect).length})
                </button>
              </div>
            </div>

            {/* Questions Detailed Evidence List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {displayedResults.map((item) => {
                const isSelected = selectedQuestionId === item.questionId;
                const formattedCorrect = Array.isArray(item.correctAnswer)
                  ? item.correctAnswer.join(' 또는 ')
                  : item.correctAnswer;

                return (
                  <div
                    key={item.questionId}
                    onClick={() => handleInspectEvidence(item)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                        : item.isCorrect
                        ? 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/20'
                        : 'border-rose-200 bg-rose-50/20 hover:border-rose-400 hover:bg-rose-50/40'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-700">
                          Q{item.questionNumber}
                        </span>
                        {item.isCorrect ? (
                          <span className="flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            정답
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                            <XCircle className="h-3.5 w-3.5 text-rose-600" />
                            오답
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectEvidence(item);
                        }}
                        className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white px-2 py-1 rounded-md border border-emerald-200 shadow-sm"
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                        <span>지문 근거 단락 보기</span>
                      </button>
                    </div>

                    {/* Answers Comparison */}
                    <div className="my-2.5 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
                        <span className="text-[11px] text-slate-500 block mb-0.5">내가 제출한 답:</span>
                        <span
                          className={`font-bold ${
                            item.isCorrect ? 'text-emerald-700' : 'text-rose-600 line-through'
                          }`}
                        >
                          {item.userAnswer || '(미입력)'}
                        </span>
                      </div>
                      <div className="rounded-lg bg-emerald-50/80 p-2.5 border border-emerald-200">
                        <span className="text-[11px] text-emerald-800 block mb-0.5">실제 정답:</span>
                        <span className="font-bold text-emerald-900">{formattedCorrect}</span>
                      </div>
                    </div>

                    {/* Evidence Quote */}
                    <div className="mt-3 rounded-xl bg-amber-50/80 p-3 border border-amber-200/80 text-xs">
                      <div className="flex items-center gap-1 font-bold text-amber-900 mb-1">
                        <span>지문 내 결정적 단서 ({item.evidence.paragraphId}):</span>
                      </div>
                      <p className="font-serif italic text-slate-800">
                        "{item.evidence.quoteText}"
                      </p>
                    </div>

                    {/* Explanation */}
                    <div className="mt-2 text-xs leading-relaxed text-slate-700 bg-white p-2.5 rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-900">💡 해설: </span>
                      {item.evidence.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
