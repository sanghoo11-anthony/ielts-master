'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  RotateCw,
  Type,
  Check,
  Maximize2,
  Minimize2,
  Copy,
  AlertCircle,
} from 'lucide-react';

interface WritingEditorProps {
  text: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isAutoSaved?: boolean;
  disabled?: boolean;
}

export default function WritingEditor({
  text,
  onChange,
  placeholder = '이곳에 실전 에세이/편지를 작성하세요. IELTS 시험 환경과 동일하게 스펠링 검사기는 작동하지 않습니다.',
  isAutoSaved = false,
  disabled = false,
}: WritingEditorProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'h-full min-h-[480px]'
      }`}
    >
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 rounded-t-2xl">
        <div className="flex items-center gap-2">
          {/* Font Size Selector */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 text-xs text-slate-600">
            <button
              type="button"
              onClick={() => setFontSize('sm')}
              className={`rounded px-2 py-1 ${
                fontSize === 'sm' ? 'bg-blue-600 font-bold text-white' : 'hover:bg-slate-100'
              }`}
            >
              작게
            </button>
            <button
              type="button"
              onClick={() => setFontSize('base')}
              className={`rounded px-2 py-1 ${
                fontSize === 'base' ? 'bg-blue-600 font-bold text-white' : 'hover:bg-slate-100'
              }`}
            >
              보통
            </button>
            <button
              type="button"
              onClick={() => setFontSize('lg')}
              className={`rounded px-2 py-1 ${
                fontSize === 'lg' ? 'bg-blue-600 font-bold text-white' : 'hover:bg-slate-100'
              }`}
            >
              크게
            </button>
          </div>

          {/* Spell check notice */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 pl-2 border-l border-slate-200">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            <span>실전 모드 (스펠체크 비활성화)</span>
          </div>
        </div>

        {/* Right Tools: Auto-save status, copy, fullscreen */}
        <div className="flex items-center gap-2">
          {isAutoSaved && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              <Check className="h-3.5 w-3.5" />
              자동 저장됨
            </span>
          )}

          <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            title="작성 내용 복사"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{copied ? '복사됨' : '복사'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 text-slate-600 hover:bg-slate-100"
            title={isFullscreen ? '전체화면 종료' : '전체화면 모드'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 p-4 sm:p-6">
        <textarea
          value={text}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          className={`h-full w-full resize-none border-none bg-transparent font-serif text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 ${fontSizeClasses[fontSize]}`}
        />
      </div>

      {/* Editor Footer hint */}
      <div className="border-t border-slate-100 px-4 py-2 text-right text-xs text-slate-400">
        문단 구분은 Enter 키를 두 번 입력해 빈 줄로 구분하세요. (IELTS 표준 단락 구분)
      </div>
    </div>
  );
}
