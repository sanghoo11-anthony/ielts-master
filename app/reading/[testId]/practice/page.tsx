'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_READING_TESTS } from '@/lib/mock-data/readingTests';
import { ReadingTestSet, ReadingSubmission, ReadingDetailedResult } from '@/types/reading';
import { readingRepository } from '@/lib/storage/readingRepository';
import { calculateGeneralReadingBand } from '@/lib/utils/bandCalculator';
import PassageViewer from '@/components/reading/PassageViewer';
import QuestionPanel from '@/components/reading/QuestionPanel';
import ExamTimer from '@/components/writing/ExamTimer';
import {
  ArrowLeft,
  Clock,
  Send,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

export default function ReadingPracticePage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId as string;

  const test: ReadingTestSet | undefined = MOCK_READING_TESTS.find((t) => t.id === testId);

  const [activePassageIndex, setActivePassageIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  if (!test) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">해당 테스트 세트를 찾을 수 없습니다.</h2>
        <Link href="/reading" className="mt-4 inline-block text-blue-600 hover:underline">
          테스트 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSelectQuestion = (index: number) => {
    setActiveQuestionIndex(index);
    const targetQ = test.questions[index];
    if (targetQ && targetQ.evidence?.paragraphId) {
      // 해당 문제의 단락이 속한 지문으로 섹션 탭 자동 전환
      const paraId = targetQ.evidence.paragraphId;
      const passageIdx = test.passages.findIndex((p) =>
        p.paragraphs.some((para) => para.id === paraId)
      );
      if (passageIdx !== -1 && passageIdx !== activePassageIndex) {
        setActivePassageIndex(passageIdx);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    let rawScore = 0;
    const detailedResults: ReadingDetailedResult[] = test.questions.map((q) => {
      const userAns = (answers[q.id] || '').trim().toUpperCase();
      let isCorrect = false;

      if (Array.isArray(q.correctAnswer)) {
        isCorrect = q.correctAnswer.map((a) => a.trim().toUpperCase()).includes(userAns);
      } else {
        isCorrect = q.correctAnswer.trim().toUpperCase() === userAns;
      }

      if (isCorrect) rawScore += 1;

      return {
        questionId: q.id,
        questionNumber: q.questionNumber,
        userAnswer: answers[q.id] || '',
        correctAnswer: q.correctAnswer,
        isCorrect,
        evidence: q.evidence,
      };
    });

    const estimatedBand = calculateGeneralReadingBand(rawScore, test.questions.length);

    const submissionId = `read_sub_${Date.now()}`;
    const newSubmission: ReadingSubmission = {
      id: submissionId,
      testId: test.id,
      answers,
      score: rawScore,
      totalQuestions: test.questions.length,
      estimatedBand,
      timeSpentSeconds,
      submittedAt: new Date().toISOString(),
      detailedResults,
    };

    await readingRepository.saveSubmission(newSubmission);
    router.push(`/reading/${test.id}/result/${submissionId}`);
  };

  const answeredCount = Object.keys(answers).filter((k) => answers[k]?.trim()).length;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-100 overflow-hidden">
      {/* Top Header Bar */}
      <div className="shrink-0 border-b border-slate-200 bg-white px-4 py-2.5 shadow-sm sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/reading"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                  IELTS GT Reading
                </span>
                <h1 className="text-sm font-bold text-slate-900 line-clamp-1 max-w-sm sm:max-w-md">
                  {test.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Right Timer & Submit */}
          <div className="flex items-center gap-3">
            <ExamTimer
              initialMinutes={test.timeLimitMinutes}
              onTimeSpentChange={(sec) => setTimeSpentSeconds(sec)}
              onTimeExpired={() => handleSubmit()}
              isSubmitting={isSubmitting}
            />

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>시험 제출</span>
            </button>
          </div>
        </div>
      </div>

      {/* Split Screen Container (좌: 지문 뷰어 / 우: 문제 패널) */}
      <div className="flex-1 p-3 sm:p-4 overflow-hidden">
        <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Left: Passage Viewer (7 cols) */}
          <div className="h-full overflow-hidden lg:col-span-7">
            <PassageViewer
              passages={test.passages}
              activePassageIndex={activePassageIndex}
              onPassageChange={setActivePassageIndex}
            />
          </div>

          {/* Right: Question Panel (5 cols) */}
          <div className="h-full overflow-hidden lg:col-span-5">
            <QuestionPanel
              questions={test.questions}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onSubmit={() => setShowSubmitModal(true)}
              activeQuestionIndex={activeQuestionIndex}
              onSelectQuestion={handleSelectQuestion}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Reading 시험을 종료하고 채점하시겠습니까?
            </h3>

            <div className="my-4 space-y-2 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-200">
              <div className="flex justify-between">
                <span>응답한 문항:</span>
                <span className="font-bold text-blue-600">
                  {answeredCount} / {test.questions.length}문항
                </span>
              </div>
              <div className="flex justify-between">
                <span>소요 시간:</span>
                <span className="font-bold text-slate-800">
                  {Math.floor(timeSpentSeconds / 60)}분 {timeSpentSeconds % 60}초
                </span>
              </div>
            </div>

            {answeredCount < test.questions.length && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  아직 풀지 않은 문제가 {test.questions.length - answeredCount}개 있습니다. IELTS는 감점이 없으므로
                  모든 문제에 답을 적는 것이 유리합니다.
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                계속 풀기
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmit();
                }}
                className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-emerald-800"
              >
                채점 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
