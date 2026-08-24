// src/store/skillStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { calculateXPToNext, checkLevelUp } from '../utils/xpCalculator';
import type { Skill, SkillStore } from '@/types/skill.types';

// Default icons for skills
export const SKILL_ICONS = [
    '💻', '📚', '💪', '🎨', '🗣️', '🧠',
    '🎵', '✍️', '🧘', '🏃', '🎯', '🌱'
];

export const SKILL_COLORS = [
    '#4F46E5', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
];

export const useSkillStore = create<SkillStore>()(
    persist(
        (set, get) => ({
            skills: [],

            addSkill: (skillData) => {
                const newSkill: Skill = {
                    ...skillData,
                    id: nanoid(),
                    level: 1,
                    xp: 0,
                    xpToNext: calculateXPToNext(1),
                    totalXP: 0,
                    streak: 0,
                    lastUpdated: new Date().toISOString().split('T')[0],
                    questsCompleted: 0,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                set((state) => ({
                    skills: [...state.skills, newSkill]
                }));
            },

            updateSkill: (id, updates) => {
                set((state) => ({
                    skills: state.skills.map((skill) =>
                        skill.id === id
                            ? { ...skill, ...updates, updatedAt: new Date().toISOString() }
                            : skill
                    )
                }));
            },

            deleteSkill: (id) => {
                set((state) => ({
                    skills: state.skills.filter((skill) => skill.id !== id)
                }));
            },

            addXP: (skillId, amount) => {
                set((state) => {
                    const skill = state.skills.find(s => s.id === skillId);
                    if (!skill) return state;

                    // Update streak
                    const today = new Date().toISOString().split('T')[0];
                    const lastDate = skill.lastUpdated;
                    let streak = skill.streak;

                    if (lastDate === today) {
                        // Already updated today
                        streak = skill.streak;
                    } else if (lastDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
                        // Yesterday — streak continues
                        streak = skill.streak + 1;
                    } else {
                        // Streak broken
                        streak = 1;
                    }

                    // Calculate new XP and level
                    let newXP = skill.xp + amount;
                    let newLevel = skill.level;
                    let xpToNext = skill.xpToNext;
                    let totalXP = skill.totalXP + amount;
                    let leveledUp = false;

                    const levelUpResult = checkLevelUp(newXP, xpToNext, newLevel);
                    newXP = levelUpResult.remainingXP;
                    newLevel = levelUpResult.newLevel;
                    xpToNext = levelUpResult.newXpToNext;
                    leveledUp = levelUpResult.leveledUp;

                    const updatedSkill = {
                        ...skill,
                        xp: newXP,
                        level: newLevel,
                        xpToNext: xpToNext,
                        totalXP: totalXP,
                        streak: streak,
                        lastUpdated: today,
                        updatedAt: new Date().toISOString(),
                    };

                    // If leveled up, show notification (we'll handle this in UI)
                    if (leveledUp) {
                        console.log(`🎉 ${skill.name} leveled up to ${newLevel}!`);
                    }

                    return {
                        skills: state.skills.map(s =>
                            s.id === skillId ? updatedSkill : s
                        ),
                    };
                });
            },

            subtractXP: (skillId, amount) => {
                set((state) => {
                    const skill = state.skills.find(s => s.id === skillId);
                    if (!skill) return state;

                    const newXP = Math.max(0, skill.xp - amount);

                    const updatedSkill = {
                        ...skill,
                        xp: newXP,
                        updatedAt: new Date().toISOString(),
                    };

                    return {
                        skills: state.skills.map(s =>
                            s.id === skillId ? updatedSkill : s
                        ),
                    };
                });
            },

            getSkillById: (id) => {
                return get().skills.find(s => s.id === id);
            },

            addXPFromQuest: (skillId: string, amount: number, questId: string) => {
                set((state) => {
                    const skill = state.skills.find(s => s.id === skillId);
                    if (!skill) return state;

                    // Update streak
                    const today = new Date().toISOString().split('T')[0];
                    const lastDate = skill.lastUpdated;
                    let streak = skill.streak;

                    if (lastDate === today) {
                        streak = skill.streak;
                    } else if (lastDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
                        streak = skill.streak + 1;
                    } else {
                        streak = 1;
                    }

                    // Calculate new XP and level
                    let newXP = skill.xp + amount;
                    let newLevel = skill.level;
                    let xpToNext = skill.xpToNext;
                    let totalXP = skill.totalXP + amount;
                    let leveledUp = false;

                    const levelUpResult = checkLevelUp(newXP, xpToNext, newLevel);
                    newXP = levelUpResult.remainingXP;
                    newLevel = levelUpResult.newLevel;
                    xpToNext = levelUpResult.newXpToNext;
                    leveledUp = levelUpResult.leveledUp;

                    const updatedSkill = {
                        ...skill,
                        xp: newXP,
                        level: newLevel,
                        xpToNext: xpToNext,
                        totalXP: totalXP,
                        streak: streak,
                        lastUpdated: today,
                        questsCompleted: skill.questsCompleted + 1,
                        updatedAt: new Date().toISOString(),
                    };

                    // If leveled up, log it (we'll show UI later)
                    if (leveledUp) {
                        console.log(`🎉 ${skill.name} leveled up to ${newLevel}!`);
                    }

                    // Also update hero total XP
                    // We'll add hero store integration later

                    return {
                        skills: state.skills.map(s =>
                            s.id === skillId ? updatedSkill : s
                        ),
                    };
                });
            },
        }),
        {
            name: 'skill-storage',
        }
    )
);