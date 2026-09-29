'use client';

import React from 'react';
import { EvaluateWritingResponse } from '@/types/evaluate-writing';
import ScoreRadarChart from './ScoreRadarChart';
import DetailedCritiqueAccordion from './DetailedCritiqueAccordion';
import InlineCorrectionsList from './InlineCorrectionsList';
import {
  Trophy,
  Sparkles,
  X,
  Printer,
  RotateCcw,
  Target,
  FileText,
} from 'lucide-react';

interface EvaluationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  evaluation: EvaluateWritingResponse | null;
  essayText: string;
  timeSpentSeconds: number;
}

export default function EvaluationReportModal({
  isOpen,
  onClose,
  isLoading,
  evaluation,
  essayText,
  timeSpentSeconds,
}: EvaluationReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-auto">
        {/* Loading Screen */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center space-y-5">
            <div className="relative">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-md" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-bold text-slate-900">
                IELTS 공식 4대 기준 Gemini AI 정밀 채점 중
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy를
                기반으로 엄격한 점수 산출 및 패러프레이징 교정을 생성하고 있습니다...
              </p>
            </div>

            <div className="flex gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200">
              <span>수석 채점관 루브릭 매칭 및 레이더 차트 생성 중</span>
            </div>
          </div>
        ) : evaluation ? (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 sm:px-6 py-3.5 sm:py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black shrink-0">
                  GT
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold">IELTS Writing AI 정밀 채점 리포트</h3>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    작성 단어 수: {evaluation.word_count}단어 | 소요 시간:{' '}
                    {Math.floor(timeSpentSeconds / 60)}분 {timeSpentSeconds % 60}초
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-7">
              {/* 1. Overall Score Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-4 sm:p-6 text-white shadow-lg">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-white text-blue-700 shadow-md">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Overall
                    </span>
                    <span className="font-mono text-3xl font-black">
                      {evaluation.overall_band.toFixed(1)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold text-amber-300 backdrop-blur-sm">
                        {evaluation.overall_band >= 7.0
                          ? '🎉 Band 7.0+ 목표 달성!'
                          : 'Band 7.0 도달을 위한 보완 필요'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-blue-100 max-w-lg leading-relaxed font-medium">
                      "{evaluation.verdict}"
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-blue-200">
                  <span className="font-semibold text-white">4대 기준 가중치 각 25%</span>
                  <span>TR 25% • CC 25% • LR 25% • GRA 25%</span>
                </div>
              </div>

              {/* 2. 점수 레이더 차트 (Score Radar Chart) */}
              <ScoreRadarChart
                scores={evaluation.scores}
                areaNames={{
                  task_response: evaluation.detailed_critique.task_response.area_name || 'Task Response',
                  coherence_cohesion: 'Coherence & Cohesion',
                  lexical_resource: 'Lexical Resource',
                  grammatical_range_accuracy: 'Grammar Accuracy',
                }}
              />

              {/* 3. 영역별 상세 피드백 & 감점 요인 3줄 요약 (아코디언) */}
              <DetailedCritiqueAccordion critique={evaluation.detailed_critique} />

              {/* 4. 에세이 본문 중 Band 7.0+ 패러프레이징 교정 문장 3~5개 */}
              <InlineCorrectionsList corrections={evaluation.inline_corrections} />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 sm:px-6 py-3 sm:py-4">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
              >
                <Printer className="h-4 w-4" />
                <span>리포트 인쇄 / PDF 저장</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                닫기
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
