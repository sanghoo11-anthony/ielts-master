'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_READING_TESTS } from '@/lib/mock-data/readingTests';
import { readingRepository } from '@/lib/storage/readingRepository';
import { ReadingSubmission } from '@/types/reading';
import {
  BookOpen,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Trophy,
  Layers,
} from 'lucide-react';

export default function ReadingListPage() {
  const [submissions, setSubmissions] = useState<ReadingSubmission[]>([]);

  useEffect(() => {
    readingRepository.getAllSubmissions().then((data) => {
      setSubmissions(data);
    });
  }, []);

  const getSubmissionsForTest = (testId: string) => {
    return submissions.filter((s) => s.testId === testId);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 text-white shadow-xl sm:p-10">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>IELTS General Training Reading</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
            실전 Reading 스플릿 모의고사 & 단락 근거 매칭
          </h1>
          <p className="mt-3 text-sm text-emerald-100 sm:text-base leading-relaxed">
            실제 시험과 동일한 좌우 분할(Split Screen) 환경에서 Section 1~3 지문을 읽고 하이라이트하며
            실전 문제를 해결하세요. 제출 즉시 공식 Band 점수 환산과 지문 내 정답 근거 문장 매칭 해설을 제공합니다.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <Link
              href="/reading/lab"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 font-bold text-slate-900 shadow-lg hover:bg-amber-300 transition-all"
            >
              <Sparkles className="h-4 w-4 text-slate-950" />
              <span>실전 시험 화면(Reading Lab) 바로 입장하기</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-sm">
              <Layers className="h-4 w-4 text-emerald-300" />
              <span>Section 1(생활) + Section 2(직장) + Section 3(심층 기사)</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-sm">
              <Clock className="h-4 w-4 text-amber-300" />
              <span>실전 60분 타이머 & 즉시 자동 채점</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_READING_TESTS.map((test) => {
          const testSubs = getSubmissionsForTest(test.id);
          const latestSub = testSubs[0];

          return (
            <div
              key={test.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-300"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    General Training Set
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                    {test.timeLimitMinutes}분
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {test.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {test.description}
                </p>

                {/* Section breakdown */}
                <div className="space-y-1.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 mb-4 border border-slate-100">
                  <div className="font-semibold text-slate-700">포함된 지문 목록:</div>
                  {test.passages.map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-1.5 text-slate-600 truncate">
                      <span className="font-bold text-emerald-700">• Sec {idx + 1}:</span>
                      <span className="truncate">{p.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                {latestSub ? (
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      최근 점수: {latestSub.score} / {latestSub.totalQuestions}
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Band {latestSub.estimatedBand.toFixed(1)}
                    </span>
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <Link
                    href={`/reading/${test.id}/practice`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-800 transition-colors"
                  >
                    <span>{latestSub ? '다시 응시하기' : '실전 테스트 시작'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {latestSub && (
                    <Link
                      href={`/reading/${test.id}/result/${latestSub.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      title="최근 결과 및 단락 근거 해설"
                    >
                      <BookOpen className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
