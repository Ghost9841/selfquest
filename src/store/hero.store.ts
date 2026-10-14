import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type HeroStore } from '../types/hero.types';
import { nanoid } from 'nanoid';

export const useHeroState = create<HeroStore>()(
  persist(
    (set) => ({
      hero: null,
      setHeroName: (name: string) =>
        set({
          hero: {
            id: nanoid(),
            name: name,
            avatar: '👻',
            totalXP: 0,
            level: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }),
      addHeroXP: (amount: number, onHeroLevelUp?: (newLevel: number) => void) => {
        set((state) => {
          if (!state.hero) return state;

          const newTotalXP = state.hero.totalXP + amount;
          // Every 100 XP is 1 Hero level (Lv 1: 0-99, Lv 2: 100-199, etc.)
          const newLevel = Math.max(1, Math.floor(newTotalXP / 100) + 1);
          const leveledUp = newLevel > state.hero.level;

          if (leveledUp && onHeroLevelUp) {
            onHeroLevelUp(newLevel);
          }

          return {
            hero: {
              ...state.hero,
              totalXP: newTotalXP,
              level: newLevel,
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },
      resetHero: () => set({ hero: null }),
    }),
    {
      name: 'hero-storage',
    }
  )
);