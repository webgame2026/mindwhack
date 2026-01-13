
import React from 'react';
import { X, Zap, Target, Flame, ChevronRight, Trophy } from 'lucide-react';
import Button from './Button';
import { GameLevel } from '../types';

interface DifficultySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (difficulty: 'Easy' | 'Medium' | 'Hard') => void;
  level: GameLevel | null;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ isOpen, onClose, onSelect, level }) => {
  if (!isOpen || !level) return null;

  const basePoints = level.logic.winConditionScore;

  const options = [
    { 
      id: 'Easy' as const, 
      label: 'CHILL', 
      desc: 'Relaxed pace, longer visibility.', 
      targetPoints: Math.floor(basePoints * 0.7),
      icon: <Zap className="text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/10',
      borderColor: 'border-emerald-500/20',
      textColor: 'text-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-400'
    },
    { 
      id: 'Medium' as const, 
      label: 'STANDARD', 
      desc: 'Balanced chaos, intended experience.', 
      targetPoints: basePoints,
      icon: <Target className="text-blue-400" />,
      color: 'from-blue-500/20 to-indigo-500/10',
      borderColor: 'border-blue-500/20',
      textColor: 'text-blue-400',
      badgeColor: 'bg-blue-500/20 text-blue-400'
    },
    { 
      id: 'Hard' as const, 
      label: 'INSANE', 
      desc: 'Hyper-speed, brutal timers.', 
      targetPoints: Math.floor(basePoints * 1.5),
      icon: <Flame className="text-rose-400" />,
      color: 'from-rose-500/20 to-pink-500/10',
      borderColor: 'border-rose-500/20',
      textColor: 'text-rose-400',
      badgeColor: 'bg-rose-500/20 text-rose-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative glass w-full max-w-lg rounded-[3rem] p-8 sm:p-12 border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="absolute top-0 right-0 p-8">
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all text-slate-400 active:scale-90">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8 relative z-10">
          <header className="space-y-2 text-center">
            <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase">PREPARE FOR WHACK</h2>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">MISSION: {level.name}</p>
          </header>

          <div className="space-y-4">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className={`w-full group relative flex items-center gap-6 p-6 rounded-[2.5rem] border ${opt.borderColor} bg-gradient-to-br ${opt.color} hover:scale-[1.02] active:scale-95 transition-all text-left overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/5 transition-opacity" />
                <div className="p-4 bg-black/30 rounded-3xl group-hover:scale-110 transition-transform">
                  {opt.icon}
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className={`text-2xl font-black italic tracking-tighter ${opt.textColor} uppercase`}>{opt.label}</h4>
                    <p className="text-[10px] text-slate-400 font-bold leading-tight line-clamp-1">{opt.desc}</p>
                  </div>
                  
                  {/* Target Points Indicator */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${opt.badgeColor} text-[9px] font-black uppercase tracking-wider`}>
                    <Trophy size={10} /> Goal: {opt.targetPoints} PTS
                  </div>
                </div>
                <ChevronRight size={24} className="text-white/20 group-hover:text-white transition-colors group-hover:translate-x-1" />
              </button>
            ))}
          </div>

          <div className="text-center">
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-6 tracking-[0.2em]">MISSION PARAMETERS UPDATED</p>
             <Button onClick={onClose} variant="glass" className="w-full py-4 text-white border-none shadow-none">
               Cancel
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;
