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
  Mic,
  Headphones,
} from 'lucide-react';
import { vocabularyRepository } from '@/lib/storage/vocabularyRepository';
import { getSpeakingStats, getAllSpeakingSubmissions } from '@/lib/storage/speakingRepository';
import { SpeakingSubmission } from '@/types/speaking';
import { listeningRepository } from '@/lib/storage/listeningRepository';
import { ListeningSubmission } from '@/types/listening';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [writingSubs, setWritingSubs] = useState<WritingSubmission[]>([]);
  const [readingSubs, setReadingSubs] = useState<ReadingSubmission[]>([]);
  const [speakingSubs, setSpeakingSubs] = useState<SpeakingSubmission[]>([]);
  const [listeningSubs, setListeningSubs] = useState<ListeningSubmission[]>([]);
  const [vocabCount, setVocabCount] = useState(0);
  const [speakingCount, setSpeakingCount] = useState(0);

  useEffect(() => {
    writingRepository.getUserProfile().then(setProfile);
    writingRepository.getAllSubmissions().then(setWritingSubs);
    readingRepository.getAllSubmissions().then(setReadingSubs);
    vocabularyRepository.getStats().then((s) => setVocabCount(s.total));
    getSpeakingStats().then((s) => setSpeakingCount(s.totalCount));
    getAllSpeakingSubmissions().then(setSpeakingSubs);
    listeningRepository.getAllSubmissions().then(setListeningSubs);
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

  // 평균 Speaking Band 계산
  const speakingBands = speakingSubs
    .filter((s) => s.evaluation?.overall_band)
    .map((s) => s.evaluation.overall_band);
  const avgSpeakingBand =
    speakingBands.length > 0
      ? (speakingBands.reduce((a, b) => a + b, 0) / speakingBands.length).toFixed(1)
      : '5.5';

  // 평균 Listening Band 계산
  const listeningBands = listeningSubs.map((s) => s.bandScore);
  const avgListeningBand =
    listeningBands.length > 0
      ? (listeningBands.reduce((a, b) => a + b, 0) / listeningBands.length).toFixed(1)
      : '5.5';

  // 전체 4개 과목 종합 평균 추정 밴드 (Writing, Reading, Speaking, Listening)
  const validBandAverages = [
    writingBands.length > 0 ? parseFloat(avgWritingBand) : null,
    readingBands.length > 0 ? parseFloat(avgReadingBand) : null,
    speakingBands.length > 0 ? parseFloat(avgSpeakingBand) : null,
    listeningBands.length > 0 ? parseFloat(avgListeningBand) : null,
  ].filter((b): b is number => b !== null);

  const overallAvgBand =
    validBandAverages.length > 0
      ? (validBandAverages.reduce((a, b) => a + b, 0) / validBandAverages.length).toFixed(1)
      : ((parseFloat(avgWritingBand) + parseFloat(avgReadingBand) + parseFloat(avgSpeakingBand) + parseFloat(avgListeningBand)) / 4).toFixed(1);

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
            IELTS 공식 4개 영역(Writing, Reading, Speaking, Listening)을 실전 시험과 동일한 타이머 및 오디오 플레이어로 완벽하게 대비하세요.
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
              href="/speaking/lab"
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/30 hover:bg-rose-700 transition-all"
            >
              <Mic className="h-4 w-4" />
              <span>Speaking Lab (대화 & 피드백)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/listening/lab"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all"
            >
              <Headphones className="h-4 w-4" />
              <span>Listening Lab (실전 오디오)</span>
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Target Band */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              목표 밴드 (Target)
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Target className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-slate-900">
              {targetBand.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">Band</span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">캐나다 EE / 호주 이민 안정권</p>
        </div>

        {/* Card 2: Current Estimated Band */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              종합 실력 (Overall)
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Trophy className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-amber-600">
              {overallAvgBand}
            </span>
            <span className="text-xs text-slate-400">Band</span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">{descriptor.levelTitle}</p>
        </div>

        {/* Card 3: Writing Avg */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Writing 평균
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <PenTool className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-indigo-600">
              {avgWritingBand}
            </span>
            <span className="text-xs text-slate-400">
              ({writingSubs.length}회)
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">4대 기준 AI 첨삭</p>
        </div>

        {/* Card 4: Reading Avg */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Reading 평균
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <BookOpen className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-600">
              {avgReadingBand}
            </span>
            <span className="text-xs text-slate-400">
              ({readingSubs.length}회)
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">실전 환산표 기준</p>
        </div>

        {/* Card 5: Speaking Avg */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Speaking 평균
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Mic className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-rose-600">
              {avgSpeakingBand}
            </span>
            <span className="text-xs text-slate-400">
              ({speakingSubs.length}회)
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">4대 영역 AI 피드백</p>
        </div>

        {/* Card 6: Listening Avg */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Listening 평균
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Headphones className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-black text-amber-600">
              {avgListeningBand}
            </span>
            <span className="text-xs text-slate-400">
              ({listeningSubs.length}회)
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500">실전 오디오 채점</p>
        </div>
      </div>

      {/* Band 5.0 -> 7.0 Roadmap Milestone Stepper */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Band 5.0 → 7.0 단계별 4개 영역 통합 도약 로드맵
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Writing, Reading, Speaking, Listening 4대 영역의 핵심 감점 요인을 제거하세요.
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
              필수 단어 수 & 기본 단락 분리
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Writing Task 1 (150단어), Task 2 (250단어) 미달 감점 방지</li>
              <li>Speaking Part 1 친숙한 일상 토픽 45초 답변 습관화</li>
              <li>Listening Part 1 폼/단문 빈칸 완성 단어 스펠링 무오류 훈련</li>
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
              복문(Complex) & Paraphrasing
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>관계사절, 조건문, 분사구문 등 복문 전개 훈련</li>
              <li>Speaking Part 2 Cue card 2분 롱턴 스피치 완주</li>
              <li>Listening Part 2 & 3 객관식 선지 패러프레이징 키워드 캐칭</li>
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
              고급 Collocation & 트랩 극복
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>원어민스러운 연어(Collocation) 및 정교한 어휘 구사</li>
              <li>Speaking Part 3 심층 토론 및 유창성/담화표지어 마스터</li>
              <li>Listening Part 4 학술 독백 1단어 완성 및 채점관 함정(Distractor) 판별</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recent Submissions History (Writing, Reading, Speaking, Listening) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Writing History */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PenTool className="h-4 w-4 text-blue-600" />
              최근 Writing 첨삭 이력
            </h3>
            <Link href="/writing" className="text-xs font-semibold text-blue-600 hover:underline">
              전체
            </Link>
          </div>

          {writingSubs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              아직 작성한 Writing 답안이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {writingSubs.slice(0, 3).map((sub) => (
                <Link
                  key={sub.id}
                  href={`/writing/${sub.topicId}/result/${sub.id}`}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3 transition-all hover:bg-blue-50/50 hover:border-blue-200 border border-slate-100"
                >
                  <div className="max-w-[70%]">
                    <span className="text-[10px] font-bold text-blue-600">
                      {sub.taskType === 'TASK_1' ? 'Task 1' : 'Task 2'}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {sub.essayText.slice(0, 40)}...
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {sub.wordCount}단어 • {new Date(sub.submittedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {sub.evaluation ? (
                      <span className="rounded-lg bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                        Band {sub.evaluation.overallBand.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">제출됨</span>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Reading History */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              최근 Reading 풀이 이력
            </h3>
            <Link href="/reading" className="text-xs font-semibold text-emerald-600 hover:underline">
              전체
            </Link>
          </div>

          {readingSubs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              아직 응시한 Reading 테스트가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {readingSubs.slice(0, 3).map((sub) => (
                <Link
                  key={sub.id}
                  href={`/reading/${sub.testId}/result/${sub.id}`}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3 transition-all hover:bg-emerald-50/50 hover:border-emerald-200 border border-slate-100"
                >
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700">
                      Reading Test
                    </span>
                    <p className="text-xs font-semibold text-slate-800">
                      정답: {sub.score} / {sub.totalQuestions}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(sub.submittedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="rounded-lg bg-emerald-700 px-2 py-0.5 text-xs font-bold text-white">
                      Band {sub.estimatedBand.toFixed(1)}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Speaking History */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Mic className="h-4 w-4 text-rose-600" />
              최근 Speaking 대화 이력
            </h3>
            <Link href="/speaking/lab" className="text-xs font-semibold text-rose-600 hover:underline">
              이동
            </Link>
          </div>

          {speakingSubs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              아직 진행한 Speaking 대화가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {speakingSubs.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3 transition-all hover:bg-rose-50/50 hover:border-rose-200 border border-slate-100"
                >
                  <div className="max-w-[70%]">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-rose-600 uppercase">
                        {sub.part}
                      </span>
                      {sub.isKoreanResponse && (
                        <span className="rounded bg-indigo-100 px-1 text-[8px] font-bold text-indigo-700">
                          한국어변환
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {sub.questionText}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(sub.submittedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="rounded-lg bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                      Band {sub.evaluation.overall_band.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Listening History (New) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Headphones className="h-4 w-4 text-amber-600" />
              최근 Listening 풀이 이력
            </h3>
            <Link href="/listening/lab" className="text-xs font-semibold text-amber-600 hover:underline">
              이동
            </Link>
          </div>

          {listeningSubs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              아직 응시한 Listening 테스트가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {listeningSubs.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 p-3 transition-all hover:bg-amber-50/50 hover:border-amber-200 border border-slate-100"
                >
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase">
                      {sub.section}
                    </span>
                    <p className="text-xs font-semibold text-slate-800">
                      정답: {sub.score} / {sub.totalQuestions}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(sub.submittedAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="rounded-lg bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                      Band {sub.bandScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
