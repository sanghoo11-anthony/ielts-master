'use client';

import React, { useState } from 'react';
import { ListeningSet, ListeningSubmission } from '@/types/listening';
import {
  X,
  Trophy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Bookmark,
  Volume2,
} from 'lucide-react';
import Link from 'next/link';

interface ListeningResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  listeningSet: ListeningSet;
  userAnswers: Record<number, string>;
  bandScore: number;
  rawScore: number;
  onSaveToHistory: () => void;
  isSaved: boolean;
  onSelectEvidenceQuestion: (questionId: number) => void;
  onRetry: () => void;
}

export default function ListeningResultModal({
  isOpen,
  onClose,
  listeningSet,
  userAnswers,
  bandScore,
  rawScore,
  onSaveToHistory,
  isSaved,
  onSelectEvidenceQuestion,
  onRetry,
}: ListeningResultModalProps) {
  if (!isOpen) return null;

  const totalQuestions = listeningSet.questions.length;
  const accuracyPercent = Math.round((rawScore / totalQuestions) * 100);

  // Helper to check correctness
  const isQuestionCorrect = (qId: number) => {
    const q = listeningSet.questions.find((item) => item.id === qId);
    if (!q) return false;
    const userAnswer = (userAnswers[qId] || '').trim().toLowerCase();
    return q.correctAnswers.some(
      (ans) => ans.trim().toLowerCase() === userAnswer
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <Trophy className="h-5 w-5 text-amber-200" />
            <h2 className="text-base sm:text-lg font-black tracking-tight">
              IELTS Listening 채점 결과 및 심층 해설
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/80 hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Score Overview Banner */}
          <div className="rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-slate-50 p-5 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                {listeningSet.section} • {listeningSet.title}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                정답률 {accuracyPercent}% ({rawScore} / {totalQuestions}문항)
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                공식 Cambridge IELTS 리스닝 환산 기준 적용
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center rounded-2xl bg-white px-5 py-3 shadow-md border border-amber-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  추정 점수
                </span>
                <span className="font-mono text-3xl font-black text-amber-600">
                  Band {bandScore.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Question-by-Question Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              문항별 정오답 및 채점관 함정(Distractor Trap) 분석
            </h4>

            <div className="space-y-3">
              {listeningSet.questions.map((q) => {
                const correct = isQuestionCorrect(q.id);
                const userAns = userAnswers[q.id] || '(미입력)';

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-4.5 text-xs sm:text-sm transition-all ${
                      correct
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-red-200 bg-red-50/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-lg font-mono text-xs font-bold text-white ${
                            correct ? 'bg-emerald-600' : 'bg-red-500'
                          }`}
                        >
                          Q{q.id}
                        </span>
                        <span className="font-bold text-slate-900">
                          {q.prompt}
                        </span>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold shrink-0 ${
                          correct
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {correct ? '정답 ✓' : '오답 ✗'}
                      </span>
                    </div>

                    {/* Answer Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60 font-mono text-xs">
                      <div>
                        <span className="text-slate-500">나의 답안: </span>
                        <span
                          className={`font-bold ${
                            correct ? 'text-emerald-700' : 'text-red-600'
                          }`}
                        >
                          {userAns}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">인정 정답: </span>
                        <span className="font-bold text-slate-900">
                          {q.correctAnswers.join(' / ')}
                        </span>
                      </div>
                    </div>

                    {/* Korean Explanation */}
                    <p className="mt-2.5 text-xs text-slate-700 leading-relaxed font-sans">
                      💡 <span className="font-semibold text-slate-900">해설: </span>
                      {q.explanation}
                    </p>

                    {/* Distractor Trap Box */}
                    {q.distractorTrap && (
                      <div className="mt-2 rounded-xl bg-amber-50/80 border border-amber-200/80 p-2.5 text-[11px] text-amber-900 leading-relaxed font-sans flex items-start gap-2">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">채점관의 함정 트랩: </span>
                          {q.distractorTrap}
                        </div>
                      </div>
                    )}

                    {/* Evidence sentence & view button */}
                    {q.evidenceSentence && (
                      <div className="mt-2 flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-500 italic line-clamp-1">
                          " {q.evidenceSentence} "
                        </span>
                        <button
                          onClick={() => {
                            onSelectEvidenceQuestion(q.id);
                            onClose();
                          }}
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline shrink-0 ml-2"
                        >
                          스크립트에서 확인 →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onRetry}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>다시 풀기</span>
            </button>

            <button
              onClick={onSaveToHistory}
              disabled={isSaved}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                isSaved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span>{isSaved ? '저장 완료 ✓' : '학습 이력 저장'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/speaking/lab"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 px-4 py-2 text-xs sm:text-sm font-bold transition-colors"
            >
              <span>Speaking Lab 이동</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
