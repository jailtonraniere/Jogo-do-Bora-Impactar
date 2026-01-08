
import React, { useEffect, useState } from 'react';
import { MAX_IMPACT_POINTS } from '../constants.tsx';

interface ImpactBarProps {
  points: number;
}

const ImpactBar: React.FC<ImpactBarProps> = ({ points }) => {
  const [pulse, setPulse] = useState(false);
  const percentage = Math.min((points / MAX_IMPACT_POINTS) * 100, 100);
  
  useEffect(() => {
    if (points > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 800);
      return () => clearTimeout(timer);
    }
  }, [points]);

  let phaseIcon = "🌱"; 
  let barColor = "from-emerald-300 via-green-400 to-emerald-300";
  let glowColor = "#10b981";
  let label = "Sementinha";

  if (percentage >= 100) { 
    phaseIcon = "👑"; 
    barColor = "from-yellow-300 via-amber-400 to-yellow-300";
    glowColor = "#f59e0b";
    label = "Mestre do Bem!";
  }
  else if (percentage > 75) { 
    phaseIcon = "💖"; 
    barColor = "from-rose-300 via-pink-400 to-rose-300";
    glowColor = "#ec4899";
    label = "Super Coração";
  }
  else if (percentage > 45) { 
    phaseIcon = "🌟"; 
    barColor = "from-cyan-300 via-blue-400 to-cyan-300";
    glowColor = "#3b82f6";
    label = "Brilho Social";
  }
  else if (percentage > 15) { 
    phaseIcon = "🌿"; 
    barColor = "from-teal-300 via-emerald-400 to-teal-300";
    glowColor = "#059669";
    label = "Crescendo...";
  }

  const milestones = [25, 50, 75, 100];

  return (
    <div className="w-full max-w-3xl mx-auto my-1 px-4 select-none relative z-10">
      <div className="relative pt-10">
        
        {/* Marcador Flutuante (Avatar + Pontos) */}
        <div 
          className="absolute top-0 transition-all duration-1000 ease-out z-30"
          style={{ left: `calc(${percentage}% - 28px)` }}
        >
          <div className="flex flex-col items-center">
             {/* Badge de Pontos */}
             <div className={`mb-1 bg-[#0c1c4e] px-2 py-0.5 rounded-full shadow-lg border border-white/30 transform transition-transform ${pulse ? 'scale-110' : 'scale-100'}`}>
                <span className="text-[9px] font-black text-[#32c5ff] tracking-tighter">{points} PTS</span>
             </div>
             
             {/* Bolha do Avatar */}
             <div className={`relative w-12 h-12 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-sm border-2 border-white shadow-[0_5px_15px_rgba(0,0,0,0.1)] overflow-hidden ${percentage >= 100 ? 'animate-victory' : 'animate-float-bar'}`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent pointer-events-none" />
                <span className="text-2xl drop-shadow-sm z-10">{phaseIcon}</span>
                {pulse && <div className="absolute inset-0 animate-ping bg-white/20 rounded-full" />}
             </div>
          </div>
        </div>
        
        {/* Recipiente da Barra (Efeito de Cristal) */}
        <div className="relative h-8 w-full bg-black/5 backdrop-blur-md rounded-full border-[3px] border-[#0c1c4e] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_5px_15px_rgba(0,0,0,0.05)] p-0.5 overflow-hidden group">
          
          {/* Marcadores de Meta (Estrelas Internas) */}
          <div className="absolute inset-0 flex justify-between px-6 items-center z-20 pointer-events-none">
            {milestones.map((m, i) => (
              <div 
                key={i} 
                className={`transition-all duration-700 flex items-center justify-center ${percentage >= m ? 'scale-110 rotate-12 drop-shadow-[0_0_8px_white]' : 'scale-90 opacity-20 grayscale'}`}
              >
                {m === 100 ? (
                  <span className="text-lg">🏆</span>
                ) : (
                  <span className="text-base">⭐</span>
                )}
              </div>
            ))}
          </div>

          {/* Preenchimento Líquido */}
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out relative overflow-hidden`}
            style={{ 
              width: `${percentage}%`,
              boxShadow: `0 0 15px ${glowColor}66`
            }}
          >
            {/* Brilho de Superfície */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/10" />
            
            {/* Animação de Fluxo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-flow-light" />
            
            {/* Partículas de Brilho */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay animate-pulse-fast bg-[radial-gradient(circle_at_50%_50%,_white_1px,_transparent_1px)] bg-[length:12px_12px]" />
          </div>
        </div>

        {/* Rodapé da Barra (Textos e Info) */}
        <div className="mt-1 flex justify-between items-center px-2">
          <div className="flex flex-col">
            <span className="text-[7px] font-black text-[#0c1c4e]/40 uppercase tracking-widest">Evolução Social</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-[#0c1c4e] uppercase italic">{label}</span>
              {percentage >= 100 && <span className="text-[10px] animate-bounce">🎉</span>}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="text-right">
                <div className="text-[10px] font-black text-[#0c1c4e] leading-none">{Math.round(percentage)}%</div>
                <div className="text-[7px] font-bold text-[#0c1c4e]/50 uppercase tracking-tighter">Impacto Gerado</div>
             </div>
             <div className="w-12 h-1.5 bg-black/5 rounded-full overflow-hidden border border-[#0c1c4e]/10">
                <div 
                  className="h-full bg-[#0c1c4e] transition-all duration-1000" 
                  style={{ width: `${percentage}%` }} 
                />
             </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-bar {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes flow-light {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(400%) skewX(-20deg); }
        }
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        .animate-float-bar { animation: float-bar 3s infinite ease-in-out; }
        .animate-flow-light { animation: flow-light 3s infinite linear; }
        .animate-pulse-fast { animation: pulse-fast 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default ImpactBar;
