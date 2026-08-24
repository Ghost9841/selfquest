
import { CheckCircle, Circle, Trash2, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Quest } from '@/types/quest.types';
import type { Skill } from '@/types/skill.types';

interface QuestCardProps {
  quest: Quest;
  skill?: Skill;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function QuestCard({ quest, skill, onComplete, onDelete }: QuestCardProps) {
  const isCompleted = quest.status === 'completed';
  const priorityColors = {
    high: 'border-red-500/50 bg-red-500/10',
    medium: 'border-yellow-500/50 bg-yellow-500/10',
    low: 'border-blue-500/50 bg-blue-500/10',
  };
  const priorityIcons = {
    high: '🔥',
    medium: '📌',
    low: '💭',
  };

  return (
    <div 
      className={`rounded-lg border p-3 transition-all ${
        isCompleted ? 'opacity-60' : 'hover:border-purple-600/50'
      } ${priorityColors[quest.priority]}`}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <button
          onClick={() => !isCompleted && onComplete(quest.id)}
          className="mt-0.5"
        >
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-400" />
          ) : (
            <Circle className="h-5 w-5 text-gray-500 hover:text-purple-400" />
          )}
        </button>

        {/* Quest Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{priorityIcons[quest.priority]}</span>
                <span className={`font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                  {quest.title}
                </span>
                {quest.repeatable && (
                  <Repeat className="h-3 w-3 text-gray-500" />
                )}
              </div>
              {quest.description && (
                <p className="text-xs text-gray-400">{quest.description}</p>
              )}
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-gray-500 hover:text-red-400"
              onClick={() => onDelete(quest.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Bottom row: XP + Skill */}
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20">
              +{quest.xpReward} XP
            </Badge>
            {skill && (
              <Badge 
                variant="outline" 
                className="border-purple-600/50 text-purple-300"
                style={{ borderColor: skill.color + '50' }}
              >
                {skill.icon} {skill.name}
              </Badge>
            )}
            {isCompleted && quest.completedAt && (
              <span className="text-xs text-gray-500">
                Completed: {new Date(quest.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}