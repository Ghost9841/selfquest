// src/components/StatsDashboard.tsx


import {
  Trophy,
  Target,
  BookOpen,
  Flame,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Hero } from '@/types/hero.types';
import type { Quest } from '@/types/quest.types';
import type { Skill } from '@/types/skill.types';

interface StatsDashboardProps {
  hero: Hero;
  skills: Skill[];
  quests: Quest[];
}

export function StatsDashboard({ hero, skills, quests }: StatsDashboardProps) {
  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.status === 'completed').length;
  const totalSkills = skills.length;
  
  // Calculate total XP across all skills
  const totalXP = skills.reduce((sum, skill) => sum + skill.totalXP, 0);
  
  // Find highest level skill
  const highestSkill = skills.length > 0 
    ? skills.reduce((a, b) => a.level > b.level ? a : b)
    : null;
  
  // Find longest streak
  const longestStreak = skills.length > 0
    ? Math.max(...skills.map(s => s.streak))
    : 0;

  const stats = [
    {
      icon: Trophy,
      label: 'Total XP',
      value: totalXP,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/20',
    },
    {
      icon: Target,
      label: 'Quests Done',
      value: `${completedQuests}/${totalQuests}`,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      border: 'border-green-400/20',
    },
    {
      icon: BookOpen,
      label: 'Skills',
      value: totalSkills,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      border: 'border-purple-400/20',
    },
    {
      icon: Flame,
      label: 'Best Streak',
      value: `${longestStreak}d`,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
      border: 'border-orange-400/20',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-lg border ${stat.border} ${stat.bg} p-3 transition-all hover:scale-105`}
          >
            <div className="flex items-center gap-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-gray-400">{stat.label}</span>
            </div>
            <p className={`mt-1 text-xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Hero Level Progress */}
      <div className="rounded-lg border border-purple-600/30 bg-[#1a1a2e] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Hero Progress</span>
          </div>
          <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20">
            Lv.{hero.level}
          </Badge>
        </div>
        
        {/* XP Progress to next level */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>XP to next level</span>
            <span>{hero.totalXP} / {hero.level * 100}</span>
          </div>
          <div className="mt-1 h-2 w-full rounded-full bg-[#0f0e17] overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-purple-600 to-yellow-400 transition-all duration-500"
              style={{ 
                width: `${Math.min((hero.totalXP / (hero.level * 100)) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Top Skill */}
      {highestSkill && (
        <div className="rounded-lg border border-purple-600/30 bg-[#1a1a2e] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{highestSkill.icon}</span>
              <span className="text-sm text-white">{highestSkill.name}</span>
              <Badge 
                className="text-xs"
                style={{ 
                  backgroundColor: highestSkill.color + '30',
                  color: highestSkill.color,
                }}
              >
                Lv.{highestSkill.level}
              </Badge>
            </div>
            <span className="text-xs text-gray-400">
              🏆 Highest Level
            </span>
          </div>
        </div>
      )}
    </div>
  );
}