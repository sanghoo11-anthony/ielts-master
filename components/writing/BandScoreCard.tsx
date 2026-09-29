'use client';

import React, { useState } from 'react';
import { CriterionScore, WritingEvaluationResult } from '@/types/writing';
import { getBandDescriptor } from '@/lib/utils/bandCalculator';
import {
  Trophy,
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface BandScoreCardProps {
  evaluation: WritingEvaluationResult;
  targetBand?: number;
}

export default function BandScoreCard({
  evaluation,
  targetBand = 7.0,
}: BandScoreCardProps) {
  const [selectedCriteria, setSelectedCriteria] = useState<
    'TA' | 'CC' | 'LR' | 'GRA'
  >('TA');

  const overall = evaluation.overallBand;
  const descriptor = getBandDescriptor(overall);
  const diffFromTarget = overall - targetBand;

  const criteriaMap: Record<
    'TA' | 'CC' | 'LR' | 'GRA',
    { title: string; subtitle: string; data: CriterionScore }
  > = {
    TA: {
      title: 'Task Achievement / Response',
      subtitle: '과제 달성도 & 핵심 요구사항 충족',
      data: evaluation.criteria.taskAchievementOrResponse,
    },
    CC: {
      title: 'Coherence & Cohesion',
      subtitle: '글의 일관성 & 논리적 문단 연결',
      data: evaluation.criteria.coherenceAndCohesion,
    },
    LR: {
      title: 'Lexical Resource',
      subtitle: '어휘의 다양성 & 정확한 Collocation',
      data: evaluation.criteria.lexicalResource,
    },
    GRA: {
      title: 'Grammatical Range & Accuracy',
      subtitle: '문법 구조의 다양성 & 문장 정확도',
      data: evaluation.criteria.grammaticalRangeAndAccuracy,
    },
  };

  const activeCriterion = criteriaMap[selectedCriteria];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Top Header: Overall Score & Target Band Status */}
      <div className="flex flex-col gap-6 border-b border-slate-100 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              Overall Band
            </span>
            <span className="font-mono text-4xl font-black">
              {overall.toFixed(1)}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-0.5 text-xs font-bold ${descriptor.badgeColor}`}
              >
                {descriptor.levelTitle}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Target className="h-3.5 w-3.5 text-blue-600" />
                <span>목표: Band {targetBand.toFixed(1)}</span>
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-xl">
              {descriptor.summary}
            </p>

            <div className="mt-2 text-xs font-semibold">
              {diffFromTarget >= 0 ? (
                <span className="text-emerald-600">
                  🎉 목표 점수(Band {targetBand.toFixed(1)})를 달성하셨습니다!
                </span>
              ) : (
                <span className="text-amber-600">
                  목표 Band {targetBand.toFixed(1)}까지{' '}
                  <span className="font-bold text-slate-900">
                    {Math.abs(diffFromTarget).toFixed(1)}점
                  </span>{' '}
                  남았습니다. 아래 영역별 취약점을 집중 보완하세요.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Word count & evaluation verdict preview */}
        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-600 min-w-[200px]">
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span>작성 단어 수:</span>
            <span className="font-bold text-slate-800">{evaluation.wordCount} words</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200">
            <span>문단 개수:</span>
            <span className="font-bold text-slate-800">
              {evaluation.paragraphAnalysis?.length || 0}개 단락
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span>첨삭 문장 수:</span>
            <span className="font-bold text-blue-600">
              {evaluation.sentenceFeedbacks?.length || 0}건
            </span>
          </div>
        </div>
      </div>

      {/* 4 Official Criteria Tabs & Gauges */}
      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
          IELTS 공식 4대 평가 영역별 채점 결과
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(['TA', 'CC', 'LR', 'GRA'] as const).map((key) => {
            const item = criteriaMap[key];
            const isSelected = selectedCriteria === key;
            const score = item.data.score;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCriteria(key)}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <span className="text-xs font-bold text-slate-500">{key}</span>
                <span className="mt-1 font-mono text-2xl font-black text-slate-900">
                  {score.toFixed(1)}
                </span>
                <span className="mt-1 line-clamp-1 text-xs font-semibold text-slate-700">
                  {item.title}
                </span>

                {/* Score bar */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full ${
                      score >= 7.0
                        ? 'bg-emerald-500'
                        : score >= 6.0
                        ? 'bg-blue-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${(score / 9) * 100}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Criterion Deep Dive Details */}
        <div className="mt-6 rounded-2xl bg-slate-50 p-6 border border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <h4 className="text-base font-bold text-slate-900">
                {activeCriterion.title}
              </h4>
              <p className="text-xs text-slate-500">{activeCriterion.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-black text-blue-600">
                Band {activeCriterion.data.score.toFixed(1)}
              </span>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-700 leading-relaxed font-medium">
            {activeCriterion.data.bandDescription}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Strengths */}
            <div className="rounded-xl bg-emerald-50/80 p-4 border border-emerald-200/60">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                잘된 점 (Strengths)
              </span>
              <ul className="space-y-1.5 text-xs text-emerald-950">
                {activeCriterion.data.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="mt-0.5 font-bold">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-xl bg-amber-50/80 p-4 border border-amber-200/60">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                보완할 점 (Weaknesses)
              </span>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {activeCriterion.data.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="mt-0.5 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actionable Tips */}
            <div className="rounded-xl bg-blue-50/80 p-4 border border-blue-200/60">
              <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5 mb-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                Band 7.0+ 돌파 전략 (Action Tips)
              </span>
              <ul className="space-y-1.5 text-xs text-blue-950">
                {activeCriterion.data.actionableTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="mt-0.5 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
