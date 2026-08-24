// src/store/questStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { Quest, QuestStore } from '@/types/quest.types';

export const useQuestStore = create<QuestStore>()(
  persist(
    (set, get) => ({
      quests: [],

      addQuest: (questData) => {
        const newQuest: Quest = {
          ...questData,
          id: nanoid(),
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          completedAt: undefined,
        };
        set((state) => ({
          quests: [...state.quests, newQuest]
        }));
      },

      updateQuest: (id, updates) => {
        set((state) => ({
          quests: state.quests.map((quest) =>
            quest.id === id 
              ? { ...quest, ...updates, updatedAt: new Date().toISOString() } 
              : quest
          )
        }));
      },

      deleteQuest: (id) => {
        set((state) => ({
          quests: state.quests.filter((quest) => quest.id !== id)
        }));
      },

      completeQuest: (id) => {
        set((state) => {
          const quest = state.quests.find(q => q.id === id);
          if (!quest) return state;

          // If already completed, do nothing
          if (quest.status === 'completed') return state;

          const updatedQuest: Quest = {
            ...quest,
            status: 'completed',
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            quests: state.quests.map(q =>
              q.id === id ? updatedQuest : q
            ),
          };
        });
      },

      getQuestById: (id) => {
        return get().quests.find(q => q.id === id);
      },

      getQuestsBySkill: (skillId) => {
        return get().quests.filter(q => q.skillId === skillId);
      },

      getQuestsByStatus: (status) => {
        return get().quests.filter(q => q.status === status);
      },
    }),
    {
      name: 'quest-storage',
    }
  )
);