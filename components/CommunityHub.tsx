
import React from 'react';
import { GameLevel } from '../types';
import Button from './Button';
import { LayoutGrid, Play, Plus, Star, Users, TrendingUp } from 'lucide-react';

interface CommunityHubProps {
  levels: GameLevel[];
  onPlay: (level: GameLevel) => void;
  onCreate: () => void;
}

const CommunityHub: React.FC<CommunityHubProps> = ({ levels, onPlay, onCreate }) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 space-y-12">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">
            <TrendingUp size={14} /> Trending Challenges
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none italic text-slate-900 dark:text-white">
            MIND<span className="gradient-text">WHACK</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xl font-medium max-w-xl">
            The world's most vibrant UGC brainstorming playground. Build the chaos, whack the targets.
          </p>
        </div>
        <Button onClick={onCreate} variant="secondary" size="lg" className="shadow-2xl transform hover:scale-105 active:scale-95 transition-transform">
          <Plus size={28} className="mr-2" /> Design New Level
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {levels.map(level => (
          <div key={level.id} className="glass rounded-[2.5rem] p-8 flex flex-col hover:translate-y-[-10px] hover:shadow-[0_20px_60px_rgba(56,189,248,0.2)] transition-all duration-500 border-black/5 dark:border-white/5 group relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors" />
            
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-black/5 dark:bg-white/5 rounded-2xl group-hover:bg-blue-500/10 transition-colors">
                <LayoutGrid className="text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform" size={28} />
              </div>
              <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400 font-black text-lg bg-black/5 dark:bg-black/20 px-4 py-1 rounded-full">
                <Star size={18} fill="currentColor" /> {level.rating}
              </div>
            </div>

            <h3 className="text-3xl font-black mb-3 text-slate-900 dark:text-white group-hover:gradient-text transition-all tracking-tight leading-tight">
              {level.name}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium mb-8 line-clamp-2 leading-relaxed">
              {level.description}
            </p>

            <div className="mt-auto pt-8 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
                  <Users size={16} className="text-blue-500 dark:text-blue-400" /> {level.plays.toLocaleString()} Plays
                </div>
                <div className="text-xs text-slate-500 font-black uppercase tracking-widest">By @{level.author}</div>
              </div>
              <Button onClick={() => onPlay(level)} size="md" variant="primary">
                <Play size={20} fill="currentColor" className="mr-2" /> Play
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityHub;
