'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TaskType } from '@/types/writing';
import { EvaluateWritingResponse } from '@/types/evaluate-writing';
import { calculateTextStats } from '@/lib/utils/textStats';
import WritingLabHeader from '@/components/writing-lab/WritingLabHeader';
import TopicPromptPanel, { LAB_TOPICS } from '@/components/writing-lab/TopicPromptPanel';
import WritingLabEditor from '@/components/writing-lab/WritingLabEditor';
import WritingLabBottomBar from '@/components/writing-lab/WritingLabBottomBar';
import EvaluationReportModal from '@/components/writing-lab/EvaluationReportModal';

const DRAFT_KEY_PREFIX = 'ielts_writing_lab_draft_';

export default function WritingLabPage() {
  const [selectedTask, setSelectedTask] = useState<TaskType>('TASK_2');
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(0);

  // 타이머 상태 (Task 2 기본 40분 = 2400초, Task 1 기본 20분 = 1200초)
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);

  // 에디터 내용
  const [essayText, setEssayText] = useState('');
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // 모달 및 채점 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingEvaluation, setIsLoadingEvaluation] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluateWritingResponse | null>(null);

  const currentTopic = LAB_TOPICS[selectedTask][selectedTopicIndex] || LAB_TOPICS[selectedTask][0];
  const stats = calculateTextStats(essayText);
  const minTargetWords = selectedTask === 'TASK_2' ? 250 : 150;

  // Task 변경 시 타이머 및 토픽 초기화
  const handleTaskChange = (newTask: TaskType) => {
    setSelectedTask(newTask);
    setSelectedTopicIndex(0);
    const newMinutes = newTask === 'TASK_2' ? 40 : 20;
    setTimeLeft(newMinutes * 60);
    setIsRunning(false);
    setTimeSpentSeconds(0);

    // 새 토픽의 이전 임시저장 불러오기
    const saved = localStorage.getItem(`${DRAFT_KEY_PREFIX}${newTask}_0`);
    if (saved) {
      setEssayText(saved);
    } else {
      setEssayText('');
    }
  };

  // 기출 토픽 변경 시
  const handleSelectTopicIndex = (index: number) => {
    setSelectedTopicIndex(index);
    const saved = localStorage.getItem(`${DRAFT_KEY_PREFIX}${selectedTask}_${index}`);
    if (saved) {
      setEssayText(saved);
    } else {
      setEssayText('');
    }
  };

  // 초안 불러오기 (첫 마운트)
  useEffect(() => {
    const saved = localStorage.getItem(`${DRAFT_KEY_PREFIX}TASK_2_0`);
    if (saved) {
      setEssayText(saved);
    }
  }, []);

  // 타이머 인터벌
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // 타이머 토글 & 리셋
  const handleToggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    const initialSeconds = (selectedTask === 'TASK_2' ? 40 : 20) * 60;
    setTimeLeft(initialSeconds);
    setTimeSpentSeconds(0);
  };

  // 초안 저장
  const handleSaveDraft = () => {
    const key = `${DRAFT_KEY_PREFIX}${selectedTask}_${selectedTopicIndex}`;
    localStorage.setItem(key, essayText);
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2500);
  };

  // AI 첨삭 제출 및 모달 팝업
  const handleSubmitForEvaluation = async () => {
    setIsModalOpen(true);
    setIsLoadingEvaluation(true);
    setIsRunning(false); // 타이머 멈춤

    try {
      const res = await fetch('/api/evaluate-writing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_type: selectedTask,
          prompt_title: currentTopic.title,
          prompt_text: currentTopic.prompt,
          essay_text: essayText.trim(),
          word_count: stats.wordCount,
          time_spent_seconds: timeSpentSeconds,
        }),
      });

      if (res.ok) {
        const data: EvaluateWritingResponse = await res.json();
        setEvaluationResult(data);
        if (data.overall_band >= 7.0) {
          confetti({ particleCount: 75, spread: 65 });
        }
      } else {
        throw new Error('채점 요청 실패');
      }
    } catch (e) {
      console.error('Failed to evaluate essay, generating local fallback', e);
    } finally {
      setIsLoadingEvaluation(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] flex-col bg-slate-100 overflow-y-auto lg:overflow-hidden">
      {/* 1. 상단 바 */}
      <WritingLabHeader
        selectedTask={selectedTask}
        onTaskChange={handleTaskChange}
        timeLeft={timeLeft}
        isRunning={isRunning}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
        wordCount={stats.wordCount}
      />

      {/* 2. 본문 화면 (좌우 2단 분할 레이아웃) */}
      <main className="flex-1 p-3 sm:p-4 overflow-y-auto lg:overflow-hidden">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-12">
          {/* 좌측 패널: 시험 주제 제시문 및 질문 요구사항 카드 (5 cols) */}
          <section className="h-auto min-h-[380px] lg:h-full overflow-hidden lg:col-span-5">
            <TopicPromptPanel
              selectedTask={selectedTask}
              selectedTopicIndex={selectedTopicIndex}
              onSelectTopicIndex={handleSelectTopicIndex}
            />
          </section>

          {/* 우측 패널: 실전 텍스트 에디터 (7 cols) */}
          <section className="h-auto min-h-[480px] lg:h-full overflow-hidden lg:col-span-7">
            <WritingLabEditor
              value={essayText}
              onChange={setEssayText}
              minWords={minTargetWords}
            />
          </section>
        </div>
      </main>

      {/* 3. 하단 바 */}
      <WritingLabBottomBar
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmitForEvaluation}
        isDraftSaved={isDraftSaved}
        isSubmitting={isLoadingEvaluation}
        wordCount={stats.wordCount}
        minTargetWords={minTargetWords}
      />

      {/* 4. AI 첨삭 평가 리포트 모달 */}
      <EvaluationReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isLoadingEvaluation}
        evaluation={evaluationResult}
        essayText={essayText}
        timeSpentSeconds={timeSpentSeconds}
      />
    </div>
  );
}
