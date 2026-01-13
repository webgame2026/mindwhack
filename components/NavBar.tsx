
import React from 'react';
import { Home, Compass, PlusCircle, User, Sun, Moon } from 'lucide-react';
import { AppView } from '../types';
import { soundService } from '../services/soundService';

interface NavBarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, onNavigate, theme, toggleTheme }) => {
  const tabs = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'hub', icon: <Compass size={24} />, label: 'Explore' },
    { id: 'editor', icon: <PlusCircle size={24} />, label: 'Build' },
    { id: 'profile', icon: <User size={24} />, label: 'Profile' }
  ];

  const handleNav = (id: string) => {
    soundService.playClick();
    onNavigate(id as AppView);
  };

  const handleThemeToggle = () => {
    soundService.playClick();
    toggleTheme();
  };

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-lg">
      <div className="glass rounded-full border border-purple-500/20 p-2 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-1">
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleNav(tab.id)}
              className={`
                relative flex-1 flex flex-col items-center justify-center py-3 rounded-full transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-fuchsia-500 dark:hover:text-white hover:bg-white/10'}
              `}
            >
              <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                {tab.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest mt-1 transition-all ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50 absolute -bottom-4'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
        
        <div className="w-px h-8 bg-purple-500/20 mx-1" />
        
        <button
          onClick={handleThemeToggle}
          className="p-3 text-slate-500 dark:text-slate-400 hover:text-pink-500 dark:hover:text-white transition-colors flex items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
