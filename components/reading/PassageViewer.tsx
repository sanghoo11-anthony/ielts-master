'use client';

import React, { useState } from 'react';
import { Passage, Paragraph } from '@/types/reading';
import WordLookupModal from '@/components/vocabulary/WordLookupModal';
import {
  Highlighter,
  ZoomIn,
  ZoomOut,
  BookOpen,
  BookmarkCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface PassageViewerProps {
  passages: Passage[];
  activePassageIndex: number;
  onPassageChange: (index: number) => void;
  targetParagraphId?: string | null;
  targetQuote?: string | null;
}

export default function PassageViewer({
  passages,
  activePassageIndex,
  onPassageChange,
  targetParagraphId,
  targetQuote,
}: PassageViewerProps) {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [highlightColor, setHighlightColor] = useState<
    'yellow' | 'green' | 'blue' | 'pink'
  >('yellow');
  const [userHighlights, setUserHighlights] = useState<
    Record<string, { color: string; text: string }[]>
  >({});

  // 단어 사전 모드 상태 및 팝업 모달
  const [isDictMode, setIsDictMode] = useState(true);
  const [lookupWord, setLookupWord] = useState<string | null>(null);
  const [lookupSentence, setLookupSentence] = useState('');
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);

  const activePassage = passages[activePassageIndex] || passages[0];

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
  };

  // 단어 클릭 핸들러
  const handleWordClick = (word: string, sentence: string) => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 1) {
      return;
    }
    setLookupWord(word);
    setLookupSentence(sentence);
    setIsLookupModalOpen(true);
  };

  // 텍스트 선택 시 하이라이트 추가
  const handleTextSelection = (paragraphId: string) => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length < 2) return;

    setUserHighlights((prev) => {
      const current = prev[paragraphId] || [];
      return {
        ...prev,
        [paragraphId]: [...current, { color: highlightColor, text: selectedText }],
      };
    });

    selection.removeAllRanges();
  };

  const handleClearHighlights = () => {
    setUserHighlights({});
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Passage Header & Section Switcher */}
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Section Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {passages.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPassageChange(idx)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all whitespace-nowrap ${
                  activePassageIndex === idx
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {p.section.replace('_', ' ')}: {p.title.slice(0, 20)}...
              </button>
            ))}
          </div>

          {/* Tools: Dictionary Mode, Highlighter picker, Font sizing */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Dictionary Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsDictMode(!isDictMode)}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                isDictMode
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
              title="지문 속 단어를 클릭하면 사전 뜻과 문맥 해석을 확인합니다."
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">단어 사전</span>
              <span
                className={`text-[10px] rounded px-1.5 py-0.2 ${
                  isDictMode ? 'bg-white/20' : 'bg-slate-100'
                }`}
              >
                {isDictMode ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Highlighter Color Picker */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
              <Highlighter className="h-3.5 w-3.5 text-slate-400 mr-0.5" />
              {(['yellow', 'green', 'blue', 'pink'] as const).map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setHighlightColor(color)}
                  className={`h-4 w-4 rounded-full transition-transform ${
                    color === 'yellow'
                      ? 'bg-amber-300'
                      : color === 'green'
                      ? 'bg-emerald-300'
                      : color === 'blue'
                      ? 'bg-blue-300'
                      : 'bg-pink-300'
                  } ${highlightColor === color ? 'scale-125 ring-2 ring-slate-400 ring-offset-1' : 'opacity-70'}`}
                  title={`${color} 형광펜`}
                />
              ))}
              <button
                type="button"
                onClick={handleClearHighlights}
                className="ml-1 text-slate-400 hover:text-slate-600 p-0.5"
                title="하이라이트 전체 지우기"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-1 text-slate-600">
              <button
                type="button"
                onClick={() => setFontSize('sm')}
                className={`p-1 rounded ${fontSize === 'sm' ? 'bg-slate-200 font-bold text-slate-900' : 'hover:bg-slate-100'}`}
                title="글자 작게"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setFontSize('lg')}
                className={`p-1 rounded ${fontSize === 'lg' ? 'bg-slate-200 font-bold text-slate-900' : 'hover:bg-slate-100'}`}
                title="글자 크게"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dictionary Mode Info Banner */}
      {isDictMode && (
        <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/80 px-4 py-1.5 text-xs text-blue-900">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span>
              <strong>단어 사전 모드 활성화</strong>: 본문의 모르는 단어를 클릭하면 뜻, 예문, 문맥 해석이 제공되며 단어장에 저장할 수 있습니다.
            </span>
          </span>
        </div>
      )}

      {/* Passage Content Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <div className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 mb-1">
            {activePassage.section.replace('_', ' ')}
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            {activePassage.title}
          </h2>
          {activePassage.subTitle && (
            <p className="mt-1 text-xs text-slate-500 font-medium sm:text-sm">
              {activePassage.subTitle}
            </p>
          )}
        </div>

        {/* Paragraphs with labels & highlight triggers */}
        <div className="space-y-6">
          {activePassage.paragraphs.map((para) => {
            const isTargetEvidence = targetParagraphId === para.id;

            return (
              <div
                key={para.id}
                id={`para-${para.id}`}
                onMouseUp={() => handleTextSelection(para.id)}
                className={`relative rounded-xl p-4 transition-all ${
                  isTargetEvidence
                    ? 'evidence-target bg-amber-50/80 ring-2 ring-amber-400'
                    : 'bg-white hover:bg-slate-50/60'
                }`}
              >
                {/* Paragraph label badge (e.g. A, B, C or P1) */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-700 border border-slate-200">
                    <BookOpen className="h-3 w-3 text-slate-500" />
                    Paragraph {para.label || para.id}
                  </span>

                  {isTargetEvidence && (
                    <span className="flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                      <BookmarkCheck className="h-3 w-3" />
                      문제 정답 근거 문단
                    </span>
                  )}
                </div>

                {/* Paragraph text with possible quote highlight & clickable word tokens */}
                <p className={`font-serif text-slate-800 select-text ${fontSizeClasses[fontSize]}`}>
                  {renderHighlightedContent(
                    para.content,
                    isTargetEvidence ? targetQuote : null,
                    handleWordClick,
                    isDictMode
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50 px-3 sm:px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-1">
        <span>단어를 클릭하면 뜻과 문맥 해석이 열립니다.</span>
        <span>텍스트를 드래그하면 형광펜 하이라이트가 적용됩니다.</span>
      </div>

      {/* Word Lookup Modal */}
      <WordLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        word={lookupWord}
        sentence={lookupSentence}
        sourceTitle={activePassage.title}
        sourceType="reading"
      />
    </div>
  );
}

function renderSentenceTokens(
  text: string,
  onWordClick: (word: string, sentence: string) => void,
  isDictMode: boolean
) {
  if (!isDictMode) return text;

  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [text];

  return sentences.map((sentence, sIdx) => {
    // Split sentence into words and whitespace/punctuation
    const tokens = sentence.split(/(\b[a-zA-Z0-9'-]+\b)/g);
    return (
      <React.Fragment key={sIdx}>
        {tokens.map((token, tIdx) => {
          const isWord = /^[a-zA-Z0-9'-]{2,}$/.test(token);
          if (isWord) {
            return (
              <span
                key={tIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  onWordClick(token, sentence.trim());
                }}
                className="cursor-pointer rounded px-0.5 transition-colors hover:bg-blue-100 hover:text-blue-800 hover:underline"
                title={`클릭하여 "${token}" 사전 뜻 & 문맥 해석 보기`}
              >
                {token}
              </span>
            );
          }
          return token;
        })}
      </React.Fragment>
    );
  });
}

function renderHighlightedContent(
  content: string,
  quote: string | null | undefined,
  onWordClick: (word: string, sentence: string) => void,
  isDictMode: boolean
) {
  if (!quote) {
    return renderSentenceTokens(content, onWordClick, isDictMode);
  }

  // Exact match
  if (content.includes(quote)) {
    const parts = content.split(quote);
    return (
      <>
        {renderSentenceTokens(parts[0], onWordClick, isDictMode)}
        <mark className="bg-amber-300 text-slate-900 font-semibold px-1 rounded shadow-sm">
          {renderSentenceTokens(quote, onWordClick, isDictMode)}
        </mark>
        {renderSentenceTokens(parts.slice(1).join(quote), onWordClick, isDictMode)}
      </>
    );
  }

  // Segment match if contains ellipsis
  if (quote.includes('...')) {
    const segments = quote
      .split('...')
      .map((s) => s.trim())
      .filter((s) => s.length > 5 && content.includes(s));

    if (segments.length > 0) {
      let nodes: (string | React.ReactNode)[] = [content];
      for (const seg of segments) {
        const nextNodes: (string | React.ReactNode)[] = [];
        for (const node of nodes) {
          if (typeof node === 'string' && node.includes(seg)) {
            const splitted = node.split(seg);
            for (let i = 0; i < splitted.length; i++) {
              if (i > 0) {
                nextNodes.push(
                  <mark
                    key={`${seg}-${i}`}
                    className="bg-amber-300 text-slate-900 font-semibold px-1 rounded shadow-sm"
                  >
                    {renderSentenceTokens(seg, onWordClick, isDictMode)}
                  </mark>
                );
              }
              if (splitted[i]) {
                nextNodes.push(renderSentenceTokens(splitted[i], onWordClick, isDictMode));
              }
            }
          } else {
            nextNodes.push(node);
          }
        }
        nodes = nextNodes;
      }
      return <>{nodes.map((n, i) => <React.Fragment key={i}>{n}</React.Fragment>)}</>;
    }
  }

  return renderSentenceTokens(content, onWordClick, isDictMode);
}
