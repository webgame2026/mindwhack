import React, { useState, useEffect } from 'react';
import { AppView, GameLevel, UserStats } from './types';
import { INITIAL_LEVELS } from './constants';
import CommunityHub from './components/CommunityHub';
import LevelEditor from './components/LevelEditor';
import LevelPlayer from './components/LevelPlayer';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import NavBar from './components/NavBar';
import SettingsModal from './components/SettingsModal';
import EntryPage from './components/EntryPage';
import DifficultySelector from './components/DifficultySelector';
import { soundService } from './services/soundService';

const DEFAULT_USER: UserStats = {
  username: "MasterWhacker",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MasterWhacker",
  totalWhacks: 12450,
  levelsCreated: 3,
  rank: "ELITE",
  xp: 7500,
  nextRankXp: 10000
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('entry');
  const [levels, setLevels] = useState<GameLevel[]>(INITIAL_LEVELS);
  const [activeLevel, setActiveLevel] = useState<GameLevel | null>(null);
  const [difficultyForGame, setDifficultyForGame] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [pendingLevel, setPendingLevel] = useState<GameLevel | null>(null);
  
  const [user, setUser] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('user_stats');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch (e) {
      return DEFAULT_USER;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('sound_enabled');
      return saved === null ? true : saved === 'true';
    } catch (e) {
      return true;
    }
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return (saved as 'dark' | 'light') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('user_stats', JSON.stringify(user));
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {}
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('sound_enabled', String(soundEnabled));
    } catch (e) {}
    soundService.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const handlePlayLevel = (level: GameLevel) => {
    setPendingLevel(level);
    setShowDifficultySelector(true);
  };

  const onConfirmDifficulty = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    if (!pendingLevel) return;
    setDifficultyForGame(difficulty);
    setActiveLevel(pendingLevel);
    setView('play');
    setShowDifficultySelector(false);
    
    setLevels(prev => prev.map(l => 
      l.id === pendingLevel.id ? { ...l, plays: l.plays + 1 } : l
    ));
    setPendingLevel(null);
  };

  const handleCreateLevel = () => {
    setView('editor');
  };

  const handleSaveLevel = (newLevel: GameLevel) => {
    setLevels(prev => [newLevel, ...prev]);
    setUser(prev => ({ ...prev, levelsCreated: prev.levelsCreated + 1 }));
    setView('hub');
  };

  const handleRateLevel = (levelId: string, rating: number) => {
    setLevels(prev => prev.map(l => {
      if (l.id === levelId) {
        const newCount = l.ratingCount + 1;
        const newRating = ((l.rating * l.ratingCount) + rating) / newCount;
        return { ...l, rating: parseFloat(newRating.toFixed(1)), ratingCount: newCount };
      }
      return l;
    }));
  };

  const handleExitToHub = () => {
    setView('hub');
    setActiveLevel(null);
  };

  const handleNavigate = (newView: AppView) => {
    setView(newView);
    if (newView !== 'play') {
      setActiveLevel(null);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    soundService.playClick();
    setUser(DEFAULT_USER);
    setLevels(INITIAL_LEVELS);
    setView('entry');
    try {
      localStorage.removeItem('user_stats');
    } catch (e) {}
  };

  const handleUpdateUser = (updates: Partial<UserStats>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const showNavBar = view !== 'play' && view !== 'entry';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#020617] text-purple-50' : 'bg-purple-50/30 text-indigo-950'} transition-colors duration-500 overflow-x-hidden pb-32 selection:bg-fuchsia-500/30`}>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[45%] h-[45%] ${theme === 'dark' ? 'bg-purple-600/20' : 'bg-purple-400/10'} blur-[150px] rounded-full animate-blob`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] ${theme === 'dark' ? 'bg-pink-600/20' : 'bg-pink-400/10'} blur-[150px] rounded-full animate-blob [animation-delay:2s]`} />
        <div className={`absolute top-[40%] left-[30%] w-[25%] h-[25%] ${theme === 'dark' ? 'bg-fuchsia-600/10' : 'bg-fuchsia-400/5'} blur-[120px] rounded-full animate-blob [animation-delay:4s]`} />
      </div>

      <main className="relative z-10 pt-4 sm:pt-8">
        {view === 'entry' && <EntryPage onEnter={() => setView('home')} />}
        {view === 'home' && <HomePage stats={user} featuredLevel={levels[0]} onPlayFeatured={handlePlayLevel} onGoToHub={() => setView('hub')} />}
        {view === 'hub' && <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000"><CommunityHub levels={levels} onPlay={handlePlayLevel} onCreate={handleCreateLevel} /></div>}
        {view === 'profile' && <ProfilePage stats={user} myLevels={levels.filter(l => l.author === 'You' || l.author === 'System')} onPlayLevel={handlePlayLevel} onLogout={handleLogout} onOpenSettings={() => setIsSettingsOpen(true)} />}
        {view === 'editor' && <div className="animate-in zoom-in-95 fade-in duration-500"><LevelEditor onSave={handleSaveLevel} onCancel={() => setView('hub')} /></div>}
        {view === 'play' && activeLevel && <div className="animate-in zoom-in-110 fade-in duration-700"><LevelPlayer level={activeLevel} initialDifficulty={difficultyForGame} onExit={handleExitToHub} onRate={handleRateLevel} /></div>}
      </main>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} soundEnabled={soundEnabled} onToggleSound={() => setSoundEnabled(!soundEnabled)} onUpdateUser={handleUpdateUser} theme={theme} onToggleTheme={toggleTheme} />
      <DifficultySelector isOpen={showDifficultySelector} onClose={() => setShowDifficultySelector(false)} onSelect={onConfirmDifficulty} level={pendingLevel} />
      {showNavBar && <NavBar currentView={view} onNavigate={handleNavigate} theme={theme} toggleTheme={toggleTheme} />}
    </div>
  );
};

export default App;