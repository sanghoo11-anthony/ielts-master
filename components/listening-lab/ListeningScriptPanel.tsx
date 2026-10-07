'use client';

import React, { useState } from 'react';
import { ListeningDialogueTurn } from '@/types/listening';
import { Eye, EyeOff, BookOpen, Volume2, Sparkles } from 'lucide-react';

interface ListeningScriptPanelProps {
  dialogue: ListeningDialogueTurn[];
  currentTurnIndex: number;
  highlightedQuestionId?: number | null;
  onWordClick: (word: string, sentence: string) => void;
  onPlaySingleTurn?: (turnIndex: number) => void;
}

export default function ListeningScriptPanel({
  dialogue,
  currentTurnIndex,
  highlightedQuestionId,
  onWordClick,
  onPlaySingleTurn,
}: ListeningScriptPanelProps) {
  const [hideEvidenceWords, setHideEvidenceWords] = useState(false);

  // Helper to tokenize sentence into clickable words
  const renderInteractiveText = (text: string, isEvidence: boolean) => {
    const tokens = text.split(/(\s+)/);

    return tokens.map((token, idx) => {
      // If whitespace or punctuation only
      if (/^\s+$/.test(token)) {
        return <span key={idx}>{token}</span>;
      }

      const cleanWord = token.replace(/[^a-zA-Z0-9-]/g, '');
      if (!cleanWord) {
        return <span key={idx}>{token}</span>;
      }

      return (
        <span
          key={idx}
          onClick={() => onWordClick(cleanWord, text)}
          title="클릭하여 단어 사전 조회 및 단어장 저장"
          className={`cursor-pointer rounded px-0.5 transition-colors hover:bg-amber-200 hover:text-amber-950 ${
            isEvidence && hideEvidenceWords ? 'bg-slate-300 text-transparent select-none blur-[2px]' : ''
          }`}
        >
          {token}
        </span>
      );
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">
            실시간 오디오 스크립트 (Transcript)
          </h3>
        </div>

        <button
          onClick={() => setHideEvidenceWords(!hideEvidenceWords)}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          title="정답 단어 블러 처리로 딕테이션 훈련"
        >
          {hideEvidenceWords ? (
            <>
              <Eye className="h-3.5 w-3.5 text-blue-600" />
              <span>정답 단어 보이기</span>
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5 text-amber-600" />
              <span>딕테이션 블러 모드</span>
            </>
          )}
        </button>
      </div>

      <p className="text-[11px] text-slate-500 mb-3">
        💡 스크립트 속 모르는 단어를 클릭하면 <span className="font-semibold text-amber-700">원어민 발음, Band 레벨 및 나만의 단어장 저장</span>이 가능합니다.
      </p>

      {/* Dialogue List */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[520px]">
        {dialogue.map((turn, index) => {
          const isCurrentPlaying = currentTurnIndex === index;
          const isEvidenceTurn =
            highlightedQuestionId != null &&
            turn.evidenceForQuestionId === highlightedQuestionId;

          return (
            <div
              key={index}
              id={`turn-${index}`}
              className={`rounded-xl p-3 sm:p-3.5 transition-all text-xs sm:text-sm leading-relaxed border ${
                isCurrentPlaying
                  ? 'border-amber-400 bg-amber-50/80 shadow-sm'
                  : isEvidenceTurn
                  ? 'border-emerald-400 bg-emerald-50/90 shadow-sm'
                  : 'border-slate-100 bg-slate-50/60 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      turn.gender === 'female'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {turn.speaker}
                  </span>
                  {turn.accent && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({turn.accent})
                    </span>
                  )}
                  {turn.evidenceForQuestionId && (
                    <span className="rounded bg-amber-100 border border-amber-300 px-1.5 py-0.2 text-[10px] font-bold text-amber-900">
                      Q{turn.evidenceForQuestionId} 근거 문장
                    </span>
                  )}
                </div>

                {onPlaySingleTurn && (
                  <button
                    onClick={() => onPlaySingleTurn(index)}
                    className="text-slate-400 hover:text-amber-600 transition-colors p-1"
                    title="이 문장만 다시 듣기"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <p className="text-slate-800 font-normal">
                {renderInteractiveText(turn.text, Boolean(turn.evidenceForQuestionId))}
              </p>

              {turn.highlightNote && (
                <p className="mt-1.5 text-[11px] font-medium text-amber-800/90 bg-amber-100/60 rounded px-2 py-0.5">
                  📌 {turn.highlightNote}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
