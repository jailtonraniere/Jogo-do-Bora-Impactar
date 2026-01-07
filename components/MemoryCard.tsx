
import React from 'react';
import { CardData, CardTheme } from '../types';
import { CARD_PAIRS } from '../constants';

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
    
    return (
      <div className="relative w-full h-full flex flex-col items-center overflow-hidden rounded-xl bg-white">
        {/* Cenário de Fundo */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{ background: `linear-gradient(to bottom, white 0%, ${mainColor} 100%)` }}
        />
        
        {/* Detalhe de Chão/Cenário */}
        <div 
          className="absolute bottom-0 w-[150%] h-[35%] opacity-30" 
          style={{ 
            backgroundColor: accentColor, 
            borderRadius: '50% 50% 0 0',
            transform: 'translateY(10%)'
          }} 
        />
        
        {/* Arte Principal (Personagem/Objeto) */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pb-6 pt-2 animate-float-gentle">
          <div className="text-6xl md:text-8xl drop-shadow-md filter saturate-125 select-none">
            {card.content}
          </div>
        </div>

        {/* Texto Estilizado na Base (Estilo Referência) */}
        <div className="absolute bottom-0 left-0 w-full z-20 px-1 pb-3 pt-6 bg-gradient-to-t from-black/40 to-transparent">
          <p className="text-white font-black text-[11px] md:text-[15px] leading-tight text-center uppercase tracking-tight drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
            {textToShow}
          </p>
        </div>

        {/* Brilho de Sucesso */}
        {isNewlyMatched && (
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent animate-shine z-30" />
        )}
      </div>
    );
  };

  return (
    <div 
      className={`relative h-36 w-28 md:h-56 md:w-40 cursor-pointer perspective-1000 
        ${isMatched && !isNewlyMatched ? 'opacity-40 grayscale-[0.3]' : 'hover:scale-[1.03]'} 
        ${isNewlyMatched ? 'z-30 scale-110' : 'z-0'} 
        transition-all duration-300 ease-out`}
      onClick={handleClick}
    >
      <div className={`flip-card-inner w-full h-full relative duration-500 rounded-2xl shadow-xl 
        ${isFlipped || isMatched || isNewlyMatched ? 'flip-card-flipped' : ''}
        border-[4px] md:border-[6px] border-white`}>
        
        {/* Verso da Carta */}
        <div className="flip-card-front bg-[#0c1c4e] rounded-xl flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <pattern id="dotPattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#dotPattern)" />
            </svg>
          </div>
          <div className="relative z-10 bg-white/10 p-5 rounded-full border-4 border-[#32c5ff]/40 shadow-inner">
            <span className="text-4xl md:text-6xl font-black text-[#32c5ff] italic drop-shadow-md">B!</span>
          </div>
          <div className="mt-4 text-[#32c5ff]/60 text-[10px] font-bold tracking-widest uppercase">Bora Impactar</div>
        </div>
        
        {/* Frente da Carta (O Desenho Ilustrado) */}
        <div className="flip-card-back bg-white rounded-xl overflow-hidden shadow-inner" 
             style={{ border: `2px solid ${mainColor}` }}>
          <Illustration />
        </div>
      </div>

      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.05); }
        }
        @keyframes shine {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(250%) skewX(-25deg); }
        }
        .animate-float-gentle { animation: float-gentle 4s infinite ease-in-out; }
        .animate-shine { animation: shine 2s infinite linear; }
      `}</style>
    </div>
  );
};

export default MemoryCard;
