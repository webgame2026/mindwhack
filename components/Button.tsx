
import React from 'react';
import { soundService } from '../services/soundService';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  onClick,
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-extrabold transition-all duration-300 rounded-2xl active:scale-[0.97] group select-none touch-manipulation";
  
  const variants = {
    primary: `
      bg-gradient-to-br from-purple-500 via-fuchsia-600 to-pink-700 
      text-white 
      shadow-[0_4px_0_0_rgba(112,26,117,1),0_8px_15px_-5px_rgba(236,72,153,0.5)] 
      hover:shadow-[0_6px_0_0_rgba(112,26,117,1),0_12px_20px_-5px_rgba(236,72,153,0.6)] 
      hover:-translate-y-1
      active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(112,26,117,1),0_4px_10px_-5px_rgba(236,72,153,0.4)]
    `,
    secondary: `
      bg-gradient-to-br from-indigo-400 via-purple-500 to-fuchsia-700 
      text-white 
      shadow-[0_4px_0_0_rgba(75,30,138,1),0_8px_15px_-5px_rgba(168,85,247,0.5)] 
      hover:shadow-[0_6px_0_0_rgba(75,30,138,1),0_12px_20px_-5px_rgba(168,85,247,0.6)] 
      hover:-translate-y-1
      active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(75,30,138,1),0_4px_10px_-5px_rgba(168,85,247,0.4)]
    `,
    danger: `
      bg-gradient-to-br from-rose-400 via-rose-500 to-pink-700 
      text-white 
      shadow-[0_4px_0_0_rgba(159,18,57,1),0_8px_15px_-5px_rgba(244,63,94,0.5)] 
      hover:shadow-[0_6px_0_0_rgba(159,18,57,1),0_12px_20px_-5px_rgba(244,63,94,0.6)] 
      hover:-translate-y-1
      active:translate-y-0.5 active:shadow-[0_2px_0_0_rgba(159,18,57,1),0_4px_10px_-5px_rgba(244,63,94,0.4)]
    `,
    glass: `
      glass text-slate-900 dark:text-white 
      shadow-[0_4px_0_0_rgba(0,0,0,0.05),0_8px_15px_-5px_rgba(168,85,247,0.1)] 
      dark:shadow-[0_4px_0_0_rgba(255,255,255,0.05),0_8px_15px_-5px_rgba(0,0,0,0.3)]
      hover:bg-white/40 dark:hover:bg-white/10 hover:-translate-y-1
      active:translate-y-0.5 active:shadow-none
    `
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-7 py-3.5 text-base tracking-wide",
    lg: "px-12 py-6 text-2xl tracking-tight"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundService.playClick();
    if (onClick) onClick(e);
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      onClick={handleClick}
      {...props}
    >
      <span className="absolute inset-x-0 top-0 h-[1px] bg-white/30 rounded-t-2xl pointer-events-none" />
      <span className="relative z-10 flex items-center justify-center drop-shadow-sm">
        {children}
      </span>
      <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shine_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 pointer-events-none" />
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          50% { transform: translateX(100%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }
      `}</style>
    </button>
  );
};

export default Button;
