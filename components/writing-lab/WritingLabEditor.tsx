'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Type,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface WritingLabEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minWords: number;
}

export default function WritingLabEditor({
  value,
  onChange,
  placeholder = '이곳에 실전 에세이/편지를 작성하세요. IELTS 시험 환경과 동일하게 스펠링 검사기는 작동하지 않습니다.',
  minWords,
}: WritingLabEditorProps) {
  const [disableCopyPaste, setDisableCopyPaste] = useState(true);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [pasteWarning, setPasteWarning] = useState(false);

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (disableCopyPaste) {
      e.preventDefault();
      setPasteWarning(true);
      setTimeout(() => setPasteWarning(false), 2500);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    if (disableCopyPaste) {
      e.preventDefault();
      setPasteWarning(true);
      setTimeout(() => setPasteWarning(false), 2500);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 py-2.5">
        <div className="flex items-center gap-3">
          {/* Font Size Selector */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 text-xs text-slate-600">
            <button
              type="button"
              onClick={() => setFontSize('sm')}
              className={`rounded px-2 py-1 ${fontSize === 'sm' ? 'bg-blue-600 font-bold text-white' : 'hover:bg-slate-100'}`}
            >
              작게
            </button>
            <button
              type="button"
              onClick={() => setFontSize('base')}
              className={`rounded px-2 py-1 ${fontSize === 'base' ? 'bg-blue-600 font-bold text-white' : 'hover:bg-slate-100'}`}
            >
              보통
            </button>
            <button
              type="button"
              onClick={() => setFontSize('lg')}
              className={`rounded px-2 py-1 ${fontSize === 'lg' ? 'bg-blue-600 font-bold text-white' : 'hover:bg-slate-100'}`}
            >
              크게
            </button>
          </div>
        </div>

        {/* Copy/Paste Protection Toggle Switch */}
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            {disableCopyPaste ? (
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-slate-400" />
            )}
            <span>복사/붙여넣기 방지</span>
            <div className="relative inline-block h-4 w-7 rounded-full bg-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={disableCopyPaste}
                onChange={(e) => setDisableCopyPaste(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                  disableCopyPaste ? 'translate-x-3 bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>
          </label>
        </div>
      </div>

      {/* Paste Blocked Toast / Banner */}
      {pasteWarning && (
        <div className="bg-amber-500 px-4 py-2 text-center text-xs font-bold text-white transition-all animate-bounce">
          ⚠️ 실전 영작 훈련 모드가 켜져 있어 붙여넣기(Paste)가 제한됩니다. 직접 타이핑해 보세요!
        </div>
      )}

      {/* Main Textarea */}
      <div className="flex-1 p-4 sm:p-6">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          onDrop={handleDrop}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          className={`h-full w-full resize-none border-none bg-transparent font-serif text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 ${fontSizeClasses[fontSize]}`}
        />
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <span>실전 팁: 문단 구분은 Enter 키를 2번 눌러 빈 줄(Empty line)로 명확히 구분하세요.</span>
        <span>최소 기준: {minWords}단어</span>
      </div>
    </div>
  );
}
