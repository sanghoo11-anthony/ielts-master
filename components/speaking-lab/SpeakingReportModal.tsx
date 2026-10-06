'use client';

import React, { useState } from 'react';
import { SpeakingEvaluationResponse } from '@/types/speaking';
import WordLookupModal from '@/components/vocabulary/WordLookupModal';
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Copy,
  Check,
  Bookmark,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Award,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface SpeakingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: SpeakingEvaluationResponse | null;
  questionText: string;
  candidateAnswer: string;
  onSaveToHistory?: () => void;
  isSaved?: boolean;
}

export default function SpeakingReportModal({
  isOpen,
  onClose,
  evaluation,
  questionText,
  candidateAnswer,
  onSaveToHistory,
  isSaved = false,
}: SpeakingReportModalProps) {
  const [isPlayingModelTTS, setIsPlayingModelTTS] = useState(false);
  const [copiedSentence, setCopiedSentence] = useState<string | null>(null);
  const [activeCriterion, setActiveCriterion] = useState<string | null>('fluency');

  // 단어 사전 팝업 상태
  const [lookupWord, setLookupWord] = useState<string | null>(null);
  const [lookupSentence, setLookupSentence] = useState('');
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);

  if (!isOpen || !evaluation) return null;

  // 원어민 음성으로 모범답안 TTS 재생
  const handlePlayModelAnswerTTS = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const textToSpeak = evaluation.korean_to_english_model_answer;
    if (!textToSpeak) return;

    if (isPlayingModelTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingModelTTS(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 0.88;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => setIsPlayingModelTTS(true);
    utterance.onend = () => setIsPlayingModelTTS(false);
    utterance.onerror = () => setIsPlayingModelTTS(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSentence(text);
    setTimeout(() => setCopiedSentence(null), 2000);
  };

  const handleWordLookup = (word: string, contextSentence: string) => {
    setLookupWord(word);
    setLookupSentence(contextSentence);
    setIsLookupModalOpen(true);
  };

  const { scores } = evaluation;

  // 4축 방사형 차트 좌표 계산 (중심 100, 100, 반지름 70)
  const maxScore = 9.0;
  const cx = 110;
  const cy = 110;
  const radius = 70;

  const points = [
    { label: 'Fluency', score: scores.fluency_coherence, angle: -Math.PI / 2 },
    { label: 'Lexical', score: scores.lexical_resource, angle: 0 },
    { label: 'Grammar', score: scores.grammatical_range_accuracy, angle: Math.PI / 2 },
    { label: 'Pronunciation', score: scores.pronunciation_delivery, angle: Math.PI },
  ];

  const targetBand7Polygon = points
    .map((p) => {
      const r = (7.0 / maxScore) * radius;
      const x = cx + r * Math.cos(p.angle);
      const y = cy + r * Math.sin(p.angle);
      return `${x},${y}`;
    })
    .join(' ');

  const userPolygon = points
    .map((p) => {
      const r = (Math.max(2.0, p.score) / maxScore) * radius;
      const x = cx + r * Math.cos(p.angle);
      const y = cy + r * Math.sin(p.angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/90 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 text-white font-bold shadow-md shadow-rose-500/20">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                IELTS Speaking 공식 채점 & 피드백 리포트
              </h3>
              <p className="text-xs text-slate-500">
                공식 4대 Band Descriptors 기준 정밀 분석 결과
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* 1. Overall Band Score & Radar Chart Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl">
            {/* Left Score Summary */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300 border border-rose-500/30">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>공식 종합 평가</span>
                </div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="font-mono text-4xl sm:text-5xl font-black text-white">
                    {evaluation.overall_band.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-400 font-semibold">Overall Band Score</span>
                </div>
              </div>

              {/* 4대 영역별 점수 미니 뱃지 */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-white/10 p-2.5 border border-white/10">
                  <div className="text-slate-400 text-[11px]">Fluency & Coherence</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    Band {scores.fluency_coherence.toFixed(1)}
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 p-2.5 border border-white/10">
                  <div className="text-slate-400 text-[11px]">Lexical Resource</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    Band {scores.lexical_resource.toFixed(1)}
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 p-2.5 border border-white/10">
                  <div className="text-slate-400 text-[11px]">Grammatical Range</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    Band {scores.grammatical_range_accuracy.toFixed(1)}
                  </div>
                </div>
                <div className="rounded-xl bg-white/10 p-2.5 border border-white/10">
                  <div className="text-slate-400 text-[11px]">Pronunciation Tips</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    Band {scores.pronunciation_delivery.toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Examiner Feedback Summary */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                {evaluation.examiner_feedback_summary}
              </p>
            </div>

            {/* Right SVG Radar Chart */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-2 bg-white/5 rounded-2xl border border-white/10">
              <svg viewBox="-30 -20 280 260" className="w-full max-w-[240px] h-auto">
                {/* Background circles */}
                {[0.33, 0.66, 1.0].map((step, idx) => (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r={radius * step}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeDasharray={step === 1.0 ? 'none' : '3,3'}
                  />
                ))}
                {/* Axes */}
                {points.map((p, idx) => {
                  const x = cx + radius * Math.cos(p.angle);
                  const y = cy + radius * Math.sin(p.angle);
                  return (
                    <line
                      key={idx}
                      x1={cx}
                      y1={cy}
                      x2={x}
                      y2={y}
                      stroke="rgba(255,255,255,0.2)"
                    />
                  );
                })}
                {/* Target Band 7.0 (Green Dashed) */}
                <polygon
                  points={targetBand7Polygon}
                  fill="rgba(16, 185, 129, 0.15)"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                {/* User Polygon (Rose Solid) */}
                <polygon
                  points={userPolygon}
                  fill="rgba(244, 63, 94, 0.45)"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                />
                {/* Labels */}
                <text x={cx} y={cy - radius - 10} fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">
                  Fluency ({scores.fluency_coherence})
                </text>
                <text x={cx + radius + 10} y={cy + 4} fill="#ffffff" fontSize="11" textAnchor="start" fontWeight="bold">
                  Lexical ({scores.lexical_resource})
                </text>
                <text x={cx} y={cy + radius + 16} fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">
                  Grammar ({scores.grammatical_range_accuracy})
                </text>
                <text x={cx - radius - 10} y={cy + 4} fill="#ffffff" fontSize="11" textAnchor="end" fontWeight="bold">
                  Pronun ({scores.pronunciation_delivery})
                </text>
              </svg>
              <div className="flex items-center gap-3 text-[11px] text-slate-300 mt-2">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> 내 점수
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> 목표 Band 7.0
                </span>
              </div>
            </div>
          </div>

          {/* 2. ⭐ 한국어 응답 시 영어 모범 답안 변환 카드 (사용자 핵심 요구사항!) */}
          {evaluation.korean_to_english_model_answer && (
            <div className="rounded-3xl border-2 border-indigo-200 bg-indigo-50/60 p-5 sm:p-7 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Band 7.5+ 영어 모범답안 (Model Answer)</span>
                  </span>
                  {evaluation.is_korean_response && (
                    <span className="rounded-lg bg-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-800">
                      한국어 의도 100% 반영
                    </span>
                  )}
                </div>

                {/* TTS 음성 듣기 & 복사 버튼 */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePlayModelAnswerTTS}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
                      isPlayingModelTTS
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {isPlayingModelTTS ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    <span>{isPlayingModelTTS ? '음성 중지' : '원어민 발음 듣기'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyText(evaluation.korean_to_english_model_answer!)}
                    className="flex items-center gap-1.5 rounded-xl border border-indigo-300 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-all shadow-sm"
                  >
                    {copiedSentence === evaluation.korean_to_english_model_answer ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copiedSentence === evaluation.korean_to_english_model_answer ? '복사됨' : '복사'}</span>
                  </button>
                </div>
              </div>

              {/* 영문 모범답안 텍스트 */}
              <div className="rounded-2xl bg-white p-4 sm:p-5 border border-indigo-100 shadow-sm">
                <p className="font-serif text-base sm:text-lg text-slate-900 leading-relaxed font-medium">
                  &ldquo;{evaluation.korean_to_english_model_answer}&rdquo;
                </p>
              </div>

              {/* 모범답안 변환 해설 */}
              {evaluation.model_answer_explanation && (
                <div className="mt-4 rounded-2xl bg-white/80 p-4 border border-indigo-100 text-xs sm:text-sm text-indigo-950 leading-relaxed">
                  <strong>💬 표현 변환 뉘앙스 해설:</strong>
                  <p className="mt-1 text-slate-700">{evaluation.model_answer_explanation}</p>
                </div>
              )}

              {/* 핵심 Collocations 칩 */}
              {evaluation.key_collocations && evaluation.key_collocations.length > 0 && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-indigo-900">핵심 Collocations (클릭 시 사전 조회):</span>
                  {evaluation.key_collocations.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleWordLookup(col, evaluation.korean_to_english_model_answer!)}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-2xs"
                      title="클릭하여 단어 뜻 & 문맥 확인 후 단어장에 저장"
                    >
                      {col}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. 공식 4대 영역 상세 분석 아코디언 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-rose-600" />
              <span>영역별 강점 및 Band 7+ 도달 과제 분석</span>
            </h4>

            <div className="space-y-3">
              {[
                {
                  id: 'fluency',
                  title: '1. 유창성 및 일관성 (Fluency & Coherence)',
                  data: evaluation.detailed_critique.fluency_coherence,
                  band: scores.fluency_coherence,
                },
                {
                  id: 'lexical',
                  title: '2. 어휘의 다양성 (Lexical Resource)',
                  data: evaluation.detailed_critique.lexical_resource,
                  band: scores.lexical_resource,
                },
                {
                  id: 'grammar',
                  title: '3. 문법적 범위 및 정확성 (Grammatical Range & Accuracy)',
                  data: evaluation.detailed_critique.grammatical_range,
                  band: scores.grammatical_range_accuracy,
                },
                {
                  id: 'pronun',
                  title: '4. 발음 및 전달력 (Pronunciation & Delivery Tips)',
                  data: evaluation.detailed_critique.pronunciation_delivery,
                  band: scores.pronunciation_delivery,
                },
              ].map((item) => {
                const isOpen = activeCriterion === item.id;
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveCriterion(isOpen ? null : item.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left font-bold text-xs sm:text-sm text-slate-800 hover:bg-slate-100"
                    >
                      <span>{item.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
                          Band {item.band.toFixed(1)}
                        </span>
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-slate-200 bg-white p-4 space-y-2.5 text-xs sm:text-sm">
                        <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-200 text-emerald-950">
                          <strong className="text-emerald-800">✓ 강점:</strong> {item.data.strengths}
                        </div>
                        <div className="rounded-xl bg-amber-50/70 p-3 border border-amber-200 text-amber-950">
                          <strong className="text-amber-800">△ 감점 요인:</strong> {item.data.weaknesses}
                        </div>
                        <div className="rounded-xl bg-rose-50/70 p-3 border border-rose-200 text-rose-950">
                          <strong className="text-rose-800">★ Band 7.0+ 도달 과제:</strong>{' '}
                          {item.data.band_7_target_advice}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. 문장 교정 리스트 (Sentence Corrections) */}
          {evaluation.corrections && evaluation.corrections.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-600" />
                <span>Band 7.0+ 실전 추천 교정 표현</span>
              </h4>

              <div className="space-y-3">
                {evaluation.corrections.map((corr, idx) => (
                  <div key={idx} className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-2">
                    <div className="text-xs text-slate-500 line-through">원문: {corr.original}</div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm sm:text-base font-bold text-slate-900 font-serif">
                        교정: &ldquo;{corr.improved}&rdquo;
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyText(corr.improved)}
                        className="rounded-lg border border-slate-200 bg-white p-1 text-slate-500 hover:bg-slate-100"
                        title="표현 복사"
                      >
                        {copiedSentence === corr.improved ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-rose-700 bg-rose-50/80 p-2 rounded-xl">
                      <strong>교정 사유:</strong> {corr.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 flex-wrap gap-2">
          {onSaveToHistory && (
            <button
              type="button"
              onClick={onSaveToHistory}
              disabled={isSaved}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-sm ${
                isSaved
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>{isSaved ? '답변 이력 저장 완료' : '이 답변 이력에 저장'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm ml-auto"
          >
            닫기
          </button>
        </div>
      </div>

      {/* 단어 사전 팝업 모달 */}
      <WordLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        word={lookupWord}
        sentence={lookupSentence}
        sourceTitle="Speaking Lab 모범 답안"
        sourceType="speaking"
      />
    </div>
  );
}
