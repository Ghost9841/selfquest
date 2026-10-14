export interface Hero {
  id: string;
  name: string;
  avatar: string;
  totalXP: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface HeroStore {
  hero: Hero | null;
  setHeroName: (name: string) => void;
  addHeroXP: (amount: number, onHeroLevelUp?: (newLevel: number) => void) => void;
  resetHero: () => void;
}
