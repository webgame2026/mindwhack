
import React from 'react';
import Button from './Button';
import { Play, Sparkles, Trophy, Zap, TrendingUp, Calendar, Hammer, LayoutGrid } from 'lucide-react';
import { UserStats, GameLevel } from '../types';

interface HomePageProps {
  stats: UserStats;
  featuredLevel: GameLevel;
  onPlayFeatured: (level: GameLevel) => void;
  onGoToHub: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ stats, featuredLevel, onPlayFeatured, onGoToHub }) => {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-8 space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <section className="relative glass rounded-[3.5rem] p-8 sm:p-16 overflow-hidden flex flex-col md:flex-row items-center gap-12 border-purple-500/10 dark:border-white/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/20 blur-[120px] rounded-full -mr-32 -mt-32 animate-pulse" />
        
        <div className="relative z-10 flex-1 space-y-8 text-center md:text-left">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-fuchsia-600 dark:text-fuchsia-400 text-sm font-black uppercase tracking-[0.2em]">
            <Sparkles size={16} /> Welcome, {stats.username}
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-8xl font-black italic tracking-tighter leading-[0.9] text-slate-900 dark:text-white">
              MASTER THE <br/> <span className="gradient-text">WHACK.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xl font-medium max-w-lg mx-auto md:mx-0 leading-relaxed">
              Craft impossible challenges or dominate the leaderboard. Join <span className="text-purple-600 dark:text-pink-400 font-bold">{stats.levelsCreated}</span> level creators worldwide.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <Button onClick={() => onPlayFeatured(featuredLevel)} variant="primary" size="lg" className="px-14 py-8 text-3xl shadow-fuchsia-500/40 transform hover:scale-105">
              <Play size={32} className="mr-4" fill="currentColor" /> QUICK START
            </Button>
            <div className="flex flex-col gap-2">
               <Button onClick={onGoToHub} variant="glass" size="lg" className="px-14 py-8 text-2xl !text-slate-900 dark:!text-white">
                 HUB
               </Button>
               <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                  <Hammer size={12} /> {stats.levelsCreated} Levels Created
               </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-sm aspect-square perspective-1000 hidden lg:block">
           <div className="w-full h-full bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-700 rounded-[4rem] shadow-2xl flex items-center justify-center transform rotate-y-12 rotate-x-6 animate-float relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <span className="text-[12rem] transform -translate-y-6 drop-shadow-2xl">🐶</span>
              <div className="absolute inset-x-0 bottom-12 text-center">
                 <div className="text-white font-black text-3xl uppercase tracking-tighter italic">RANK: {stats.rank}</div>
                 <div className="text-white/60 text-sm font-bold uppercase tracking-[0.3em]">BATTLE READY</div>
              </div>
           </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between px-6">
          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter flex items-center gap-4 text-slate-900 dark:text-white">
              <Calendar className="text-fuchsia-500" /> DAILY CHALLENGE
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs ml-12">New high-stakes mission every 24 hours</p>
          </div>
          <button onClick={onGoToHub} className="text-purple-600 dark:text-pink-400 font-black text-sm sm:text-base uppercase tracking-widest hover:text-fuchsia-500 transition-colors bg-purple-500/5 px-6 py-3 rounded-2xl border border-purple-500/10">Explore All →</button>
        </div>
        
        <div 
          className="glass rounded-[4rem] p-10 sm:p-16 flex flex-col lg:flex-row items-center gap-12 group cursor-pointer hover:bg-white/10 transition-all duration-500 border-purple-500/10 dark:border-white/10 shadow-[0_50px_100px_-20px_rgba(168,85,247,0.2)]" 
          onClick={() => onPlayFeatured(featuredLevel)}
        >
           <div className="w-full lg:w-72 aspect-square bg-slate-200 dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-inner flex items-center justify-center relative border-4 border-purple-500/10 group-hover:border-fuchsia-500/30 transition-colors">
              <div className="grid grid-cols-3 gap-3 p-8 opacity-20 group-hover:opacity-60 transition-opacity">
                 {Array.from({length: 9}).map((_, i) => (
                   <div key={i} className="w-12 h-12 rounded-full bg-purple-500/30 dark:bg-purple-700/20 shadow-inner" />
                 ))}
              </div>
              <div className="absolute text-8xl group-hover:scale-125 transition-transform duration-700 ease-out drop-shadow-2xl">🐹</div>
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
           </div>

           <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="space-y-3">
                <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                   <span className="px-4 py-1.5 bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                     <Trophy size={14} /> Featured Level
                   </span>
                   <span className="px-4 py-1.5 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full text-xs font-black uppercase tracking-widest">
                     Difficulty: HARD
                   </span>
                </div>
                <h3 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white group-hover:gradient-text transition-all duration-500 leading-none">
                  {featuredLevel.name}
                </h3>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 font-medium text-xl sm:text-2xl line-clamp-2 max-w-2xl leading-relaxed">
                {featuredLevel.description}
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4">
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-xl">👤</div>
                    <div className="text-left">
                       <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Creator</div>
                       <div className="font-bold text-slate-900 dark:text-white">@{featuredLevel.author}</div>
                    </div>
                 </div>
                 <div className="h-10 w-px bg-purple-500/10" />
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-500"><Zap size={24} /></div>
                    <div className="text-left">
                       <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Engagement</div>
                       <div className="font-bold text-slate-900 dark:text-white">{featuredLevel.plays.toLocaleString()} Plays</div>
                    </div>
                 </div>
                 <div className="h-10 w-px bg-purple-500/10" />
                 <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-500"><TrendingUp size={24} /></div>
                    <div className="text-left">
                       <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Win Rate</div>
                       <div className="font-bold text-slate-900 dark:text-white">64%</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="w-full lg:w-auto self-stretch flex items-center justify-center lg:border-l border-purple-500/10 lg:pl-12">
              <Button variant="secondary" size="lg" className="rounded-3xl w-full lg:w-auto h-24 lg:h-full lg:px-12 text-3xl font-black italic !bg-gradient-to-br from-fuchsia-500 to-pink-600">
                 PLAY NOW
              </Button>
           </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
         <div className="glass p-8 rounded-[3rem] border-purple-500/10 hover:bg-white/10 transition-all cursor-pointer group" onClick={onGoToHub}>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-500 group-hover:scale-110 transition-transform"><LayoutGrid size={28} /></div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Browse Community</h4>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Explore thousands of user-generated levels from around the world.</p>
         </div>
         <div className="glass p-8 rounded-[3rem] border-pink-500/10 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-pink-500/20 rounded-2xl text-pink-500 group-hover:scale-110 transition-transform"><Hammer size={28} /></div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Workshop Tools</h4>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Build your own masterpiece using our intuitive logic engine.</p>
         </div>
      </section>
    </div>
  );
};

export default HomePage;
