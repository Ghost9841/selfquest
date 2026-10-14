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
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.07] hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
      style={{
        boxShadow: `0 4px 20px -2px ${skill.color}15`,
      }}
    >
      {/* Subtle color highlight accent at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${skill.color}, transparent)`,
        }}
      />

      <div className="flex items-center gap-3.5">
        {/* Skill Icon with glowing backdrop */}
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl shadow-inner transition-transform group-hover:scale-105"
          style={{
            backgroundColor: `${skill.color}22`,
            border: `1px solid ${skill.color}50`,
          }}
        >
          {skill.icon}
        </div>

        {/* Skill Info & Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm truncate">{skill.name}</span>
            <Badge
              className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
              style={{ backgroundColor: skill.color }}
            >
              Lv.{skill.level}
            </Badge>
            {hasStreak && (
              <Badge
                variant="outline"
                className="border-amber-500/40 bg-amber-500/10 text-amber-300 text-[10px] py-0.5"
              >
                <Flame className="mr-1 h-3 w-3 text-amber-400" />
                {skill.streak}d
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-2.5">
            <div className="flex justify-between text-[11px] text-gray-400 font-medium">
              <span>Progress to Lv.{skill.level + 1}</span>
              <span className="font-mono text-gray-300">
                {skill.xp} / {skill.xpToNext} XP
              </span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full transition-all duration-300 shadow-sm"
                style={{
                  width: `${progress}%`,
                  backgroundColor: skill.color,
                  boxShadow: `0 0 10px ${skill.color}80`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-end gap-1.5 shrink-0 pl-1">
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 rounded-lg border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/25 shadow-sm"
              onClick={() => onAddXP(skill.id, 5)}
              title="+5 XP"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 rounded-lg border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/25 shadow-sm"
              onClick={() => onSubtractXP(skill.id, 5)}
              disabled={skill.xp === 0}
              title="-5 XP"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
              onClick={() => onDelete(skill.id)}
              title="Delete Skill"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">
            {skill.questsCompleted} quests done
          </span>
        </div>
      </div>
    </div>
  );
}