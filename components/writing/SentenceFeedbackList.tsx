'use client';

import React, { useState } from 'react';
import { SentenceFeedback } from '@/types/writing';
import {
  Check,
  Copy,
  Sparkles,
  ArrowRight,
  BookOpen,
  Filter,
} from 'lucide-react';

interface SentenceFeedbackListProps {
  feedbacks: SentenceFeedback[];
}

export default function SentenceFeedbackList({ feedbacks }: SentenceFeedbackListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        <Sparkles className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
        <p className="font-bold text-slate-800">문장 단위 첨삭 내역이 없습니다.</p>
        <p className="text-xs text-slate-500 mt-1">
          작성한 문장들이 전반적으로 매우 우수하거나 오류가 발견되지 않았습니다.
        </p>
      </div>
    );
  }

  const categoryLabels: Record<string, { label: string; badge: string }> = {
    GRAMMAR: {
      label: '문법 (Grammar)',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    VOCABULARY: {
      label: '어휘/표현 (Vocabulary)',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    COHESION: {
      label: '결속성/문맥 (Cohesion)',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    TASK_ACHIEVEMENT: {
      label: '과제 달성 (Task)',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  };

  const filtered = feedbacks.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Header & Filter */}
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            문장 단위 AI 정밀 첨삭 및 Band 7.0+ 업그레이드
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            원문 문장과 Band 7+ 고득점 문장을 1:1로 비교하고 고급 표현을 체득하세요.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> 필터:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            전체 ({feedbacks.length})
          </button>
          {['GRAMMAR', 'VOCABULARY', 'COHESION'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {categoryLabels[cat]?.label || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Items List */}
      <div className="mt-6 space-y-5">
        {filtered.map((item, idx) => {
          const catInfo = categoryLabels[item.category] || {
            label: item.category,
            badge: 'bg-slate-100 text-slate-700',
          };

          return (
            <div
              key={item.id || idx}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition-all hover:bg-white hover:shadow-md hover:border-indigo-200"
            >
              {/* Category Badge & Index */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 font-mono text-xs font-bold text-slate-700">
                    {idx + 1}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-xs font-bold ${catInfo.badge}`}
                  >
                    {catInfo.label}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(item.id || String(idx), item.improvedSentence)}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                  title="개선된 문장 복사"
                >
                  {copiedId === (item.id || String(idx)) ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>교정문 복사</span>
                    </>
                  )}
                </button>
              </div>

              {/* Before vs After Grid */}
              <div className="space-y-3">
                {/* Original */}
                <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-rose-700 mb-1">
                    작성한 원문 (Original)
                  </span>
                  <p className="font-serif text-sm text-slate-800 line-through decoration-rose-400">
                    {item.originalSentence}
                  </p>
                </div>

                {/* Improved */}
                <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-emerald-600" />
                    Band 7.5+ 개선 문장 (Improved)
                  </span>
                  <p className="font-serif text-sm font-semibold text-slate-900">
                    {item.improvedSentence}
                  </p>
                </div>
              </div>

              {/* Korean Explanation */}
              <div className="mt-3 rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-700 border border-slate-200/80">
                <span className="font-bold text-indigo-700">💡 교정 원리: </span>
                {item.explanation}
              </div>

              {/* Alternative Expressions / Collocations */}
              {item.alternativeExpressions && item.alternativeExpressions.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] font-semibold text-slate-500 mr-1">
                    추천 대체 표현:
                  </span>
                  {item.alternativeExpressions.map((alt, aIdx) => (
                    <span
                      key={aIdx}
                      className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
