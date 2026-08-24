// src/components/AddSkillForm.tsx

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SKILL_COLORS, SKILL_ICONS } from '@/store/skill.store';

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
  const [color, setColor] = useState('#4F46E5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddSkill({ name: name.trim(), icon, color });
      setName('');
      setIcon('💻');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="w-full border border-dashed border-purple-600 bg-transparent text-purple-400 hover:bg-purple-600/20">
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1a1a2e] text-white border-purple-600">
        <DialogHeader>
          <DialogTitle className="text-white">🎯 New Skill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skill Name */}
          <div>
            <label className="text-sm text-gray-400">Skill Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Coding"
              className="border-purple-600 bg-[#0f0e17] text-white"
              autoFocus
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="text-sm text-gray-400">Icon</label>
            <Select
              value={icon}
              onValueChange={(value) => {
                if (value !== null) setIcon(value);
              }}
            >
              <SelectTrigger className="border-purple-600 bg-[#0f0e17] text-white">
                <SelectValue placeholder="Select icon" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-purple-600">
                <div className="grid grid-cols-6 gap-2 p-2">
                  {SKILL_ICONS.map((emoji) => (
                    <SelectItem 
                      key={emoji} 
                      value={emoji}
                      className="text-center text-2xl hover:bg-purple-600/20"
                    >
                      {emoji}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* Color Selector */}
          <div>
            <label className="text-sm text-gray-400">Color</label>
            <div className="flex gap-2 flex-wrap">
              {SKILL_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    color === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Add Skill
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}