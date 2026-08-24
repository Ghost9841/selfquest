// src/components/SkillCard.tsx

import { Flame, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Skill } from '@/types/skill.types';

interface SkillCardProps {
  skill: Skill;
  onAddXP: (id: string, amount: number) => void;
  onSubtractXP: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export function SkillCard({ skill, onAddXP, onSubtractXP, onDelete }: SkillCardProps) {
  const progress = Math.min((skill.xp / skill.xpToNext) * 100, 100);
  const hasStreak = skill.streak > 0;

  return (
    <div 
      className="rounded-lg border bg-[#1a1a2e] p-4 transition-all hover:border-purple-600/50"
      style={{ borderColor: skill.color + '40' }}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div 
          className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
          style={{ backgroundColor: skill.color + '20' }}
        >
          {skill.icon}
        </div>

        {/* Name + Level */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{skill.name}</span>
            <Badge style={{ backgroundColor: skill.color }}>
              Lv.{skill.level}
            </Badge>
            {hasStreak && (
              <Badge variant="outline" className="border-orange-500 text-orange-400">
                <Flame className="mr-1 h-3 w-3" />
                {skill.streak}d
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>XP Progress</span>
              <span>{skill.xp} / {skill.xpToNext}</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-[#0f0e17] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: skill.color 
                }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 border-green-600 text-green-400 hover:bg-green-600/20"
              onClick={() => onAddXP(skill.id, 5)}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 border-red-600 text-red-400 hover:bg-red-600/20"
              onClick={() => onSubtractXP(skill.id, 5)}
              disabled={skill.xp === 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-gray-500 hover:text-red-400"
              onClick={() => onDelete(skill.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-xs text-gray-500">
            {skill.questsCompleted} quests
          </span>
        </div>
      </div>
    </div>
  );
}