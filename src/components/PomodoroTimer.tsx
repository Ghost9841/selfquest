// src/components/PomodoroTimer.tsx

import { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Flame, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTimerStore, type TimerMode } from '@/store/timer.store';
import { useSkillStore } from '@/store/skill.store';
import { useHeroState } from '@/store/hero.store';
import type { Quest } from '@/types/quest.types';
import type { Skill } from '@/types/skill.types';

interface PomodoroTimerProps {
  quests: Quest[];
  skills: Skill[];
  onLevelUp?: (name: string, level: number, icon: string, color: string) => void;
}

export function PomodoroTimer({ quests, skills, onLevelUp }: PomodoroTimerProps) {
  const {
    activeQuestId,
    mode,
    durationSeconds,
    remainingSeconds,
    isRunning,
    sessionsCompleted,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    setMode,
    tick,
    addMinutes,
  } = useTimerStore();

  const { addXP } = useSkillStore();
  const { addHeroXP } = useHeroState();
  const [sessionRewardClaimed, setSessionRewardClaimed] = useState(false);

  // Interval ticker
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        const justFinished = tick();
        if (justFinished) {
          setSessionRewardClaimed(false);
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

  const activeQuest = quests.find((q) => q.id === activeQuestId);
  const activeSkill = activeQuest ? skills.find((s) => s.id === activeQuest.skillId) : null;

  // Format time mm:ss
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress percentage
  const progressPercent = durationSeconds > 0 
    ? Math.min(100, Math.max(0, ((durationSeconds - remainingSeconds) / durationSeconds) * 100))
    : 0;

  // Handle claiming bonus XP when a focus session finishes
  const handleClaimFocusXP = () => {
    // 1. Award 15 XP to the Hero
    addHeroXP(15);

    // 2. Award 15 XP to the active Skill
    if (activeQuest && activeSkill) {
      addXP(activeSkill.id, 15, onLevelUp);
    } else if (skills.length > 0) {
      addXP(skills[0].id, 15, onLevelUp);
    }
    setSessionRewardClaimed(true);
  };

  const modeColors: Record<TimerMode, { border: string; glow: string; text: string; bg: string }> = {
    work: {
      border: 'border-purple-500/40',
      glow: 'shadow-purple-500/20',
      text: 'text-purple-400',
      bg: 'from-purple-600/20 to-indigo-600/10',
    },
    break: {
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
      text: 'text-emerald-400',
      bg: 'from-emerald-600/20 to-teal-600/10',
    },
    longBreak: {
      border: 'border-blue-500/40',
      glow: 'shadow-blue-500/20',
      text: 'text-blue-400',
      bg: 'from-blue-600/20 to-cyan-600/10',
    },
  };

  const currentColor = modeColors[mode];

  return (
    <div className="space-y-4">
      {/* Main Glassmorphic Timer Card */}
      <div className={`relative overflow-hidden rounded-2xl border ${currentColor.border} bg-gradient-to-b ${currentColor.bg} p-6 backdrop-blur-2xl shadow-2xl transition-all duration-300`}>
        {/* Ambient background glow */}
        <div
          className={`pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full blur-3xl opacity-30 transition-all ${
            mode === 'break' ? 'bg-emerald-500' : 'bg-purple-600'
          }`}
        />

        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-black/30 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMode('work', 25)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              mode === 'work'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚔️ Focus (25m)
          </button>
          <button
            type="button"
            onClick={() => setMode('break', 5)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              mode === 'break'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ☕ Break (5m)
          </button>
          <button
            type="button"
            onClick={() => setMode('longBreak', 15)}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              mode === 'longBreak'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🌴 Rest (15m)
          </button>
        </div>

        {/* Linked Quest Header */}
        <div className="mt-4 text-center">
          {activeQuest ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1 backdrop-blur-md">
              <span className="text-xs text-gray-300 font-medium">Quest:</span>
              <span className="text-xs font-semibold text-white truncate max-w-[200px]">
                {activeQuest.title}
              </span>
              {activeSkill && (
                <span className="text-xs font-medium text-purple-300">
                  ({activeSkill.icon} +{activeQuest.xpReward} XP)
                </span>
              )}
            </div>
          ) : (
            <div className="text-xs text-gray-400">
              {quests.filter((q) => q.status === 'active').length > 0 ? (
                <select
                  value={activeQuestId || ''}
                  onChange={(e) => {
                    const selected = quests.find((q) => q.id === e.target.value);
                    if (selected) {
                      startTimer(selected.id, selected.title, selected.allocatedMinutes || 25);
                    }
                  }}
                  className="rounded-lg border border-white/15 bg-white/[0.05] px-2.5 py-1 text-xs text-gray-300 outline-none focus:border-purple-400"
                >
                  <option value="" className="bg-[#121124] text-gray-400">
                    -- Select Quest to Focus On --
                  </option>
                  {quests
                    .filter((q) => q.status === 'active')
                    .map((q) => (
                      <option key={q.id} value={q.id} className="bg-[#121124] text-white">
                        {q.title} ({q.allocatedMinutes || 25}m)
                      </option>
                    ))}
                </select>
              ) : (
                <span>General Focus Session</span>
              )}
            </div>
          )}
        </div>

        {/* Circular Countdown Display */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="relative flex h-52 w-52 items-center justify-center">
            {/* SVG Ring */}
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="5"
                fill="transparent"
                className="text-white/10"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={276.46}
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                className={`transition-all duration-500 ${
                  mode === 'break' ? 'text-emerald-400' : 'text-purple-400'
                }`}
              />
            </svg>

            {/* Inner Center Display */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
                {timeFormatted}
              </span>
              <span className="mt-1 text-xs font-semibold tracking-wider uppercase text-gray-400">
                {mode === 'work' ? 'Deep Focus' : 'Recovery'}
              </span>

              {/* Adjust minutes buttons */}
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => addMinutes(-5)}
                  className="rounded-md border border-white/10 bg-white/5 p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                  title="-5 Minutes"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="text-[11px] text-gray-400 font-mono">±5m</span>
                <button
                  type="button"
                  onClick={() => addMinutes(5)}
                  className="rounded-md border border-white/10 bg-white/5 p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                  title="+5 Minutes"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="h-11 w-11 rounded-full border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white shadow-md"
            title="Reset Timer"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          {isRunning ? (
            <Button
              type="button"
              onClick={pauseTimer}
              className="h-13 w-28 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-lg shadow-amber-600/30 border border-amber-400/30"
            >
              <Pause className="mr-2 h-5 w-5 fill-current" />
              Pause
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => (remainingSeconds < durationSeconds && remainingSeconds > 0 ? resumeTimer() : startTimer())}
              className={`h-13 w-28 rounded-full font-bold shadow-lg text-white border ${
                mode === 'break'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/30 border-emerald-400/30'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30 border-purple-400/30'
              }`}
            >
              <Play className="mr-2 h-5 w-5 fill-current" />
              {remainingSeconds < durationSeconds && remainingSeconds > 0 ? 'Resume' : 'Start'}
            </Button>
          )}
        </div>

        {/* Sessions Completed Badge */}
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-orange-400" />
            <span>Focus Sessions Today:</span>
            <span className="font-bold text-white">{sessionsCompleted}</span>
          </div>
          <span className="text-[11px] text-gray-400">
            Icon badge active on toolbar
          </span>
        </div>
      </div>

      {/* Completion Banner if Timer just finished */}
      {remainingSeconds === 0 && !isRunning && (
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-4 backdrop-blur-xl shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">Focus Session Complete! 🎉</p>
              <p className="text-xs text-emerald-300">
                You maintained deep focus. Ready to claim +15 Focus XP?
              </p>
            </div>
          </div>
          {!sessionRewardClaimed ? (
            <Button
              onClick={handleClaimFocusXP}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shrink-0"
            >
              Claim +15 XP
            </Button>
          ) : (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Claimed!
            </span>
          )}
        </div>
      )}
    </div>
  );
}
