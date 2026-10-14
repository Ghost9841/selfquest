// src/store/timer.store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startTimerService, stopTimerService, setBadge, playChimeSound } from '@/utils/extensionBridge';

export type TimerMode = 'work' | 'break' | 'longBreak';

export interface TimerStore {
  activeQuestId: string | null;
  activeQuestTitle: string | null;
  mode: TimerMode;
  durationSeconds: number;
  remainingSeconds: number;
  endTime: number | null;
  isRunning: boolean;
  sessionsCompleted: number;

  startTimer: (questId?: string, questTitle?: string, customMinutes?: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  setMode: (mode: TimerMode, durationMinutes?: number) => void;
  tick: () => boolean; // returns true if just finished
  addMinutes: (mins: number) => void;
}

const DEFAULT_DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      activeQuestId: null,
      activeQuestTitle: null,
      mode: 'work',
      durationSeconds: 25 * 60,
      remainingSeconds: 25 * 60,
      endTime: null,
      isRunning: false,
      sessionsCompleted: 0,

      startTimer: (questId, questTitle, customMinutes) => {
        const state = get();
        const durationSec = customMinutes ? customMinutes * 60 : (state.durationSeconds || 25 * 60);
        const targetEndTime = Date.now() + durationSec * 1000;

        playChimeSound('focus-start');
        startTimerService(targetEndTime, state.mode === 'work' ? 'work' : 'break', questTitle || state.activeQuestTitle || undefined);

        set({
          activeQuestId: questId !== undefined ? questId : state.activeQuestId,
          activeQuestTitle: questTitle !== undefined ? questTitle : state.activeQuestTitle,
          durationSeconds: durationSec,
          remainingSeconds: durationSec,
          endTime: targetEndTime,
          isRunning: true,
        });

        const mins = Math.ceil(durationSec / 60);
        setBadge(`${mins}m`, state.mode === 'work' ? '#8B5CF6' : '#10B981');
      },

      pauseTimer: () => {
        const state = get();
        if (!state.isRunning) return;

        const remaining = state.endTime ? Math.max(0, Math.round((state.endTime - Date.now()) / 1000)) : state.remainingSeconds;
        stopTimerService();

        set({
          isRunning: false,
          remainingSeconds: remaining,
          endTime: null,
        });

        const mins = Math.ceil(remaining / 60);
        setBadge(mins > 0 ? `${mins}m` : '', '#6B7280');
      },

      resumeTimer: () => {
        const state = get();
        if (state.isRunning || state.remainingSeconds <= 0) return;

        const targetEndTime = Date.now() + state.remainingSeconds * 1000;
        startTimerService(targetEndTime, state.mode === 'work' ? 'work' : 'break', state.activeQuestTitle || undefined);

        set({
          isRunning: true,
          endTime: targetEndTime,
        });

        const mins = Math.ceil(state.remainingSeconds / 60);
        setBadge(`${mins}m`, state.mode === 'work' ? '#8B5CF6' : '#10B981');
      },

      resetTimer: () => {
        const state = get();
        stopTimerService();
        setBadge('', '#8B5CF6');

        set({
          isRunning: false,
          endTime: null,
          remainingSeconds: state.durationSeconds,
        });
      },

      setMode: (newMode, durationMinutes) => {
        stopTimerService();
        const durSec = durationMinutes ? durationMinutes * 60 : DEFAULT_DURATIONS[newMode];
        setBadge('', '#8B5CF6');

        set({
          mode: newMode,
          durationSeconds: durSec,
          remainingSeconds: durSec,
          endTime: null,
          isRunning: false,
        });
      },

      tick: () => {
        const state = get();
        if (!state.isRunning) return false;

        if (!state.endTime) return false;

        const diffSeconds = Math.round((state.endTime - Date.now()) / 1000);

        if (diffSeconds <= 0) {
          stopTimerService();
          playChimeSound('focus-end');
          setBadge('DONE', '#10B981');

          set({
            isRunning: false,
            endTime: null,
            remainingSeconds: 0,
            sessionsCompleted: state.mode === 'work' ? state.sessionsCompleted + 1 : state.sessionsCompleted,
          });
          return true;
        }

        set({ remainingSeconds: diffSeconds });
        const mins = Math.ceil(diffSeconds / 60);
        setBadge(`${mins}m`, state.mode === 'work' ? '#8B5CF6' : '#10B981');
        return false;
      },

      addMinutes: (mins) => {
        const state = get();
        const addedSec = mins * 60;
        const newDuration = Math.max(60, state.durationSeconds + addedSec);
        let newRemaining = Math.max(0, state.remainingSeconds + addedSec);
        let newEndTime = state.endTime;

        if (state.isRunning && state.endTime) {
          newEndTime = state.endTime + addedSec * 1000;
          startTimerService(newEndTime, state.mode === 'work' ? 'work' : 'break', state.activeQuestTitle || undefined);
        }

        set({
          durationSeconds: newDuration,
          remainingSeconds: newRemaining,
          endTime: newEndTime,
        });

        if (state.isRunning) {
          setBadge(`${Math.ceil(newRemaining / 60)}m`, state.mode === 'work' ? '#8B5CF6' : '#10B981');
        }
      },
    }),
    {
      name: 'selfquest-timer-storage',
    }
  )
);
