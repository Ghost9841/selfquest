// src/components/NameInput.tsx

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sword } from 'lucide-react';

interface NameInputProps {
  onSetName: (name: string) => void;
}

export function NameInput({ onSetName }: NameInputProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSetName(name.trim());
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0e17] p-4">
      <div className="w-full max-w-md rounded-lg border-2 border-purple-600 bg-[#1a1a2e] p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-purple-600/20 p-4">
            <Sword className="h-12 w-12 text-purple-400" />
          </div>
        </div>
        
        <h1 className="mb-2 text-3xl font-bold text-white">⚔️ Self Quest</h1>
        <p className="mb-6 text-gray-400">What's your name, adventurer?</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="border-purple-600 bg-[#0f0e17] text-white placeholder:text-gray-500"
            autoFocus
          />
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Begin Quest →
          </Button>
        </form>
      </div>
    </div>
  );
}

export default NameInput;