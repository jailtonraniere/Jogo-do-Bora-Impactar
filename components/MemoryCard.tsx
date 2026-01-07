
import React from 'react';
import { CardData, CardTheme } from '../types';

interface MemoryCardProps {
  card: CardData;
  isFlipped: boolean;
  isMatched: boolean;
  isNewlyMatched?: boolean;
  onClick: (card: CardData) => void;
  disabled: boolean;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ card, isFlipped, isMatched, isNewlyMatched, onClick, disabled }) => {
  const handleClick = () => {
    if (!isFlipped && !isMatched && !disabled) {
      onClick(card);
    }
  };

  const getAnimationClass = () => {
    if (isNewlyMatched) return "animate-success-celebration";
    if (!isFlipped && !isMatched) return "";
    
    // Apply theme-specific gentle animations
    switch (card.theme) {
      case CardTheme.SOLIDARITY: return "animate-heartbeat";
      case CardTheme.ENVIRONMENT: return "animate-grow-sway";
      case CardTheme.EMPATHY: return "animate-bounce-gentle";
      case CardTheme.EDUCATION: return "animate-wiggle";
      case CardTheme.INCLUSION: return "animate-pulse-soft";
      case CardTheme.ANIMALS: return "animate-bounce-gentle";
      case CardTheme.KINDNESS: return "animate-spin-slow";
      case CardTheme.SHARING: return "animate-float";
      case CardTheme.RESPECT: return "animate-pulse-soft";
      case CardTheme.HEALTH: return "animate-bounce-gentle";
      case CardTheme.PEACE: return "animate-float-horizontal";
      default: return "animate-pulse-soft";
    }
  };

  return (
    <div 
      className={`relative h-28 w-20 md:h-40 md:w-32 cursor-pointer perspective-1000 
        ${isMatched && !isNewlyMatched ? 'opacity-40 grayscale-[0.2]' : ''} 
        ${isNewlyMatched ? 'z-30 scale-110' : 'z-0'} 
        transition-all duration-300`}
      onClick={handleClick}
    >
      <div className={`flip-card-inner w-full h-full relative duration-500 rounded-xl shadow-md 
        ${isFlipped || isMatched || isNewlyMatched ? 'flip-card-flipped' : ''} 
        ${isNewlyMatched ? 'shadow-[0_0_45px_rgba(50,197,255,1)]' : ''}`}>
        
        {/* Face para baixo */}
        <div className="flip-card-front bg-gradient-to-br from-[#32c5ff] to-[#0c1c4e] rounded-xl flex items-center justify-center border-4 border-white overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:10px_10px]"></div>
          <span className="text-3xl md:text-5xl text-white font-bold drop-shadow-md">?</span>
        </div>
        
        {/* Face para cima */}
        <div className={`flip-card-back bg-white rounded-xl flex flex-col items-center justify-center p-2 border-4 
          ${isNewlyMatched ? 'border-[#32c5ff] animate-success-glow' : 'border-[#32c5ff]'} 
          text-center overflow-hidden`}>
          <div className={`text-3xl md:text-5xl mb-1 drop-shadow-sm transition-transform duration-500 ${getAnimationClass()}`}>
            {card.content}
          </div>
          <p className="text-[9px] md:text-[11px] font-bold text-[#0c1c4e] leading-tight uppercase tracking-tighter">
            {card.label}
          </p>
          
          {/* Efeitos de celebração ao acertar par */}
          {isNewlyMatched && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[#32c5ff11] animate-pulse"></div>
               <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] border-2 border-[#32c5ff] rounded-full animate-ping opacity-20"></div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes grow-sway {
          0%, 100% { transform: scale(1) rotate(-3deg); }
          50% { transform: scale(1.05) rotate(3deg); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(0.97); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes float-horizontal {
          0%, 100% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes success-glow {
          0%, 100% { border-color: #32c5ff; box-shadow: 0 0 10px rgba(50,197,255,0.5); }
          50% { border-color: #ffffff; box-shadow: 0 0 40px rgba(50,197,255,1); }
        }
        @keyframes success-celebration {
          0% { transform: scale(1) translateY(0) rotate(0); }
          25% { transform: scale(1.25) translateY(-15px) rotate(-4deg); }
          50% { transform: scale(1.15) translateY(-8px) rotate(4deg); }
          75% { transform: scale(1.25) translateY(-12px) rotate(-2deg); }
          100% { transform: scale(1.15) translateY(-4px) rotate(0); }
        }

        .animate-heartbeat { animation: heartbeat 1.2s ease-in-out infinite; }
        .animate-grow-sway { animation: grow-sway 2.5s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 1.2s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 0.6s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 2.5s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-horizontal { animation: float-horizontal 3.5s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-success-glow { animation: success-glow 0.4s ease-in-out infinite; }
        .animate-success-celebration { animation: success-celebration 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default MemoryCard;
