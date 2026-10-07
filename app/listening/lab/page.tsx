'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_LISTENING_SETS } from '@/lib/mock-data/listeningSets';
import { ListeningSet, ListeningSubmission } from '@/types/listening';
import ListeningAudioPlayer from '@/components/listening-lab/ListeningAudioPlayer';
import ListeningQuestionCard from '@/components/listening-lab/ListeningQuestionCard';
import ListeningScriptPanel from '@/components/listening-lab/ListeningScriptPanel';
import ListeningResultModal from '@/components/listening-lab/ListeningResultModal';
import WordLookupModal from '@/components/vocabulary/WordLookupModal';
import {
  calculateListeningBand,
  listeningRepository,
} from '@/lib/storage/listeningRepository';
import {
  Headphones,
  Timer,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Volume2,
  FileText,
  RotateCcw,
  Send,
  SlidersHorizontal,
  Bookmark,
} from 'lucide-react';
import Link from 'next/link';

export default function ListeningLabPage() {
  const [selectedSetIndex, setSelectedSetIndex] = useState(0);
  const [isExamMode, setIsExamMode] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [highlightedEvidenceId, setHighlightedEvidenceId] = useState<number | null>(null);

  // Result modal state
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [rawScore, setRawScore] = useState(0);
  const [bandScore, setBandScore] = useState(0);
  const [isSavedToHistory, setIsSavedToHistory] = useState(false);

  // Word lookup modal state
  const [lookupWord, setLookupWord] = useState<string | null>(null);
  const [lookupSentence, setLookupSentence] = useState('');
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);

  // Exam countdown timer (30 mins = 1800s)
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentSet: ListeningSet = MOCK_LISTENING_SETS[selectedSetIndex] || MOCK_LISTENING_SETS[0];

  // Reset answers when switching sets
  const handleSelectSet = (idx: number) => {
    setSelectedSetIndex(idx);
    setCurrentTurnIndex(0);
    setUserAnswers({});
    setIsSubmitted(false);
    setHighlightedEvidenceId(null);
    setIsResultModalOpen(false);
    setIsSavedToHistory(false);
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAnswerChange = (qId: number, val: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: val,
    }));
  };

  // Submit and calculate score
  const handleSubmit = async () => {
    let score = 0;
    currentSet.questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
      const isCorrect = q.correctAnswers.some(
        (ans) => ans.trim().toLowerCase() === userAns
      );
      if (isCorrect) score += 1;
    });

    const calculatedBand = calculateListeningBand(score, currentSet.questions.length);
    setRawScore(score);
    setBandScore(calculatedBand);
    setIsSubmitted(true);
    setIsResultModalOpen(true);

    // Auto save submission to IndexedDB
    const submission: ListeningSubmission = {
      id: `listening-${Date.now()}`,
      testId: currentSet.id,
      section: currentSet.section,
      answers: userAnswers,
      score,
      totalQuestions: currentSet.questions.length,
      bandScore: calculatedBand,
      timeSpentSeconds: 1800 - timeLeft,
      submittedAt: new Date().toISOString(),
    };

    try {
      await listeningRepository.saveSubmission(submission);
      setIsSavedToHistory(true);
    } catch (err) {
      console.error('Failed to auto-save submission:', err);
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setIsResultModalOpen(false);
    setIsSavedToHistory(false);
    setHighlightedEvidenceId(null);
    setCurrentTurnIndex(0);
  };

  const handleWordClick = (word: string, sentence: string) => {
    setLookupWord(word);
    setLookupSentence(sentence);
    setIsLookupModalOpen(true);
  };

  const answeredCount = Object.keys(userAnswers).filter(
    (k) => userAnswers[Number(k)]?.trim().length > 0
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white font-bold shadow-sm shadow-amber-500/30">
                <Headphones className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                IELTS General & Academic Listening Lab
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              실전 오디오 리스닝 & 트랩 분석 트레이닝
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              실전 원어민 음성 재생, 단락별 딕테이션, 채점관 함정(Distractor) 해설 및 문맥 단어장을 지원합니다.
            </p>
          </div>

          {/* Mode & Timer Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mode Toggle Button */}
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs font-bold">
              <button
                onClick={() => setIsExamMode(false)}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  !isExamMode
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                트레이닝 모드 (스크립트)
              </button>
              <button
                onClick={() => setIsExamMode(true)}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  isExamMode
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                실전 시험 모드 (1회 재생)
              </button>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2 text-xs sm:text-sm font-bold text-amber-900">
              <Timer className="h-4 w-4 text-amber-600" />
              <span className="font-mono">{formatTimer(timeLeft)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-[11px] underline text-amber-700 hover:text-amber-900 ml-1"
              >
                {isTimerRunning ? '일시정지' : '시작'}
              </button>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          {MOCK_LISTENING_SETS.map((set, idx) => (
            <button
              key={set.id}
              onClick={() => handleSelectSet(idx)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all ${
                selectedSetIndex === idx
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <span className="rounded bg-white/20 px-1.5 py-0.2 text-[10px] font-mono">
                Part {set.sectionNumber}
              </span>
              <span>{set.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sticky Audio Player */}
      <div className="sticky top-20 z-30">
        <ListeningAudioPlayer
          dialogue={currentSet.dialogue}
          title={currentSet.title}
          sectionNumber={currentSet.sectionNumber}
          currentTurnIndex={currentTurnIndex}
          onTurnChange={setCurrentTurnIndex}
          onAudioComplete={() => {}}
          isExamMode={isExamMode}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`grid grid-cols-1 gap-6 ${
          !isExamMode ? 'lg:grid-cols-12' : 'max-w-3xl mx-auto'
        }`}
      >
        {/* Left Column: Script Panel (Training Mode Only) */}
        {!isExamMode && (
          <div className="lg:col-span-5">
            <ListeningScriptPanel
              dialogue={currentSet.dialogue}
              currentTurnIndex={currentTurnIndex}
              highlightedQuestionId={highlightedEvidenceId}
              onWordClick={handleWordClick}
            />
          </div>
        )}

        {/* Right Column: Question Sheet */}
        <div className={!isExamMode ? 'lg:col-span-7' : 'w-full'}>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
            {/* Sheet Instructions */}
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                    Questions 1 – {currentSet.questions.length}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {currentSet.context}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    작성 현황: {answeredCount} / {currentSet.questions.length}
                  </span>
                </div>
              </div>

              {currentSet.wordLimitRule && (
                <div className="mt-2.5 rounded-xl bg-amber-50 p-3 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>
                    지시사항: <strong>{currentSet.wordLimitRule}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {currentSet.questions.map((question) => (
                <ListeningQuestionCard
                  key={question.id}
                  question={question}
                  userAnswer={userAnswers[question.id] || ''}
                  onAnswerChange={handleAnswerChange}
                  isSubmitted={isSubmitted}
                />
              ))}
            </div>

            {/* Submit Action Banner */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                {isSubmitted ? (
                  <span className="font-semibold text-emerald-600">
                    채점이 완료되었습니다. 결과 모달에서 정오답을 확인하세요.
                  </span>
                ) : (
                  <span>
                    모든 문제를 푼 뒤 아래 제출 버튼을 누르면 즉시 Band Score가 산출됩니다.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isSubmitted && (
                  <button
                    onClick={() => setIsResultModalOpen(true)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <span>채점 결과 다시 보기</span>
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-amber-500/25 transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitted ? '다시 채점하기' : '답안 제출 및 자동 채점'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      <ListeningResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        listeningSet={currentSet}
        userAnswers={userAnswers}
        bandScore={bandScore}
        rawScore={rawScore}
        onSaveToHistory={() => setIsSavedToHistory(true)}
        isSaved={isSavedToHistory}
        onSelectEvidenceQuestion={(qId) => setHighlightedEvidenceId(qId)}
        onRetry={handleRetry}
      />

      {/* Vocabulary Lookup Modal */}
      <WordLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        word={lookupWord}
        sentence={lookupSentence}
        sourceTitle={`Listening Section ${currentSet.sectionNumber} - ${currentSet.title}`}
        sourceType="listening"
      />
    </div>
  );
}
