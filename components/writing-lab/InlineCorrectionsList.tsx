'use client';

import React, { useState } from 'react';
import { InlineCorrection } from '@/types/evaluate-writing';
import {
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
  Quote,
  Search,
} from 'lucide-react';
import WordLookupModal from '@/components/vocabulary/WordLookupModal';

interface InlineCorrectionsListProps {
  corrections: InlineCorrection[];
}

export default function InlineCorrectionsList({
  corrections,
}: InlineCorrectionsListProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [lookupWord, setLookupWord] = useState<string | null>(null);
  const [lookupSentence, setLookupSentence] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!corrections || corrections.length === 0) return null;

  const handleLookup = (expression: string, sentence: string) => {
    const firstWord = expression.split('/')[0].trim();
    setLookupWord(firstWord);
    setLookupSentence(sentence);
    setIsModalOpen(true);
  };

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Band 7.0+ 패러프레이징(Paraphrasing) 교정 문장 ({corrections.length}개 추천)
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            평이한 원문을 IELTS 채점관이 선호하는 세련된 고득점 문장으로 교체해 보세요.
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {corrections.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 transition-all hover:border-indigo-300 hover:shadow-md"
          >
            {/* Header info & Copy Button */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200">
                <span>추천 문장 #{idx + 1}</span>
              </span>

              <button
                type="button"
                onClick={() => handleCopy(idx, item.improved)}
                className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                title="개선된 문장 복사"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>개선문 복사</span>
                  </>
                )}
              </button>
            </div>

            {/* Before & After Comparison */}
            <div className="space-y-2.5 font-serif text-xs">
              {/* Original */}
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 text-slate-800">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-1">
                  작성한 원문 (Original):
                </span>
                <p className="line-through decoration-rose-400 leading-relaxed">
                  {item.original}
                </p>
              </div>

              {/* Improved */}
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/80 p-3.5 text-slate-900 font-semibold shadow-inner">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  Band 7.0+ 패러프레이징 (Improved):
                </span>
                <p className="leading-relaxed">{item.improved}</p>
              </div>
            </div>

            {/* Reason */}
            <div className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 border border-slate-200/80">
              <span className="font-bold text-indigo-700">💡 교정 원리 & 채점 포인트: </span>
              {item.reason}
            </div>

            {/* Band 7 Expression Chip with 1-click Dictionary Lookup */}
            {item.band_7_expression && (
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500">
                  Band 7+ 핵심 표현:
                </span>
                <button
                  type="button"
                  onClick={() => handleLookup(item.band_7_expression, item.improved)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 font-mono text-xs font-bold text-amber-800 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-all shadow-sm"
                  title="클릭하여 사전 뜻, 문맥 해석 및 단어장 저장"
                >
                  <Search className="h-3 w-3 text-amber-600" />
                  <span>{item.band_7_expression}</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Word Lookup Modal */}
      <WordLookupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        word={lookupWord}
        sentence={lookupSentence}
        sourceTitle="Writing Lab 첨삭 리포트"
        sourceType="writing"
      />
    </div>
  );
}
