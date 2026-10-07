'use client';

import React from 'react';
import { ListeningQuestion } from '@/types/listening';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface ListeningQuestionCardProps {
  question: ListeningQuestion;
  userAnswer: string;
  onAnswerChange: (questionId: number, value: string) => void;
  isSubmitted?: boolean;
}

export default function ListeningQuestionCard({
  question,
  userAnswer = '',
  onAnswerChange,
  isSubmitted = false,
}: ListeningQuestionCardProps) {
  const isMultipleChoice = question.type === 'MULTIPLE_CHOICE' && question.options;

  // Split prompt with [BLANK] for inline blank rendering
  const promptParts = question.prompt.split('[BLANK]');

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
      {/* Header with Question Number and Type */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 font-mono text-xs font-bold text-white shadow-sm">
            Q{question.id}
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {question.type === 'FORM_COMPLETION'
              ? '양식 빈칸 완성'
              : question.type === 'NOTE_COMPLETION'
              ? '노트 빈칸 완성'
              : '객관식 3지선다'}
          </span>
        </div>

        {question.instruction && (
          <span className="rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
            {question.instruction}
          </span>
        )}
      </div>

      {/* Question Content */}
      {isMultipleChoice ? (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
            {question.prompt}
          </p>

          <div className="space-y-2 pt-1">
            {question.options!.map((option, idx) => {
              const optionLetter = option.charAt(0);
              const isSelected =
                userAnswer.trim().toUpperCase() === optionLetter ||
                userAnswer.trim() === option.trim();

              return (
                <label
                  key={idx}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/70 text-amber-950 shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${question.id}`}
                    value={optionLetter}
                    checked={isSelected}
                    disabled={isSubmitted}
                    onChange={() => onAnswerChange(question.id, optionLetter)}
                    className="mt-0.5 h-4 w-4 text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <span className="flex-1 leading-relaxed">{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      ) : (
        /* Fill-in-the-blank Form / Note completion */
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-800 leading-relaxed">
            {promptParts.length > 1 ? (
              <div className="flex flex-wrap items-center gap-2">
                <span>{promptParts[0]}</span>
                <div className="inline-block relative">
                  <input
                    type="text"
                    value={userAnswer}
                    disabled={isSubmitted}
                    onChange={(e) => onAnswerChange(question.id, e.target.value)}
                    placeholder="정답 입력..."
                    className="rounded-lg border-2 border-amber-300 bg-amber-50/50 px-3 py-1.5 text-sm font-bold text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none transition-colors w-44 sm:w-56 shadow-inner"
                  />
                </div>
                <span>{promptParts[1]}</span>
              </div>
            ) : (
              <div>
                <p className="mb-2">{question.prompt}</p>
                <input
                  type="text"
                  value={userAnswer}
                  disabled={isSubmitted}
                  onChange={(e) => onAnswerChange(question.id, e.target.value)}
                  placeholder="정답 단어 또는 숫자 입력..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
