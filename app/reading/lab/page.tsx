'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import ReadingLabHeader from '@/components/reading-lab/ReadingLabHeader';
import ReadingPassagePanel from '@/components/reading-lab/ReadingPassagePanel';
import ReadingQuestionsPanel from '@/components/reading-lab/ReadingQuestionsPanel';
import { READING_LAB_QUESTIONS } from '@/components/reading-lab/readingLabData';

export default function ReadingLabPage() {
  // 타이머 상태 (기본 60분 = 3600초)
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // 답안 상태
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 지문 내 포커스 단락 및 근거 문장
  const [targetParagraphId, setTargetParagraphId] = useState<string | null>(null);
  const [targetEvidenceQuote, setTargetEvidenceQuote] = useState<string | null>(null);
  const [selectedEvidenceQuestionId, setSelectedEvidenceQuestionId] = useState<string | null>(null);

  // 타이머 인터벌
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleToggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(60 * 60);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setIsRunning(false);

    // 정답 개수 산출 및 Band 7.0 이상 시 Confetti
    let score = 0;
    READING_LAB_QUESTIONS.forEach((q) => {
      if ((answers[q.id] || '').trim().toUpperCase() === q.correctAnswer) {
        score += 1;
      }
    });

    if (score >= 4) {
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  const handleResetTest = () => {
    setAnswers({});
    setIsSubmitted(false);
    setTargetParagraphId(null);
    setTargetEvidenceQuote(null);
    setSelectedEvidenceQuestionId(null);
    handleResetTimer();
  };

  // 문제의 [근거 단락 보기]를 클릭했을 때 실행되는 핸들러
  const handleFocusEvidence = (paragraphId: string, quote: string, questionId?: string) => {
    setTargetParagraphId(paragraphId);
    setTargetEvidenceQuote(quote);

    if (questionId) {
      setSelectedEvidenceQuestionId(questionId);
    }

    // 좌측 지문 해당 엘리먼트로 부드럽게 스크롤
    setTimeout(() => {
      const el = document.getElementById(paragraphId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] flex-col bg-slate-100 overflow-y-auto lg:overflow-hidden">
      {/* 1. 상단 바 (타이머 & 제출 액션) */}
      <ReadingLabHeader
        timeLeft={timeLeft}
        isRunning={isRunning}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
        isSubmitted={isSubmitted}
        onSubmit={handleSubmit}
        onResetTest={handleResetTest}
      />

      {/* 2. 분할 레이아웃 (Split View) */}
      <main className="flex-1 p-3 sm:p-4 overflow-y-auto lg:overflow-hidden">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-12">
          {/* 좌측 창: 샘플 긴 지문 (단락 번호 A, B, C... 표시, 형광펜 하이라이트) (7 cols) */}
          <section className="h-auto min-h-[420px] lg:h-full overflow-hidden lg:col-span-7">
            <ReadingPassagePanel
              targetParagraphId={targetParagraphId}
              targetEvidenceQuote={targetEvidenceQuote}
            />
          </section>

          {/* 우측 창: 문제 영역 (독립 스크롤, T/F/NG 문항 3개, Matching Headings 2개) (5 cols) */}
          <section className="h-auto min-h-[450px] lg:h-full overflow-hidden lg:col-span-5">
            <ReadingQuestionsPanel
              answers={answers}
              onAnswerChange={handleAnswerChange}
              isSubmitted={isSubmitted}
              onSubmit={handleSubmit}
              onReset={handleResetTest}
              onFocusEvidence={handleFocusEvidence}
              selectedEvidenceQuestionId={selectedEvidenceQuestionId}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
