// src/components/AddQuestForm.tsx

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Skill } from '@/types/skill.types';

interface AddQuestFormProps {
  skills: Skill[];
  onAddQuest: (quest: {
    title: string;
    description?: string;
    skillId: string;
    xpReward: number;
    priority: 'high' | 'medium' | 'low';
    repeatable: boolean;
    streakBonus: number;
    notes?: string;
  }) => void;
}

export function AddQuestForm({ skills, onAddQuest }: AddQuestFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillId, setSkillId] = useState('');
  const [xpReward, setXpReward] = useState(10);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [repeatable, setRepeatable] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && skillId) {
      onAddQuest({
        title: title.trim(),
        description: description.trim() || undefined,
        skillId,
        xpReward: Number(xpReward),
        priority,
        repeatable,
        streakBonus: Math.floor(Number(xpReward) * 0.2),
        notes: notes.trim() || undefined,
      });
      // Reset form
      setTitle('');
      setDescription('');
      setSkillId('');
      setXpReward(10);
      setPriority('medium');
      setRepeatable(false);
      setNotes('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="w-full border border-dashed border-purple-600 bg-transparent text-purple-400 hover:bg-purple-600/20">
          <Plus className="mr-2 h-4 w-4" />
          Add Quest
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#1a1a2e] text-white border-purple-600">
        <DialogHeader>
          <DialogTitle className="text-white">⚔️ New Quest</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quest Title */}
          <div>
            <Label className="text-gray-400">Quest Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Build Chrome extension"
              className="border-purple-600 bg-[#0f0e17] text-white"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-gray-400">Description (optional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you need to do?"
              className="border-purple-600 bg-[#0f0e17] text-white"
            />
          </div>

          {/* Skill Assignment */}
          <div>
            <Label className="text-gray-400">Assign to Skill</Label>
            <Select value={skillId} onValueChange={() => setSkillId} required>
              <SelectTrigger className="border-purple-600 bg-[#0f0e17] text-white">
                <SelectValue placeholder="Select a skill..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-purple-600">
                {skills.map((skill) => (
                  <SelectItem 
                    key={skill.id} 
                    value={skill.id}
                    className="hover:bg-purple-600/20"
                  >
                    {skill.icon} {skill.name} (Lv.{skill.level})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {skills.length === 0 && (
              <p className="mt-1 text-sm text-yellow-400">
                Create a skill first before adding quests!
              </p>
            )}
          </div>

          {/* XP Reward */}
          <div>
            <Label className="text-gray-400">XP Reward</Label>
            <Input
              type="number"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              min={1}
              max={100}
              className="border-purple-600 bg-[#0f0e17] text-white"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <Label className="text-gray-400">Priority</Label>
            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
              <SelectTrigger className="border-purple-600 bg-[#0f0e17] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-purple-600">
                <SelectItem value="high" className="hover:bg-purple-600/20">
                  🔥 High
                </SelectItem>
                <SelectItem value="medium" className="hover:bg-purple-600/20">
                  📌 Medium
                </SelectItem>
                <SelectItem value="low" className="hover:bg-purple-600/20">
                  💭 Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Repeatable Switch */}
          <div className="flex items-center justify-between">
            <Label className="text-gray-400">Repeatable Quest</Label>
            <Switch
              checked={repeatable}
              onCheckedChange={setRepeatable}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

          {/* Notes */}
          <div>
            <Label className="text-gray-400">Notes (optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any extra details..."
              className="border-purple-600 bg-[#0f0e17] text-white"
            />
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
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={skills.length === 0}
            >
              ⚔️ Add Quest
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}