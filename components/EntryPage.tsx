
import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Sparkles, Download, CheckCircle2, X, Smartphone, Share, Facebook, UserCheck } from 'lucide-react';

interface EntryPageProps {
  onEnter: () => void;
}

const EntryPage: React.FC<EntryPageProps> = ({ onEnter }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Detect Safari on iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isSafariBrowser = userAgent.includes('safari') && !userAgent.includes('chrome') && !userAgent.includes('android');
    setIsSafari(isSafariBrowser);

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
  };

  const showPrompt = !isInstalled && !isDismissed && (deferredPrompt || (isSafari && !isInstalled));

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 overflow-hidden bg-[#020617]">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square pointer-events-none">
        <div className="absolute inset-0 bg-purple-600/25 blur-[150px] rounded-full animate-blob" />
        <div className="absolute inset-0 bg-pink-600/15 blur-[120px] rounded-full animate-blob [animation-delay:3.5s] scale-75" />
      </div>

      {/* PWA Install Banner */}
      {showPrompt && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-[110] animate-in slide-in-from-top-10 duration-500">
          <div className="glass rounded-3xl p-5 border border-purple-500/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none" />
            
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <Smartphone size={24} className="text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-black text-white uppercase tracking-tight">Install MindWhack</h4>
              <p className="text-[10px] text-purple-200/60 font-bold uppercase tracking-wider line-clamp-1">
                {isSafari ? "Tap 'Share' then 'Add to Home Screen'" : "Play offline & full screen experience"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isSafari && deferredPrompt && (
                <Button onClick={handleInstallClick} size="sm" variant="primary" className="rounded-xl px-4 py-2 text-[10px] whitespace-nowrap">
                  INSTALL
                </Button>
              )}
              {isSafari && (
                <div className="p-2 bg-white/10 rounded-xl text-fuchsia-400">
                  <Share size={18} />
                </div>
              )}
              <button 
                onClick={() => setIsDismissed(true)}
                className="p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative z-10 flex flex-col items-center space-y-10 text-center animate-in zoom-in-95 fade-in duration-1000">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-fuchsia-400 text-xs font-black uppercase tracking-[0.3em]">
            <Sparkles size={14} /> Creative Universe
          </div>
          <h1 className="text-7xl sm:text-9xl font-black italic tracking-tighter leading-none text-white drop-shadow-2xl">
            MIND<span className="gradient-text">WHACK</span>
          </h1>
          <p className="text-purple-200/60 text-lg sm:text-xl font-medium tracking-wide max-w-sm mx-auto opacity-80">
            Design. Build. Whack. The ultimate UGC brainstorming arena.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-fuchsia-500/30 blur-2xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-500 opacity-50" />
            <Button 
              onClick={onEnter} 
              variant="primary" 
              size="lg" 
              className="relative px-16 py-10 text-4xl sm:text-5xl rounded-[3rem] shadow-[0_20px_40px_-10px_rgba(168,85,247,0.5)] transform hover:scale-105 active:scale-95 transition-all"
            >
              ENTER GAME
            </Button>
          </div>

           <button 
            onClick={handleDevClick}
            className="group flex items-center gap-3 px-8 py-4 glass border-blue-500/20 hover:border-blue-500/50 rounded-full transition-all active:scale-95 hover:bg-blue-600/10 shadow-lg"
          >
            <div className="p-2 bg-blue-600 rounded-lg text-white group-hover:rotate-12 transition-transform shadow-blue-500/20 shadow-lg">
              <Facebook size={18} fill="currentColor" />
            </div>
            <div className="text-left">
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 opacity-70">Developer</div>
              <div className="text-sm font-black text-blue-400 uppercase tracking-tighter">Riajul Daian Arpon</div>
            </div>
          </button>
          
          {isInstalled && (
             <div className="flex items-center gap-2 text-fuchsia-500/60 font-black uppercase tracking-widest text-[10px] animate-in fade-in duration-1000">
               <CheckCircle2 size={12} /> App Installed & Synced
             </div>
          )}
        </div>

        <div className="flex gap-8 items-center opacity-30">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🐶</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Classic</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🛠️</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Creator</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🏆</span>
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Ranked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
