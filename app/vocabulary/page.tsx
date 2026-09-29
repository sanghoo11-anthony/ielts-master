'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { VocabularyItem } from '@/types/vocabulary';
import { vocabularyRepository } from '@/lib/storage/vocabularyRepository';
import {
  Bookmark,
  BookOpen,
  Volume2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  Eye,
  EyeOff,
  Layers,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Flame,
  Lightbulb,
  ExternalLink,
} from 'lucide-react';

export default function VocabularyPage() {
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [stats, setStats] = useState({ total: 0, mastered: 0, studying: 0, band7Plus: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'studying' | 'mastered' | 'band7'>('all');
  const [sortOrder, setSortOrder] = useState<'latest' | 'alphabetical'>('latest');

  // Study View Modes
  const [viewMode, setViewMode] = useState<'list' | 'flashcard'>('list');
  const [hideMeanings, setHideMeanings] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const loadData = async () => {
    const list = await vocabularyRepository.getAllWords();
    setWords(list);
    const s = await vocabularyRepository.getStats();
    setStats(s);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Pronunciation TTS
  const playAudio = (wordText: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(wordText);
    utterance.lang = 'en-GB';
    utterance.rate = 0.85;

    setPlayingWord(wordText);
    utterance.onend = () => setPlayingWord(null);
    utterance.onerror = () => setPlayingWord(null);

    window.speechSynthesis.speak(utterance);
  };

  // Toggle Mastered
  const handleToggleMastered = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await vocabularyRepository.toggleMastered(id);
    await loadData();
  };

  // Delete Word
  const handleDeleteWord = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('단어장에서 이 단어를 삭제하시겠습니까?')) return;
    await vocabularyRepository.deleteWord(id);
    await loadData();
  };

  // Filter & Search Logic
  const filteredWords = words
    .filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.word.toLowerCase().includes(q) ||
        item.meaningKo.toLowerCase().includes(q) ||
        item.contextSentence.toLowerCase().includes(q);

      if (!matchesQuery) return false;

      if (filterType === 'studying') return !item.isMastered;
      if (filterType === 'mastered') return item.isMastered;
      if (filterType === 'band7') {
        return (
          item.bandLevel.includes('7.0') ||
          item.bandLevel.includes('7.5') ||
          item.bandLevel.includes('8.0') ||
          item.bandLevel.includes('8.5')
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'alphabetical') {
        return a.word.localeCompare(b.word);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const currentFlashcard = filteredWords[flashcardIndex] || filteredWords[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Bookmark className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Personalized IELTS Word Bank
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            나만의 실전 IELTS 단어장
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            지문과 모의고사에서 체크한 모르는 단어를 문맥 해석, 실전 예문과 함께 체계적으로 복습하세요.
          </p>
        </div>

        {/* View Mode Toggle Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>리스트 보기</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setViewMode('flashcard');
                setIsFlipped(false);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === 'flashcard'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>플래시카드 암기</span>
            </button>
          </div>

          {viewMode === 'list' && (
            <button
              type="button"
              onClick={() => setHideMeanings(!hideMeanings)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all shadow-sm ${
                hideMeanings
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              title="한글 뜻을 숨겨 자가 진단 테스트를 진행합니다"
            >
              {hideMeanings ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              <span>{hideMeanings ? '뜻 가리기 켜짐' : '뜻 가리기'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>저장된 단어</span>
            <Bookmark className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-slate-900">
            {stats.total}
            <span className="text-sm font-normal text-slate-400 ml-1">단어</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>학습 중 (미암기)</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-amber-600">
            {stats.studying}
            <span className="text-sm font-normal text-slate-400 ml-1">단어</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>암기 완료 (Mastered)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-emerald-600">
            {stats.mastered}
            <span className="text-sm font-normal text-slate-400 ml-1">단어</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Band 7.5+ 고득점 어휘</span>
            <Trophy className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-purple-700">
            {stats.band7Plus}
            <span className="text-sm font-normal text-slate-400 ml-1">단어</span>
          </p>
        </div>
      </div>

      {/* FLASHCARD STUDY MODE */}
      {viewMode === 'flashcard' && filteredWords.length > 0 && currentFlashcard && (
        <div className="mx-auto max-w-xl space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              카드 <strong>{flashcardIndex + 1}</strong> / {filteredWords.length}
            </span>
            <span>카드를 클릭하면 한글 뜻과 문맥 해석이 나타납니다.</span>
          </div>

          {/* Flashcard Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[340px] rounded-3xl border-2 border-indigo-200 bg-gradient-to-b from-white to-slate-50/50 p-8 shadow-xl transition-all hover:border-indigo-400 flex flex-col justify-between"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-bold text-purple-700 border border-purple-200">
                {currentFlashcard.bandLevel}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => playAudio(currentFlashcard.word, e)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                  title="발음 듣기"
                >
                  <Volume2 className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleToggleMastered(currentFlashcard.id, e)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    currentFlashcard.isMastered
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {currentFlashcard.isMastered ? '✓ 완전 암기' : '미암기'}
                </button>
              </div>
            </div>

            {/* Front vs Back Content */}
            {!isFlipped ? (
              <div className="text-center py-8 space-y-3">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                  {currentFlashcard.word}
                </h2>
                <p className="font-mono text-sm text-slate-500">
                  {currentFlashcard.phonetic} • {currentFlashcard.partOfSpeech}
                </p>
                <p className="text-xs text-indigo-600 font-semibold pt-4">
                  👆 탭하여 뜻과 문맥 해석 확인하기
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-3 animate-in fade-in">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">{currentFlashcard.meaningKo}</h3>
                  {currentFlashcard.definitionEn && (
                    <p className="text-xs text-slate-500 italic mt-1 leading-relaxed">
                      "{currentFlashcard.definitionEn}"
                    </p>
                  )}
                </div>

                {/* Context Sentence */}
                <div className="rounded-2xl bg-amber-50/80 p-3.5 border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 block mb-1">지문 문맥 해석:</span>
                  <p className="text-slate-800 font-serif leading-relaxed italic">
                    "{currentFlashcard.contextSentence}"
                  </p>
                  <p className="mt-1.5 text-amber-950 font-medium">
                    💡 {currentFlashcard.contextTranslation}
                  </p>
                </div>

                {/* Collocations */}
                {currentFlashcard.collocations && currentFlashcard.collocations.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400">추천 연어:</span>
                    {currentFlashcard.collocations.map((c, i) => (
                      <span
                        key={i}
                        className="rounded bg-slate-200 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Card Footer Navigation */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevCard();
                }}
                className="flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>이전 단어</span>
              </button>

              <span className="text-xs text-slate-400">카드 클릭으로 앞/뒤 전환</span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextCard();
                }}
                className="flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
              >
                <span>다음 단어</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIST VIEW MODE */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="단어, 뜻, 문맥 예문 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                전체 ({words.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('studying')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  filterType === 'studying'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                학습 중 ({stats.studying})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('mastered')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  filterType === 'mastered'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                암기 완료 ({stats.mastered})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('band7')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  filterType === 'band7'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Band 7.5+ ({stats.band7Plus})
              </button>
            </div>
          </div>

          {/* Words Grid */}
          {filteredWords.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredWords.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                    item.isMastered
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-black text-slate-900 tracking-tight">
                            {item.word}
                          </h3>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            {item.partOfSpeech}
                          </span>
                          <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                            {item.bandLevel}
                          </span>
                        </div>

                        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-mono">{item.phonetic}</span>
                          <button
                            type="button"
                            onClick={(e) => playAudio(item.word, e)}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                            title="발음 듣기"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Mastered Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleMastered(item.id, e)}
                        className={`rounded-lg px-2 py-1 text-xs font-bold transition-all shrink-0 ${
                          item.isMastered
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="학습 완료 여부 전환"
                      >
                        {item.isMastered ? '✓ 완료' : '미완료'}
                      </button>
                    </div>

                    {/* Meaning */}
                    <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        대표 의미
                      </span>
                      {hideMeanings ? (
                        <p className="text-xs font-semibold text-slate-400 italic">
                          (뜻 가리기 모드 활성화됨)
                        </p>
                      ) : (
                        <p className="text-sm font-bold text-slate-900">{item.meaningKo}</p>
                      )}
                    </div>

                    {/* Context Sentence */}
                    {item.contextSentence && (
                      <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200/60 text-xs">
                        <span className="text-[10px] font-bold text-amber-800 uppercase block mb-1">
                          문맥 속 쓰임새
                        </span>
                        <p className="text-slate-800 font-serif leading-relaxed italic line-clamp-3">
                          "{item.contextSentence}"
                        </p>
                        {!hideMeanings && (
                          <p className="mt-1 text-[11px] text-amber-950 leading-snug">
                            💡 {item.contextTranslation}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Collocations */}
                    {item.collocations && item.collocations.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.collocations.slice(0, 3).map((c, i) => (
                          <span
                            key={i}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-700"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                    <span className="truncate max-w-[170px]">
                      {item.sourceTitle || 'IELTS 실전 훈련'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteWord(item.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="단어 삭제"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <BookOpen className="h-7 w-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  {searchQuery ? '일치하는 단어가 없습니다.' : '아직 저장된 단어가 없습니다.'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Reading Lab 지문이나 Writing 첨삭 리포트에서 모르는 단어를 클릭하면 뜻과 문맥 해석을 확인하고 이곳 단어장에 바로 저장할 수 있습니다.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/reading/lab"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Reading Lab 지문 읽으러 가기
                </Link>
                <Link
                  href="/writing/lab"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Writing Lab 가기
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
