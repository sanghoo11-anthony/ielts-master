'use client';

import React from 'react';
import { Clock, Pause, Play, RotateCcw, AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react';
import { TaskType } from '@/types/writing';

interface WritingLabHeaderProps {
  selectedTask: TaskType;
  onTaskChange: (task: TaskType) => void;
  timeLeft: number; // in seconds
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  wordCount: number;
}

export default function WritingLabHeader({
  selectedTask,
  onTaskChange,
  timeLeft,
  isRunning,
  onToggleTimer,
  onResetTimer,
  wordCount,
}: WritingLabHeaderProps) {
  const isTask2 = selectedTask === 'TASK_2';
  const minTargetWords = isTask2 ? 250 : 150;
  const isUnderWordCount = wordCount < minTargetWords;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWarning = timeLeft <= 300 && timeLeft > 60; // 5분 이하
  const isDanger = timeLeft <= 60 && timeLeft > 0; // 1분 이하
  const isExpired = timeLeft === 0;

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* 1. Task 선택 드롭다운 */}
        <div className="flex items-center gap-3">
          <div className="relative max-w-full">
            <select
              value={selectedTask}
              onChange={(e) => onTaskChange(e.target.value as TaskType)}
              className="w-full sm:w-auto max-w-[260px] sm:max-w-none truncate appearance-none rounded-xl border border-slate-300 bg-slate-50 py-2 pl-3.5 pr-9 text-xs sm:text-sm font-bold text-slate-800 transition-all hover:bg-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="TASK_1">Task 1: 편지/실용 서신 (20분, 150단어+)</option>
              <option value="TASK_2">Task 2: 아카데믹/논쟁 에세이 (40분, 250단어+)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          <span
            className={`hidden sm:inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${
              isTask2 ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isTask2 ? 'Essay Writing (40m)' : 'Letter Writing (20m)'}
          </span>
        </div>

        {/* 2. 타이머 & 실시간 글자수 카운터 */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* 실시간 단어 수 카운터 배지 */}
          <div className="flex items-center gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase">Words:</span>
              <span className="font-mono text-xl font-black text-slate-900">{wordCount}</span>
              <span className="text-xs text-slate-400">/ {minTargetWords}w</span>
            </div>

            {isUnderWordCount ? (
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 sm:px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200 shadow-sm animate-pulse">
                <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
                <span>
                  -{minTargetWords - wordCount}
                  <span className="hidden sm:inline">단어 부족 (경고)</span>
                  <span className="sm:hidden">w 부족</span>
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-sm">
                <CheckCircle className="h-3 w-3 text-emerald-600" />
                <span>기준 달성</span>
              </span>
            )}
          </div>

          {/* 제한 시간 타이머 (일시정지 & 리셋 기능) */}
          <div
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all shadow-sm ${
              isExpired
                ? 'border-red-500 bg-red-50 text-red-700'
                : isDanger
                ? 'animate-pulse border-red-400 bg-red-50 text-red-600'
                : isWarning
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-slate-50 text-slate-800'
            }`}
          >
            <Clock
              className={`h-4 w-4 ${
                isDanger || isExpired ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-blue-600'
              }`}
            />
            <span className="font-mono text-base font-bold tracking-tight">{formattedTime}</span>

            {/* Play / Pause Toggle Button */}
            <button
              type="button"
              onClick={onToggleTimer}
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              title={isRunning ? '타이머 일시정지' : '타이머 시작/재개'}
            >
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={onResetTimer}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              title="타이머 리셋"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
