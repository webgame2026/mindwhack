import { GameLevel } from './types';

export const TARGET_ICONS: Record<string, string> = {
  dog: '🐶',
  cat: '🐱',
  rat: '🐭',
  bonus: '⭐',
  hazard: '💣'
};

export const INITIAL_LEVELS: GameLevel[] = [
  {
    id: 'default-1',
    name: 'Classic Kennel Chaos',
    author: 'System',
    description: 'Whack the dogs and rats, but avoid the cats!',
    gridSize: 3,
    plays: 1240,
    rating: 4.8,
    ratingCount: 156,
    createdAt: Date.now(),
    logic: {
      spawnInterval: 1200,
      activeDuration: 1000,
      winConditionScore: 10,
      timeLimit: 30,
      description: 'Standard difficulty level.',
      targetWeights: {
        dog: 40,
        rat: 40,
        cat: 10,
        bonus: 5,
        hazard: 5
      }
    }
  }
];