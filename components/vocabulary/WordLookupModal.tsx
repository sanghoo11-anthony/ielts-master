'use client';

import React, { useState, useEffect } from 'react';
import { WordLookupResponse, VocabularyItem } from '@/types/vocabulary';
import { vocabularyRepository } from '@/lib/storage/vocabularyRepository';
import { writingRepository } from '@/lib/storage/writingRepository';
import {
  Volume2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  X,
  BookOpen,
  Quote,
  Lightbulb,
  Check,
  ExternalLink,
  Loader2,
} from 'lucide-react';

interface WordLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string | null;
  sentence?: string;
  sourceTitle?: string;
  sourceType?: 'reading' | 'writing' | 'manual';
  onWordSavedChange?: () => void;
}

export default function WordLookupModal({
  isOpen,
  onClose,
  word,
  sentence = '',
  sourceTitle,
  sourceType = 'reading',
  onWordSavedChange,
}: WordLookupModalProps) {
  const [data, setData] = useState<WordLookupResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (!isOpen || !word) {
      setData(null);
      return;
    }

    const fetchWordInfo = async () => {
      setIsLoading(true);
      try {
        // 커스텀 API Key 확인
        const profile = await writingRepository.getUserProfile();
        const customApiKey = profile?.customGeminiApiKey;

        // 이미 단어장에 저장되어 있는지 확인
        const savedItem = await vocabularyRepository.getWordByText(word);
        setIsSaved(!!savedItem);

        const res = await fetch('/api/lookup-word', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word,
            sentence,
            sourceTitle,
            sourceType,
            customApiKey,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          console.error('Word lookup failed with status:', res.status);
        }
      } catch (err) {
        console.error('Error fetching word lookup:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWordInfo();
  }, [isOpen, word, sentence, sourceTitle, sourceType]);

  if (!isOpen || !word) return null;

  // TTS 발음 듣기
  const handlePlayAudio = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(data?.word || word);
    utterance.lang = 'en-GB'; // IELTS 영국식/국제 발음
    utterance.rate = 0.85;

    setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  // 단어장 저장/삭제 토글
  const handleToggleSave = async () => {
    if (!data) return;

    if (isSaved) {
      const existing = await vocabularyRepository.getWordByText(data.word);
      if (existing) {
        await vocabularyRepository.deleteWord(existing.id);
        setIsSaved(false);
      }
    } else {
      await vocabularyRepository.saveWord({
        word: data.word,
        phonetic: data.phonetic,
        partOfSpeech: data.partOfSpeech,
        meaningKo: data.meaningKo,
        definitionEn: data.definitionEn,
        contextSentence: data.contextSentence || sentence,
        contextTranslation: data.contextTranslation,
        examples: data.examples,
        collocations: data.collocations,
        synonyms: data.synonyms,
        bandLevel: data.bandLevel,
        isMastered: false,
        sourceType,
        sourceTitle,
      });

      setIsSaved(true);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 2000);
    }

    if (onWordSavedChange) {
      onWordSavedChange();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">IELTS 스마트 단어 사전</h3>
              <p className="text-[11px] text-slate-500">문맥 해석 & Band 7+ 고득점 연어 분석</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              <p className="text-sm font-semibold text-slate-700">
                "{word}"의 사전적 정의 및 문맥 해석을 분석하는 중...
              </p>
            </div>
          ) : data ? (
            <>
              {/* Word Header Card */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {data.word}
                    </h2>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
                      {data.partOfSpeech}
                    </span>
                    <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
                      {data.bandLevel}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono text-slate-600">{data.phonetic}</span>
                    <button
                      type="button"
                      onClick={handlePlayAudio}
                      className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold transition-colors ${
                        isPlayingAudio
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      title="발음 듣기 (영국/국제 표준 발음)"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{isPlayingAudio ? '재생 중...' : '발음 듣기'}</span>
                    </button>
                  </div>
                </div>

                {/* Save to Vocabulary Button */}
                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all shadow-sm shrink-0 ${
                    isSaved
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700'
                      : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4" />
                      <span>단어장 저장됨</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 text-slate-500" />
                      <span>단어장에 저장</span>
                    </>
                  )}
                </button>
              </div>

              {/* Toast for saving */}
              {saveToast && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500 p-2.5 text-xs font-bold text-white shadow-md animate-in slide-in-from-top duration-200">
                  <Check className="h-4 w-4 shrink-0" />
                  <span>'나만의 단어장'에 안전하게 추가되었습니다! 언제든 복습하세요.</span>
                </div>
              )}

              {/* 1. Core Meaning & English Definition */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  대표 한글 뜻 & 영문 정의
                </span>
                <p className="text-base font-bold text-slate-900 leading-snug">
                  {data.meaningKo}
                </p>
                {data.definitionEn && (
                  <p className="mt-1.5 text-xs text-slate-600 italic leading-relaxed">
                    "{data.definitionEn}"
                  </p>
                )}
              </div>

              {/* 2. Contextual Sentence & Translation */}
              {data.contextSentence && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Quote className="h-3.5 w-3.5 text-amber-700" />
                      해당 문장에서의 문맥적 해석 (Contextual Meaning)
                    </span>
                    {sourceTitle && (
                      <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md font-medium truncate max-w-[150px]">
                        {sourceTitle}
                      </span>
                    )}
                  </div>

                  {/* Context sentence with target word highlighted */}
                  <div className="rounded-xl bg-white/90 p-3 text-xs text-slate-800 font-serif leading-relaxed border border-amber-200/60">
                    {renderSentenceWithHighlight(data.contextSentence, data.word)}
                  </div>

                  <p className="text-xs text-amber-950 font-medium leading-relaxed">
                    💡 <strong>문맥 뉘앙스:</strong> {data.contextTranslation}
                  </p>
                </div>
              )}

              {/* 3. IELTS Exam Examples */}
              {data.examples && data.examples.length > 0 && (
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    IELTS 실전 고득점 예문
                  </h4>
                  <div className="space-y-2">
                    {data.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-blue-50/50 p-3 text-xs border border-blue-100 space-y-1"
                      >
                        <p className="font-semibold text-slate-900 leading-relaxed font-serif">
                          • {ex.en}
                        </p>
                        <p className="text-slate-600 pl-3">{ex.ko}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Collocations & Synonyms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Collocations */}
                {data.collocations && data.collocations.length > 0 && (
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                      🔗 Band 7+ 연어 (Collocations)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {data.collocations.map((col, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-800"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Synonyms */}
                {data.synonyms && data.synonyms.length > 0 && (
                  <div className="rounded-xl border border-slate-200 p-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                      ✨ 고급 유의어 (Synonyms)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {data.synonyms.map((syn, idx) => (
                        <span
                          key={idx}
                          className="rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100"
                        >
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Examiner Tip */}
              {data.examinerTip && (
                <div className="flex items-start gap-2 rounded-xl bg-purple-50 p-3 text-xs text-purple-950 border border-purple-200">
                  <Lightbulb className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-900">IELTS 채점관 조언: </span>
                    {data.examinerTip}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              단어 정보를 불러오지 못했습니다.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3">
          <span className="text-[11px] text-slate-400">
            저장된 단어는 상단 네비게이션 '단어장'에서 언제든 확인 가능합니다.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function renderSentenceWithHighlight(sentence: string, targetWord: string) {
  if (!targetWord) return sentence;

  const regex = new RegExp(`(\\b${targetWord}\\w*)`, 'gi');
  const parts = sentence.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase().startsWith(targetWord.toLowerCase().slice(0, 4))) {
          return (
            <mark
              key={index}
              className="bg-amber-300 text-slate-900 font-bold px-1 py-0.5 rounded shadow-sm"
            >
              {part}
            </mark>
          );
        }
        return part;
      })}
    </>
  );
}
