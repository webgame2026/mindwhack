
import React, { useState } from 'react';
import { UserStats } from '../types';
import Button from './Button';
import { X, Save, User as UserIcon, Camera, Bell, Shield, Volume2, VolumeX, Moon, Sun } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onUpdateUser: (updates: Partial<UserStats>) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  soundEnabled, 
  onToggleSound, 
  onUpdateUser,
  theme,
  onToggleTheme
}) => {
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateUser({ username, avatar });
    onClose();
  };

  const handleRandomizeAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative glass w-full max-w-xl rounded-[3rem] p-8 sm:p-12 border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Decorative Background Blob */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="absolute top-0 right-0 p-8">
          <button onClick={onClose} className="p-3 hover:bg-black/5 dark:hover:bg-white/10 rounded-2xl transition-all text-slate-400 active:scale-90">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8 relative z-10">
          <header className="space-y-2">
            <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white uppercase">Settings</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">Master your profile configurations</p>
          </header>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="p-6 bg-black/5 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10 space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white/20 shadow-xl bg-slate-800">
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    onClick={handleRandomizeAvatar}
                    className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg transform hover:scale-110 active:scale-90 transition-all border-2 border-white/20"
                    title="Randomize Avatar"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Player Handle</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/10 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-3 text-slate-900 dark:text-white font-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="Enter username..."
                  />
                </div>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <button 
                  onClick={onToggleSound}
                  className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-300 ${soundEnabled ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' : 'bg-black/5 dark:bg-white/5 border-transparent text-slate-400'}`}
               >
                  <div className="flex items-center gap-4">
                    {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    <span className="font-black uppercase tracking-widest text-[11px]">Audio Effects</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${soundEnabled ? 'bg-blue-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${soundEnabled ? 'left-5' : 'left-1'}`} />
                  </div>
               </button>

               <button 
                  onClick={onToggleTheme}
                  className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-300 ${theme === 'dark' ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400' : 'bg-orange-500/10 border-orange-500/30 text-orange-600'}`}
               >
                  <div className="flex items-center gap-4">
                    {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
                    <span className="font-black uppercase tracking-widest text-[11px]">{theme === 'dark' ? 'Night Mode' : 'Light Mode'}</span>
                  </div>
                  <div className={`w-10 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-purple-500' : 'bg-orange-500'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'left-5' : 'left-1'}`} />
                  </div>
               </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-40">
               <div className="flex items-center gap-4 p-5 glass border-none text-slate-400">
                  <Bell size={20} />
                  <span className="font-black uppercase tracking-widest text-[10px]">Cloud Sync Off</span>
               </div>
               <div className="flex items-center gap-4 p-5 glass border-none text-slate-400">
                  <Shield size={20} />
                  <span className="font-black uppercase tracking-widest text-[10px]">v1.0.4 Release</span>
               </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
             <Button onClick={handleSave} variant="primary" size="lg" className="flex-1 py-5 text-xl">
               <Save size={22} className="mr-3" /> Update Profile
             </Button>
             <Button onClick={onClose} variant="glass" size="lg" className="flex-1 py-5 text-xl !text-slate-900 dark:!text-white border-none shadow-none">
               Discard
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
