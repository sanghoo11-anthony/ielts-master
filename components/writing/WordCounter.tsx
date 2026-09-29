'use client';

import React from 'react';
import { getWordCountStatus } from '@/lib/utils/textStats';
import { CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

interface WordCounterProps {
  currentWords: number;
  target: { min: number; recommended: number };
}

export default function WordCounter({ currentWords, target }: WordCounterProps) {
  const status = getWordCountStatus(currentWords, target);

  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            단어 수 (Words)
          </span>
          <span className="font-mono text-2xl font-black tracking-tight text-slate-900">
            {currentWords}
          </span>
          <span className="text-xs text-slate-400">
            / 최소 {target.min}단어 (권장 {target.recommended}w)
          </span>
        </div>

        <div>
          {status.status === 'under' && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
              <AlertTriangle className="h-3 w-3" />
              기준 미달 (-{target.min - currentWords}w)
            </span>
          )}
          {status.status === 'good' && (
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
              <CheckCircle2 className="h-3 w-3" />
              최소 통과
            </span>
          )}
          {status.status === 'optimal' && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <Sparkles className="h-3 w-3" />
              최적 분량
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full transition-all duration-300 ${
            status.status === 'under'
              ? 'bg-amber-500'
              : status.status === 'good'
              ? 'bg-blue-600'
              : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min((currentWords / target.recommended) * 100, 100)}%` }}
        />
        {/* Min threshold line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-400 opacity-60"
          style={{ left: `${(target.min / target.recommended) * 100}%` }}
          title={`최소 기준선 (${target.min}단어)`}
        />
      </div>

      <p className="text-xs text-slate-500">{status.message}</p>
    </div>
  );
}
