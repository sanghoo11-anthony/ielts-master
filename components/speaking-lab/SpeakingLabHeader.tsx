'use client';

import React from 'react';
import { SpeakingTopic, SpeakingPart } from '@/types/speaking';
import { Mic, Clock, RotateCcw, Volume2, Sparkles } from 'lucide-react';

interface SpeakingLabHeaderProps {
  topics: SpeakingTopic[];
  activeTopic: SpeakingTopic;
  onSelectTopic: (topic: SpeakingTopic) => void;
  activeQuestionIndex: number;
  onSelectQuestionIndex: (index: number) => void;
  timerSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}

export default function SpeakingLabHeader({
  topics,
  activeTopic,
  onSelectTopic,
  activeQuestionIndex,
  onSelectQuestionIndex,
  timerSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
}: SpeakingLabHeaderProps) {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 py-3 shadow-sm sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Module Title & Topic Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white font-bold shadow-md shadow-rose-500/20 shrink-0">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                Speaking Lab <span className="text-rose-600">실전 대화 & 피드백</span>
              </h1>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                {activeTopic.part.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              영어로 즉석 대화 및 한국어 답변 시 Band 7.5+ 영어 모범답안 즉시 변환
            </p>
          </div>
        </div>

        {/* Center / Right: Topic Dropdown & Timer */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
          {/* Topic Dropdown */}
          <select
            value={activeTopic.id}
            onChange={(e) => {
              const selected = topics.find((t) => t.id === e.target.value);
              if (selected) {
                onSelectTopic(selected);
              }
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 focus:border-rose-500 focus:outline-none max-w-[220px] sm:max-w-[280px] truncate"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.titleKo}
              </option>
            ))}
          </select>

          {/* Countdown / Speech Timer */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-sm text-slate-800">
            <Clock className="h-4 w-4 text-rose-600" />
            <span className="font-mono text-sm font-bold tracking-tight">{formattedTime}</span>
            <button
              type="button"
              onClick={onToggleTimer}
              className="rounded-md px-1.5 py-0.5 text-[11px] font-bold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              {isTimerRunning ? '정지' : '시작'}
            </button>
            <button
              type="button"
              onClick={onResetTimer}
              className="text-slate-400 hover:text-slate-600 p-0.5"
              title="타이머 리셋"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
