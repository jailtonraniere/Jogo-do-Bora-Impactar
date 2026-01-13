
import React from 'react';
import { CardData, CardTheme } from '../types.ts';
import { CARD_PAIRS } from '../constants.tsx';

interface MemoryCardProps {
  card: CardData;
  isFlipped: boolean;
  isMatched: boolean;
  isNewlyMatched?: boolean;
  onClick: (card: CardData) => void;
  disabled: boolean;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ card, isFlipped, isMatched, isNewlyMatched, onClick, disabled }) => {
  const themeData = CARD_PAIRS.find(p => p.theme === card.theme);
  const mainColor = themeData?.color || '#a7f3d0';
  const accentColor = themeData?.secondaryColor || '#059669';

  const handleClick = () => {
    if (!isFlipped && !isMatched && !disabled) {
      onClick(card);
    }
  };

  const Illustration = () => {
    const isSituation = card.type === 'situation';
    const textToShow = isSituation ? themeData?.situation : themeData?.label;
    
    const renderVisual = () => {
      switch(card.theme) {
        case CardTheme.EDUCATION:
          return (
            <div className="relative flex items-center justify-center scale-110">
              <div className="absolute inset-0 bg-blue-100/50 rounded-full blur-2xl animate-pulse"></div>
              <span className="text-7xl md:text-8xl z-10 drop-shadow-xl rotate-[-5deg]">📖</span>
              <span className="absolute -top-6 -right-2 text-2xl animate-bounce">✨</span>
              <span className="absolute top-2 -left-6 text-xl opacity-70 animate-float-slow">A</span>
              <span className="absolute bottom-2 -right-6 text-xl opacity-70 animate-float-slow" style={{animationDelay: '1s'}}>B</span>
              <span className="absolute -bottom-4 left-0 text-xl opacity-70 animate-float-slow" style={{animationDelay: '0.5s'}}>C</span>
            </div>
          );
        case CardTheme.ENVIRONMENT:
          return (
            <div className="relative flex items-center justify-center scale-110">
              <div className="absolute -top-12 w-20 h-20 bg-yellow-200/30 rounded-full blur-xl animate-pulse"></div>
              <span className="text-7xl md:text-8xl z-10 drop-shadow-xl">🌳</span>
              <span className="absolute -top-8 -right-4 text-3xl animate-spin-slow">☀️</span>
              <span className="absolute bottom-0 -left-2 text-3xl animate-bounce">🌱</span>
              <div className="absolute bottom-2 right-0 flex gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>
                <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
          );
        case CardTheme.ANIMALS:
          return (
            <div className="relative flex items-center justify-center scale-110">
              <div className="absolute inset-0 bg-orange-100/40 rounded-full blur-2xl"></div>
              <span className="text-7xl md:text-8xl z-10 drop-shadow-xl">🐾</span>
              <span className="absolute -top-6 -right-6 text-4xl rotate-12 hover:rotate-[30deg] transition-transform">🐶</span>
              <span className="absolute -bottom-4 -left-6 text-4xl -rotate-12">🐱</span>
              <span className="absolute top-0 -left-8 text-xl animate-pulse">🦴</span>
            </div>
          );
        case CardTheme.SOLIDARITY:
          return (
            <div className="relative flex items-center justify-center scale-110">
              <div className="absolute inset-0 bg-red-100/50 rounded-full blur-2xl animate-ping opacity-20"></div>
              <span className="text-7xl md:text-8xl z-10 drop-shadow-xl">🎁</span>
              <span className="absolute -top-8 text-4xl animate-heart-beat">❤️</span>
              <span className="absolute top-0 -right-6 text-xl opacity-60 rotate-45">✨</span>
              <span className="absolute bottom-0 -left-6 text-xl opacity-60 -rotate-45">✨</span>
            </div>
          );
        case CardTheme.INCLUSION:
          return (
            <div className="relative flex items-center justify-center scale-110">
              <div className="absolute inset-0 border-[6px] border-dashed border-purple-300/30 rounded-full animate-spin-slow scale-125"></div>
              <span className="text-7xl md:text-8xl z-10 drop-shadow-xl">🎡</span>
              <span className="absolute -top-4 -left-4 text-3xl animate-bounce">🌈</span>
              <span className="absolute -bottom-2 -right-4 text-2xl">🤝</span>
            </div>
          );
        case CardTheme.EMPATHY:
          return (
            <div className="relative flex items-center justify-center scale-110">
              <div className="absolute inset-0 bg-yellow-100/40 rounded-full blur-xl animate-pulse"></div>
              <span className="text-7xl md:text-8xl z-10 drop-shadow-xl">🤝</span>
              <span className="absolute -top-6 text-3xl animate-float-gentle">⭐</span>
              <span className="absolute -bottom-2 text-2xl animate-float-gentle" style={{animationDelay: '1s'}}>💖</span>
            </div>
          );
        case CardTheme.KINDNESS:
          return (
            <div className="relative flex items-center justify-center scale-110">
              <span className="text-7xl md:text-8xl z-10 drop-shadow-xl animate-shimmer">✨</span>
              <span className="absolute -top-4 -right-4 text-3xl animate-pulse">🌸</span>
              <span className="absolute -bottom-4 -left-4 text-3xl animate-pulse" style={{animationDelay: '0.7s'}}>🌻</span>
            </div>
          );
        case CardTheme.SHARING:
          return (
            <div className="relative flex items-center justify-center scale-110">
              <span className="text-7xl md:text-8xl z-10 drop-shadow-xl">🍕</span>
              <div className="absolute -inset-4 border-2 border-dotted border-blue-400/20 rounded-full animate-spin-slow"></div>
              <span className="absolute -top-4 -right-4 text-2xl">🥤</span>
              <span className="absolute -bottom-4 -left-4 text-2xl">🍎</span>
            </div>
          );
        default:
          return (
            <div className="relative flex items-center justify-center">
              <span className="text-7xl md:text-9xl z-10 drop-shadow-xl">{card.content}</span>
            </div>
          );
      }
    };

    return (
      <div className="relative w-full h-full flex flex-col items-center overflow-hidden rounded-xl bg-white">
        <div 
          className="absolute inset-0 transition-colors duration-500"
          style={{ 
            background: `radial-gradient(circle at 50% 40%, white 0%, ${mainColor} 120%)`,
          }}
        />
        
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
        
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>

        <div 
          className="absolute bottom-0 w-[150%] h-[35%] opacity-30 blur-[1px]" 
          style={{ 
            backgroundColor: accentColor, 
            borderRadius: '50% 50% 0 0',
            transform: 'translateX(-25%) translateY(10%)'
          }} 
        />
        
        <div className={`relative z-10 flex flex-col items-center justify-center h-full pb-10 pt-2 transition-transform duration-500 ${isNewlyMatched ? 'scale-110' : 'animate-float-gentle'}`}>
          <div className="filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.1)]">
            {renderVisual()}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-20 p-3 pt-6 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <p className="text-white font-black text-[11px] md:text-[14px] leading-tight text-center uppercase tracking-wider drop-shadow-md">
            {textToShow}
          </p>
        </div>

        {/* Partículas de Match */}
        {isNewlyMatched && (
          <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`absolute w-2 h-2 bg-yellow-400 rounded-full animate-particle-${i+1}`} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`relative h-44 w-34 md:h-64 md:w-48 cursor-pointer perspective-1000 
        ${isMatched && !isNewlyMatched ? 'opacity-60 scale-95 grayscale-[0.3]' : 'hover:scale-[1.05] active:scale-95'} 
        ${isNewlyMatched ? 'z-[100] animate-match-success' : 'z-0'} 
        transition-all duration-500 ease-out`}
      onClick={handleClick}
    >
      <div className={`flip-card-inner w-full h-full relative duration-700 rounded-3xl shadow-2xl 
        ${isFlipped || isMatched || isNewlyMatched ? 'flip-card-flipped' : ''}
        ${isNewlyMatched ? 'ring-[12px] ring-yellow-400 ring-offset-4' : 'border-[6px] md:border-[10px] border-white ring-4 ring-black/5'}`}>
        
        <div className="flip-card-front bg-gradient-to-br from-[#0c1c4e] to-[#1e3a8a] rounded-2xl flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <pattern id="patternStars" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 5 L23 15 L33 15 L25 21 L28 31 L20 25 L12 31 L15 21 L7 15 L17 15 Z" fill="white" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#patternStars)" />
            </svg>
          </div>
          <div className="relative z-10 bg-white/10 p-6 md:p-8 rounded-full border-4 border-[#32c5ff]/40 shadow-[0_0_40px_rgba(50,197,255,0.4)] animate-pulse-slow">
            <span className="text-5xl md:text-7xl font-black text-white italic drop-shadow-lg">B!</span>
          </div>
          <div className="mt-4 text-white text-[10px] md:text-xs font-black tracking-widest uppercase opacity-60">Bora Impactar</div>
        </div>
        
        <div className="flip-card-back bg-white rounded-2xl overflow-hidden shadow-inner">
          <Illustration />
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(0.98); }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-15px); opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes heart-beat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes match-success {
          0% { transform: scale(1); }
          20% { transform: scale(1.3) rotate(5deg); }
          40% { transform: scale(1.25) rotate(-5deg); }
          60% { transform: scale(1.3) rotate(3deg); }
          100% { transform: scale(1); rotate(0deg); }
        }
        ${[...Array(6)].map((_, i) => `
          @keyframes particle-${i+1} {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(${(i-2.5)*40}px, ${(i%2===0?1:-1)*60}px) scale(0); opacity: 0; }
          }
          .animate-particle-${i+1} { animation: particle-${i+1} 1s ease-out forwards; }
        `).join('')}
        .animate-match-success { animation: match-success 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .animate-pulse-slow { animation: pulse-slow 4s infinite ease-in-out; }
        .animate-float-gentle { animation: float-gentle 4s infinite ease-in-out; }
        .animate-float-slow { animation: float-slow 3s infinite ease-in-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-heart-beat { animation: heart-beat 1.2s infinite cubic-bezier(0.4, 0, 0.6, 1); }
      `}</style>
    </div>
  );
};

export default MemoryCard;
