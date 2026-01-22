
import React, { useState, useEffect } from 'react';
import { GameLevel, LevelLogic, TargetType, GameType, BoardTheme, MoodProfile } from '../types';
import Button from './Button';
import GameHole from './GameHole';
import { generateLevelLogic, suggestThemes } from '../services/geminiService';
import { TARGET_ICONS } from '../constants';
import { 
  Wand2, Save, X, Info, Settings2, Target, ChevronLeft, 
  LayoutGrid, Zap, Trophy, Clock, Sparkles, RefreshCw,
  Eye, Timer, BarChart3, Binary, Rocket, ShieldCheck,
  Gamepad2, Palette, Activity, Gauge, MousePointer2, AlertCircle
} from 'lucide-react';

interface LevelEditorProps {
  onSave: (level: GameLevel) => void;
  onCancel: () => void;
}

const LevelEditor: React.FC<LevelEditorProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gridSize, setGridSize] = useState(3);
  const [themePrompt, setThemePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [logic, setLogic] = useState<LevelLogic | null>(null);
  const [activeTab, setActiveTab] = useState<'visuals' | 'logic' | 'targets'>('visuals');

  useEffect(() => {
    handleFetchSuggestions();
  }, []);

  const handleFetchSuggestions = async () => {
    setIsSuggesting(true);
    const results = await suggestThemes(themePrompt || undefined);
    setSuggestions(results);
    setIsSuggesting(false);
  };

  const handleGenerateLogic = async (customPrompt?: string) => {
    const promptToUse = customPrompt || themePrompt;
    if (!promptToUse) return;
    setIsGenerating(true);
    const result = await generateLevelLogic(promptToUse, logic || undefined);
    setLogic({
      ...result,
      gameType: logic?.gameType || 'Standard',
      boardTheme: logic?.boardTheme || 'Cyber'
    });
    setIsGenerating(false);
  };

  const updateLogicField = <K extends keyof LevelLogic>(field: K, value: LevelLogic[K]) => {
    if (!logic) return;
    setLogic({ ...logic, [field]: value });
  };

  const handlePublish = () => {
    if (!name || !logic) return;
    const newLevel: GameLevel = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      author: 'You',
      description,
      gridSize,
      logic,
      rating: 5.0,
      ratingCount: 1,
      plays: 0,
      createdAt: Date.now()
    };
    onSave(newLevel);
  };

  // Fixed logic.gridSize error: using local state variable gridSize instead
  const difficultyScore = logic ? Math.round(
    ((1500 - logic.spawnInterval) / 100) + 
    ((1200 - logic.activeDuration) / 100) + 
    ((logic.speedMultiplier || 1) * 5) +
    (gridSize === 5 ? 10 : gridSize === 4 ? 5 : 0)
  ) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="flex items-center justify-between mb-8 sm:mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-3 glass rounded-2xl hover:bg-white/10 active:scale-90 transition-all sm:hidden">
            <ChevronLeft size={24} className="text-blue-400" />
          </button>
          <div>
            <h2 className="text-3xl sm:text-5xl font-black gradient-text italic tracking-tighter uppercase">Workshop<span className="text-white not-italic">Labs</span></h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Experimental UGC Construction Toolset</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="glass" size="sm" className="hidden sm:flex rounded-full">
            <X size={20} className="mr-1" /> Discard
          </Button>
          <Button onClick={handlePublish} variant="primary" size="sm" className="rounded-full px-8" disabled={!name || !logic}>
            <Save size={20} className="mr-1" /> Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Input & AI */}
        <div className="lg:col-span-4 space-y-6">
          <section className="glass p-6 sm:p-8 rounded-[2.5rem] border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-lg font-black text-white uppercase tracking-tighter">
                <Settings2 size={20} className="text-blue-400" /> Identity
              </h3>
            </div>
            <div className="space-y-4">
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Level Name..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all font-bold text-white placeholder:text-slate-600"
              />
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Creators note..."
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition-all resize-none text-sm font-medium text-white placeholder:text-slate-600"
              />
            </div>
          </section>

          <section className="glass p-6 sm:p-8 rounded-[2.5rem] border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-3 text-lg font-black text-white uppercase tracking-tighter">
                <Wand2 size={20} className="text-purple-400" /> AI Refinement
              </h3>
              <button onClick={handleFetchSuggestions} className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300">
                <RefreshCw size={12} className={isSuggesting ? 'animate-spin' : ''} />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, i) => (
                <button key={i} onClick={() => setThemePrompt(suggestion)} className="px-3 py-1 bg-white/5 hover:bg-blue-500/20 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400 transition-all active:scale-95">
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="relative">
                <input 
                  value={themePrompt}
                  onChange={(e) => setThemePrompt(e.target.value)}
                  placeholder="Ask for 'Extreme' or 'Chill'..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-purple-500 transition-all text-sm font-bold text-white"
                />
                {isGenerating && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleGenerateLogic("Make it significantly harder and more chaotic")}
                  className="p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase text-rose-400 flex items-center justify-center gap-2"
                >
                  <Activity size={14} /> Add Chaos
                </button>
                <button 
                  onClick={() => handleGenerateLogic("Make it a high-stakes bonus round with mostly stars")}
                  className="p-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-xl text-[10px] font-black uppercase text-yellow-400 flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} /> Bonus Round
                </button>
              </div>

              <Button onClick={() => handleGenerateLogic()} variant="secondary" disabled={isGenerating || !themePrompt} className="w-full h-14">
                {isGenerating ? 'Synthesizing...' : (logic ? 'Re-calculate Logic' : 'Initiate Logic Generation')}
              </Button>
            </div>
          </section>

          {logic && (
            <div className="glass p-6 rounded-[2rem] border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Gauge size={20} /></div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Complexity Index</div>
                  <div className="text-xl font-black text-white">{difficultyScore} <span className="text-xs text-slate-500">/ 100</span></div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${difficultyScore > 40 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {difficultyScore > 60 ? 'Extreme' : difficultyScore > 30 ? 'Moderate' : 'Casual'}
              </div>
            </div>
          )}
        </div>

        {/* Center: Live Laboratory View */}
        <div className="lg:col-span-5 space-y-6">
          <section className="glass p-2 sm:p-2 rounded-[3.5rem] border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)] aspect-square relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
               <div className="px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white flex items-center gap-3">
                 <Binary size={14} className="text-blue-400" /> Tactile Preview
               </div>
            </div>

            <div className="w-full h-full p-8 sm:p-12 flex items-center justify-center">
               <div 
                 className="grid gap-4 w-full h-full opacity-60"
                 style={{ 
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    gridTemplateRows: `repeat(${gridSize}, 1fr)`
                 }}
               >
                 {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                    <div key={i} className="relative scale-90">
                       <GameHole 
                        isActive={i === Math.floor(Date.now() / 2000) % (gridSize * gridSize)} 
                        type={['dog', 'rat', 'bonus', 'cat', 'hazard'][i % 5] as TargetType}
                        onHit={() => {}} 
                        theme={logic?.boardTheme || 'Cyber'}
                        disabled
                       />
                    </div>
                 ))}
               </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 px-8 z-20">
               <div className="flex justify-center gap-2">
                  <button onClick={() => setActiveTab('visuals')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'visuals' ? 'bg-blue-600 text-white' : 'bg-black/40 text-slate-400 hover:text-white'}`}>Visuals</button>
                  <button onClick={() => setActiveTab('logic')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logic' ? 'bg-blue-600 text-white' : 'bg-black/40 text-slate-400 hover:text-white'}`}>Timing</button>
                  <button onClick={() => setActiveTab('targets')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'targets' ? 'bg-blue-600 text-white' : 'bg-black/40 text-slate-400 hover:text-white'}`}>Targets</button>
               </div>
            </div>
          </section>
          
          <div className="p-8 glass rounded-[3rem] border-white/10 min-h-[200px] animate-in fade-in duration-300">
             {activeTab === 'visuals' ? (
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest"><LayoutGrid size={14} /> Grid Size</label>
                      <div className="flex gap-2">
                        {[2, 3, 4, 5].map(s => (
                          <button key={s} onClick={() => setGridSize(s)} className={`flex-1 py-4 rounded-xl font-black transition-all ${gridSize === s ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}>{s}x{s}</button>
                        ))}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest"><Palette size={14} /> Theme</label>
                      <select 
                        value={logic?.boardTheme || 'Cyber'}
                        onChange={(e) => updateLogicField('boardTheme', e.target.value as BoardTheme)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-xs font-black text-white outline-none appearance-none"
                      >
                        <option value="Cyber">Cyber Neon</option>
                        <option value="Classic">Classic Grass</option>
                        <option value="Volcano">Volcano Peak</option>
                        <option value="Void">The Void</option>
                      </select>
                   </div>
                   <div className="col-span-2 space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest"><Sparkles size={14} /> Mood Profile</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['Classic', 'Zen', 'Aggressive', 'Chaos'] as MoodProfile[]).map(m => (
                          <button 
                            key={m} 
                            onClick={() => updateLogicField('moodProfile', m)}
                            className={`py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${logic?.moodProfile === m ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-500'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>
             ) : activeTab === 'logic' ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
                          <span>Spawn Interval</span>
                          <span className="text-white">{logic?.spawnInterval || 1000}ms</span>
                       </label>
                       <input type="range" min="200" max="3000" step="50" value={logic?.spawnInterval || 1000} onChange={(e) => updateLogicField('spawnInterval', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-blue-500" />
                    </div>
                    <div className="space-y-3">
                       <label className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
                          <span>Active Time</span>
                          <span className="text-white">{logic?.activeDuration || 800}ms</span>
                       </label>
                       <input type="range" min="100" max="2500" step="50" value={logic?.activeDuration || 800} onChange={(e) => updateLogicField('activeDuration', parseInt(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                       <label className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
                          <span>Target Speed</span>
                          <span className="text-white">x{(logic?.speedMultiplier || 1).toFixed(1)}</span>
                       </label>
                       <input type="range" min="0.5" max="2.5" step="0.1" value={logic?.speedMultiplier || 1} onChange={(e) => updateLogicField('speedMultiplier', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-purple-500" />
                    </div>
                    <div className="space-y-3">
                       <label className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
                          <span>Target Size</span>
                          <span className="text-white">x{(logic?.targetSizeMultiplier || 1).toFixed(1)}</span>
                       </label>
                       <input type="range" min="0.5" max="1.5" step="0.1" value={logic?.targetSizeMultiplier || 1} onChange={(e) => updateLogicField('targetSizeMultiplier', parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-800 rounded-full appearance-none accent-purple-500" />
                    </div>
                  </div>
                </div>
             ) : (
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Click target to edit points</p>
                   <div className="grid grid-cols-5 gap-3">
                     {Object.entries(TARGET_ICONS).map(([type, icon]) => (
                        <div key={type} className="flex flex-col items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/5">
                           <span className="text-2xl">{icon}</span>
                           <input 
                            type="number" 
                            value={logic?.targetScores?.[type as TargetType] || 0}
                            onChange={(e) => {
                              if (!logic) return;
                              setLogic({
                                ...logic,
                                targetScores: { ...logic.targetScores!, [type]: parseInt(e.target.value) }
                              });
                            }}
                            className="w-full bg-black/40 rounded-lg py-1 text-center font-black text-[10px] text-white outline-none focus:border-blue-500 border border-transparent"
                           />
                        </div>
                     ))}
                   </div>
                </div>
             )}
          </div>
        </div>

        {/* Right Column: Balancing & Specs */}
        <div className="lg:col-span-3 space-y-6">
           <section className="glass p-8 rounded-[3rem] border-white/10 shadow-2xl space-y-8 h-full flex flex-col">
              <h3 className="flex items-center gap-3 text-lg font-black text-white uppercase tracking-tighter">
                <Activity size={20} className="text-rose-400" /> Balancing
              </h3>
              
              <div className="flex-1 space-y-6">
                 {logic ? (
                   <>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center justify-between">
                          Distribution <BarChart3 size={12} />
                        </label>
                        <div className="space-y-4">
                           {Object.entries(logic.targetWeights).map(([type, weight]) => (
                              <div key={type} className="space-y-1">
                                 <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                                    <span>{type}</span>
                                    <span>{weight}%</span>
                                 </div>
                                 <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${weight}%` }} />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-white/5 p-6 rounded-[2rem] space-y-3">
                        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase"><AlertCircle size={14} /> AI Analysis</div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium italic opacity-80">"{logic.description}"</p>
                     </div>
                   </>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 text-center gap-4">
                      <Binary size={48} />
                      <div className="text-[10px] font-black uppercase tracking-widest">Waiting for simulation data</div>
                   </div>
                 )}
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Win Goal</span>
                   <span className="text-xl font-black text-white">{logic?.winConditionScore || 0}</span>
                 </div>
                 <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Level Duration</span>
                   <span className="text-xl font-black text-white">{logic?.timeLimit || 0}s</span>
                 </div>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default LevelEditor;
