// src/components/AddQuestForm.tsx

import { useState } from 'react';
import { Plus, Bell, Clock, Sparkles } from 'lucide-react';
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
    allocatedMinutes?: number;
    reminderTime?: string;
    notes?: string;
  }) => void;
}

export function AddQuestForm({ skills, onAddQuest }: AddQuestFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillId, setSkillId] = useState('');
  const [xpReward, setXpReward] = useState(15);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [repeatable, setRepeatable] = useState(false);
  const [allocatedMinutes, setAllocatedMinutes] = useState(25);
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  const [notes, setNotes] = useState('');

  // Quick reminder setter helper
  const setQuickReminder = (minutesFromNow: number) => {
    const target = new Date(Date.now() + minutesFromNow * 60 * 1000);
    const hours = String(target.getHours()).padStart(2, '0');
    const mins = String(target.getMinutes()).padStart(2, '0');
    setReminderTime(`${hours}:${mins}`);
    setEnableReminder(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && skillId) {
      let finalReminderIso: string | undefined = undefined;

      if (enableReminder && reminderTime) {
        const [h, m] = reminderTime.split(':').map(Number);
        const now = new Date();
        const reminderDate = new Date();
        reminderDate.setHours(h, m, 0, 0);

        // If the time already passed today, assume tomorrow
        if (reminderDate.getTime() <= now.getTime()) {
          reminderDate.setDate(reminderDate.getDate() + 1);
        }
        finalReminderIso = reminderDate.toISOString();
      }

      onAddQuest({
        title: title.trim(),
        description: description.trim() || undefined,
        skillId,
        xpReward: Number(xpReward),
        priority,
        repeatable,
        streakBonus: Math.floor(Number(xpReward) * 0.2),
        allocatedMinutes: Number(allocatedMinutes),
        reminderTime: finalReminderIso,
        notes: notes.trim() || undefined,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setSkillId('');
      setXpReward(15);
      setPriority('medium');
      setRepeatable(false);
      setAllocatedMinutes(25);
      setEnableReminder(false);
      setReminderTime('');
      setNotes('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="w-full border border-dashed border-purple-500/40 bg-purple-950/20 text-purple-300 hover:bg-purple-900/30 hover:border-purple-400 backdrop-blur-sm transition-all h-11">
          <Plus className="mr-2 h-4 w-4 text-purple-400" />
          <span className="font-medium">Accept New Quest</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#131226]/95 backdrop-blur-2xl text-white border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            ⚔️ Accept New Quest
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Quest Title */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Quest Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Code Pomodoro Timer, Study React 19..."
              className="mt-1.5 border-white/15 bg-white/[0.05] text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 h-10 rounded-xl"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Description (optional)
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are the mission requirements?"
              className="mt-1.5 border-white/15 bg-white/[0.05] text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 rounded-xl min-h-[60px]"
            />
          </div>

          {/* Skill Assignment (Direct Grid Select to prevent portal clipping) */}
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5 block">
              Assign to Skill
            </Label>
            {skills.length === 0 ? (
              <p className="text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                ⚠️ Forge a Skill first before creating quests!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto rounded-xl border border-white/10 bg-white/[0.03] p-2">
                {skills.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => setSkillId(skill.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                      skillId === skill.id
                        ? 'border-purple-400 bg-purple-600/30 shadow-md scale-101 text-white'
                        : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.08] text-gray-300'
                    }`}
                  >
                    <span className="text-xl">{skill.icon}</span>
                    <div className="truncate">
                      <p className="text-xs font-semibold leading-tight truncate">{skill.name}</p>
                      <p className="text-[10px] text-gray-400">Lv.{skill.level}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Two-Column: XP Reward & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                XP Reward
              </Label>
              <Input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                min={5}
                max={200}
                className="mt-1.5 border-white/15 bg-white/[0.05] text-white focus:border-purple-500 h-10 rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                Priority
              </Label>
              <div className="flex gap-1 mt-1.5">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all border ${
                      priority === p
                        ? p === 'high'
                          ? 'bg-rose-500/30 border-rose-400 text-rose-300'
                          : p === 'medium'
                          ? 'bg-amber-500/30 border-amber-400 text-amber-300'
                          : 'bg-blue-500/30 border-blue-400 text-blue-300'
                        : 'border-white/5 bg-white/[0.03] text-gray-400 hover:bg-white/[0.08]'
                    }`}
                  >
                    {p === 'high' ? '🔥' : p === 'medium' ? '📌' : '💭'} {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Allocated Pomodoro Focus Time */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                Allocated Focus Time
              </span>
              <span className="text-xs font-bold text-purple-400">{allocatedMinutes} mins</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setAllocatedMinutes(mins)}
                  className={`py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    allocatedMinutes === mins
                      ? 'border-purple-400 bg-purple-600/40 text-white'
                      : 'border-white/5 bg-white/[0.04] text-gray-400 hover:bg-white/[0.08]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Task Reminder Pop-out Alert (Scheduled Notification) */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-1.5 cursor-pointer">
                <Bell className="h-3.5 w-3.5 text-amber-400" />
                Pop-up Reminder Alert
              </Label>
              <Switch
                checked={enableReminder}
                onCheckedChange={setEnableReminder}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>

            {enableReminder && (
              <div className="space-y-2 pt-1 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="border-white/15 bg-white/[0.05] text-white focus:border-amber-400 h-9 rounded-lg text-xs"
                    required={enableReminder}
                  />
                  <span className="text-[11px] text-gray-400 whitespace-nowrap">Today / Tomorrow</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setQuickReminder(15)}
                    className="flex-1 py-1 rounded-md text-[11px] bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
                  >
                    +15m
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickReminder(30)}
                    className="flex-1 py-1 rounded-md text-[11px] bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
                  >
                    +30m
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickReminder(60)}
                    className="flex-1 py-1 rounded-md text-[11px] bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5"
                  >
                    +1h
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Repeatable Switch */}
          <div className="flex items-center justify-between py-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-300">
              Repeatable Quest
            </Label>
            <Switch
              checked={repeatable}
              onCheckedChange={setRepeatable}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

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
              disabled={skills.length === 0}
            >
              ⚔️ Accept Quest
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}