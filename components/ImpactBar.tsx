
import React from 'react';
import { MAX_IMPACT_POINTS } from '../constants';

interface ImpactBarProps {
  points: number;
}

const ImpactBar: React.FC<ImpactBarProps> = ({ points }) => {
  const percentage = Math.min((points / MAX_IMPACT_POINTS) * 100, 100);
  
  let label = "Começando o Impacto!";
  let color = "bg-[#32c5ff]"; // Light blue

  if (percentage >= 100) {
    label = "🌟 Super Impactadores!";
    color = "bg-[#0c1c4e]"; // Navy
  } else if (percentage > 60) {
    label = "🔥 Impacto Gigante!";
    color = "bg-[#0c1c4e]";
  } else if (percentage > 30) {
    label = "✨ Impacto Positivo!";
    color = "bg-[#32c5ff]";
  }

  return (
    <div className="w-full max-w-md mx-auto my-4 px-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[10px] md:text-xs font-black text-[#0c1c4e] uppercase tracking-widest">{label}</span>
        <span className="text-[10px] md:text-xs font-bold text-[#32c5ff]">{points} / {MAX_IMPACT_POINTS} ⭐</span>
      </div>
      <div className="h-4 md:h-6 w-full bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
        <div 
          className={`h-full ${color} transition-all duration-1000 ease-out relative`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default ImpactBar;
