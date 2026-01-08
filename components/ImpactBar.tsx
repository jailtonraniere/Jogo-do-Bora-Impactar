
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
  let barColor = "from-emerald-400 via-green-500 to-emerald-400";
  let glowColor = "rgba(52, 211, 153, 0.4)";
  let label = "Sementinha";

  if (percentage >= 100) { 
    phaseIcon = "👑"; 
    barColor = "from-yellow-300 via-orange-400 to-yellow-300";
    glowColor = "rgba(251, 191, 36, 0.6)";
    label = "Mestre do Bem!";
  }
  else if (percentage > 75) { 
    phaseIcon = "💖"; 
    barColor = "from-pink-400 via-rose-500 to-pink-400";
    glowColor = "rgba(244, 114, 182, 0.5)";
    label = "Super Coração";
  }
  else if (percentage > 45) { 
    phaseIcon = "🌟"; 
    barColor = "from-blue-400 via-indigo-500 to-blue-400";
    glowColor = "rgba(96, 165, 250, 0.5)";
    label = "Brilho Social";
  }
  else if (percentage > 15) { 
    phaseIcon = "🌿"; 
    barColor = "from-teal-400 via-emerald-500 to-teal-400";
    glowColor = "rgba(45, 212, 191, 0.4)";
    label = "Crescendo...";
  }

  const milestones = [25, 50, 75, 100];

  return (
    <div className="w-full max-w-3xl mx-auto my-14 px-6 select-none relative">
      {/* Background Decorative Glow */}
      <div 
        className="absolute inset-0 blur-[60px] opacity-20 transition-colors duration-1000 rounded-full"
        style={{ backgroundColor: glowColor }}
      />

      <div className="relative pt-16">
        {/* Floating Bubble Indicator */}
        <div 
          className="absolute top-0 transition-all duration-1000 ease-out z-30"
          style={{ left: `calc(${percentage}% - 40px)` }}
        >
          <div className="flex flex-col items-center">
             {/* Score Badge */}
             <div className={`mb-2 bg-white px-3 py-1 rounded-2xl shadow-lg border-2 border-[#0c1c4e] transform transition-transform ${pulse ? 'scale-125' : 'scale-100'}`}>
                <span className="text-xs font-black text-[#0c1c4e] whitespace-nowrap">{points} PTS</span>
             </div>
             
             {/* Character Bubble */}
             <div className={`relative w-20 h-20 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border-4 border-white shadow-2xl overflow-hidden group ${percentage >= 100 ? 'animate-victory' : 'animate-bounce-gentle'}`}>
                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none" />
                <span className="text-5xl drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)] z-10">{phaseIcon}</span>
                {pulse && (
                  <div className="absolute inset-0 animate-ping bg-white/40 rounded-full" />
                )}
             </div>
          </div>
        </div>
        
        {/* Main Capsule Container */}
        <div className="relative h-14 w-full bg-[#0c1c4e]/10 backdrop-blur-md rounded-[30px] border-[6px] border-[#0c1c4e] shadow-[inset_0_4px_10px_rgba(0,0,0,0.2),0_10px_25px_rgba(0,0,0,0.1)] p-1.5 overflow-hidden group">
          
          {/* Milestone markers inside the bar */}
          <div className="absolute inset-0 flex justify-between px-10 items-center z-20 pointer-events-none">
            {milestones.map((m, i) => (
              <div 
                key={i} 
                className={`transition-all duration-700 ${percentage >= m ? 'scale-125 rotate-12' : 'scale-100 grayscale opacity-40'}`}
              >
                {m === 100 ? (
                  <span className="text-2xl drop-shadow-md">🏆</span>
                ) : (
                  <span className="text-xl drop-shadow-md">⭐</span>
                )}
              </div>
            ))}
          </div>

          {/* Liquid Progress Fill */}
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out relative shadow-[0_0_20px_rgba(255,255,255,0.4)] overflow-hidden`}
            style={{ 
              width: `${percentage}%`,
              boxShadow: `0 0 25px ${glowColor}`
            }}
          >
            {/* Wave Effect Layer 1 */}
            <div className="absolute inset-0 opacity-30 animate-wave-slow bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat-x" />
            
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/10" />
            
            {/* Rapid Shimmer Sparkle */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer-fast" />
          </div>
        </div>

        {/* Phase Label & Progress Text */}
        <div className="mt-6 flex justify-between items-end px-2">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[#0c1c4e]/50 uppercase tracking-[0.2em]">Fase Atual</span>
            <span className="text-xl font-black text-[#0c1c4e] italic uppercase tracking-tight leading-none">
              {label}
            </span>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
               <span className="text-sm font-black text-[#0c1c4e]">{Math.round(percentage)}%</span>
               <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#32c5ff] transition-all duration-1000" style={{ width: `${percentage}%` }} />
               </div>
            </div>
            <span className="text-[10px] font-black text-[#0c1c4e]/40 uppercase tracking-widest">
              Objetivo: {MAX_IMPACT_POINTS} Pontos
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.05); }
        }
        @keyframes victory {
          0%, 100% { transform: scale(1) rotate(-8deg); }
          50% { transform: scale(1.2) rotate(8deg); }
        }
        @keyframes shimmer-fast {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }
        @keyframes wave-slow {
          from { background-position: 0 0; }
          to { background-position: 1000px 0; }
        }
        .animate-bounce-gentle { animation: bounce-gentle 2.5s infinite ease-in-out; }
        .animate-victory { animation: victory 0.8s infinite ease-in-out; }
        .animate-shimmer-fast { animation: shimmer-fast 4s infinite linear; }
        .animate-wave-slow { animation: wave-slow 20s infinite linear; }
      `}</style>
    </div>
  );
};

export default ImpactBar;
