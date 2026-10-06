'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  PenTool,
  Trophy,
  Settings,
  Flame,
  Key,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Bookmark,
  Mic,
} from 'lucide-react';
import { writingRepository } from '@/lib/storage/writingRepository';
import { vocabularyRepository } from '@/lib/storage/vocabularyRepository';

export default function Navbar() {
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [targetBand, setTargetBand] = useState(7.0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    writingRepository.getUserProfile().then((profile) => {
      if (profile.customGeminiApiKey) setApiKey(profile.customGeminiApiKey);
      if (profile.targetBand) setTargetBand(profile.targetBand);
    });
    vocabularyRepository.getStats().then((s) => setSavedCount(s.total));
  }, [pathname]);

  const handleSaveSettings = async () => {
    await writingRepository.updateUserProfile({
      customGeminiApiKey: apiKey.trim(),
      targetBand: Number(targetBand),
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowSettings(false);
    }, 1200);
  };

  const navLinks = [
    { href: '/', label: '대시보드', icon: Trophy },
    { href: '/writing/lab', label: 'Writing Lab', icon: Sparkles },
    { href: '/reading/lab', label: 'Reading Lab', icon: BookOpen },
    { href: '/speaking/lab', label: 'Speaking Lab', icon: Mic },
    { href: '/vocabulary', label: '단어장', icon: Bookmark, badge: savedCount > 0 ? savedCount : null },
    { href: '/writing', label: 'Writing 토픽', icon: PenTool },
    { href: '/reading', label: 'Reading 세트', icon: BookOpen },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
                <span className="text-base sm:text-lg">GT</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  IELTS<span className="text-blue-600">Master</span>
                </span>
                <span className="ml-1.5 hidden md:inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  General Band 7+
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-0.5 sm:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : link.href === '/writing'
                  ? pathname === '/writing'
                  : link.href === '/reading'
                  ? pathname === '/reading'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  className={`flex items-center gap-1.5 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden md:inline">{link.label}</span>
                  {link.badge != null && (
                    <span className="rounded-full bg-blue-600 px-1.5 py-0.2 font-mono text-[9px] sm:text-[10px] font-bold text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
              <Flame className="h-3.5 w-3.5 text-amber-600" />
              <span>목표 Band {targetBand.toFixed(1)}</span>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              title="설정 및 API 키 관리"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                학습 목표 및 API 설정
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-400 hover:text-slate-600 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Target Band */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  목표 IELTS Band Score
                </label>
                <select
                  value={targetBand}
                  onChange={(e) => setTargetBand(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none"
                >
                  <option value={6.0}>Band 6.0 (기본 정착 기준)</option>
                  <option value={6.5}>Band 6.5 (안정적 합격선)</option>
                  <option value={7.0}>Band 7.0 (이민/취업 핵심 목표)</option>
                  <option value={7.5}>Band 7.5 (고득점 우대)</option>
                  <option value={8.0}>Band 8.0+ (최고 수준 완성)</option>
                </select>
              </div>

              {/* Gemini API Key */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Key className="h-4 w-4 text-slate-500" />
                  Gemini API Key (선택)
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none font-mono"
                />
                <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" />
                  비워두면 서버 기본 환경 변수(`GEMINI_API_KEY`)를 사용합니다.
                </p>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle className="h-4 w-4" />
                  설정이 안전하게 저장되었습니다!
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm"
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
