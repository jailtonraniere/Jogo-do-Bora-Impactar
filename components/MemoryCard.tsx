
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
    
    // Conteúdo visual baseado no tema
    const renderVisual = () => {
      switch(card.theme) {
        case CardTheme.EDUCATION:
          return (
            <div className="relative flex items-center justify-center">
              <span className="text-7xl md:text-9xl z-10">📖</span>
              <span className="absolute -top-4 -right-4 text-2xl animate-pulse">✨</span>
              <span className="absolute -bottom-2 -left-2 text-xl opacity-60">✏️</span>
            </div>
          );
        case CardTheme.ENVIRONMENT:
          return (
            <div className="relative flex items-center justify-center">
              <span className="text-7xl md:text-9xl z-10">🌳</span>
              <span className="absolute -top-2 text-2xl animate-bounce">☀️</span>
              <span className="absolute bottom-0 text-3xl opacity-80">🌱</span>
            </div>
          );
        case CardTheme.ANIMALS:
          return (
            <div className="relative flex items-center justify-center">
              <span className="text-7xl md:text-9xl z-10">🐾</span>
              <span className="absolute -top-2 -right-4 text-4xl rotate-12">🐶</span>
              <span className="absolute -bottom-2 -left-4 text-3xl -rotate-12">🐱</span>
            </div>
          );
        case CardTheme.SOLIDARITY:
          return (
            <div className="relative flex items-center justify-center">
              <span className="text-7xl md:text-9xl z-10">🎁</span>
              <span className="absolute -top-4 text-3xl animate-ping">❤️</span>
            </div>
          );
        default:
          return (
            <div className="relative flex items-center justify-center">
              <span className="text-7xl md:text-9xl z-10">{card.content}</span>
              <span className="absolute inset-0 flex items-center justify-center text-4xl blur-sm opacity-30">{card.content}</span>
            </div>
          );
      }
    };

    return (
      <div className="relative w-full h-full flex flex-col items-center overflow-hidden rounded-xl bg-white">
        {/* Camada de Gradiente Artístico */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{ 
            background: `radial-gradient(circle at center, white 0%, ${mainColor} 100%)`,
            filter: 'contrast(1.1)'
          }}
        />
        
        {/* Elementos Decorativos de Fundo (Bolhas/Estrelas) */}
        <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-white opacity-40 blur-[1px]"></div>
        <div className="absolute top-10 right-4 w-2 h-2 rounded-full bg-white opacity-60"></div>
        <div className="absolute bottom-16 left-6 w-3 h-3 rounded-full bg-white opacity-30 blur-[2px]"></div>
        
        {/* Chão estilizado */}
        <div 
          className="absolute bottom-0 w-[140%] h-[30%] opacity-20" 
          style={{ 
            backgroundColor: accentColor, 
            borderRadius: '50% 50% 0 0',
            transform: 'translateY(5%)'
          }} 
        />
        
        {/* Arte Central */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pb-8 pt-2 animate-float-gentle drop-shadow-2xl">
          {renderVisual()}
        </div>

        {/* Texto Estilizado na Base */}
        <div className="absolute bottom-0 left-0 w-full z-20 px-2 pb-4 pt-8 bg-gradient-to-t from-black/50 via-black/20 to-transparent">
          <p className="text-white font-black text-[12px] md:text-[16px] leading-tight text-center uppercase tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {textToShow}
          </p>
        </div>

        {/* Efeito de Vidro/Brilho Superior */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

        {/* Animação de Sucesso */}
        {isNewlyMatched && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent animate-shine z-30" />
        )}
      </div>
    );
  };

  return (
    <div 
      className={`relative h-40 w-32 md:h-64 md:w-48 cursor-pointer perspective-1000 
        ${isMatched && !isNewlyMatched ? 'opacity-40 grayscale-[0.2]' : 'hover:scale-[1.05] active:scale-95'} 
        ${isNewlyMatched ? 'z-30 scale-110' : 'z-0'} 
        transition-all duration-300 ease-out`}
      onClick={handleClick}
    >
      <div className={`flip-card-inner w-full h-full relative duration-500 rounded-3xl shadow-2xl 
        ${isFlipped || isMatched || isNewlyMatched ? 'flip-card-flipped' : ''}
        border-[5px] md:border-[8px] border-white`}>
        
        {/* Verso da Carta (Costas) */}
        <div className="flip-card-front bg-gradient-to-br from-[#0c1c4e] to-[#1e3a8a] rounded-2xl flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <pattern id="patternStars" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M15 2 L18 10 L26 10 L20 16 L22 24 L15 20 L8 24 L10 16 L4 10 L12 10 Z" fill="white" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#patternStars)" />
            </svg>
          </div>
          <div className="relative z-10 bg-white/10 p-6 md:p-8 rounded-full border-4 border-[#32c5ff]/50 shadow-[0_0_30px_rgba(50,197,255,0.3)] animate-pulse-slow">
            <span className="text-5xl md:text-7xl font-black text-[#32c5ff] italic drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">B!</span>
          </div>
          <div className="mt-4 text-[#32c5ff] text-[10px] md:text-xs font-black tracking-widest uppercase opacity-80">Bora Impactar</div>
        </div>
        
        {/* Frente da Carta (O Desenho Ilustrado) */}
        <div className="flip-card-back bg-white rounded-2xl overflow-hidden" 
             style={{ border: `3px solid ${mainColor}` }}>
          <Illustration />
        </div>
      </div>

      <style>{`
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(-5px) rotate(-2deg); }
        }
        @keyframes shine {
          0% { transform: translateX(-200%) skewX(-30deg); }
          100% { transform: translateX(300%) skewX(-30deg); }
        }
        .animate-float-gentle { animation: float-gentle 5s infinite ease-in-out; }
        .animate-shine { animation: shine 1.8s infinite linear; }
      `}</style>
    </div>
  );
};

export default MemoryCard;
