// src/App.tsx

import { NameInput } from './components/NameInput';
import { HeroHeader } from './components/HeroHeader';
import { SkillList } from './components/SkillList';
import { AddSkillForm } from './components/AddSkillForm';
import { BookOpen } from 'lucide-react';
import { useHeroState } from './store/hero.store';
import { useSkillStore } from './store/skill.store';

function App() {
  const { hero, setHeroName } = useHeroState();
  const { skills, addSkill, addXP, subtractXP, deleteSkill } = useSkillStore();

  // If no hero, show name input
  if (!hero) {
    return <NameInput onSetName={setHeroName} />;
  }

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

        {/* Placeholder for Quests */}
        <div className="mt-8 rounded-lg border border-purple-600/30 bg-[#1a1a2e] p-8 text-center">
          <p className="text-gray-400">⚔️ Quests coming soon...</p>
        </div>
      </div>
    </div>
  );
}

export default App;