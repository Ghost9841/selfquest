// src/components/HeroHeader.tsx

import { Crown, Sparkles, Shield } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SettingsModal } from './SettingsModal';
import type { Hero } from '@/types/hero.types';

interface HeroHeaderProps {
  hero: Hero;
}

export function HeroHeader({ hero }: HeroHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-purple-950/40 p-4.5 backdrop-blur-2xl shadow-xl">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-purple-500/20 blur-2xl" />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Avatar with glowing frosted ring */}
          <div className="relative shrink-0">
            <Avatar className="h-13 w-13 rounded-2xl border border-purple-400/40 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 shadow-lg shadow-purple-600/30">
              <AvatarFallback className="bg-transparent text-3xl select-none">
                {hero.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-purple-600 p-1 text-[10px] text-white shadow">
              <Shield className="h-3 w-3 fill-current" />
            </div>
          </div>

          {/* Hero Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-white tracking-tight truncate">
                {hero.name}
              </span>

              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-[11px] shadow-md shadow-amber-500/20 border-none px-2 py-0.5">
                <Crown className="mr-1 h-3 w-3 fill-black" />
                Lv.{hero.level}
              </Badge>

              <Badge
                variant="outline"
                className="border-purple-400/30 bg-purple-500/10 text-purple-300 font-semibold text-[11px] px-2 py-0.5"
              >
                <Sparkles className="mr-1 h-3 w-3 text-purple-300" />
                {hero.totalXP} XP
              </Badge>
            </div>

            <p className="mt-0.5 text-[11px] text-gray-400 truncate">
              Path of Mastery • Ready for adventure
            </p>
          </div>
        </div>

        {/* Settings Button */}
        <div className="shrink-0">
          <SettingsModal />
        </div>
      </div>
    </div>
  );
}