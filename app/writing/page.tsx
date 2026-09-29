'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_WRITING_TOPICS } from '@/lib/mock-data/writingTopics';
import { TaskType, WritingTopic, WritingSubmission } from '@/types/writing';
import { writingRepository } from '@/lib/storage/writingRepository';
import {
  PenTool,
  Mail,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function WritingListPage() {
  const [selectedTab, setSelectedTab] = useState<'ALL' | TaskType>('ALL');
  const [submissions, setSubmissions] = useState<WritingSubmission[]>([]);

  useEffect(() => {
    writingRepository.getAllSubmissions().then((data) => {
      setSubmissions(data);
    });
  }, []);

  const filteredTopics = MOCK_WRITING_TOPICS.filter((topic) => {
    if (selectedTab === 'ALL') return true;
    return topic.taskType === selectedTab;
  });

  const getSubmissionsForTopic = (topicId: string) => {
    return submissions.filter((s) => s.topicId === topicId);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 text-white shadow-xl sm:p-10">
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>IELTS General Training Writing</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
            실전 Writing 모의고사 & AI 정밀 첨삭
          </h1>
          <p className="mt-3 text-sm text-blue-100 sm:text-base leading-relaxed">
            Task 1(실용 서신)과 Task 2(주제별 에세이) 기출 토픽을 실전 타이머 환경에서 연습하고,
            공식 4대 평가 기준(TA/TR, CC, LR, GRA)에 따른 즉시 채점과 문장 단위 Band 7+ 패러프레이징 제안을 받으세요.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm">
            <Link
              href="/writing/lab"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2 font-bold text-slate-900 shadow-lg hover:bg-amber-300 transition-all"
            >
              <Sparkles className="h-4 w-4 text-slate-950" />
              <span>실전 시험 화면(Writing Lab) 바로 입장하기</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-sm">
              <Mail className="h-4 w-4 text-amber-300" />
              <span>Task 1: 최소 150단어 (20분)</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-sm">
              <FileText className="h-4 w-4 text-emerald-300" />
              <span>Task 2: 최소 250단어 (40분)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedTab('ALL')}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              selectedTab === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            전체 토픽 ({MOCK_WRITING_TOPICS.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('TASK_1')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              selectedTab === 'TASK_1'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Mail className="h-4 w-4" />
            Task 1 (서신 작성)
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab('TASK_2')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              selectedTab === 'TASK_2'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            Task 2 (에세이)
          </button>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTopics.map((topic) => {
          const topicSubs = getSubmissionsForTopic(topic.id);
          const latestSub = topicSubs[0];
          const isTask1 = topic.taskType === 'TASK_1';

          return (
            <div
              key={topic.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-300"
            >
              <div>
                {/* Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        isTask1
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {isTask1 ? <Mail className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                      {isTask1 ? 'Task 1 (Letter)' : 'Task 2 (Essay)'}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {topic.tone || topic.essayType}
                    </span>
                  </div>

                  {topic.sampleAnswers && topic.sampleAnswers.length > 0 && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                      모범답안 수록
                    </span>
                  )}
                </div>

                {/* Title & Preview */}
                <h3 className="text-base font-bold text-slate-900 line-clamp-2 mb-2">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed font-serif bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {topic.prompt}
                </p>

                {/* Metadata info */}
                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {topic.timeLimitMinutes}분 제한
                  </span>
                  <span className="flex items-center gap-1">
                    <PenTool className="h-3.5 w-3.5 text-slate-400" />
                    최소 {topic.targetWordCount.min}단어
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-slate-100 pt-4">
                {latestSub ? (
                  <div className="mb-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500">최근 응시: {latestSub.wordCount}단어</span>
                    {latestSub.evaluation ? (
                      <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Band {latestSub.evaluation.overallBand.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-amber-600">채점 진행 전</span>
                    )}
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <Link
                    href={`/writing/${topic.id}/practice`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    <span>{latestSub ? '다시 쓰기' : '실전 작성 시작'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {latestSub && (
                    <Link
                      href={`/writing/${topic.id}/result/${latestSub.id}`}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      title="최근 첨삭 리포트 열람"
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
