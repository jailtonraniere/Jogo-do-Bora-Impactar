
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CardData, CardTheme, Challenge, PlayerProfile } from './types';
import { CARD_PAIRS, CHALLENGES, MAX_IMPACT_POINTS } from './constants';
import MemoryCard from './components/MemoryCard';
import ImpactBar from './components/ImpactBar';

const SOUNDS = {
  flip: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  celebration: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  challenge: 'https://assets.mixkit.co/active_storage/sfx/1434/1434-preview.mp3',
  hint: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  whoosh: 'https://assets.mixkit.co/active_storage/sfx/599/599-preview.mp3'
};

const AVATARS = ['🌈', '🚀', '🦊', '🐱', '🐘', '🤖', '⭐', '🎈'];

/**
 * ConfettiEffect Component
 * Renders a lightweight particle system using CSS animations.
 */
const ConfettiEffect: React.FC = () => {
  const [pieces, setPieces] = useState<React.ReactElement[]>([]);

  useEffect(() => {
    const colors = ['#32c5ff', '#0c1c4e', '#facc15', '#f472b6', '#4ade80', '#fb923c', '#ffffff'];
    const shapes = ['rect', 'circle', 'triangle'];
    const newPieces = Array.from({ length: 80 }).map((_, i) => {
      const size = Math.random() * 8 + 6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 4;
      const duration = Math.random() * 3 + 4;
      const rotation = Math.random() * 360;

      return (
        <div
          key={i}
          className={`absolute animate-confetti-fall pointer-events-none`}
          style={{
            left: `${left}%`,
            top: '-20px',
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: shape === 'circle' ? '50%' : shape === 'triangle' ? '0' : '2px',
            clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
            transform: `rotate(${rotation}deg)`,
            opacity: 0.8,
            zIndex: 55
          }}
        />
      );
    });
    setPieces(newPieces);
  }, []);

  return <div className="fixed inset-0 overflow-hidden pointer-events-none z-[55]">{pieces}</div>;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [player1, setPlayer1] = useState<PlayerProfile>({ name: 'Jogador 1', avatar: '🌈' });
  const [player2, setPlayer2] = useState<PlayerProfile>({ name: 'Jogador 2', avatar: '🚀' });
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isSwitchingPlayer, setIsSwitchingPlayer] = useState(false);

  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardData[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [newlyMatchedPair, setNewlyMatchedPair] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const [hintAvailable, setHintAvailable] = useState(true);
  const [hintingCards, setHintingCards] = useState<number[]>([]);

  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      if (key === 'error') audio.volume = 0.3;
      if (key === 'whoosh') audio.volume = 0.2;
      if (key === 'flip') audio.volume = 0.6;
      audioRefs.current[key] = audio;
    });
  }, []);

  const playSound = (soundKey: keyof typeof SOUNDS) => {
    if (isMuted) return;
    const sound = audioRefs.current[soundKey];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => console.debug("Audio play blocked", error));
    }
  };

  const initializeGame = useCallback(() => {
    const deck: CardData[] = [];
    CARD_PAIRS.forEach((pair, index) => {
      deck.push({
        id: index * 2,
        pairId: `pair-${index}`,
        content: pair.icon,
        type: 'icon',
        theme: pair.theme,
        label: pair.label
      });
      deck.push({
        id: index * 2 + 1,
        pairId: `pair-${index}`,
        content: '✨', 
        type: 'situation',
        theme: pair.theme,
        label: pair.situation
      });
    });

    setCards([...deck].sort(() => Math.random() - 0.5));
    setMatchedPairs([]);
    setNewlyMatchedPair(null);
    setPoints(0);
    setFlippedCards([]);
    setActiveChallenge(null);
    setIsProcessing(false);
    setCurrentPlayerIndex(0);
    setGameState('playing');
    setShowResetConfirm(false);
    setIsSwitchingPlayer(false);
    setHintAvailable(true);
    setHintingCards([]);
  }, []);

  const handleCardClick = (card: CardData) => {
    if (isProcessing || flippedCards.length >= 2 || activeChallenge || matchedPairs.includes(card.pairId)) return;
    setHintingCards([]);
    playSound('flip');
    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [first, second] = newFlipped;
      if (first.pairId === second.pairId) {
        setNewlyMatchedPair(first.pairId);
        setTimeout(() => playSound('success'), 150);
        setTimeout(() => {
          setMatchedPairs(prev => [...prev, first.pairId]);
          setNewlyMatchedPair(null);
          setPoints(prev => prev + 2);
          playSound('challenge');
          setActiveChallenge(CHALLENGES[first.theme]);
          setFlippedCards([]);
          setIsProcessing(false);
          setHintAvailable(true);
        }, 1000);
      } else {
        setTimeout(() => {
          playSound('error');
          setIsSwitchingPlayer(true);
          setTimeout(() => {
            playSound('whoosh'); 
            setFlippedCards([]);
            setCurrentPlayerIndex(prev => (prev === 0 ? 1 : 0));
            setIsProcessing(false);
            setTimeout(() => {
              setIsSwitchingPlayer(false);
            }, 300);
          }, 500); 
        }, 800);
      }
    }
  };

  const handleHint = () => {
    if (!hintAvailable || isProcessing || flippedCards.length > 0 || activeChallenge) return;
    
    playSound('hint');
    setHintAvailable(false);
    
    const remainingPairs = Array.from(new Set(cards.filter(c => !matchedPairs.includes(c.pairId)).map(c => c.pairId)));
    if (remainingPairs.length > 0) {
      const randomPairId = remainingPairs[Math.floor(Math.random() * remainingPairs.length)];
      const pairIndices = cards.filter(c => c.pairId === randomPairId).map(c => c.id);
      setHintingCards(pairIndices);
      setTimeout(() => setHintingCards([]), 2000);
    }
  };

  const completeChallenge = () => {
    setActiveChallenge(null);
    playSound('success');
    setIsSwitchingPlayer(true);
    setTimeout(() => {
      setCurrentPlayerIndex(prev => (prev === 0 ? 1 : 0));
      setIsSwitchingPlayer(false);
    }, 400);
    if (matchedPairs.length === CARD_PAIRS.length) {
      setTimeout(() => {
        setGameState('finished');
        playSound('celebration');
      }, 500);
    }
  };

  const handleResetGame = () => setShowResetConfirm(true);

  const LogoText = ({ light = false }: { light?: boolean }) => {
    const impactarText = "IMPACTAR";
    return (
      <div className={`flex flex-col items-center select-none group cursor-default transition-transform duration-300 hover:scale-105 ${light ? 'text-white' : ''}`}>
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className={`text-4xl md:text-6xl font-black italic tracking-tighter transition-all duration-500 group-hover:text-[#32c5ff] animate-logo-pop ${light ? 'text-white' : 'text-[#0c1c4e]'}`}>
            BORA
          </span>
          <span className="relative flex text-4xl md:text-6xl font-black italic tracking-tighter text-[#32c5ff] animate-logo-shimmer overflow-hidden px-1">
            {impactarText.split('').map((letter, index) => (
              <span 
                key={index} 
                className="inline-block animate-wave" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {letter}
              </span>
            ))}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer-sweep"></span>
          </span>
        </div>
        <div className="relative h-2 md:h-2.5 w-full max-w-[200px] md:max-w-[320px] mt-1.5 rounded-full overflow-hidden bg-gray-200/20">
          <div className={`absolute inset-0 rounded-full animate-logo-bar-expand origin-left ${light ? 'bg-white' : 'bg-[#32c5ff]'}`}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-sweep-fast"></div>
        </div>
      </div>
    );
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-[#f0f9ff]">
        <LogoText />
        <div className="mt-10 bg-white p-8 rounded-[40px] shadow-xl border-4 border-[#32c5ff] w-full max-w-2xl text-center animate-fade-in-up">
          <h2 className="text-3xl font-black text-[#0c1c4e] mb-8 uppercase">Quem vai impactar hoje?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="p-4 rounded-3xl bg-blue-50 border-2 border-blue-100 transition-transform hover:scale-[1.02]">
              <div className="text-6xl mb-4 p-4 bg-white rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-inner">
                {player1.avatar}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {AVATARS.map(a => (
                  <button key={a} onClick={() => setPlayer1(p => ({ ...p, avatar: a }))} className={`text-2xl p-1 rounded-lg transition-all ${player1.avatar === a ? 'bg-blue-200 scale-125 rotate-6' : 'hover:bg-white hover:scale-110'}`}>{a}</button>
                ))}
              </div>
              <input 
                type="text" 
                value={player1.name} 
                onChange={e => setPlayer1(p => ({ ...p, name: e.target.value }))}
                className="w-full p-3 rounded-xl border-2 border-[#32c5ff] text-center font-bold text-[#0c1c4e] focus:ring-4 focus:ring-blue-100 outline-none"
                placeholder="Nome da Criança 1"
              />
            </div>

            <div className="p-4 rounded-3xl bg-blue-50 border-2 border-blue-100 transition-transform hover:scale-[1.02]">
              <div className="text-6xl mb-4 p-4 bg-white rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-inner">
                {player2.avatar}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {AVATARS.map(a => (
                  <button key={a} onClick={() => setPlayer2(p => ({ ...p, avatar: a }))} className={`text-2xl p-1 rounded-lg transition-all ${player2.avatar === a ? 'bg-blue-200 scale-125 rotate-6' : 'hover:bg-white hover:scale-110'}`}>{a}</button>
                ))}
              </div>
              <input 
                type="text" 
                value={player2.name} 
                onChange={e => setPlayer2(p => ({ ...p, name: e.target.value }))}
                className="w-full p-3 rounded-xl border-2 border-[#32c5ff] text-center font-bold text-[#0c1c4e] focus:ring-4 focus:ring-blue-100 outline-none"
                placeholder="Nome da Criança 2"
              />
            </div>
          </div>

          <button 
            onClick={initializeGame}
            className="group relative bg-[#32c5ff] hover:bg-[#0c1c4e] text-white text-3xl font-black py-5 px-12 rounded-full shadow-lg transition-all active:scale-95 uppercase italic overflow-hidden"
          >
            <span className="relative z-10">Vamos Começar! 🚀</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    );
  }

  const currentPlayer = currentPlayerIndex === 0 ? player1 : player2;

  return (
    <div className="min-h-screen p-4 pb-20 flex flex-col items-center bg-[#f0f9ff]">
      {gameState === 'finished' && <ConfettiEffect />}
      
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <div className="relative group">
          <button 
            onClick={handleHint}
            disabled={!hintAvailable || flippedCards.length > 0}
            className={`bg-white border-2 p-3 rounded-full shadow-lg text-xl transition-all ${hintAvailable && flippedCards.length === 0 ? 'border-yellow-400 hover:scale-110 animate-pulse' : 'border-gray-200 opacity-50 cursor-not-allowed'}`}
          >
            💡
          </button>
          <div className={`absolute -bottom-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black border-2 transition-colors ${hintAvailable ? 'bg-yellow-400 border-white text-white' : 'bg-gray-300 border-white text-gray-500'}`}>
            {hintAvailable ? '1' : '0'}
          </div>
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[#0c1c4e] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold uppercase tracking-tighter">
            {hintAvailable ? 'Dica disponível!' : 'Aguarde o próximo par!'}
          </span>
        </div>
        <button onClick={handleResetGame} className="bg-white border-2 border-[#0c1c4e] p-3 rounded-full shadow-lg text-xl hover:rotate-180 transition-transform duration-500">🔄</button>
        <button onClick={() => setIsMuted(!isMuted)} className="bg-white border-2 border-[#32c5ff] p-3 rounded-full shadow-lg text-xl">{isMuted ? '🔇' : '🔊'}</button>
      </div>

      <header className="text-center mb-6 flex flex-col items-center w-full max-w-4xl pt-4">
        <LogoText />
        
        <div className="flex items-center gap-4 mt-6 bg-white p-3 rounded-full shadow-md border-2 border-[#32c5ff22]">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 
            ${currentPlayerIndex === 0 ? 'bg-blue-100 scale-110 border-2 border-[#32c5ff]' : 'opacity-30 grayscale-[0.5]'}
            ${isSwitchingPlayer ? 'opacity-0 scale-90' : 'opacity-100'}`}>
            <span className="text-2xl">{player1.avatar}</span>
            <span className="font-bold text-[#0c1c4e] text-sm">{player1.name}</span>
          </div>
          <div className="w-8 h-8 flex items-center justify-center bg-[#0c1c4e] text-white rounded-full text-xs font-bold shadow-sm">🤝</div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 
            ${currentPlayerIndex === 1 ? 'bg-blue-100 scale-110 border-2 border-[#32c5ff]' : 'opacity-30 grayscale-[0.5]'}
            ${isSwitchingPlayer ? 'opacity-0 scale-90' : 'opacity-100'}`}>
            <span className="text-2xl">{player2.avatar}</span>
            <span className="font-bold text-[#0c1c4e] text-sm">{player2.name}</span>
          </div>
        </div>

        <div className={`mt-4 text-[#0c1c4e] font-black uppercase text-xs tracking-widest transition-all duration-500
          ${isSwitchingPlayer ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0 animate-pulse'}`}>
          É a vez de: <span className="text-[#32c5ff]">{currentPlayer.name}</span>
        </div>
      </header>

      <ImpactBar points={points} />

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-4 my-4 max-w-6xl px-2">
        {cards.map((card) => (
          <div key={card.id} className={`${hintingCards.includes(card.id) ? 'animate-hint-shake z-10' : ''}`}>
             <MemoryCard
              card={card}
              isFlipped={flippedCards.some(c => c.id === card.id)}
              isMatched={matchedPairs.includes(card.pairId)}
              isNewlyMatched={newlyMatchedPair === card.pairId}
              onClick={handleCardClick}
              disabled={isProcessing}
            />
          </div>
        ))}
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-[#0c1c4e]/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[30px] p-8 max-sm w-full text-center shadow-2xl border-4 border-[#32c5ff]">
            <h3 className="text-2xl font-black text-[#0c1c4e] mb-4 uppercase italic">Recomeçar?</h3>
            <p className="text-gray-600 mb-8">Vocês querem começar uma nova rodada de impacto?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-full hover:bg-gray-300 transition-colors uppercase text-sm">Continuar</button>
              <button onClick={initializeGame} className="flex-1 bg-[#0c1c4e] text-white font-bold py-3 rounded-full hover:opacity-90 transition-opacity uppercase text-sm">Sim, Novo Jogo!</button>
            </div>
          </div>
        </div>
      )}

      {activeChallenge && (
        <div className="fixed inset-0 bg-[#0c1c4e]/90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full text-center shadow-2xl border-4 border-[#32c5ff] animate-bounce-subtle">
            <div className="text-5xl mb-4 flex justify-center gap-2">
              <span>{player1.avatar}</span>
              <span>🌟</span>
              <span>{player2.avatar}</span>
            </div>
            <h2 className="text-2xl font-black text-[#0c1c4e] mb-3 uppercase">Missão para o Time!</h2>
            <p className="text-xl text-gray-600 mb-8 font-medium italic leading-relaxed">"{activeChallenge.text}"</p>
            <button onClick={completeChallenge} className="bg-[#32c5ff] hover:bg-[#28b0e6] text-white text-xl font-black py-5 px-10 rounded-full shadow-xl transition-all active:scale-95 w-full uppercase">Missão Cumprida! 👏</button>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="fixed inset-0 bg-[#0c1c4e]/95 flex flex-col items-center justify-center z-[60] p-6 text-center text-white">
          <div className="bg-white/10 backdrop-blur-xl rounded-[50px] p-10 md:p-14 max-w-3xl border-4 border-[#32c5ff] shadow-2xl relative animate-scale-up">
            <div className="mb-6 flex justify-center gap-4 text-6xl">
              <span>{player1.avatar}</span>
              <span>💙</span>
              <span>{player2.avatar}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-4 text-[#32c5ff] uppercase italic animate-bounce">VIVA!</h1>
            <p className="text-2xl md:text-3xl font-bold mb-8 drop-shadow-lg">{player1.name} e {player2.name},<br/>vocês impactaram o mundo hoje! 🌍✨</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button onClick={initializeGame} className="bg-[#32c5ff] text-white hover:bg-white hover:text-[#0c1c4e] text-xl font-black py-5 px-10 rounded-full shadow-2xl transition-all transform hover:scale-105 uppercase">Jogar Novamente 🔄</button>
              <button onClick={() => setGameState('setup')} className="bg-white/20 text-white hover:bg-white/30 text-xl font-black py-5 px-10 rounded-full shadow-2xl transition-all uppercase">Mudar Jogadores 👥</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes hint-shake {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.05) rotate(-2deg); box-shadow: 0 0 15px #facc15; }
          75% { transform: scale(1.05) rotate(2deg); box-shadow: 0 0 15px #facc15; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg) translateX(50px); opacity: 0; }
        }
        @keyframes logo-pop {
          0% { transform: scale(0.8) rotate(-5deg); opacity: 0; }
          70% { transform: scale(1.1) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes logo-shimmer {
          0%, 100% { filter: drop-shadow(0 0 0 rgba(50,197,255,0)); }
          50% { filter: drop-shadow(0 0 12px rgba(50,197,255,0.6)); }
        }
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
        @keyframes shimmer-sweep-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes logo-bar-expand {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-up {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
        .animate-hint-shake { animation: hint-shake 0.5s infinite ease-in-out; }
        .animate-confetti-fall { animation: confetti-fall linear forwards; }
        .animate-logo-pop { animation: logo-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-logo-shimmer { animation: logo-shimmer 2.5s infinite ease-in-out; }
        .animate-wave { animation: wave 2.5s infinite ease-in-out; }
        .animate-shimmer-sweep { animation: shimmer-sweep 3s infinite ease-in-out; }
        .animate-shimmer-sweep-fast { animation: shimmer-sweep-fast 2s infinite linear; }
        .animate-logo-bar-expand { animation: logo-bar-expand 1.2s cubic-bezier(0.65, 0, 0.35, 1) forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
