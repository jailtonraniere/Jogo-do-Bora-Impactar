
import React from 'react';
import { MAX_IMPACT_POINTS } from '../constants';

interface ImpactBarProps {
  points: number;
}

const ImpactBar: React.FC<ImpactBarProps> = ({ points }) => {
  const percentage = Math.min((points / MAX_IMPACT_POINTS) * 100, 100);
  
  let phaseIcon = "🥚"; // Sementinha/Ovo do bem
  let status = "Começando!";

  if (percentage >= 100) { phaseIcon = "👑"; status = "Mestres do Impacto!"; }
  else if (percentage > 75) { phaseIcon = "💖"; status = "Super Coração!"; }
  else if (percentage > 50) { phaseIcon = "🌟"; status = "Brilho Coletivo!"; }
  else if (percentage > 25) { phaseIcon = "🌿"; status = "Crescendo!"; }

  return (
    <div className="w-full max-w-lg mx-auto my-8 px-6">
      <div className="relative mb-6">
        {/* Personagem Ilustrado que corre pela barra */}
        <div 
          className="absolute -top-10 transition-all duration-1000 ease-out flex flex-col items-center"
          style={{ left: `calc(${percentage}% - 20px)` }}
        >
          <div className="text-3xl animate-bounce-character">{phaseIcon}</div>
          <div className="bg-[#0c1c4e] text-white text-[8px] font-black px-2 py-0.5 rounded-full whitespace-nowrap uppercase">
            {status}
          </div>
        </div>
        
        {/* Trilho da Barra */}
        <div className="h-6 w-full bg-white rounded-full border-4 border-[#0c1c4e] overflow-hidden p-1 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#32c5ff] to-[#0c1c4e] transition-all duration-1000 ease-out rounded-full relative"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-[rgba(255,255,255,0.2)] animate-shimmer"></div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center text-[10px] font-black text-[#0c1c4e] uppercase opacity-50">
        <span>Início</span>
        <div className="flex items-center gap-1">
          <span>{points}</span>
          <span className="text-red-500 animate-pulse">🧡</span>
        </div>
        <span>Impacto Total</span>
      </div>

      <style>{`
        @keyframes bounce-character {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-bounce-character { animation: bounce-character 0.8s infinite ease-in-out; }
        .animate-shimmer { animation: shimmer 2s infinite linear; }
      `}</style>
    </div>
  );
};

export default ImpactBar;
