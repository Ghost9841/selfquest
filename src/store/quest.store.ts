// src/store/questStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Quest, QuestStore } from '@/types/quest.types';
import { scheduleReminder, cancelReminder } from '@/utils/extensionBridge';

export const useQuestStore = create<QuestStore>()(
  persist(
    (set, get) => ({
      quests: [],

      addQuest: (questData) => {
        const newQuest: Quest = {
          ...questData,
          id: nanoid(),
          status: 'active',
          allocatedMinutes: questData.allocatedMinutes || 25,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completedAt: undefined,
        };

        if (newQuest.reminderTime) {
          scheduleReminder(newQuest.id, newQuest.reminderTime, newQuest.title, newQuest.xpReward);
        }

        set((state) => ({
          quests: [...state.quests, newQuest]
        }));
      },

      updateQuest: (id, updates) => {
        set((state) => ({
          quests: state.quests.map((quest) => {
            if (quest.id !== id) return quest;
            const updated = { ...quest, ...updates, updatedAt: new Date().toISOString() };
            if (updates.reminderTime) {
              scheduleReminder(updated.id, updates.reminderTime, updated.title, updated.xpReward);
            }
            return updated;
          })
        }));
      },

      deleteQuest: (id) => {
        cancelReminder(id);
        set((state) => ({
          quests: state.quests.filter((quest) => quest.id !== id)
        }));
      },

      completeQuest: (id) => {
        cancelReminder(id);
        const today = new Date().toISOString().split('T')[0];

        set((state) => {
          const quest = state.quests.find((q) => q.id === id);
          if (!quest) return state;

          if (quest.status === 'completed') return state;

          const updatedQuest: Quest = {
            ...quest,
            status: 'completed',
            lastCompletedDate: today,
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            quests: state.quests.map((q) => (q.id === id ? updatedQuest : q)),
          };
        });
      },

      // Automatically reset repeatable quests when a new day arrives
      checkDailyReset: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          quests: state.quests.map((quest) => {
            if (quest.repeatable && quest.status === 'completed' && quest.lastCompletedDate !== today) {
              return {
                ...quest,
                status: 'active',
                completedAt: undefined,
                updatedAt: new Date().toISOString(),
              };
            }
            return quest;
          }),
        }));
      },

      getQuestById: (id) => {
        return get().quests.find((q) => q.id === id);
      },

      getQuestsBySkill: (skillId) => {
        return get().quests.filter((q) => q.skillId === skillId);
      },

      getQuestsByStatus: (status) => {
        return get().quests.filter((q) => q.status === status);
      },
    }),
    {
      name: 'quest-storage',
    }
  )
);