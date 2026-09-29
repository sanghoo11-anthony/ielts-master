'use client';

import React, { useState } from 'react';
import { AreaCritique } from '@/types/evaluate-writing';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Award,
} from 'lucide-react';

interface DetailedCritiqueAccordionProps {
  critique: {
    task_response: AreaCritique;
    coherence_cohesion: AreaCritique;
    lexical_resource: AreaCritique;
    grammatical_range_accuracy: AreaCritique;
  };
}

export default function DetailedCritiqueAccordion({
  critique,
}: DetailedCritiqueAccordionProps) {
  // 열려 있는 아코디언 영역 key 목록 (초기에는 모두 열려 있게 하여 한눈에 볼 수 있도록 함)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    task_response: true,
    coherence_cohesion: true,
    lexical_resource: true,
    grammatical_range_accuracy: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const areas: {
    key: keyof typeof critique;
    title: string;
    description: string;
    data: AreaCritique;
    badgeColor: string;
  }[] = [
    {
      key: 'task_response',
      title: critique.task_response.area_name || 'Task Response',
      description: '주제 요구사항 충족, 명확한 입장 및 세부 논거 발전',
      data: critique.task_response,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      key: 'coherence_cohesion',
      title: 'Coherence & Cohesion',
      description: '단락 구성의 논리성, 주제문 배치 및 문장 간 자연스러운 결속성',
      data: critique.coherence_cohesion,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      key: 'lexical_resource',
      title: 'Lexical Resource',
      description: '어휘의 폭과 다양성, 고급 아카데믹 연어(Collocation) 및 철자 정확도',
      data: critique.lexical_resource,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      key: 'grammatical_range_accuracy',
      title: 'Grammatical Range & Accuracy',
      description: '단문/복문의 혼합 구성, 시제/수일치 정확도 및 오류 없는 문장 비율',
      data: critique.grammatical_range_accuracy,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          영역별 상세 피드백 & 감점 요인 3줄 요약 (아코디언)
        </h4>
        <span className="text-xs text-slate-400">카드를 클릭해 접거나 펼칠 수 있습니다</span>
      </div>

      <div className="space-y-2.5">
        {areas.map((area) => {
          const isOpen = !!openSections[area.key];
          const score = area.data.score;

          return (
            <div
              key={area.key}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleSection(area.key)}
                className="flex w-full items-center justify-between px-5 py-3.5 text-left bg-slate-50/60 hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-xs font-black font-mono ${area.badgeColor}`}
                  >
                    Band {score.toFixed(1)}
                  </span>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900 leading-tight">
                      {area.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 hidden sm:block">
                      {area.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">
                    {isOpen ? '접기' : '상세보기'}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  )}
                </div>
              </button>

              {/* Accordion Content: 3-line Summary */}
              {isOpen && (
                <div className="border-t border-slate-100 p-4 sm:p-5 bg-white space-y-2.5">
                  {area.data.summary_3lines && area.data.summary_3lines.length > 0 ? (
                    area.data.summary_3lines.map((line, idx) => {
                      const isStrength = line.includes('[강점]');
                      const isDeduction = line.includes('[감점') || line.includes('감점');
                      const isBand7 = line.includes('Band 7') || line.includes('과제');

                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-2.5 rounded-xl p-3 text-xs leading-relaxed border ${
                            isStrength
                              ? 'bg-emerald-50/70 border-emerald-200/60 text-emerald-950'
                              : isDeduction
                              ? 'bg-rose-50/70 border-rose-200/60 text-rose-950'
                              : 'bg-blue-50/70 border-blue-200/60 text-blue-950'
                          }`}
                        >
                          {isStrength ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : isDeduction ? (
                            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                          ) : (
                            <Lightbulb className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                          )}
                          <span className="font-medium">{line}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-400">요약 피드백이 준비되지 않았습니다.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
