// src/App.tsx

import { NameInput } from './components/NameInput';
import { HeroHeader } from './components/HeroHeader';
import { SkillList } from './components/SkillList';
import { AddSkillForm } from './components/AddSkillForm';
import { BookOpen, Sword } from 'lucide-react';
import { useHeroState } from './store/hero.store';
import { useSkillStore } from './store/skill.store';
import { useQuestStore } from './store/quest.store';
import { QuestList } from './components/QuestList';
import { AddQuestForm } from './components/AddQuestForm';

function App() {
  const { hero, setHeroName } = useHeroState();
  const { skills, addSkill, addXP, subtractXP, deleteSkill, addXPFromQuest } = useSkillStore();
  const { quests, addQuest, completeQuest, deleteQuest } = useQuestStore();

  // If no hero, show name input
  if (!hero) {
    return <NameInput onSetName={setHeroName} />;
  }

  // Handle quest completion with XP
  const handleCompleteQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status === 'completed') return;

    // Add XP to the skill
    addXPFromQuest(quest.skillId, quest.xpReward, questId);
    
    // Mark quest as completed
    completeQuest(questId);
  };

  return (
    <div className="min-h-screen bg-[#0f0e17] p-6">
      <div className="mx-auto max-w-2xl">
        {/* Hero Header */}
        <HeroHeader hero={hero} />
        
        {/* Skills Section */}
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Skills</h2>
              <span className="text-sm text-gray-500">
                ({skills.length})
              </span>
            </div>
          </div>

          <SkillList
            skills={skills}
            onAddXP={addXP}
            onSubtractXP={subtractXP}
            onDelete={deleteSkill}
          />

          <div className="mt-4">
            <AddSkillForm onAddSkill={addSkill} />
          </div>
        </div>

        {/* Quests Section */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sword className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Quests</h2>
              <span className="text-sm text-gray-500">
                ({quests.length})
              </span>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
}

export default App;