'use client';

import React from 'react';
import { AdvancedVocabularySuggestion } from '@/types/writing';
import { BookMarked, ArrowRight, Quote } from 'lucide-react';

interface LexicalUpgradeProps {
  suggestions: AdvancedVocabularySuggestion[];
}

export default function LexicalUpgradeSuggestions({ suggestions }: LexicalUpgradeProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
          <BookMarked className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Band 7.0+ 어휘 & Collocation 업그레이드 제안
          </h3>
          <p className="text-xs text-slate-500">
            반복 사용된 평이한 단어를 고급 아카데믹 표현으로 대체하여 어휘 점수(LR)를 극대화하세요.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {suggestions.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/40 to-slate-50 p-5"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-md bg-slate-200 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700">
                  {item.originalWord}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-purple-600" />
                <div className="flex flex-wrap gap-1">
                  {item.recommendedReplacements.map((rep, rIdx) => (
                    <span
                      key={rIdx}
                      className="rounded-md bg-purple-100 px-2 py-0.5 font-mono text-xs font-bold text-purple-800 border border-purple-200"
                    >
                      {rep}
                    </span>
                  ))}
                </div>
              </div>

              {item.contextExample && (
                <div className="mt-3 rounded-xl bg-white p-3 border border-purple-100/80 text-xs text-slate-700">
                  <span className="font-semibold text-purple-900 flex items-center gap-1 mb-1">
                    <Quote className="h-3 w-3" /> 실전 활용 예문:
                  </span>
                  <p className="font-serif italic text-slate-800">
                    "{item.contextExample}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
