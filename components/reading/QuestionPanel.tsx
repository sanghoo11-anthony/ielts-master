'use client';

import React from 'react';
import { ReadingQuestion, QuestionType } from '@/types/reading';
import {
  HelpCircle,
  CheckCircle2,
  Send,
  Flag,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface QuestionPanelProps {
  questions: ReadingQuestion[];
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  onSubmit: () => void;
  activeQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  isSubmitting?: boolean;
}

export default function QuestionPanel({
  questions,
  answers,
  onAnswerChange,
  onSubmit,
  activeQuestionIndex,
  onSelectQuestion,
  isSubmitting = false,
}: QuestionPanelProps) {
  const currentQ = questions[activeQuestionIndex];
  const answeredCount = Object.keys(answers).filter((k) => answers[k]?.trim()).length;
  const totalCount = questions.length;
  const progressPercent = Math.round((answeredCount / totalCount) * 100);

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case 'TRUE_FALSE_NOT_GIVEN':
        return 'True / False / Not Given';
      case 'MATCHING_HEADINGS':
        return 'Matching Headings';
      case 'MULTIPLE_CHOICE':
        return 'Multiple Choice';
      case 'SUMMARY_COMPLETION':
        return 'Summary Completion (빈칸 채우기)';
      default:
        return type;
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Top Header: Progress & Question Quick Navigation Chips */}
      <div className="border-b border-slate-200 bg-slate-50/90 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            문제 풀이 진행 현황
          </span>
          <span className="font-mono text-xs font-bold text-blue-600">
            {answeredCount} / {totalCount} 문항 ({progressPercent}%)
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 mb-3">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Numbers Bar */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {questions.map((q, idx) => {
            const hasAnswer = !!answers[q.id]?.trim();
            const isCurrent = activeQuestionIndex === idx;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectQuestion(idx)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/40'
                    : hasAnswer
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {q.questionNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Content Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
        {currentQ && (
          <div className="space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                Question {currentQ.questionNumber}
              </span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                {getQuestionTypeLabel(currentQ.type)}
              </span>
            </div>

            {/* Prompt Statement */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 font-medium text-slate-900 text-sm leading-relaxed">
              {currentQ.prompt}
            </div>

            {/* Render Input controls depending on Question Type */}
            <div className="pt-2">
              {/* Type 1: True / False / Not Given */}
              {(currentQ.type === 'TRUE_FALSE_NOT_GIVEN' || currentQ.type === 'YES_NO_NOT_GIVEN') && (
                <div className="space-y-2.5">
                  {(['TRUE', 'FALSE', 'NOT GIVEN'] as const).map((option) => (
                    <label
                      key={option}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                        answers[currentQ.id] === option
                          ? 'border-blue-600 bg-blue-50/70 font-bold text-blue-900 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-sm">{option}</span>
                      <input
                        type="radio"
                        name={`q-${currentQ.id}`}
                        value={option}
                        checked={answers[currentQ.id] === option}
                        onChange={() => onAnswerChange(currentQ.id, option)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
              )}

              {/* Type 2: Multiple Choice */}
              {currentQ.type === 'MULTIPLE_CHOICE' && (
                <div className="space-y-2.5">
                  {currentQ.options.map((opt) => (
                    <label
                      key={opt.label}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                        answers[currentQ.id] === opt.label
                          ? 'border-blue-600 bg-blue-50/70 font-semibold text-blue-900 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-700">
                        {opt.label}
                      </span>
                      <span className="text-sm leading-snug pt-0.5">{opt.text}</span>
                      <input
                        type="radio"
                        name={`q-${currentQ.id}`}
                        value={opt.label}
                        checked={answers[currentQ.id] === opt.label}
                        onChange={() => onAnswerChange(currentQ.id, opt.label)}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              )}

              {/* Type 3: Matching Headings */}
              {currentQ.type === 'MATCHING_HEADINGS' && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-600">
                    선택할 제목(Heading)을 고르세요:
                  </p>
                  <select
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => onAnswerChange(currentQ.id, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">-- 제목을 선택하세요 --</option>
                    {currentQ.headingOptions.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.romanNumeral}. {h.text}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Type 4: Summary Completion */}
              {currentQ.type === 'SUMMARY_COMPLETION' && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 border border-amber-200">
                    지침: NO MORE THAN {currentQ.wordLimit} WORDS (단어 수 제한 준수)
                  </div>
                  <input
                    type="text"
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => onAnswerChange(currentQ.id, e.target.value)}
                    placeholder="지문에서 정확한 단어를 찾아 입력하세요"
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation & Submit */}
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {/* Prev / Next buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={activeQuestionIndex === 0}
              onClick={() => onSelectQuestion(activeQuestionIndex - 1)}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>이전</span>
            </button>
            <button
              type="button"
              disabled={activeQuestionIndex === questions.length - 1}
              onClick={() => onSelectQuestion(activeQuestionIndex + 1)}
              className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            >
              <span>다음</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Submit Test Button */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>답안 제출 및 채점</span>
          </button>
        </div>
      </div>
    </div>
  );
}
