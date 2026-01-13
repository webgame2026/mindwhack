
import React, { useState, useEffect } from 'react';
import { TargetType, BoardTheme } from '../types';
import { TARGET_ICONS } from '../constants';

interface GameHoleProps {
  isActive: boolean;
  type: TargetType | null;
  onHit: () => void;
  wasHit?: boolean;
  disabled?: boolean;
  theme?: BoardTheme;
}

const PARTICLE_ICONS: Record<string, string> = {
  dog: '🦴',
  cat: '🐾',
  rat: '🧀',
  bonus: '✨',
  hazard: '🔥'
};

const THEME_STYLES: Record<BoardTheme, { outer: string, inner: string, glow: string }> = {
  Cyber: {
    outer: 'from-slate-600 via-slate-800 to-slate-950 border-slate-700/50',
    inner: 'from-black via-slate-900 to-slate-950',
    glow: 'rgba(56,189,248,0.5)'
  },
  Classic: {
    outer: 'from-amber-800 via-amber-900 to-stone-900 border-amber-950',
    inner: 'from-stone-900 via-green-950 to-black',
    glow: 'rgba(132,204,22,0.4)'
  },
  Volcano: {
    outer: 'from-red-900 via-stone-900 to-black border-red-950',
    inner: 'from-orange-950 via-red-950 to-black',
    glow: 'rgba(239,68,68,0.6)'
  },
  Void: {
    outer: 'from-indigo-950 via-purple-950 to-black border-purple-900/30',
    inner: 'from-black via-indigo-950 to-black',
    glow: 'rgba(168,85,247,0.5)'
  }
};

const GameHole: React.FC<GameHoleProps> = ({ isActive, type, onHit, wasHit, disabled, theme = 'Cyber' }) => {
  const styles = THEME_STYLES[theme];
  
  // Track last seen type to ensure smooth pop-down animation
  const [displayType, setDisplayType] = useState<TargetType | null>(type);

  useEffect(() => {
    if (isActive && type) {
      setDisplayType(type);
    } else if (!isActive) {
      // Small delay before clearing displayType to let transition finish
      const timer = setTimeout(() => {
        if (!isActive) setDisplayType(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isActive, type]);

  return (
    <div className="relative w-full aspect-square flex items-center justify-center p-0.5 sm:p-1 group perspective-1000">
      <div className={`relative w-full h-full preserve-3d transition-transform duration-500 ${isActive ? 'scale-[1.02]' : 'scale-100'}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.outer} rounded-full border-[3px] sm:border-[6px] shadow-[0_12px_35px_rgba(0,0,0,0.9),inset_0_2px_5px_rgba(255,255,255,0.1)] pointer-events-none`} />
        
        <div className={`absolute inset-[10%] bg-gradient-to-b ${styles.inner} rounded-full hole-shadow overflow-hidden group-hover:shadow-[inset_0_20px_40px_rgba(0,0,0,0.95)] transition-shadow`}>
          <div className="absolute inset-0 bg-black/20 rounded-full" />
          
          <div 
            className={`absolute inset-0 rounded-full transition-opacity duration-700 pointer-events-none ${isActive ? 'opacity-100 animate-inner-glow-pulse' : 'opacity-0'}`}
            style={{ 
              background: `radial-gradient(circle at center, ${styles.glow} 0%, transparent 75%)`
            }} 
          />
          
          <div 
            onPointerDown={() => isActive && !disabled && onHit()}
            className={`
              absolute inset-0 flex items-center justify-center text-5xl sm:text-[5.5rem] cursor-pointer select-none target-popup
              ${isActive ? 'translate-y-[-8%] scale-110 rotate-0' : 'translate-y-full scale-50 rotate-12'}
              hover:brightness-125 active:scale-95 touch-manipulation z-10
            `}
            style={{ 
              filter: isActive ? 'drop-shadow(0 20px 25px rgba(0,0,0,0.7))' : 'none',
              transformOrigin: 'bottom center',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <span className={`inline-block drop-shadow-2xl ${isActive ? 'animate-bounce-slow' : ''}`}>
              {displayType ? TARGET_ICONS[displayType] : ''}
            </span>
          </div>

          {wasHit && displayType && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <span className="text-7xl sm:text-9xl animate-ping opacity-90">💥</span>
              {[...Array(8)].map((_, i) => (
                <span 
                  key={i} 
                  className="absolute text-2xl sm:text-4xl animate-particle-burst"
                  style={{ 
                    '--angle': `${i * 45 + Math.random() * 20}deg`,
                    '--delay': `${i * 0.03}s` 
                  } as React.CSSProperties}
                >
                  {displayType ? PARTICLE_ICONS[displayType] || '✨' : '✨'}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameHole;
