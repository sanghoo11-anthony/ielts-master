'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SpeakingTopic, SpeakingQuestion } from '@/types/speaking';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Languages,
  BookOpen,
} from 'lucide-react';

interface SpeakingInteractionPanelProps {
  activeTopic: SpeakingTopic;
  activeQuestionIndex: number;
  onSelectQuestionIndex: (index: number) => void;
  onSubmitAnswer: (answer: string, isKorean: boolean) => void;
  isEvaluating: boolean;
}

export default function SpeakingInteractionPanel({
  activeTopic,
  activeQuestionIndex,
  onSelectQuestionIndex,
  onSubmitAnswer,
  isEvaluating,
}: SpeakingInteractionPanelProps) {
  const currentQuestion: SpeakingQuestion =
    activeTopic.questions[activeQuestionIndex] || activeTopic.questions[0];

  // 사용자 답변 텍스트
  const [answerText, setAnswerText] = useState('');
  const [showKoreanHint, setShowKoreanHint] = useState(false);

  // 음성 인식 (STT) 상태
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognitionLang, setRecognitionLang] = useState<'en-US' | 'ko-KR'>('en-US');

  // TTS 재생 상태
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  // 음성인식 인스턴스 ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // 한글 감지
  const isKoreanDetected = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(answerText);

  // 질문이 변경될 때마다 텍스트 초기화 및 질문 자동 TTS 재생 지원
  useEffect(() => {
    setAnswerText('');
    setShowKoreanHint(false);
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, [currentQuestion.id]);

  // Web Speech API 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  // TTS 질문 재생
  const handlePlayQuestionAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestion.questionText);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsPlayingTTS(true);
    utterance.onend = () => setIsPlayingTTS(false);
    utterance.onerror = () => setIsPlayingTTS(false);

    window.speechSynthesis.speak(utterance);
  };

  // 마이크 녹음 시작/중지
  const toggleRecording = () => {
    if (typeof window === 'undefined') return;

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('사용하시는 브라우저에서 실시간 음성 인식을 지원하지 않습니다. 크롬 또는 사파리 브라우저를 이용하시거나 텍스트로 직접 입력해 주세요.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = recognitionLang;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerText((prev) => {
          const trimmed = prev.trim();
          if (event.results[0].isFinal) {
            return trimmed ? `${trimmed} ${transcript}` : transcript;
          }
          return trimmed ? `${trimmed} ${transcript}` : transcript;
        });
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const handleLanguageModeToggle = () => {
    const nextLang = recognitionLang === 'en-US' ? 'ko-KR' : 'en-US';
    setRecognitionLang(nextLang);
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (!answerText.trim()) return;
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    onSubmitAnswer(answerText.trim(), isKoreanDetected || recognitionLang === 'ko-KR');
  };

  return (
    <div className="flex h-full flex-col gap-5 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      {/* 1. Questions Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <span className="text-xs font-bold text-slate-500 shrink-0">질문 목록:</span>
        {activeTopic.questions.map((q, idx) => (
          <button
            key={q.id}
            type="button"
            onClick={() => onSelectQuestionIndex(idx)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
              activeQuestionIndex === idx
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/25'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Q{idx + 1}</span>
            <span className="max-w-[120px] sm:max-w-[160px] truncate">
              {q.questionText.slice(0, 24)}...
            </span>
          </button>
        ))}
      </div>

      {/* 2. Examiner Card (질문 영역) */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-300 border border-rose-500/30">
              IELTS Examiner
            </span>
            <span className="text-xs text-slate-400">Question {activeQuestionIndex + 1} of {activeTopic.questions.length}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* 한국어 힌트 토글 */}
            <button
              type="button"
              onClick={() => setShowKoreanHint(!showKoreanHint)}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-white/20 transition-all backdrop-blur-md"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{showKoreanHint ? '한국어 숨기기' : '질문 해석'}</span>
            </button>

            {/* 원어민 TTS 음성 듣기 */}
            <button
              type="button"
              onClick={handlePlayQuestionAudio}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shadow-md ${
                isPlayingTTS
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {isPlayingTTS ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span>{isPlayingTTS ? '재생 중지' : '질문 듣기'}</span>
            </button>
          </div>
        </div>

        {/* 질문 텍스트 */}
        <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
          &ldquo;{currentQuestion.questionText}&rdquo;
        </h2>

        {/* 한국어 질문 해석 */}
        {showKoreanHint && (
          <div className="mt-4 rounded-2xl bg-white/10 p-3.5 text-xs sm:text-sm text-slate-200 leading-relaxed border border-white/10">
            <strong>한국어 해석:</strong> {currentQuestion.questionKo}
          </div>
        )}

        {/* Part 2 Cue Card 항목 표시 (Part 2인 경우) */}
        {currentQuestion.cueCardBulletPoints && currentQuestion.cueCardBulletPoints.length > 0 && (
          <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-2">
              Cue Card Prompt Requirements:
            </div>
            <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 list-disc pl-5">
              {currentQuestion.cueCardBulletPoints.map((pt, pIdx) => (
                <li key={pIdx}>{pt}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 고득점 추천 연어 칩 */}
        <div className="mt-5 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400">추천 Collocations:</span>
          {currentQuestion.recommendedCollocations.map((col, cIdx) => (
            <span
              key={cIdx}
              className="rounded-lg bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-rose-200 border border-white/10"
            >
              {col}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Candidate Spoken Response Card (응시자 답변 영역) */}
      <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm flex flex-col justify-between gap-4">
        <div>
          {/* Header toolbar: 언어 모드 선택 및 음성 가이드 */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Mic className="h-4 w-4 text-rose-600" />
                <span>나의 답변 (My Answer)</span>
              </span>
            </div>

            {/* 언어 인식 모드 토글 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">음성 언어:</span>
              <button
                type="button"
                onClick={handleLanguageModeToggle}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition-all border ${
                  recognitionLang === 'ko-KR'
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
                title="영어로 말하기 힘들다면 한국어 모드로 편하게 답변하세요!"
              >
                <Languages className="h-3.5 w-3.5" />
                <span>{recognitionLang === 'ko-KR' ? '🇰🇷 한국어로 답변' : '🌐 영어로 답변'}</span>
              </button>
            </div>
          </div>

          {/* 한국어 감지 안내 배너 (핵심 요구사항!) */}
          {isKoreanDetected && (
            <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-indigo-50/90 border border-indigo-200 p-3.5 text-xs text-indigo-900">
              <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>💡 한국어 답변이 감지되었습니다!</strong>
                <p className="mt-0.5 text-indigo-800">
                  영어로 바로 떠오르지 않는 생각을 한국어로 솔직하게 말씀해 주시면,
                  AI가 그 논리를 그대로 살려 <strong>Band 7.5+ 자연스러운 영어 모범답안</strong>으로 번역 및 변환해 드립니다.
                </p>
              </div>
            </div>
          )}

          {/* Textarea 답변 입력 및 음성 실시간 스트리밍 */}
          <div className="mt-4 relative">
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder={
                recognitionLang === 'ko-KR'
                  ? '마이크 버튼을 누르고 한국어로 편하게 말씀하시거나 여기에 직접 적어주세요...\n(예: "제 생각에는 대중교통 요금을 인하하고 노선을 늘리면 자가용 이용이 줄어들고 환경 오염도 크게 개선될 것 같습니다.")'
                  : 'Click the microphone button and speak in English, or type your answer here...\n(e.g. "In my opinion, expanding public transit infrastructure not only mitigates urban congestion but also fosters ecological sustainability...")'
              }
              rows={5}
              className="w-full rounded-2xl border border-slate-200 p-4 text-sm sm:text-base text-slate-900 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 leading-relaxed font-sans resize-none"
            />

            {/* 마이크 활성화 시 펄스 인디케이터 */}
            {isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-lg animate-pulse">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                <span>듣고 있습니다... 말씀하세요</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Bottom Controls: Record Mic & Submit for AI Evaluation */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 flex-wrap">
          {/* Mic Action */}
          <button
            type="button"
            onClick={toggleRecording}
            className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all shadow-md ${
              isRecording
                ? 'bg-rose-600 text-white shadow-rose-500/40 animate-bounce'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-rose-600" />}
            <span>{isRecording ? '녹음 중지' : '마이크로 말하기 (음성 인식)'}</span>
          </button>

          {/* AI 채점 및 피드백 제출 버튼 */}
          <button
            type="button"
            disabled={!answerText.trim() || isEvaluating}
            onClick={handleSubmit}
            className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg transition-all ${
              !answerText.trim() || isEvaluating
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 shadow-rose-500/25'
            }`}
          >
            {isEvaluating ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>AI 정밀 채점 & 피드백 분석 중...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>{isKoreanDetected ? '한국어 분석 & 영어 모범답안 받기' : 'AI 스피킹 채점 & 피드백 받기'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
