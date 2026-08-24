// src/components/QuestList.tsx

import { useState } from 'react';

import { QuestCard } from './QuestCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Quest, QuestStatus } from '@/types/quest.types';
import type { Skill } from '@/types/skill.types';

interface QuestListProps {
  quests: Quest[];
  skills: Skill[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuestList({ quests, skills, onComplete, onDelete }: QuestListProps) {
  const [filter, setFilter] = useState<QuestStatus | 'all'>('active');

  const filteredQuests = quests.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  const getSkillForQuest = (skillId: string) => {
    return skills.find(s => s.id === skillId);
  };

  if (quests.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-purple-600/30 bg-[#1a1a2e] p-8 text-center">
        <p className="text-gray-400">No quests yet. Add your first quest!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <Tabs 
        value={filter} 
        onValueChange={(v) => setFilter(v as QuestStatus | 'all')}
        className="mb-4"
      >
        <TabsList className="bg-[#1a1a2e]">
          <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">
            All ({quests.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-purple-600">
            Active ({quests.filter(q => q.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-purple-600">
            Completed ({quests.filter(q => q.status === 'completed').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Quest Cards */}
      <div className="space-y-2">
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            skill={getSkillForQuest(quest.skillId)}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))}
        {filteredQuests.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-4">
            No {filter} quests
          </p>
        )}
      </div>
    </div>
  );
}