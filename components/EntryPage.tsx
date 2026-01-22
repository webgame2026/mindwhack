import React, { useState, useEffect } from 'react';
import Button from './Button';
import { Sparkles, CheckCircle2, X, Smartphone, Share, Facebook, Info, Monitor, SmartphoneNfc, Download, Layout } from 'lucide-react';

interface EntryPageProps {
  onEnter: () => void;
}

const EntryPage: React.FC<EntryPageProps> = ({ onEnter }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isSafari, setIsSafari] = useState(false);
  const [showInstallOverlay, setShowInstallOverlay] = useState(false);

  useEffect(() => {
    // Detect if already installed
    const checkIsInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true ||
                          document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    checkIsInstalled();

    // Detect Safari iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isSafariBrowser = userAgent.includes('safari') && 
                           !userAgent.includes('chrome') && 
                           !userAgent.includes('android') && 
                           /iphone|ipad|ipod/.test(userAgent);
    setIsSafari(isSafariBrowser);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('MindWhack: PWA installation prompt is ready.');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstallOverlay(false);
      console.log('MindWhack: Installed successfully.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallOverlay(true);
    }
  };

  const handleDevClick = () => {
    window.open('https://www.facebook.com/riajul.daian.arpon', '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 overflow-hidden bg-[#020617]">
      {/* Immersive Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-square pointer-events-none">
        <div className="absolute inset-0 bg-fuchsia-600/20 blur-[180px] rounded-full animate-blob" />
        <div className="absolute inset-0 bg-blue-600/10 blur-[140px] rounded-full animate-blob [animation-delay:4s] scale-90" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-12 text-center animate-in zoom-in-95 fade-in duration-1000 max-w-lg w-full">
        
        {/* Logo Section */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-fuchsia-500/40 blur-3xl rounded-full scale-125 animate-pulse" />
              
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-[3.5rem] sm:rounded-[4rem] overflow-hidden border-4 border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex items-center justify-center bg-slate-900 group-hover:scale-105 transition-transform duration-700">
                <img 
                  src="assets/192x192.png" 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <span className="text-7xl sm:text-8xl drop-shadow-2xl animate-bounce-slow">🧠</span>
                  <div className="mt-2 text-[10px] font-black text-white/40 tracking-[0.4em] uppercase">MindWhack</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-[10px] font-black uppercase tracking-[0.4em]">
              <Sparkles size={14} className="animate-pulse" /> Original Content Engine
            </div>
            <h1 className="text-7xl sm:text-8xl font-black italic tracking-tighter leading-none text-white drop-shadow-2xl">
              MIND<span className="gradient-text">WHACK</span>
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl font-bold tracking-tight max-w-sm mx-auto opacity-90 leading-tight italic">
              Empowering creators to build, share, and dominate the arena.
            </p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="flex flex-col items-center gap-6 w-full px-4">
          <div className="relative group w-full">
            <div className="absolute inset-0 bg-fuchsia-500/20 blur-2xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-500 opacity-50" />
            <Button 
              onClick={onEnter} 
              variant="primary" 
              size="lg" 
              className="relative px-12 py-10 text-4xl sm:text-5xl rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(168,85,247,0.5)] transform hover:scale-[1.03] active:scale-95 transition-all w-full flex items-center justify-center gap-4"
            >
              <Layout size={40} className="hidden sm:block" /> START GAME
            </Button>
          </div>

          {!isInstalled && (
            <div className="w-full space-y-4">
              <Button 
                onClick={handleInstallClick} 
                variant="secondary" 
                size="md" 
                className="group px-8 py-6 rounded-3xl border border-white/10 shadow-2xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-4 w-full bg-gradient-to-r from-blue-600 to-indigo-700"
              >
                <div className="p-2 bg-white/20 rounded-xl group-hover:rotate-12 transition-transform">
                  <Download size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="text-[9px] font-black uppercase tracking-widest opacity-80 leading-none">Instant Access</div>
                  <div className="text-lg font-black uppercase leading-none mt-1">
                    {deferredPrompt ? 'DIRECT INSTALL' : 'GET APP VERSION'}
                  </div>
                </div>
              </Button>
              
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                Unlock full-screen play & offline logic
              </p>
            </div>
          )}

          {isInstalled && (
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 font-black uppercase tracking-widest text-xs animate-in fade-in zoom-in duration-500">
              <CheckCircle2 size={16} /> PWA Version Active
            </div>
          )}

          <button 
            onClick={handleDevClick}
            className="group flex items-center gap-3 px-8 py-4 glass border-blue-500/10 hover:border-blue-500/30 rounded-full transition-all active:scale-95 hover:bg-blue-600/5 shadow-lg"
          >
            <div className="p-2 bg-blue-600/80 rounded-lg text-white group-hover:rotate-12 transition-transform">
              <Facebook size={18} fill="currentColor" />
            </div>
            <div className="text-left">
              <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">Curated By</div>
              <div className="text-sm font-black text-blue-400 uppercase tracking-tighter">Riajul Daian Arpon</div>
            </div>
          </button>
        </div>
      </div>

      {/* Modern Installation Guide Overlay */}
      {showInstallOverlay && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowInstallOverlay(false)} />
          <div className="relative glass w-full max-w-sm rounded-[3.5rem] p-10 border-white/10 shadow-2xl space-y-8">
            <button 
              onClick={() => setShowInstallOverlay(false)}
              className="absolute top-6 right-6 p-3 text-slate-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <header className="text-center space-y-3">
              <div className="inline-flex p-4 bg-blue-500/20 rounded-3xl text-blue-400 mb-2">
                <Smartphone size={40} />
              </div>
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">Install Guide</h3>
              <p className="text-sm text-slate-400 font-bold">Follow these steps for the best experience.</p>
            </header>

            <div className="space-y-6">
              {isSafari ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-5 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="p-3 bg-white/10 rounded-xl text-white">
                      <Share size={24} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-white uppercase">Step 1</div>
                      <div className="text-[11px] text-slate-400 font-bold leading-tight">Tap the 'Share' button in your Safari toolbar.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="p-3 bg-white/10 rounded-xl text-white">
                      <PlusCircle size={24} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-white uppercase">Step 2</div>
                      <div className="text-[11px] text-slate-400 font-bold leading-tight">Scroll down and tap 'Add to Home Screen'.</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-5 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="p-3 bg-white/10 rounded-xl text-white">
                      <Monitor size={24} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-white uppercase">Browser Menu</div>
                      <div className="text-[11px] text-slate-400 font-bold leading-tight">Tap the three dots (⋮) or browser menu.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="p-3 bg-white/10 rounded-xl text-white">
                      <Download size={24} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-white uppercase">Option</div>
                      <div className="text-[11px] text-slate-400 font-bold leading-tight">Select 'Install App' or 'Add to Home Screen'.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button onClick={() => setShowInstallOverlay(false)} variant="glass" className="w-full py-5 rounded-2xl text-white font-black uppercase text-xs tracking-widest border-none">
              Got it, thanks!
            </Button>
          </div>
        </div>
      )}

      {/* Version Footer */}
      <div className="absolute bottom-10 left-0 right-0 px-6 flex justify-between items-center opacity-30 pointer-events-none">
        <div className="text-[8px] font-black uppercase tracking-[0.5em] text-white">Build v1.0.8 / Stable</div>
        <div className="flex gap-4">
          <div className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse" />
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse [animation-delay:0.5s]" />
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse [animation-delay:1s]" />
        </div>
      </div>
    </div>
  );
};

// Internal icon used for guide
const PlusCircle = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default EntryPage;
