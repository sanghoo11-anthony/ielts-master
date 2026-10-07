'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ListeningDialogueTurn } from '@/types/listening';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  Headphones,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ListeningAudioPlayerProps {
  dialogue: ListeningDialogueTurn[];
  title: string;
  sectionNumber: number;
  currentTurnIndex: number;
  onTurnChange: (index: number) => void;
  onAudioComplete: () => void;
  isExamMode: boolean;
}

export default function ListeningAudioPlayer({
  dialogue,
  title,
  sectionNumber,
  currentTurnIndex,
  onTurnChange,
  onAudioComplete,
  isExamMode,
}: ListeningAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const currentTurnRef = useRef(0);
  const rateRef = useRef(1.0);

  useEffect(() => {
    rateRef.current = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    currentTurnRef.current = currentTurnIndex;
  }, [currentTurnIndex]);

  // Load available TTS voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Pick suitable voice based on speaker gender and accent
  const getVoiceForTurn = (turn: ListeningDialogueTurn): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null;

    // Filter by English voices
    const enVoices = voices.filter((v) => v.lang.startsWith('en'));
    if (enVoices.length === 0) return voices[0] || null;

    // Preference for British (en-GB) or Australian (en-AU)
    const britishVoices = enVoices.filter((v) => v.lang.includes('GB') || v.lang.includes('uk'));
    const australianVoices = enVoices.filter((v) => v.lang.includes('AU'));
    const candidateVoices =
      turn.accent === 'en-AU' && australianVoices.length > 0
        ? australianVoices
        : britishVoices.length > 0
        ? britishVoices
        : enVoices;

    // Try gender matching based on common voice names
    const femaleNames = ['samantha', 'victoria', 'karen', 'moira', 'fiona', 'serena', 'zira', 'amy'];
    const maleNames = ['daniel', 'oliver', 'george', 'arthur', 'david', 'alex', 'james', 'thomas'];

    if (turn.gender === 'female') {
      const femaleVoice = candidateVoices.find((v) =>
        femaleNames.some((n) => v.name.toLowerCase().includes(n))
      );
      if (femaleVoice) return femaleVoice;
    } else {
      const maleVoice = candidateVoices.find((v) =>
        maleNames.some((n) => v.name.toLowerCase().includes(n))
      );
      if (maleVoice) return maleVoice;
    }

    return candidateVoices[0] || voices[0];
  };

  // Speak turn sequentially
  const speakTurn = (index: number) => {
    if (index >= dialogue.length) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      onAudioComplete();
      return;
    }

    const turn = dialogue[index];
    currentTurnRef.current = index;
    onTurnChange(index);

    const utterance = new SpeechSynthesisUtterance(turn.text);
    const selectedVoice = getVoiceForTurn(turn);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = turn.accent || 'en-GB';
    utterance.rate = isExamMode ? 1.0 : rateRef.current;
    utterance.pitch = turn.gender === 'female' ? 1.05 : 0.95;

    utterance.onend = () => {
      if (isPlayingRef.current) {
        // Natural pause between speaker turns (600ms)
        setTimeout(() => {
          if (isPlayingRef.current) {
            speakTurn(index + 1);
          }
        }, 650);
      }
    };

    utterance.onerror = (e) => {
      console.warn('TTS utterance error:', e);
      if (isPlayingRef.current && index + 1 < dialogue.length) {
        speakTurn(index + 1);
      } else {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      // In Exam mode, if already finished, don't allow replay
      if (isExamMode && hasStartedPlaying && currentTurnIndex >= dialogue.length - 1) {
        return;
      }

      setHasStartedPlaying(true);
      setIsPlaying(true);
      isPlayingRef.current = true;
      speakTurn(currentTurnIndex);
    }
  };

  const handleReset = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isExamMode && hasStartedPlaying) return; // Exam mode prevents restart

    window.speechSynthesis.cancel();
    setIsPlaying(false);
    isPlayingRef.current = false;
    onTurnChange(0);
  };

  const progressPercent = Math.min(
    100,
    Math.round(((currentTurnIndex + 1) / dialogue.length) * 100)
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20">
            <Headphones className="h-6 w-6" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                Section {sectionNumber}
              </span>
              {isExamMode ? (
                <span className="rounded-md bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
                  실전 1회 시험 모드
                </span>
              ) : (
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                  트레이닝 모드
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1 line-clamp-1">
              {title}
            </h4>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          {/* Speed Selector (Training mode only) */}
          {!isExamMode && (
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs">
              <Gauge className="h-3.5 w-3.5 text-slate-500" />
              {[0.85, 1.0, 1.15].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`rounded px-1.5 py-0.5 font-bold transition-colors ${
                    playbackRate === rate
                      ? 'bg-amber-500 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          )}

          {/* Reset / Rewind (Training mode only) */}
          {!isExamMode && (
            <button
              onClick={handleReset}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              title="처음부터 다시 듣기"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          {/* Main Play / Pause Button */}
          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-orange-500/25'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 fill-white" />
                <span>일시정지</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>{hasStartedPlaying ? '이어듣기' : '음원 재생'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress & Waveform Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-mono">
          <span>
            화자 턴: {currentTurnIndex + 1} / {dialogue.length}
          </span>
          <span>진행률: {progressPercent}%</span>
        </div>

        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Live Audio Visualizer Bars */}
        {isPlaying && (
          <div className="mt-2 flex items-center justify-center gap-1 h-3">
            {[40, 80, 20, 95, 60, 30, 75, 45, 90, 35, 70, 50, 85, 25].map((h, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-amber-400 animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDelay: `${(i * 0.08).toFixed(2)}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
