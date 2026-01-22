import React, { useState, useEffect } from 'react';
import Button from './Button';
import { CheckCircle2, X, Smartphone, Download, Layout } from 'lucide-react';

interface EntryPageProps {
  onEnter: () => void;
}

const EntryPage: React.FC<EntryPageProps> = ({ onEnter }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect if already installed
    const checkIsInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true ||
                          document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkIsInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
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
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setDeferredPrompt(null);
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000 bg-[#020617] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-fuchsia-600/20 blur-[150px] rounded-full animate-blob" />
        <div className="absolute inset-0 bg-blue-600/10 blur-[120px] rounded-full animate-blob [animation-delay:4s] scale-75" />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-10">
        <header className="space-y-4">
          <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 group">
             <div className="absolute inset-0 bg-fuchsia-500/30 blur-3xl rounded-full animate-pulse group-hover:scale-125 transition-transform" />
             <div className="relative h-full w-full rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-slate-900 flex items-center justify-center">
                <span className="text-6xl sm:text-7xl animate-bounce-slow">🧠</span>
             </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-5xl sm:text-6xl font-black italic tracking-tighter text-white uppercase drop-shadow-xl">
              MIND<span className="gradient-text">WHACK</span>
            </h1>
            <p className="text-slate-400 text-sm font-bold tracking-widest uppercase opacity-70">Creative Brainstorming Arena</p>
          </div>
        </header>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={onEnter} 
            variant="primary" 
            size="lg" 
            className="w-full py-6 text-2xl rounded-[2rem] shadow-fuchsia-500/20 group overflow-hidden"
          >
            <span className="flex items-center gap-3">
              <Layout size={24} /> ENTER ARENA
            </span>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
          </Button>

          {(!isInstalled && deferredPrompt) && (
            <div className="space-y-3 pt-2">
              <button 
                onClick={handleInstallClick}
                className="w-full py-5 px-6 rounded-[2rem] bg-gradient-to-r from-blue-600/90 to-indigo-700/90 border border-white/10 flex items-center justify-between text-left group hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
                    <Download size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/70 leading-none">Android / Chrome</div>
                    <div className="text-sm font-black text-white uppercase mt-0.5">INSTALL WEB APP</div>
                  </div>
                </div>
                <div className="p-1 bg-white/10 rounded-full">
                  <Smartphone size={16} className="text-white/50" />
                </div>
              </button>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic animate-pulse">
                Unlock full-screen play & high performance
              </p>
            </div>
          )}

          {isInstalled && (
            <div className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 font-black uppercase tracking-widest text-[9px]">
              <CheckCircle2 size={14} /> Application Installed
            </div>
          )}
        </div>

        <footer className="pt-6">
           <a 
            href="https://www.facebook.com/riajul.daian.arpon" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 glass border-blue-500/10 hover:border-blue-500/40 rounded-full text-slate-400 hover:text-blue-400 transition-all text-[10px] font-black uppercase tracking-widest"
           >
             Created by Arpon
           </a>
        </footer>
      </div>
    </div>
  );
};

export default EntryPage;
