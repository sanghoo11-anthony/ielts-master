'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_WRITING_TOPICS } from '@/lib/mock-data/writingTopics';
import { WritingTopic, WritingSubmission } from '@/types/writing';
import { writingRepository } from '@/lib/storage/writingRepository';
import { calculateTextStats } from '@/lib/utils/textStats';
import ExamTimer from '@/components/writing/ExamTimer';
import WordCounter from '@/components/writing/WordCounter';
import WritingEditor from '@/components/writing/WritingEditor';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Info,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export default function WritingPracticePage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const topic: WritingTopic | undefined = MOCK_WRITING_TOPICS.find((t) => t.id === topicId);

  const [essayText, setEssayText] = useState('');
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [isPromptCollapsed, setIsPromptCollapsed] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const stats = calculateTextStats(essayText);

  // 초기에 이전 임시저장(draft) 불러오기
  useEffect(() => {
    if (!topic) return;
    const draft = writingRepository.getDraft(topic.id);
    if (draft && draft.text) {
      setEssayText(draft.text);
      if (draft.timeSpentSeconds) {
        setTimeSpentSeconds(draft.timeSpentSeconds);
      }
    }
  }, [topic]);

  // 주기적 자동 저장 (3초 debounce)
  useEffect(() => {
    if (!topic || !essayText.trim()) return;

    const timer = setTimeout(() => {
      writingRepository.saveDraft(topic.id, essayText, timeSpentSeconds);
      setIsAutoSaved(true);
      setTimeout(() => setIsAutoSaved(false), 2000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [essayText, timeSpentSeconds, topic]);

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">해당 토픽을 찾을 수 없습니다.</h2>
        <Link href="/writing" className="mt-4 inline-block text-blue-600 hover:underline">
          토픽 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const isTask1 = topic.taskType === 'TASK_1';
  const isWordCountSufficient = stats.wordCount >= topic.targetWordCount.min;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    const submissionId = `sub_${Date.now()}`;
    const newSubmission: WritingSubmission = {
      id: submissionId,
      topicId: topic.id,
      taskType: topic.taskType,
      essayText: essayText.trim(),
      wordCount: stats.wordCount,
      timeSpentSeconds,
      submittedAt: new Date().toISOString(),
    };

    try {
      // 1. 먼저 로컬 IndexedDB에 기본 제출 내역 저장
      await writingRepository.saveSubmission(newSubmission);

      // 2. Gemini API 호출하여 공식 4대 기준 평가 수행
      const userProfile = await writingRepository.getUserProfile();
      const res = await fetch('/api/writing/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          essayText: essayText.trim(),
          wordCount: stats.wordCount,
          timeSpentSeconds,
          customApiKey: userProfile.customGeminiApiKey,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'AI 첨삭 생성 중 문제가 발생했습니다.');
      }

      const evalData = await res.json();
      newSubmission.evaluation = evalData.evaluation;

      // 3. 첨삭 결과 업데이트 저장 및 드래프트 비우기
      await writingRepository.saveSubmission(newSubmission);
      writingRepository.clearDraft(topic.id);

      // 4. 결과 페이지로 이동
      router.push(`/writing/${topic.id}/result/${submissionId}`);
    } catch (err: any) {
      console.error('Submission failed', err);
      setSubmissionError(err.message || '채점 도중 오류가 발생했습니다. 다시 시도해 주세요.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100/60 pb-12">
      {/* Top Header Bar */}
      <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 backdrop-blur px-4 py-3 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/writing"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              title="토픽 목록으로 돌아가기"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-xs font-bold ${
                    isTask1 ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {isTask1 ? 'Task 1 (Letter)' : 'Task 2 (Essay)'}
                </span>
                <h1 className="text-sm font-bold text-slate-900 sm:text-base line-clamp-1 max-w-md sm:max-w-xl">
                  {topic.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Right Controls: Timer & Submit button */}
          <div className="flex items-center gap-3">
            <ExamTimer
              initialMinutes={topic.timeLimitMinutes}
              onTimeSpentChange={(sec) => setTimeSpentSeconds(sec)}
              isSubmitting={isSubmitting}
            />

            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              disabled={isSubmitting || !essayText.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>채점 생성 중...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>제출 및 AI 첨삭</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Column: Topic Prompt & Requirements (4 or 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  실전 문제 지시문 (Prompt)
                </span>
                <button
                  type="button"
                  onClick={() => setIsPromptCollapsed(!isPromptCollapsed)}
                  className="text-slate-400 hover:text-slate-600 lg:hidden"
                >
                  {isPromptCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>
              </div>

              {!isPromptCollapsed && (
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-800">
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 font-serif text-slate-900 whitespace-pre-line">
                    {topic.prompt}
                  </div>

                  {topic.bulletPoints && topic.bulletPoints.length > 0 && (
                    <div className="rounded-xl bg-amber-50/70 p-3.5 border border-amber-200/60">
                      <p className="text-xs font-bold text-amber-900 mb-2">
                        ★ Task Achievement 필수 충족 요건 (3가지):
                      </p>
                      <ul className="list-disc pl-5 text-xs text-amber-950 space-y-1">
                        {topic.bulletPoints.map((bp, idx) => (
                          <li key={idx}>{bp}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-[11px] text-amber-700">
                        * 세 가지 요구 조건 중 하나라도 누락되면 Task Achievement에서 Band 5.0 이하로 감점됩니다.
                      </p>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <p className="font-semibold text-slate-700">시험 가이드라인:</p>
                    <p>• 최소 {topic.targetWordCount.min}단어 이상을 작성해야 단어 수 감점을 피할 수 있습니다.</p>
                    <p>• Task 1은 적절한 인사말(Salutation)과 맺음말(Sign-off)을 포함하세요.</p>
                    <p>• 단락 구분을 명확히 하고 각 단락마다 하나의 중심 생각을 전개하세요.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Word Counter Component */}
            <WordCounter currentWords={stats.wordCount} target={topic.targetWordCount} />

            {/* Sample Answer Toggle (Hints) */}
            {topic.sampleAnswers && topic.sampleAnswers.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                  className="flex w-full items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-600"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    Band {topic.sampleAnswers[0].bandScore} 모범 예시 답안 보기 (참고용)
                  </span>
                  {showSampleAnswer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showSampleAnswer && (
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    <div className="max-h-60 overflow-y-auto rounded-lg bg-slate-50 p-3 font-serif text-xs leading-relaxed text-slate-800 whitespace-pre-line border border-slate-200">
                      {topic.sampleAnswers[0].answerText}
                    </div>
                    <div className="rounded-lg bg-blue-50 p-2.5 text-[11px] text-blue-900 border border-blue-200">
                      <span className="font-bold">채점관 코멘트: </span>
                      {topic.sampleAnswers[0].examinerComment}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Writing Editor (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <WritingEditor
              text={essayText}
              onChange={setEssayText}
              isAutoSaved={isAutoSaved}
              disabled={isSubmitting}
            />

            {submissionError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              답안을 제출하고 AI 정밀 채점을 시작하시겠습니까?
            </h3>

            <div className="my-4 space-y-2 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-200">
              <div className="flex justify-between">
                <span>작성 단어 수:</span>
                <span className={`font-bold ${isWordCountSufficient ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {stats.wordCount}단어 (최소 {topic.targetWordCount.min}단어)
                </span>
              </div>
              <div className="flex justify-between">
                <span>소요 시간:</span>
                <span className="font-bold text-slate-800">
                  {Math.floor(timeSpentSeconds / 60)}분 {timeSpentSeconds % 60}초
                </span>
              </div>
            </div>

            {!isWordCountSufficient && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  작성된 단어 수가 최소 기준({topic.targetWordCount.min}단어)에 미치지 못합니다. 그대로 제출할 경우
                  Task Achievement/Response 점수가 대폭 감점될 수 있습니다.
                </span>
              </div>
            )}

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                계속 작성하기
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  handleSubmit();
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
              >
                제출 및 채점하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
