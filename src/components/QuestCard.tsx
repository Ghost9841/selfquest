// src/components/QuestCard.tsx

import { CheckCircle, Circle, Trash2, Repeat, Clock, Bell, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Quest } from '@/types/quest.types';
import type { Skill } from '@/types/skill.types';

interface QuestCardProps {
  quest: Quest;
  skill?: Skill;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onStartFocus?: (quest: Quest) => void;
}

export function QuestCard({ quest, skill, onComplete, onDelete, onStartFocus }: QuestCardProps) {
  const isCompleted = quest.status === 'completed';

  const priorityStyles = {
    high: {
      border: 'border-rose-500/30 hover:border-rose-400/50',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      icon: '🔥',
    },
    medium: {
      border: 'border-amber-500/30 hover:border-amber-400/50',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: '📌',
    },
    low: {
      border: 'border-blue-500/30 hover:border-blue-400/50',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: '💭',
    },
  };

  const style = priorityStyles[quest.priority];

  // Format reminder time if present
  let formattedReminder = '';
  if (quest.reminderTime) {
    try {
      const d = new Date(quest.reminderTime);
      formattedReminder = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      formattedReminder = quest.reminderTime;
    }
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${style.border} bg-white/[0.03] backdrop-blur-xl p-3.5 transition-all duration-200 hover:bg-white/[0.06] hover:shadow-[0_8px_25px_rgba(0,0,0,0.3)] ${
        isCompleted ? 'opacity-50 grayscale-40' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox Complete Button */}
        <button
          onClick={() => !isCompleted && onComplete(quest.id)}
          className="mt-0.5 shrink-0 transition-transform active:scale-90"
          title={isCompleted ? 'Completed' : 'Mark complete'}
        >
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-emerald-400 drop-shadow-sm" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400 hover:text-purple-400" />
          )}
        </button>

        {/* Quest Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs">{style.icon}</span>
                <span
                  className={`text-sm font-semibold truncate ${
                    isCompleted ? 'line-through text-gray-500' : 'text-white'
                  }`}
                >
                  {quest.title}
                </span>
                {quest.repeatable && (
                  <span title="Repeatable Quest" className="inline-flex items-center">
                    <Repeat className="h-3 w-3 text-purple-400 shrink-0" />
                  </span>
                )}
              </div>
              {quest.description && (
                <p className="mt-0.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {quest.description}
                </p>
              )}
            </div>

            {/* Quick Actions (Focus & Delete) */}
            <div className="flex items-center gap-1 shrink-0">
              {!isCompleted && onStartFocus && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onStartFocus(quest)}
                  className="h-7 px-2.5 rounded-lg border-purple-500/40 bg-purple-600/20 text-purple-300 hover:bg-purple-600/40 hover:text-white text-xs font-semibold shadow-sm"
                  title="Start Pomodoro Focus"
                >
                  <Play className="mr-1 h-3 w-3 fill-current" />
                  Focus
                </Button>
              )}

              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                onClick={() => onDelete(quest.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Badges Row: XP, Skill, Allocated Time, Reminder */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <Badge className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold py-0.5">
              +{quest.xpReward} XP
            </Badge>

            {skill && (
              <Badge
                variant="outline"
                className="text-[11px] font-semibold py-0.5 border"
                style={{
                  backgroundColor: `${skill.color}18`,
                  borderColor: `${skill.color}45`,
                  color: skill.color,
                }}
              >
                {skill.icon} {skill.name}
              </Badge>
            )}

            {/* Allocated Focus Time Badge */}
            <Badge
              variant="outline"
              className="text-[11px] py-0.5 border-white/10 bg-white/[0.04] text-purple-300 flex items-center gap-1"
            >
              <Clock className="h-3 w-3 text-purple-400" />
              {quest.allocatedMinutes || 25}m
            </Badge>

            {/* Reminder Badge */}
            {formattedReminder && !isCompleted && (
              <Badge
                variant="outline"
                className="text-[11px] py-0.5 border-amber-500/30 bg-amber-500/10 text-amber-300 flex items-center gap-1"
              >
                <Bell className="h-3 w-3 text-amber-400" />
                {formattedReminder}
              </Badge>
            )}

            {isCompleted && quest.completedAt && (
              <span className="text-[10px] text-gray-500 ml-auto">
                Completed: {new Date(quest.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}