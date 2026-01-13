
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameLevel, TargetType, LevelLogic, GameType, BoardTheme, MoodProfile } from '../types';
import Button from './Button';
import GameHole from './GameHole';
import { soundService } from '../services/soundService';
import { Trophy, Clock, RotateCcw, Home, Sparkles, Gavel, Target, ChevronLeft, Star, Pause, Play as PlayIcon, Settings2, Heart } from 'lucide-react';

interface LevelPlayerProps {
  level: GameLevel;
  initialDifficulty?: 'Easy' | 'Medium' | 'Hard';
  onExit: () => void;
  onRate?: (levelId: string, rating: number) => void;
}

type Difficulty = 'Easy' | 'Medium' | 'Hard';

const LevelPlayer: React.FC<LevelPlayerProps> = ({ level, initialDifficulty = 'Medium', onExit, onRate }) => {
  const [activeLogic, setActiveLogic] = useState<LevelLogic>(level.logic);
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(level.logic.timeLimit);
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'paused' | 'ended'>('countdown');
  const [countdown, setCountdown] = useState(3);
  
  const [holeStates, setHoleStates] = useState<(TargetType | null)[]>(
    Array(level.gridSize * level.gridSize).fill(null)
  );
  
  const [hitHoles, setHitHoles] = useState<Set<number>>(new Set());
  const [hammerPos, setHammerPos] = useState({ x: 0, y: 0, active: false, visible: false });
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holeStatesRef = useRef<(TargetType | null)[]>(holeStates);

  useEffect(() => {
    holeStatesRef.current = holeStates;
  }, [holeStates]);

  const gameType: GameType = activeLogic.gameType || 'Standard';
  const boardTheme: BoardTheme = activeLogic.boardTheme || 'Cyber';

  const getWinGoal = useCallback(() => {
    const base = activeLogic.winConditionScore;
    if (difficulty === 'Easy') return Math.floor(base * 0.7);
    if (difficulty === 'Hard') return Math.floor(base * 1.5);
    return base;
  }, [difficulty, activeLogic.winConditionScore]);

  const getAdjustedInterval = useCallback(() => {
    const base = activeLogic.spawnInterval / (activeLogic.speedMultiplier || 1);
    if (difficulty === 'Easy') return base * 1.5;
    if (difficulty === 'Hard') return base * 0.7;
    return base;
  }, [difficulty, activeLogic.spawnInterval, activeLogic.speedMultiplier]);

  const getAdjustedDuration = useCallback(() => {
    const base = activeLogic.activeDuration / (activeLogic.speedMultiplier || 1);
    if (difficulty === 'Easy') return base * 1.3;
    if (difficulty === 'Hard') return base * 0.7;
    return base;
  }, [difficulty, activeLogic.activeDuration, activeLogic.speedMultiplier]);

  const spawnTarget = useCallback(() => {
    setGameState(currentGameState => {
      if (currentGameState !== 'playing') return currentGameState;

      const totalHoles = level.gridSize * level.gridSize;
      const currentHoles = holeStatesRef.current;
      
      const emptyHoles = currentHoles
        .map((type, idx) => (type === null ? idx : null))
        .filter((idx): idx is number => idx !== null);
      
      if (emptyHoles.length > 0) {
        const randomHole = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
        const weights = activeLogic.targetWeights;
        const totalWeight = (Object.values(weights) as number[]).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let selectedType: TargetType = 'dog';
        
        for (const [type, weight] of Object.entries(weights) as [string, number][]) {
          if (random < weight) {
            selectedType = type as TargetType;
            break;
          }
          random -= weight;
        }

        setHoleStates(prev => {
          const next = [...prev];
          next[randomHole] = selectedType;
          return next;
        });

        const duration = getAdjustedDuration();
        setTimeout(() => {
          setHoleStates(prev => {
            if (prev[randomHole] === selectedType) {
              if (gameType === 'Catch' && (selectedType === 'dog' || selectedType === 'rat' || selectedType === 'bonus')) {
                setLives(l => {
                  if (l <= 1) {
                    setGameState('ended');
                    return 0;
                  }
                  return l - 1;
                });
              }
              const next = [...prev];
              next[randomHole] = null;
              return next;
            }
            return prev;
          });
        }, duration);
      }

      if (spawnRef.current) clearTimeout(spawnRef.current);
      spawnRef.current = setTimeout(spawnTarget, getAdjustedInterval());
      return currentGameState;
    });
  }, [level.gridSize, getAdjustedInterval, getAdjustedDuration, activeLogic.targetWeights, gameType]);

  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        soundService.playBeep(false);
        const t = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(t);
      } else {
        soundService.playGameStart();
        setGameState('playing');
      }
    }
  }, [gameState, countdown]);

  useEffect(() => {
    if (gameState === 'playing') {
      spawnTarget();
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('ended');
            return 0;
          }
          if (prev <= 5) soundService.playBeep(true);
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearTimeout(spawnRef.current);
    }
    if (gameState === 'ended') {
      const isWin = gameType === 'Catch' ? lives > 0 : score >= getWinGoal();
      soundService.playGameEnd(isWin);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearTimeout(spawnRef.current);
    };
  }, [gameState, score, getWinGoal, lives, gameType]);

  const handleHit = (index: number) => {
    const targetType = holeStates[index];
    if (!targetType || hitHoles.has(index) || gameState !== 'playing') return;

    soundService.playWhack();
    
    // Use custom scores if defined, else use defaults
    const customScores = activeLogic.targetScores;
    let points = 1;
    if (customScores && customScores[targetType] !== undefined) {
      points = customScores[targetType];
    } else {
      if (targetType === 'cat') points = -5;
      if (targetType === 'dog') points = 2;
      if (targetType === 'rat') points = 1;
      if (targetType === 'bonus') points = 10;
      if (targetType === 'hazard') points = -10;
    }
    
    if (gameType === 'Focus' && targetType === 'cat') points = -15;
    if (targetType === 'hazard' && gameType === 'Catch') setLives(l => Math.max(0, l - 1));

    setScore(s => Math.max(0, s + points));
    setHoleStates(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setHitHoles(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    setTimeout(() => {
      setHitHoles(prev => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 500);

    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(60);
    }
  };

  const restart = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearTimeout(spawnRef.current);
    setScore(0);
    setLives(3);
    setTimeLeft(activeLogic.timeLimit);
    setGameState('countdown');
    setCountdown(3);
    setHitHoles(new Set());
    setHoleStates(Array(level.gridSize * level.gridSize).fill(null));
    setHammerPos(p => ({ ...p, visible: false }));
  };

  const cycleDifficulty = () => {
    soundService.playClick();
    const cycle: Difficulty[] = ['Easy', 'Medium', 'Hard'];
    const nextIdx = (cycle.indexOf(difficulty) + 1) % cycle.length;
    setDifficulty(cycle[nextIdx]);
  };

  return (
    <div className={`flex flex-col items-center justify-start min-h-[100dvh] p-4 space-y-4 sm:space-y-6 max-w-4xl mx-auto perspective-1000 pt-[calc(env(safe-area-inset-top)+0.5rem)]`}>
      <div 
        className={`fixed z-[999] pointer-events-none transition-all duration-75 text-5xl sm:text-6xl select-none`}
        style={{ 
          left: hammerPos.x, 
          top: hammerPos.y, 
          transform: `translate(-50%, -50%) rotate(${hammerPos.active ? '-45deg' : '0deg'}) scale(${hammerPos.active ? '1.2' : '1'})`,
          opacity: (hammerPos.visible && (gameState === 'playing' || gameState === 'countdown')) ? 1 : 0,
          transition: 'transform 75ms ease-out, opacity 200ms ease-in-out'
        }}
      >
        🔨
      </div>

      <div className="w-full flex items-center justify-between glass p-3 sm:p-5 rounded-[2rem] shadow-2xl border-white/20 transform sm:-rotate-1 animate-in slide-in-from-top duration-500 z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl sm:rounded-2xl shadow-lg shrink-0">
            <Trophy size={18} className="text-white sm:w-6 sm:h-6" />
          </div>
          <div className="leading-none">
            <span className="text-[8px] sm:text-xs text-slate-400 uppercase font-black tracking-widest block mb-0.5">Points / Goal</span>
            <span className="text-xl sm:text-3xl font-black gradient-text tabular-nums tracking-tighter">{score} <span className="text-slate-500 text-sm">/ {getWinGoal()}</span></span>
          </div>
        </div>

        <div className="flex flex-col items-center flex-1 mx-2 sm:mx-4">
          <h2 className="text-xs sm:text-xl font-black text-slate-900 dark:text-white mb-0.5 uppercase italic text-center leading-tight">{level.name}</h2>
          <div className="flex gap-2">
            <button onClick={cycleDifficulty} className="px-2 py-0.5 bg-blue-500/20 rounded-full border border-blue-500/30 text-[7px] sm:text-[9px] text-blue-600 dark:text-blue-300 font-black uppercase flex items-center gap-1">
              <Settings2 size={10} /> {difficulty}
            </button>
            <span className="px-2 py-0.5 bg-purple-500/20 rounded-full border border-purple-500/30 text-[7px] sm:text-[9px] text-purple-600 dark:text-purple-300 font-black uppercase">
              {gameType}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {gameType === 'Catch' && (
            <div className="flex items-center gap-1 mr-2">
               {[...Array(3)].map((_, i) => (
                 <Heart key={i} size={16} className={i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'} />
               ))}
            </div>
          )}
          <div className="text-right leading-none">
            <span className="text-[8px] sm:text-xs text-slate-400 uppercase font-black tracking-widest block mb-0.5">Time</span>
            <span className={`text-xl sm:text-3xl font-black tabular-nums ${timeLeft < 10 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
              {timeLeft}
            </span>
          </div>
          <button 
            onClick={() => gameState === 'playing' ? setGameState('paused') : gameState === 'paused' ? setGameState('playing') : null}
            className={`p-2 sm:p-3 rounded-xl shadow-lg transition-all ${gameState === 'paused' ? 'bg-emerald-500' : 'bg-slate-700'}`}
          >
            {gameState === 'paused' ? <PlayIcon size={18} className="text-white" /> : <Pause size={18} className="text-white" />}
          </button>
        </div>
      </div>

      <div className="relative w-full flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-[min(90vw,550px)] aspect-square preserve-3d">
          <div 
            onPointerDown={(e) => {
              setHammerPos(p => ({ ...p, x: e.clientX, y: e.clientY, active: true }));
              e.preventDefault();
            }}
            onPointerUp={() => setHammerPos(p => ({ ...p, active: false }))}
            onPointerMove={(e) => {
              setHammerPos(p => ({ ...p, x: e.clientX, y: e.clientY, visible: true }));
            }}
            onPointerEnter={(e) => {
              setHammerPos(p => ({ ...p, x: e.clientX, y: e.clientY, visible: true }));
            }}
            onPointerLeave={() => {
              setHammerPos(p => ({ ...p, visible: false, active: false }));
            }}
            className="game-board-container relative w-full h-full glass rounded-[2.5rem] sm:rounded-[4rem] p-4 sm:p-8 shadow-2xl flex items-center justify-center cursor-none overflow-hidden touch-none"
          >
            {gameState === 'countdown' ? (
              <div className="text-8xl sm:text-[10rem] font-black gradient-text animate-bounce">{countdown}</div>
            ) : gameState === 'paused' ? (
              <div className="absolute inset-0 z-30 glass flex flex-col items-center justify-center p-6 text-center space-y-6 bg-slate-900/90 backdrop-blur-2xl">
                 <h3 className="text-4xl font-black text-white italic uppercase">PAUSED</h3>
                 <div className="flex flex-col w-full max-w-xs gap-3">
                   <Button onClick={() => setGameState('playing')}>Resume</Button>
                   <Button onClick={restart} variant="secondary">Restart</Button>
                   <Button onClick={onExit} variant="glass">Exit Room</Button>
                 </div>
              </div>
            ) : gameState === 'ended' ? (
              <div className="absolute inset-0 z-30 glass flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-900/95">
                <h3 className="text-4xl sm:text-6xl font-black text-white italic uppercase">FINISH!</h3>
                <p className="text-6xl sm:text-8xl font-black text-blue-400 tabular-nums">{score}</p>
                <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
                  <Button onClick={restart} variant="secondary" className="flex-1">Replay</Button>
                  <Button onClick={onExit} variant="glass" className="flex-1">Exit</Button>
                </div>
              </div>
            ) : (
              <div 
                className={`grid gap-2 sm:gap-6 w-full h-full mood-${activeLogic.moodProfile?.toLowerCase() || 'classic'}`}
                style={{ 
                  gridTemplateColumns: `repeat(${level.gridSize}, 1fr)`,
                  gridTemplateRows: `repeat(${level.gridSize}, 1fr)`
                }}
              >
                {holeStates.map((type, idx) => (
                  <GameHole 
                    key={idx} 
                    isActive={type !== null} 
                    type={type}
                    onHit={() => handleHit(idx)}
                    wasHit={hitHoles.has(idx)}
                    theme={boardTheme}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center w-full max-w-xs sm:max-w-md pb-6">
        <Button onClick={onExit} variant="glass" className="w-full sm:flex-1 rounded-2xl py-3 flex items-center justify-center gap-2">
          <ChevronLeft size={18} /> LEAVE ROOM
        </Button>
        <Button onClick={restart} variant="secondary" className="w-full sm:flex-1 rounded-2xl py-3 flex items-center justify-center gap-2">
          <RotateCcw size={18} /> RESTART
        </Button>
      </div>
    </div>
  );
};

export default LevelPlayer;
