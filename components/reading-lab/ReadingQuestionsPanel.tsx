'use client';

import React from 'react';
import {
  READING_LAB_QUESTIONS,
  LIST_OF_HEADINGS,
  LabQuestion,
} from './readingLabData';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  Send,
  RotateCcw,
  Sparkles,
  Trophy,
} from 'lucide-react';

interface ReadingQuestionsPanelProps {
  answers: Record<string, string>;
  onAnswerChange: (questionId: string, value: string) => void;
  isSubmitted: boolean;
  onSubmit: () => void;
  onReset: () => void;
  onFocusEvidence: (paragraphId: string, quote: string, questionId?: string) => void;
  selectedEvidenceQuestionId: string | null;
}

export default function ReadingQuestionsPanel({
  answers,
  onAnswerChange,
  isSubmitted,
  onSubmit,
  onReset,
  onFocusEvidence,
  selectedEvidenceQuestionId,
}: ReadingQuestionsPanelProps) {
  // 채점 계산
  let rawScore = 0;
  const questions = READING_LAB_QUESTIONS;

  questions.forEach((q) => {
    const userAns = (answers[q.id] || '').trim().toUpperCase();
    if (userAns === q.correctAnswer.trim().toUpperCase()) {
      rawScore += 1;
    }
  });

  // 5문항 비례 환산 Band Score 계산
  const getEstimatedBand = (score: number) => {
    switch (score) {
      case 5:
        return 8.5;
      case 4:
        return 7.5;
      case 3:
        return 6.5;
      case 2:
        return 5.5;
      case 1:
        return 4.5;
      default:
        return 3.5;
    }
  };

  const estimatedBand = getEstimatedBand(rawScore);
  const answeredCount = Object.keys(answers).filter((k) => answers[k]?.trim()).length;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Panel Top Header Bar */}
      <div className="border-b border-slate-200 bg-slate-50/90 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              실전 문제 풀이 (Questions 1–5)
            </h3>
            <p className="text-[11px] text-slate-500">
              응답: {answeredCount} / {questions.length}문항 완료
            </p>
          </div>

          {!isSubmitted ? (
            <button
              type="button"
              onClick={onSubmit}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>정답 확인</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>다시 풀기</span>
            </button>
          )}
        </div>
      </div>

      {/* 채점 결과 배너 (isSubmitted === true일 때 즉시 표시) */}
      {isSubmitted && (
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-md">
                <span className="text-[9px] uppercase font-bold text-emerald-200">Band</span>
                <span className="font-mono text-xl">{estimatedBand.toFixed(1)}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    채점 완료: {rawScore} / {questions.length} 정답
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    정답률 {Math.round((rawScore / questions.length) * 100)}%
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-300">
                  {estimatedBand >= 7.0
                    ? '🎉 목표 점수인 Band 7.0+ 기준을 통과했습니다!'
                    : '오답 문항의 [지문 근거 단락 보기]를 눌러 단서를 확인하세요.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Questions Scrollable Container (독립 스크롤 overflow-y-auto) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        {/* Section A: True / False / Not Given (Questions 1~3) */}
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-100 p-3 border border-slate-200">
            <span className="text-xs font-bold text-slate-800 uppercase block mb-1">
              Questions 1 – 3: True / False / Not Given
            </span>
            <p className="text-[11px] text-slate-600 leading-snug">
              Do the following statements agree with the information given in the text?
              <br />
              <strong>TRUE</strong> if the statement agrees with the information
              <br />
              <strong>FALSE</strong> if the statement contradicts the information
              <br />
              <strong>NOT GIVEN</strong> if there is no information on this
            </p>
          </div>

          {questions.slice(0, 3).map((q) => {
            const userAns = (answers[q.id] || '').trim().toUpperCase();
            const isCorrect = userAns === q.correctAnswer;
            const isFocused = selectedEvidenceQuestionId === q.id;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                } ${isFocused ? 'ring-2 ring-emerald-500 shadow-md' : ''}`}
              >
                {/* Question Prompt */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-700">
                      {q.questionNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Statement {q.questionNumber}
                    </span>
                  </div>

                  {/* 정답/오답 배지 */}
                  {isSubmitted && (
                    <div>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          정답
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                          <XCircle className="h-3.5 w-3.5 text-rose-600" />
                          오답
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-xs font-medium text-slate-800 leading-relaxed mb-3">
                  "{q.prompt}"
                </p>

                {/* Radio Options: TRUE / FALSE / NOT GIVEN */}
                <div className="grid grid-cols-3 gap-2">
                  {(['TRUE', 'FALSE', 'NOT GIVEN'] as const).map((opt) => (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center justify-center rounded-xl border p-2 text-xs font-bold transition-all ${
                        answers[q.id] === opt
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        disabled={isSubmitted}
                        onChange={() => onAnswerChange(q.id, opt)}
                        className="sr-only"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                {/* 해설 및 단락 근거 포커스 버튼 (제출 후) */}
                {isSubmitted && (
                  <div className="mt-3.5 border-t border-slate-200/80 pt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="space-x-2">
                        <span className="text-slate-500">정답: <strong>{q.correctAnswer}</strong></span>
                        <span className="text-slate-500">내 답: <strong className={isCorrect ? 'text-emerald-700' : 'text-rose-600'}>{userAns || '(미선택)'}</strong></span>
                      </div>

                      {/* 단락 근거 보기 버튼 */}
                      <button
                        type="button"
                        onClick={() => onFocusEvidence(q.paragraphTarget, q.evidenceQuote, q.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-white border border-emerald-300 px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 shadow-sm"
                      >
                        <Bookmark className="h-3 w-3" />
                        <span>근거 단락({q.paragraphTarget.replace('para-', '')}) 보기</span>
                      </button>
                    </div>

                    <div className="rounded-xl bg-amber-50/80 p-2.5 text-[11px] text-amber-950 border border-amber-200">
                      <strong>지문 근거:</strong> "{q.evidenceQuote}"
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-2 rounded border border-slate-100">
                      💡 <strong>해설:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section B: Matching Headings (Questions 4~5) */}
        <div className="space-y-4 pt-2 border-t border-slate-200">
          <div className="rounded-xl bg-slate-100 p-3 border border-slate-200">
            <span className="text-xs font-bold text-slate-800 uppercase block mb-1">
              Questions 4 – 5: Matching Headings
            </span>
            <p className="text-[11px] text-slate-600 leading-snug">
              Choose the correct heading for each paragraph from the List of Headings below.
            </p>
          </div>

          {/* List of Headings Reference Box */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 text-xs">
            <span className="font-bold text-blue-900 block mb-2">List of Headings:</span>
            <div className="space-y-1 text-slate-700">
              {LIST_OF_HEADINGS.map((h) => (
                <div key={h.id} className="flex items-start gap-1.5 text-[11px]">
                  <span className="font-mono font-bold text-blue-800 w-5">{h.roman}.</span>
                  <span>{h.text}</span>
                </div>
              ))}
            </div>
          </div>

          {questions.slice(3, 5).map((q) => {
            const userAns = answers[q.id] || '';
            const isCorrect = userAns === q.correctAnswer;
            const isFocused = selectedEvidenceQuestionId === q.id;

            const selectedHeading = LIST_OF_HEADINGS.find((h) => h.id === userAns);
            const correctHeading = LIST_OF_HEADINGS.find((h) => h.id === q.correctAnswer);

            return (
              <div
                key={q.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                } ${isFocused ? 'ring-2 ring-emerald-500 shadow-md' : ''}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 font-mono text-xs font-bold text-slate-700">
                      {q.questionNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {q.targetParagraphForHeading}
                    </span>
                  </div>

                  {isSubmitted && (
                    <div>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          정답
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                          <XCircle className="h-3.5 w-3.5 text-rose-600" />
                          오답
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-700 mb-3">{q.prompt}</p>

                {/* Dropdown Selector */}
                <select
                  value={userAns}
                  disabled={isSubmitted}
                  onChange={(e) => onAnswerChange(q.id, e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- 제목(Heading)을 선택하세요 --</option>
                  {LIST_OF_HEADINGS.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.roman}. {h.text}
                    </option>
                  ))}
                </select>

                {/* 해설 및 단락 근거 포커스 (제출 후) */}
                {isSubmitted && (
                  <div className="mt-3.5 border-t border-slate-200/80 pt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="space-x-2">
                        <span className="text-slate-500">
                          정답: <strong>{correctHeading?.roman}. {correctHeading?.text.slice(0, 18)}...</strong>
                        </span>
                      </div>

                      {/* 단락 근거 보기 버튼 */}
                      <button
                        type="button"
                        onClick={() => onFocusEvidence(q.paragraphTarget, q.evidenceQuote, q.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-white border border-emerald-300 px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 shadow-sm"
                      >
                        <Bookmark className="h-3 w-3" />
                        <span>근거 단락({q.paragraphTarget.replace('para-', '')}) 보기</span>
                      </button>
                    </div>

                    <div className="rounded-xl bg-amber-50/80 p-2.5 text-[11px] text-amber-950 border border-amber-200">
                      <strong>지문 근거:</strong> "{q.evidenceQuote}"
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed bg-white p-2 rounded border border-slate-100">
                      💡 <strong>해설:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
