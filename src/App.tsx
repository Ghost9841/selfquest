// src/App.tsx

import { useState, useEffect } from 'react';
import { NameInput } from './components/NameInput';
import { HeroHeader } from './components/HeroHeader';
import { SkillList } from './components/SkillList';
import { QuestList } from './components/QuestList';
import { SkillRadar } from './components/SkillRadar';
import { StatsDashboard } from './components/StatsDashboard';
import { LevelUpNotification } from './components/LevelUpNotification';
import { AddSkillForm } from './components/AddSkillForm';
import { AddQuestForm } from './components/AddQuestForm';
import { PomodoroTimer } from './components/PomodoroTimer';
import { BookOpen, Sword, LayoutDashboard, Timer } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHeroState } from './store/hero.store';
import { useSkillStore } from './store/skill.store';
import { useQuestStore } from './store/quest.store';
import { useTimerStore } from './store/timer.store';
import { playChimeSound } from './utils/extensionBridge';
import type { Quest } from './types/quest.types';

function App() {
  const { hero, setHeroName, addHeroXP } = useHeroState();
  const { skills, addSkill, addXP, subtractXP, deleteSkill, addXPFromQuest } = useSkillStore();
  const { quests, addQuest, completeQuest, deleteQuest, checkDailyReset } = useQuestStore();
  const { startTimer } = useTimerStore();

  // Read URL search params for deep navigation (from notifications or auto-popout)
  const [activeTab, setActiveTab] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab && ['dashboard', 'quests', 'timer', 'skills'].includes(tab)) {
      return tab;
    }
    return 'dashboard';
  });

  const [highlightQuestId, setHighlightQuestId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('questId') || null;
  });

  // Daily quest reset check on load
  useEffect(() => {
    checkDailyReset();

    // Check if new URL params arrive while window is open
    const checkParams = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      const qId = params.get('questId');
      if (tab && ['dashboard', 'quests', 'timer', 'skills'].includes(tab)) {
        setActiveTab(tab);
      }
      if (qId) {
        setHighlightQuestId(qId);
      }
    };

    window.addEventListener('popstate', checkParams);
    return () => window.removeEventListener('popstate', checkParams);
  }, [checkDailyReset]);

  // Level up notification state
  const [levelUp, setLevelUp] = useState<{
    skillName: string;
    newLevel: number;
    skillIcon: string;
    skillColor: string;
  } | null>(null);

  // If no hero, show name input
  if (!hero) {
    return <NameInput onSetName={setHeroName} />;
  }

  // Handle quest completion with XP
  const handleCompleteQuest = (questId: string) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.status === 'completed') return;

    // Add XP to Hero
    addHeroXP(quest.xpReward);

    // Add XP to the skill with level up callback
    addXPFromQuest(quest.skillId, quest.xpReward, questId, (name, level, icon, color) => {
      playChimeSound('level-up');
      setLevelUp({ skillName: name, newLevel: level, skillIcon: icon, skillColor: color });
    });

    // Mark quest as completed
    completeQuest(questId);
  };

  // Handle manual XP add with level up callback
  const handleAddXP = (skillId: string, amount: number) => {
    // Add XP to Hero
    addHeroXP(amount);

    addXP(skillId, amount, (name, level, icon, color) => {
      playChimeSound('level-up');
      setLevelUp({ skillName: name, newLevel: level, skillIcon: icon, skillColor: color });
    });
  };

  // Quick-start focus timer on a quest
  const handleStartFocus = (quest: Quest) => {
    startTimer(quest.id, quest.title, quest.allocatedMinutes || 25);
    setActiveTab('timer');
  };

  return (
    <div className="min-h-screen bg-[#0c0b14] text-white selection:bg-purple-500/30 relative overflow-x-hidden p-3.5 md:p-6 font-sans">
      {/* Ambient background glows for glassmorphism refraction */}
      <div className="pointer-events-none fixed -top-24 -left-24 h-96 w-96 rounded-full bg-purple-600/15 blur-[120px]" />
      <div className="pointer-events-none fixed top-1/2 -right-24 h-96 w-96 rounded-full bg-indigo-600/12 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-24 left-1/3 h-80 w-80 rounded-full bg-cyan-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-2xl space-y-4">
        {/* Hero Header */}
        <HeroHeader hero={hero} />

        {/* Main Content with Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Frosted Glass Tab Bar */}
          <TabsList className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 backdrop-blur-xl shadow-lg">
            <TabsTrigger
              value="dashboard"
              className="flex-1 rounded-xl py-2 text-xs font-semibold text-gray-400 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:text-white"
            >
              <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
              Stats
            </TabsTrigger>
            <TabsTrigger
              value="quests"
              className="flex-1 rounded-xl py-2 text-xs font-semibold text-gray-400 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:text-white"
            >
              <Sword className="mr-1.5 h-3.5 w-3.5" />
              Quests
            </TabsTrigger>
            <TabsTrigger
              value="timer"
              className="flex-1 rounded-xl py-2 text-xs font-semibold text-gray-400 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:text-white"
            >
              <Timer className="mr-1.5 h-3.5 w-3.5" />
              Focus
            </TabsTrigger>
            <TabsTrigger
              value="skills"
              className="flex-1 rounded-xl py-2 text-xs font-semibold text-gray-400 transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:text-white"
            >
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              Skills
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-4 space-y-4">
            <StatsDashboard hero={hero} skills={skills} quests={quests} />
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl shadow-lg">
              <SkillRadar skills={skills} />
            </div>
          </TabsContent>

          {/* Quests Tab */}
          <TabsContent value="quests" className="mt-4 space-y-4">
            <QuestList
              quests={quests}
              skills={skills}
              onComplete={handleCompleteQuest}
              onDelete={deleteQuest}
              onStartFocus={handleStartFocus}
              highlightQuestId={highlightQuestId || undefined}
            />
            <div>
              <AddQuestForm skills={skills} onAddQuest={addQuest} />
            </div>
          </TabsContent>

          {/* Pomodoro Timer Tab */}
          <TabsContent value="timer" className="mt-4">
            <PomodoroTimer
              quests={quests}
              skills={skills}
              onLevelUp={(name, level, icon, color) => {
                playChimeSound('level-up');
                setLevelUp({ skillName: name, newLevel: level, skillIcon: icon, skillColor: color });
              }}
            />
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-4 space-y-4">
            <SkillList
              skills={skills}
              onAddXP={handleAddXP}
              onSubtractXP={subtractXP}
              onDelete={deleteSkill}
            />
            <div>
              <AddSkillForm onAddSkill={addSkill} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Level Up Notification Modal */}
      {levelUp && (
        <LevelUpNotification
          skillName={levelUp.skillName}
          newLevel={levelUp.newLevel}
          skillIcon={levelUp.skillIcon}
          skillColor={levelUp.skillColor}
          onClose={() => setLevelUp(null)}
        />
      )}
    </div>
  );
}

export default App;