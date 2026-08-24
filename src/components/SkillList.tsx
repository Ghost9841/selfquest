// src/components/SkillList.tsx

import type { Skill } from '@/types/skill.types';
import { SkillCard } from './SkillCard';

interface SkillListProps {
  skills: Skill[];
  onAddXP: (id: string, amount: number) => void;
  onSubtractXP: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export function SkillList({ skills, onAddXP, onSubtractXP, onDelete }: SkillListProps) {
  if (skills.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-purple-600/30 bg-[#1a1a2e] p-8 text-center">
        <p className="text-gray-400">No skills yet. Add your first skill!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          onAddXP={onAddXP}
          onSubtractXP={onSubtractXP}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}