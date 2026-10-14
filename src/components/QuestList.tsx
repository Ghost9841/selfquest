// src/components/QuestList.tsx

import { useState } from 'react';
import { QuestCard } from './QuestCard';
import type { Quest, QuestStatus } from '@/types/quest.types';
import type { Skill } from '@/types/skill.types';

interface QuestListProps {
  quests: Quest[];
  skills: Skill[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onStartFocus?: (quest: Quest) => void;
  highlightQuestId?: string;
}

export function QuestList({ quests, skills, onComplete, onDelete, onStartFocus, highlightQuestId }: QuestListProps) {
  const [filter, setFilter] = useState<QuestStatus | 'all'>('active');

  const filteredQuests = quests.filter((q) => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  const getSkillForQuest = (skillId: string) => {
    return skills.find((s) => s.id === skillId);
  };

  const activeCount = quests.filter((q) => q.status === 'active').length;
  const completedCount = quests.filter((q) => q.status === 'completed').length;

  if (quests.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 text-center">
        <p className="text-sm text-gray-400">No quests recorded in your quest log yet.</p>
        <p className="text-xs text-purple-400/80 mt-1">Accept your first quest below to begin earning XP!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Glassmorphic Filter Bar */}
      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            filter === 'active'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Active ({activeCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            filter === 'completed'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Completed ({completedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
            filter === 'all'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All ({quests.length})
        </button>
      </div>

      {/* Quest Cards */}
      <div className="space-y-2.5">
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            skill={getSkillForQuest(quest.skillId)}
            onComplete={onComplete}
            onDelete={onDelete}
            onStartFocus={onStartFocus}
            isHighlighted={quest.id === highlightQuestId}
          />
        ))}

        {filteredQuests.length === 0 && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center">
            <p className="text-xs text-gray-500">
              No {filter} quests found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}