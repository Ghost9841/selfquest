// src/App.tsx

import { useState } from 'react';
import { NameInput } from './components/NameInput';
import { HeroHeader } from './components/HeroHeader';
import { SkillList } from './components/SkillList';
import { QuestList } from './components/QuestList';
import { SkillRadar } from './components/SkillRadar';
import { StatsDashboard } from './components/StatsDashboard';
import { LevelUpNotification } from './components/LevelUpNotification';
import { AddSkillForm } from './components/AddSkillForm';
import { AddQuestForm } from './components/AddQuestForm';
import { BookOpen, Sword, LayoutDashboard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useHeroState } from './store/hero.store';
import { useSkillStore } from './store/skill.store';
import { useQuestStore } from './store/quest.store';

function App() {
  const { hero, setHeroName } = useHeroState();
  const { skills, addSkill, addXP, subtractXP, deleteSkill, addXPFromQuest } = useSkillStore();
  const { quests, addQuest, completeQuest, deleteQuest } = useQuestStore();
  
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
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status === 'completed') return;

    // Add XP to the skill with level up callback
    addXPFromQuest(quest.skillId, quest.xpReward, questId, (name, level, icon, color) => {
      setLevelUp({ skillName: name, newLevel: level, skillIcon: icon, skillColor: color });
    });
    
    // Mark quest as completed
    completeQuest(questId);
  };

  // Handle manual XP add with level up callback
  const handleAddXP = (skillId: string, amount: number) => {
    addXP(skillId, amount, (name, level, icon, color) => {
      setLevelUp({ skillName: name, newLevel: level, skillIcon: icon, skillColor: color });
    });
  };

  return (
    <div className="min-h-screen bg-[#0f0e17] p-4 md:p-6">
      <div className="mx-auto max-w-2xl">
        {/* Hero Header */}
        <HeroHeader hero={hero} />
        
        {/* Main Content with Tabs */}
        <Tabs defaultValue="dashboard" className="mt-4">
          <TabsList className="w-full bg-[#1a1a2e]">
            <TabsTrigger value="dashboard" className="flex-1 data-[state=active]:bg-purple-600">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex-1 data-[state=active]:bg-purple-600">
              <BookOpen className="mr-2 h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex-1 data-[state=active]:bg-purple-600">
              <Sword className="mr-2 h-4 w-4" />
              Quests
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-4 space-y-4">
            <StatsDashboard hero={hero} skills={skills} quests={quests} />
            <SkillRadar skills={skills} />
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-4">
            <SkillList
              skills={skills}
              onAddXP={handleAddXP}
              onSubtractXP={subtractXP}
              onDelete={deleteSkill}
            />
            <div className="mt-4">
              <AddSkillForm onAddSkill={addSkill} />
            </div>
          </TabsContent>

          {/* Quests Tab */}
          <TabsContent value="quests" className="mt-4">
            <QuestList
              quests={quests}
              skills={skills}
              onComplete={handleCompleteQuest}
              onDelete={deleteQuest}
            />
            <div className="mt-4">
              <AddQuestForm 
                skills={skills} 
                onAddQuest={addQuest} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Level Up Notification */}
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