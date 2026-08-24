export interface Skill {
    id: string
    name: string
    icon: string
    color: string
    level: number
    xp: number
    xpToNext: number
    totalXP: number
    streak: number
    lastUpdated: string
    questsCompleted: number
    createdAt: string
    updatedAt: string
}

export interface SkillStore {
    skills: Skill[]
    addSkill: (skill: Omit<Skill, 'id' | 'level' | 'xp' | 'xpToNext' | 'totalXP' | 'streak' | 'lastUpdated' | 'questsCompleted' | 'createdAt' | 'updatedAt'>) => void;
    updateSkill: (id: string, updates: Partial<Skill>) => void;
    deleteSkill: (id: string) => void;
    addXP: (skillId: string, amount: number) => void;
    subtractXP: (skillId: string, amount: number) => void;
    addXPFromQuest: (skillId: string, amount: number, questId: string) => void; // NEW
    getSkillById: (id: string) => Skill | undefined;
}
