
import React from 'react';
import { UserStats, GameLevel } from '../types';
import Button from './Button';
import { Settings, LogOut, Award, Star, Clock, Hammer, ShieldCheck, Play } from 'lucide-react';

interface ProfilePageProps {
  stats: UserStats;
  myLevels: GameLevel[];
  onPlayLevel: (level: GameLevel) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ stats, myLevels, onPlayLevel, onLogout, onOpenSettings }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-8 space-y-10 animate-in fade-in slide-in-from-right-10 duration-700">
      {/* Profile Header */}
      <header className="flex flex-col md:flex-row items-center gap-10 bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-8 sm:p-12 rounded-[3.5rem] border border-black/5 dark:border-white/10 relative overflow-hidden glass">
        <div className="absolute top-0 right-0 p-8 flex gap-2">
          <button 
            onClick={onOpenSettings}
            className="p-3 glass rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors border-none shadow-none active:scale-90"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={onLogout} 
            className="p-3 glass rounded-2xl text-rose-500 hover:text-rose-400 transition-colors border-none shadow-none active:scale-90"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="relative">
          <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-[3rem] overflow-hidden border-4 border-white/20 shadow-2xl">
            <img src={stats.avatar} alt={stats.username} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-slate-950 p-3 rounded-2xl shadow-xl font-black text-sm">
             LVL {Math.floor(stats.xp / 1000)}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none text-slate-900 dark:text-white">{stats.username}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-xs">
              <ShieldCheck size={14} /> {stats.rank} RANK
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
              <span>XP PROGRESS</span>
              <span>{stats.xp} / {stats.nextRankXp}</span>
            </div>
            <div className="w-full h-4 bg-black/5 dark:bg-black/40 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                style={{ width: `${(stats.xp / stats.nextRankXp) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="glass px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300 border-black/5 dark:border-white/10">
              <Hammer size={14} className="text-blue-500" /> {stats.totalWhacks} Total Whacks
            </div>
            <div className="glass px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 text-slate-700 dark:text-slate-300 border-black/5 dark:border-white/10">
              <Award size={14} className="text-yellow-500" /> Veteran Badge
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Creations */}
        <section className="lg:col-span-7 space-y-6">
           <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-3 text-slate-900 dark:text-white px-2">
              <Play size={24} className="text-blue-500" /> MY CREATIONS
           </h2>
           <div className="space-y-4">
              {myLevels.length > 0 ? myLevels.map(level => (
                <div key={level.id} className="glass p-6 rounded-[2rem] border-black/5 dark:border-white/5 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                   <div className="space-y-1">
                      <h4 className="font-black text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{level.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                        <span className="flex items-center gap-1"><Star size={12} fill="currentColor" className="text-yellow-500" /> {level.rating}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {new Date(level.createdAt).toLocaleDateString()}</span>
                      </div>
                   </div>
                   <Button onClick={() => onPlayLevel(level)} size="sm" variant="glass" className="rounded-full shadow-none">View</Button>
                </div>
              )) : (
                <div className="glass p-12 rounded-[2rem] border-dashed border-2 border-black/5 dark:border-white/10 text-center space-y-4 opacity-50">
                  <Play size={48} className="mx-auto text-slate-400" />
                  <p className="font-black uppercase tracking-widest text-xs text-slate-500">No levels built yet</p>
                </div>
              )}
           </div>
        </section>

        {/* Right: Achievements */}
        <section className="lg:col-span-5 space-y-6">
           <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-3 text-slate-900 dark:text-white px-2">
              <Award size={24} className="text-yellow-500" /> UNLOCKED
           </h2>
           <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🚀', label: 'Trainee' },
                { icon: '🔥', label: '10x Hit' },
                { icon: '🎨', label: 'Creator' },
                { icon: '👑', label: 'Champion' },
                { icon: '⚡', label: 'Quick Tap' },
                { icon: '🛡️', label: 'Founder' },
              ].map((badge, i) => (
                <div key={i} className="glass aspect-square rounded-[2rem] flex flex-col items-center justify-center p-4 text-center group hover:bg-yellow-400/10 transition-colors cursor-help border-black/5 dark:border-white/5">
                   <span className="text-3xl mb-2 group-hover:scale-125 transition-transform">{badge.icon}</span>
                   <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">{badge.label}</span>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
