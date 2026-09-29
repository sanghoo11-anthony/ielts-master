'use client';

import React, { useState } from 'react';
import { Save, Send, Check, AlertTriangle, Sparkles } from 'lucide-react';

interface WritingLabBottomBarProps {
  onSaveDraft: () => void;
  onSubmit: () => void;
  isDraftSaved: boolean;
  isSubmitting: boolean;
  wordCount: number;
  minTargetWords: number;
}

export default function WritingLabBottomBar({
  onSaveDraft,
  onSubmit,
  isDraftSaved,
  isSubmitting,
  wordCount,
  minTargetWords,
}: WritingLabBottomBarProps) {
  const isWordCountSufficient = wordCount >= minTargetWords;

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-3 shadow-md sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        {/* Left Status */}
        <div className="flex items-center gap-3">
          {isDraftSaved ? (
            <span className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>로컬 스토리지에 안전하게 임시 저장되었습니다</span>
            </span>
          ) : (
            <span className="text-xs text-slate-500">
              마지막 작성 내용이 브라우저에 실시간 보관됩니다.
            </span>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* [초안 저장] 버튼 */}
          <button
            type="button"
            onClick={onSaveDraft}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Save className="h-4 w-4 text-slate-500" />
            <span>초안 저장</span>
          </button>

          {/* [AI 첨삭 제출] 버튼 */}
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || wordCount === 0}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 transition-all"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>AI 채점 분석 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>AI 첨삭 제출</span>
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
}
