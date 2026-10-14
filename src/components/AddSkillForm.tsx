// src/components/AddSkillForm.tsx

import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const CATEGORIZED_ICONS = [
  { label: 'Work & Code', icons: ['💻', '⚡', '🚀', '🛠️', '📊', '💼'] },
  { label: 'Mind & Study', icons: ['📚', '🧠', '✍️', '🗣️', '🎓', '🎯'] },
  { label: 'Body & Health', icons: ['💪', '🏃', '🧘', '🥊', '🥗', '💧'] },
  { label: 'Art & RPG', icons: ['🎨', '🎵', '⚔️', '🛡️', '🧪', '✨'] },
];

const VIBRANT_SKILL_COLORS = [
  { name: 'Arcane Purple', hex: '#8B5CF6' },
  { name: 'Cyber Cyan', hex: '#06B6D4' },
  { name: 'Emerald Blade', hex: '#10B981' },
  { name: 'Solar Amber', hex: '#F59E0B' },
  { name: 'Phoenix Red', hex: '#EF4444' },
  { name: 'Mystic Pink', hex: '#EC4899' },
  { name: 'Royal Blue', hex: '#3B82F6' },
  { name: 'Void Violet', hex: '#6366F1' },
];

interface AddSkillFormProps {
  onAddSkill: (skill: {
    name: string;
    icon: string;
    color: string;
  }) => void;
}

export function AddSkillForm({ onAddSkill }: AddSkillFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💻');
  const [color, setColor] = useState('#8B5CF6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddSkill({ name: name.trim(), icon: icon.trim() || '⭐', color });
      setName('');
      setIcon('💻');
      setColor('#8B5CF6');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="w-full border border-dashed border-purple-500/40 bg-purple-950/20 text-purple-300 hover:bg-purple-900/30 hover:border-purple-400 backdrop-blur-sm transition-all h-11">
          <Plus className="mr-2 h-4 w-4 text-purple-400" />
          <span className="font-medium">Forge New Skill</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#131226]/95 backdrop-blur-2xl text-white border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Forge New Skill
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Live Preview Card */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-3.5 backdrop-blur-md">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-inner transition-transform"
              style={{ backgroundColor: `${color}25`, border: `1px solid ${color}60` }}
            >
              {icon || '⭐'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {name.trim() || 'Skill Name Preview'}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: `${color}30`, color: color }}
                >
                  Level 1 • 0 XP
                </span>
              </div>
            </div>
          </div>

          {/* Skill Name */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Skill Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Web Development, Guitar, Fitness..."
              className="mt-1.5 border-white/15 bg-white/[0.05] text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 h-10 rounded-xl"
              autoFocus
              required
            />
          </div>

          {/* Icon Selector (Fixed Grid & Custom Emoji Input) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Choose Skill Icon
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400">Custom:</span>
                <input
                  type="text"
                  maxLength={4}
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-10 text-center py-0.5 rounded-lg border border-white/15 bg-white/[0.07] text-base text-white focus:outline-none focus:border-purple-400"
                  placeholder="✨"
                />
              </div>
            </div>

            <div className="space-y-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 max-h-48 overflow-y-auto">
              {CATEGORIZED_ICONS.map((cat) => (
                <div key={cat.label}>
                  <p className="text-[11px] font-medium text-gray-400 mb-1">{cat.label}</p>
                  <div className="grid grid-cols-6 gap-1.5">
                    {cat.icons.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setIcon(emoji)}
                        className={`h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                          icon === emoji
                            ? 'bg-purple-600/40 border border-purple-400 scale-105 shadow-md shadow-purple-500/30'
                            : 'bg-white/[0.04] border border-white/5 hover:bg-white/[0.1] hover:scale-102'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Theme Glow Color
            </label>
            <div className="grid grid-cols-4 gap-2 mt-1.5">
              {VIBRANT_SKILL_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c.hex)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                    color === c.hex
                      ? 'border-white bg-white/10 shadow-lg scale-102'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
                  }`}
                >
                  <div
                    className="h-4 w-4 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-xs font-medium text-gray-300 truncate">
                    {c.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-600/30 border border-purple-400/30"
            >
              Forge Skill
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}