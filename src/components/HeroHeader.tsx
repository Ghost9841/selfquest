// src/components/HeroHeader.tsx

import { Crown, Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Hero } from '@/types/hero.types';

interface HeroHeaderProps {
  hero: Hero;
}

export function HeroHeader({ hero }: HeroHeaderProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-purple-600 bg-[#1a1a2e] p-4">
      {/* Avatar */}
      <Avatar className="h-14 w-14 bg-linear-to-br from-purple-600 to-purple-800">
        <AvatarFallback className="bg-transparent text-3xl">
          {hero.avatar}
        </AvatarFallback>
      </Avatar>
      
      {/* Hero Info */}
      <div className="flex flex-1 items-center gap-3 flex-wrap">
        <span className="text-xl font-semibold text-white">
          {hero.name}
        </span>
        
        <Badge className="bg-yellow-500 text-black hover:bg-yellow-500">
          <Crown className="mr-1 h-3 w-3" />
          Lv.{hero.level}
        </Badge>
        
        <Badge variant="outline" className="border-purple-600 text-gray-300">
          <Star className="mr-1 h-3 w-3 text-yellow-400" />
          {hero.totalXP} XP
        </Badge>
      </div>
    </div>
  );
}