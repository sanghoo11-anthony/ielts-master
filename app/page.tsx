'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { writingRepository } from '@/lib/storage/writingRepository';
import { readingRepository } from '@/lib/storage/readingRepository';
import { WritingSubmission } from '@/types/writing';
import { ReadingSubmission } from '@/types/reading';
import { UserProfile } from '@/lib/storage/db';
import { getBandDescriptor } from '@/lib/utils/bandCalculator';
import {
  Trophy,
  PenTool,
  BookOpen,
  Target,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Flame,
  Bookmark,
} from 'lucide-react';
import { vocabularyRepository } from '@/lib/storage/vocabularyRepository';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [writingSubs, setWritingSubs] = useState<WritingSubmission[]>([]);
  const [readingSubs, setReadingSubs] = useState<ReadingSubmission[]>([]);
  const [vocabCount, setVocabCount] = useState(0);

  useEffect(() => {
    writingRepository.getUserProfile().then(setProfile);
    writingRepository.getAllSubmissions().then(setWritingSubs);
    readingRepository.getAllSubmissions().then(setReadingSubs);
    vocabularyRepository.getStats().then((s) => setVocabCount(s.total));
  }, []);

  const targetBand = profile?.targetBand || 7.0;

  // 평균 Writing Band 계산
  const writingBands = writingSubs
    .filter((s) => s.evaluation?.overallBand)
    .map((s) => s.evaluation!.overallBand);
  const avgWritingBand =
    writingBands.length > 0
      ? (writingBands.reduce((a, b) => a + b, 0) / writingBands.length).toFixed(1)
      : '5.0';

  // 평균 Reading Band 계산
  const readingBands = readingSubs.map((s) => s.estimatedBand);
  const avgReadingBand =
    readingBands.length > 0
      ? (readingBands.reduce((a, b) => a + b, 0) / readingBands.length).toFixed(1)
      : '5.5';

  const overallAvgBand = (
    (parseFloat(avgWritingBand) + parseFloat(avgReadingBand)) /
    2
  ).toFixed(1);

  const descriptor = getBandDescriptor(parseFloat(overallAvgBand));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 p-6 text-white shadow-2xl sm:p-10">
        <div className="relative z-10 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
            <Flame className="h-3.5 w-3.5 text-amber-300" />
            <span>IELTS General Training 실전 트레이닝 플랫폼</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
            Band 5.0에서 <span className="text-amber-300">Band 7.0+</span>까지,
            <br />
            실전 타이머 & AI 정밀 첨삭 훈련
          </h1>

          <p className="mt-3 text-sm text-slate-200 sm:text-base leading-relaxed">
            IELTS 공식 4대 기준(TA/TR, CC, LR, GRA)에 맞춘 문장 단위 AI 첨삭과
            Reading 단락 근거 매칭 뷰어로 실전 감각을 극대화하세요.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/writing/lab"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all"
            >
              <PenTool className="h-4 w-4" />
              <span>Writing Lab (실전 시험)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/reading/lab"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>Reading Lab (스플릿 시험)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/vocabulary"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
            >
              <Bookmark className="h-4 w-4 text-amber-300" />
              <span>나만의 단어장</span>
              {vocabCount > 0 && (
                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-black text-slate-900">
                  {vocabCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Stats & Progression Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Target Band */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              목표 밴드 (Target)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-slate-900">
              {targetBand.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">Band</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">캐나다 EE / 호주 이민 필수 안정권</p>
        </div>

        {/* Card 2: Current Estimated Band */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              현재 추정 실력 (Overall)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Trophy className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-amber-600">
              {overallAvgBand}
            </span>
            <span className="text-xs text-slate-400">Band</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">{descriptor.levelTitle}</p>
        </div>

        {/* Card 3: Writing Avg */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Writing 평균 점수
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <PenTool className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-indigo-600">
              {avgWritingBand}
            </span>
            <span className="text-xs text-slate-400">
              ({writingSubs.length}회 작성)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">4대 공식 기준 채점 반영</p>
        </div>

        {/* Card 4: Reading Avg */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Reading 평균 점수
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-black text-emerald-600">
              {avgReadingBand}
            </span>
            <span className="text-xs text-slate-400">
              ({readingSubs.length}회 응시)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">실전 환산표 기준</p>
        </div>
      </div>

      {/* Band 5.0 -> 7.0 Roadmap Milestone Stepper */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Band 5.0 → 7.0 단계별 실력 도약 로드맵
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              각 단계별 핵심 감점 요인을 제거하고 고득점 기준을 정복하세요.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="rounded-lg bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
                Step 1: Band 5.0~5.5
              </span>
              <span className="text-xs font-semibold text-slate-500">기본 틀 확립</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">
              필수 단어 수 충족 & 기본 단락 분리
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Task 1 (150단어), Task 2 (250단어) 미달 감점 방지</li>
              <li>Task 1 세 가지 요구사항(Bullet points) 누락 없이 기재</li>
              <li>주어-동사 수일치 및 기본 시제 오류 최소화</li>
            </ul>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl bg-blue-50/60 p-5 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <span className="rounded-lg bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-800">
                Step 2: Band 6.0~6.5
              </span>
              <span className="text-xs font-semibold text-blue-600">논리 전개</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">
              복문(Complex Sentences) & 다양한 연결어
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>단순문 나열을 탈피하여 관계사절, 조건문, 분사구문 도입</li>
              <li>However, Furthermore 등 논리적 전환 장치 배치</li>
              <li>Reading 지문 내 Paraphrasing 표현 매칭 훈련</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl bg-emerald-50/70 p-5 border border-emerald-300">
            <div className="flex items-center justify-between mb-3">
              <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                Step 3: Band 7.0+ (최종 목표)
              </span>
              <span className="text-xs font-semibold text-emerald-600">고득점 완성</span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">
              오류 없는 문장 50%+ & 고급 Collocation
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>원어민스러운 연어(Collocation) 및 정교한 어휘 구사</li>
              <li>자연스러운 단락 간 응집성 및 일관된 Tone(격식체) 유지</li>
              <li>Reading T/F/NG의 미묘한 Not Given 함정 완벽 판별</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Submissions History (Writing & Reading) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Writing History */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PenTool className="h-4 w-4 text-blue-600" />
              최근 Writing 첨삭 이력
            </h3>
            <Link href="/writing" className="text-xs font-semibold text-blue-600 hover:underline">
              전체 보기
            </Link>
          </div>

          {writingSubs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              아직 작성한 Writing 답안이 없습니다. 실전 훈련을 시작해보세요!
            </div>
          ) : (
            <div className="space-y-3">
              {writingSubs.slice(0, 3).map((sub) => (
                <Link
                  key={sub.id}
                  href={`/writing/${sub.topicId}/result/${sub.id}`}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 transition-all hover:bg-blue-50/50 hover:border-blue-200 border border-slate-100"
                >
                  <div className="max-w-[70%]">
                    <span className="text-[11px] font-bold text-blue-600">
                      {sub.taskType === 'TASK_1' ? 'Task 1 (Letter)' : 'Task 2 (Essay)'}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {sub.essayText.slice(0, 50)}...
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {sub.wordCount}단어 • {new Date(sub.submittedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {sub.evaluation ? (
                      <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
                        Band {sub.evaluation.overallBand.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">제출됨</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Reading History */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              최근 Reading 풀이 이력
            </h3>
            <Link href="/reading" className="text-xs font-semibold text-emerald-600 hover:underline">
              전체 보기
            </Link>
          </div>

          {readingSubs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              아직 응시한 Reading 테스트가 없습니다. 스플릿 모의고사를 시작해보세요!
            </div>
          ) : (
            <div className="space-y-3">
              {readingSubs.slice(0, 3).map((sub) => (
                <Link
                  key={sub.id}
                  href={`/reading/${sub.testId}/result/${sub.id}`}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 transition-all hover:bg-emerald-50/50 hover:border-emerald-200 border border-slate-100"
                >
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700">
                      General Reading Set
                    </span>
                    <p className="text-xs font-semibold text-slate-800">
                      정답률: {sub.score} / {sub.totalQuestions}문항
                    </p>
                    <span className="text-[10px] text-slate-400">
                      소요 시간: {Math.floor(sub.timeSpentSeconds / 60)}분 •{' '}
                      {new Date(sub.submittedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-emerald-700 px-2.5 py-1 text-xs font-bold text-white">
                      Band {sub.estimatedBand.toFixed(1)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
