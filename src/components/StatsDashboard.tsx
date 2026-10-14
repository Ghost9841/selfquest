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
  const completedQuests = quests.filter((q) => q.status === 'completed').length;
  const totalSkills = skills.length;

  const totalXP = skills.reduce((sum, skill) => sum + skill.totalXP, 0);

  const highestSkill = skills.length > 0
    ? skills.reduce((a, b) => (a.level > b.level ? a : b))
    : null;

  const longestStreak = skills.length > 0
    ? Math.max(...skills.map((s) => s.streak))
    : 0;

  const stats = [
    {
      icon: Trophy,
      label: 'Total XP',
      value: totalXP,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      icon: Target,
      label: 'Quests Done',
      value: `${completedQuests}/${totalQuests}`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      icon: BookOpen,
      label: 'Active Skills',
      value: totalSkills,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
    {
      icon: Flame,
      label: 'Best Streak',
      value: `${longestStreak}d`,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
    },
  ];

  const currentLevelXP = hero.level * 100;
  const heroProgress = Math.min((hero.totalXP / currentLevelXP) * 100, 100);

  return (
    <div className="space-y-3.5">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-2xl border ${stat.border} ${stat.bg} p-3.5 backdrop-blur-xl transition-all hover:bg-white/[0.08] hover:shadow-lg`}
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-white/5">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
            </div>
            <p className={`mt-2 text-2xl font-black tracking-tight ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Hero Level Progress */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-white">Hero Progression</span>
          </div>
          <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold py-0.5">
            Lv.{hero.level}
          </Badge>
        </div>

        {/* XP Progress to next level */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 font-medium">
            <span>XP to next level</span>
            <span className="font-mono text-gray-300">
              {hero.totalXP} / {currentLevelXP} XP
            </span>
          </div>
          <div className="mt-1.5 h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-400 to-amber-400 transition-all duration-500 shadow-sm shadow-purple-500/50"
              style={{ width: `${heroProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Top Skill Card */}
      {highestSkill && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{highestSkill.icon}</span>
              <div>
                <p className="text-sm font-bold text-white">{highestSkill.name}</p>
                <p className="text-[10px] text-gray-400">Prime Mastered Skill</p>
              </div>
            </div>
            <Badge
              className="text-xs font-bold py-1 px-2.5 rounded-xl border"
              style={{
                backgroundColor: `${highestSkill.color}25`,
                borderColor: `${highestSkill.color}60`,
                color: highestSkill.color,
              }}
            >
              Lv.{highestSkill.level}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}