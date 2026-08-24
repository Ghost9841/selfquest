// src/App.tsx

import { NameInput } from './components/NameInput';
import { HeroHeader } from './components/HeroHeader';
import { useHeroState } from './store/hero.store';

function App() {
  const { hero, setHeroName } = useHeroState();

  // If no hero, show name input
  if (!hero) {
    return <NameInput onSetName={setHeroName} />;
  }

  // If hero exists, show the app
  return (
    <div className="min-h-screen bg-[#0f0e17] p-6">
      <div className="mx-auto max-w-2xl">
        <HeroHeader hero={hero} />
        
        {/* Placeholder for next steps */}
        <div className="mt-8 rounded-lg border border-purple-600/30 bg-[#1a1a2e] p-8 text-center">
          <p className="text-gray-400">
            Welcome back, {hero.name}! 🎮
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Skills & Quests coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;