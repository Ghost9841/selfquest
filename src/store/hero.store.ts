import { create } from 'zustand';
import {persist} from 'zustand/middleware'
import { type HeroStore } from '../types/hero.types';
import { nanoid } from 'nanoid';


export const useHeroState = create<HeroStore>()(
    persist(
        (set) => ({
            hero: null,
            setHeroName: (name: string) => set({ 
                hero: { 
                    id: nanoid(),
                    name: name,
                    avatar: '👻',
                    totalXP: 0,
                    level: 1,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                 } }),
            resetHero: () => set({ hero: null }),
        }),
        {
            name: 'hero-storage',
        }
    )

)