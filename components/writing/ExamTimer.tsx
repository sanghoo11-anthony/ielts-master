'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Pause, Play, AlertCircle } from 'lucide-react';

interface ExamTimerProps {
  initialMinutes: number;
  onTimeSpentChange?: (seconds: number) => void;
  onTimeExpired?: () => void;
  isSubmitting?: boolean;
}

export default function ExamTimer({
  initialMinutes,
  onTimeSpentChange,
  onTimeExpired,
  isSubmitting = false,
}: ExamTimerProps) {
  const totalSeconds = initialMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isRunning || isSubmitting) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeExpired?.();
          return 0;
        }
        const updated = prev - 1;
        onTimeSpentChange?.(totalSeconds - updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isSubmitting, totalSeconds, onTimeSpentChange, onTimeExpired]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWarning = timeLeft <= 300 && timeLeft > 60; // 5분 이하
  const isDanger = timeLeft <= 60 && timeLeft > 0; // 1분 이하
  const isExpired = timeLeft === 0;

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-1.5 transition-all shadow-sm ${
        isExpired
          ? 'border-red-500 bg-red-50 text-red-700'
          : isDanger
          ? 'animate-pulse border-red-400 bg-red-50 text-red-600'
          : isWarning
          ? 'border-amber-400 bg-amber-50 text-amber-700'
          : 'border-slate-200 bg-white text-slate-800'
      }`}
    >
      <Clock
        className={`h-4 w-4 ${
          isDanger || isExpired
            ? 'text-red-600'
            : isWarning
            ? 'text-amber-600'
            : 'text-blue-600'
        }`}
      />
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          남은 시간
        </span>
        <span className="font-mono text-base font-bold tracking-tight">
          {formattedTime}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsRunning(!isRunning)}
        disabled={isExpired || isSubmitting}
        className="ml-1 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
        title={isRunning ? '타이머 일시정지' : '타이머 재개'}
      >
        {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>

      {isWarning && (
        <span className="hidden text-xs font-semibold text-amber-600 sm:inline">
          5분 남음
        </span>
      )}
      {isDanger && (
        <span className="hidden text-xs font-bold text-red-600 sm:inline">
          마무리 단계!
        </span>
      )}
      {isExpired && (
        <span className="flex items-center gap-1 text-xs font-bold text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> 시간 종료
        </span>
      )}
    </div>
  );
}
