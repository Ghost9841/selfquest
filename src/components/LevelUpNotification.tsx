// src/components/LevelUpNotification.tsx

import { useEffect, useState } from 'react';
import { Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LevelUpNotificationProps {
  skillName: string;
  newLevel: number;
  skillIcon: string;
  skillColor: string;
  onClose: () => void;
}

export function LevelUpNotification({
  skillName,
  newLevel,
  skillIcon,
  skillColor,
  onClose,
}: LevelUpNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative mx-4 max-w-sm rounded-2xl border-2 p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ 
          borderColor: skillColor,
          background: 'linear-gradient(135deg, #1a1a2e, #0f0e17)',
        }}
      >
        {/* Sparkle decoration */}
        <div className="absolute -top-4 -right-4">
          <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
        </div>
        <div className="absolute -bottom-4 -left-4">
          <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex justify-center mb-4">
          <div 
            className="flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-lg animate-bounce"
            style={{ backgroundColor: skillColor + '30' }}
          >
            {skillIcon}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white">🎉 Level Up!</h2>
        <p className="mt-2 text-gray-300">
          <span className="font-semibold" style={{ color: skillColor }}>
            {skillName}
          </span>{' '}
          reached <span className="font-bold text-yellow-400">Lv.{newLevel}</span>!
        </p>

        <div className="mt-4 flex justify-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <span className="text-sm text-gray-400">Keep up the great work!</span>
        </div>

        <Button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="mt-6 w-full bg-purple-600 hover:bg-purple-700"
        >
          Awesome! 🚀
        </Button>
      </div>
    </div>
  );
}