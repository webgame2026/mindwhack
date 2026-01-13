export type TargetType = 'dog' | 'cat' | 'rat' | 'bonus' | 'hazard';
export type GameType = 'Standard' | 'Catch' | 'Focus';
export type BoardTheme = 'Cyber' | 'Classic' | 'Volcano' | 'Void';
export type MoodProfile = 'Aggressive' | 'Zen' | 'Chaos' | 'Classic';

export interface LevelLogic {
  spawnInterval: number;
  activeDuration: number;
  winConditionScore: number;
  timeLimit: number;
  description: string;
  targetWeights: Record<TargetType, number>;
  targetScores?: Record<TargetType, number>;
  gameType?: GameType;
  boardTheme?: BoardTheme;
  moodProfile?: MoodProfile;
  speedMultiplier?: number;
  targetSizeMultiplier?: number;
}

export interface GameLevel {
  id: string;
  name: string;
  author: string;
  description: string;
  gridSize: number;
  logic: LevelLogic;
  rating: number;
  ratingCount: number;
  plays: number;
  createdAt: number;
}

export interface UserStats {
  username: string;
  avatar: string;
  totalWhacks: number;
  levelsCreated: number;
  rank: string;
  xp: number;
  nextRankXp: number;
}

export type AppView = 'entry' | 'home' | 'hub' | 'editor' | 'play' | 'profile';