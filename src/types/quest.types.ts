export type QuestPriority = 'high' | 'medium' | 'low';
export type QuestStatus  = 'active' | 'completed' | 'archived';

export interface Quest {
  id: string;
  title: string;
  description?: string;
  skillId: string; 
  xpReward: number;
  priority: QuestPriority;
  status: QuestStatus;
  repeatable: boolean;
  streakBonus: number;
  createdAt: string;
  completedAt?: string;
  updatedAt: string;
  notes?: string;
}

export interface QuestStore {
  quests: Quest[];
  addQuest: (quest: Omit<Quest, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'completedAt'>) => void;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;
  completeQuest: (id: string) => void;
  getQuestById: (id: string) => Quest | undefined;
  getQuestsBySkill: (skillId: string) => Quest[];
  getQuestsByStatus: (status: QuestStatus) => Quest[];
}