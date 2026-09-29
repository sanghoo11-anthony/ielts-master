'use client';

import React from 'react';
import { Clock, Pause, Play, RotateCcw, BookOpen, Send } from 'lucide-react';

interface ReadingLabHeaderProps {
  timeLeft: number;
  isRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  isSubmitted: boolean;
  onSubmit: () => void;
  onResetTest: () => void;
}

export default function ReadingLabHeader({
  timeLeft,
  isRunning,
  onToggleTimer,
  onResetTimer,
  isSubmitted,
  onSubmit,
  onResetTest,
}: ReadingLabHeaderProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWarning = timeLeft <= 600 && timeLeft > 180; // 10분 이하
  const isDanger = timeLeft <= 180 && timeLeft > 0; // 3분 이하

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Module Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold shadow-md shadow-emerald-500/20 shrink-0">
            RL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-slate-900">
                Reading Lab <span className="text-emerald-700">실전 스플릿 훈련</span>
              </h1>
              <span className="hidden sm:inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                General / Academic
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              좌측 지문 하이라이트 & 우측 독립 스크롤 문제 풀이 (T/F/NG + Matching Headings)
            </p>
          </div>
        </div>

        {/* Right Controls: Timer & Submit Action */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* 60분 실전 타이머 */}
          <div
            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 transition-all shadow-sm ${
              isDanger
                ? 'animate-pulse border-red-400 bg-red-50 text-red-600'
                : isWarning
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-slate-200 bg-slate-50 text-slate-800'
            }`}
          >
            <Clock
              className={`h-4 w-4 ${isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}
            />
            <span className="font-mono text-base font-bold tracking-tight">{formattedTime}</span>

            <button
              type="button"
              onClick={onToggleTimer}
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-200 transition-colors"
              title={isRunning ? '타이머 일시정지' : '타이머 시작/재개'}
            >
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              onClick={onResetTimer}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 transition-colors"
              title="타이머 리셋"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Action button */}
          {!isSubmitted ? (
            <button
              type="button"
              onClick={onSubmit}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>정답 확인 및 채점</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onResetTest}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>다시 풀기</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
