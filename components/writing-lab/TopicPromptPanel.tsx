'use client';

import React from 'react';
import { TaskType, WritingTopic } from '@/types/writing';
import {
  FileText,
  Mail,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export const LAB_TOPICS: Record<TaskType, WritingTopic[]> = {
  TASK_1: [
    {
      id: 'lab-t1-01',
      taskType: 'TASK_1',
      tone: 'FORMAL',
      title: '항공사 수하물 분실에 대한 공식 항의 및 보상 요구 편지',
      prompt: `You recently traveled on an international flight with Global Airways, and your checked baggage was lost upon arrival at London Heathrow. Despite submitting a report at the service desk, you have received no updates for 48 hours.

Write a formal letter to the Customer Relations Manager. In your letter:
• Provide details of your flight and lost luggage
• Explain the severe problems and financial costs this situation has caused you
• State clearly what compensation or urgent action you require`,
      bulletPoints: [
        'Provide details of your flight and lost luggage',
        'Explain the severe problems and financial costs this situation has caused you',
        'State clearly what compensation or urgent action you require',
      ],
      targetWordCount: { min: 150, recommended: 175 },
      timeLimitMinutes: 20,
      difficulty: 'BAND_6_7',
    },
    {
      id: 'lab-t1-02',
      taskType: 'TASK_1',
      tone: 'SEMI_FORMAL',
      title: '아파트 이웃의 지속적인 심야 소음에 대한 원만한 해결 요청 편지',
      prompt: `You live in a residential apartment building and the neighbor living directly above you has recently been making excessive noise late at night, disrupting your sleep and work.

Write a letter to your neighbor. In your letter:
• Explain the specific noise disturbances and when they typically occur
• Describe how this is affecting your daily health and professional routine
• Propose a polite and practical solution to resolve the matter amicably`,
      bulletPoints: [
        'Explain the specific noise disturbances and when they typically occur',
        'Describe how this is affecting your daily health and professional routine',
        'Propose a polite and practical solution to resolve the matter amicably',
      ],
      targetWordCount: { min: 150, recommended: 170 },
      timeLimitMinutes: 20,
      difficulty: 'BAND_5_6',
    },
  ],
  TASK_2: [
    {
      id: 'lab-t2-01',
      taskType: 'TASK_2',
      essayType: 'OPINION',
      title: '원격 근무의 확산: 기업과 근로자 모두에게 실질적으로 더 유익한가?',
      prompt: `With ongoing advancements in digital communication technology, an increasing number of companies are encouraging employees to work remotely from home rather than in traditional corporate offices.

To what extent do you agree or disagree that remote work provides greater long-term advantages for both employers and employees?

Give reasons for your answer and include relevant examples from your own knowledge or experience.`,
      targetWordCount: { min: 250, recommended: 285 },
      timeLimitMinutes: 40,
      difficulty: 'BAND_7_PLUS',
    },
    {
      id: 'lab-t2-02',
      taskType: 'TASK_2',
      essayType: 'DISCUSSION',
      title: '대학 교육의 본질: 직업 실무 기술 중심 vs 폭넓은 학문과 교양 중심',
      prompt: `Some people believe that universities should focus primarily on imparting specialized workplace skills and career-oriented knowledge. Others argue that universities must provide a broad, general education irrespective of direct job market utility.

Discuss both views and give your own balanced opinion.

Give reasons for your answer and include any relevant examples from your own experience or observations.`,
      targetWordCount: { min: 250, recommended: 280 },
      timeLimitMinutes: 40,
      difficulty: 'BAND_6_7',
    },
  ],
};

interface TopicPromptPanelProps {
  selectedTask: TaskType;
  selectedTopicIndex: number;
  onSelectTopicIndex: (index: number) => void;
}

export default function TopicPromptPanel({
  selectedTask,
  selectedTopicIndex,
  onSelectTopicIndex,
}: TopicPromptPanelProps) {
  const topics = LAB_TOPICS[selectedTask];
  const currentTopic = topics[selectedTopicIndex] || topics[0];
  const isTask1 = selectedTask === 'TASK_1';

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Topic Switcher Bar */}
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            기출 토픽 선택 ({topics.length}개 예시 수록)
          </span>
          <span className="text-xs font-semibold text-blue-600">
            {isTask1 ? 'Letter Topic' : 'Essay Topic'}
          </span>
        </div>

        <div className="flex gap-2">
          {topics.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTopicIndex(idx)}
              className={`flex-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all text-left truncate ${
                selectedTopicIndex === idx
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              토픽 {idx + 1}: {t.title.slice(0, 18)}...
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
        {/* Title & Metadata */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                isTask1 ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
              }`}
            >
              {isTask1 ? <Mail className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
              {isTask1 ? 'IELTS GT Task 1' : 'IELTS GT Task 2'}
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {currentTopic.tone || currentTopic.essayType}
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-900 leading-snug">
            {currentTopic.title}
          </h2>
        </div>

        {/* Prompt Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-serif text-sm leading-relaxed text-slate-800 shadow-inner whitespace-pre-line">
          {currentTopic.prompt}
        </div>

        {/* Question Requirements Card */}
        {isTask1 && currentTopic.bulletPoints && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-amber-600" />
              Task Achievement 필수 포함 항목 (3가지)
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-950 list-disc pl-4">
              {currentTopic.bulletPoints.map((bp, i) => (
                <li key={i}>{bp}</li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-amber-800 leading-normal">
              * 세 가지 중 하나라도 생략되거나 불충분하게 작성되면 Task Achievement에서 5.0 이하로 감점됩니다.
            </p>
          </div>
        )}

        {!isTask1 && (
          <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-purple-600" />
              Task Response 핵심 평가 기준
            </h4>
            <ul className="space-y-1.5 text-xs text-purple-950 list-disc pl-4">
              <li>질문에서 제시된 양측 입장 또는 자신의 명확한 견해(Clear Position) 일관되게 전개</li>
              <li>각 본론 문단마다 구체적인 이유(Reasons) 및 적절한 예시(Examples) 제시</li>
              <li>결론(Conclusion)에서 서론 및 본론의 핵심 논점을 명확히 재요약</li>
            </ul>
          </div>
        )}

        {/* Exam Tip Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-600 space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5 text-blue-600" />
            <span>실전 작성 가이드:</span>
          </div>
          <p>
            • 최소 단어 수: <strong>{currentTopic.targetWordCount.min}단어 이상</strong> (감점 방지)
            <br />
            • 권장 분량: 약 {currentTopic.targetWordCount.recommended}단어 내외
          </p>
          <p>
            • {isTask1 ? '적절한 격식의 인사말과 맺음말(Yours faithfully / sincerely)을 반드시 포함하세요.' : '서론-본론1-본론2-결론의 4단락 체계를 갖추는 것이 Band 7.0의 정석입니다.'}
          </p>
        </div>
      </div>
    </div>
  );
}
