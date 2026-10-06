'use client';

import React, { useState, useEffect } from 'react';
import SpeakingLabHeader from '@/components/speaking-lab/SpeakingLabHeader';
import SpeakingInteractionPanel from '@/components/speaking-lab/SpeakingInteractionPanel';
import SpeakingReportModal from '@/components/speaking-lab/SpeakingReportModal';
import { SPEAKING_TOPICS } from '@/lib/mock-data/speakingTopics';
import {
  SpeakingTopic,
  SpeakingEvaluationResponse,
  SpeakingSubmission,
} from '@/types/speaking';
import { saveSpeakingSubmission } from '@/lib/storage/speakingRepository';
import { db } from '@/lib/storage/db';

export default function SpeakingLabPage() {
  const [activeTopic, setActiveTopic] = useState<SpeakingTopic>(SPEAKING_TOPICS[0]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // 타이머 상태 (Part 1: 45초, Part 2: 120초, Part 3: 60초)
  const defaultTimer = activeTopic.speechTimeSeconds || 60;
  const [timerSeconds, setTimerSeconds] = useState(defaultTimer);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 평가 진행 및 모달 상태
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<SpeakingEvaluationResponse | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [lastSubmittedAnswer, setLastSubmittedAnswer] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // 토픽 변경 시 타이머 및 질문 리셋
  useEffect(() => {
    setActiveQuestionIndex(0);
    setTimerSeconds(activeTopic.speechTimeSeconds || 60);
    setIsTimerRunning(false);
  }, [activeTopic]);

  // 타이머 인터벌
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(activeTopic.speechTimeSeconds || 60);
  };

  // 답변 제출 및 AI 평가 호출
  const handleSubmitAnswer = async (answer: string, isKorean: boolean) => {
    setIsEvaluating(true);
    setLastSubmittedAnswer(answer);
    setIsSaved(false);

    try {
      // IndexedDB에서 customApiKey 확인
      const userProfile = await db.userProfile.get('current-user');
      const customApiKey = userProfile?.customGeminiApiKey;

      const currentQ = activeTopic.questions[activeQuestionIndex];

      const res = await fetch('/api/evaluate-speaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId: activeTopic.id,
          topicTitle: activeTopic.titleKo,
          part: activeTopic.part,
          questionText: currentQ.questionText,
          candidateAnswer: answer,
          isKoreanInput: isKorean,
          custom_api_key: customApiKey,
        }),
      });

      if (!res.ok) {
        throw new Error('평가 요청 실패');
      }

      const data: SpeakingEvaluationResponse = await res.json();
      setEvaluationResult(data);
      setIsReportModalOpen(true);
    } catch (error) {
      console.error(error);
      alert('스피킹 평가 요청 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // 답변 이력 IndexedDB 저장
  const handleSaveToHistory = async () => {
    if (!evaluationResult) return;

    try {
      const currentQ = activeTopic.questions[activeQuestionIndex];
      const submission: SpeakingSubmission = {
        id: `spk-sub-${Date.now()}`,
        topicId: activeTopic.id,
        topicTitle: activeTopic.titleKo,
        part: activeTopic.part,
        questionText: currentQ.questionText,
        candidateAnswer: lastSubmittedAnswer,
        isKoreanResponse: evaluationResult.is_korean_response,
        evaluation: evaluationResult,
        submittedAt: new Date().toISOString(),
      };

      await saveSpeakingSubmission(submission);
      setIsSaved(true);
    } catch (e) {
      console.error(e);
      alert('이력 저장에 실패했습니다.');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-slate-50">
      {/* 1. Header with Topic Selector & Timer */}
      <SpeakingLabHeader
        topics={SPEAKING_TOPICS}
        activeTopic={activeTopic}
        onSelectTopic={setActiveTopic}
        activeQuestionIndex={activeQuestionIndex}
        onSelectQuestionIndex={setActiveQuestionIndex}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
      />

      {/* 2. Main Spoken Interaction Panel */}
      <main className="flex-1 overflow-y-auto">
        <SpeakingInteractionPanel
          activeTopic={activeTopic}
          activeQuestionIndex={activeQuestionIndex}
          onSelectQuestionIndex={setActiveQuestionIndex}
          onSubmitAnswer={handleSubmitAnswer}
          isEvaluating={isEvaluating}
        />
      </main>

      {/* 3. Speaking Report Modal */}
      <SpeakingReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        evaluation={evaluationResult}
        questionText={activeTopic.questions[activeQuestionIndex]?.questionText || ''}
        candidateAnswer={lastSubmittedAnswer}
        onSaveToHistory={handleSaveToHistory}
        isSaved={isSaved}
      />
    </div>
  );
}
