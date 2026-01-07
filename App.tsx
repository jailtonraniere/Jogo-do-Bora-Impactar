
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
        content: pair.icon.split(' ')[0],
        type: 'icon',
        theme: pair.theme,
        label: pair.label
      });
      deck.push({
        id: index * 2 + 1,
        pairId: `pair-${index}`,
        content: pair.icon.split(' ')[1] || '✨',
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
        }, 1200);
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
          <span className={`text-3xl md:text-5xl font-black italic tracking-tighter transition-all duration-500 group-hover:text-[#32c5ff] animate-logo-pop ${light ? 'text-white' : 'text-[#0c1c4e]'}`}>
            BORA
          </span>
          <span className="relative flex text-3xl md:text-5xl font-black italic tracking-tighter text-[#32c5ff] animate-logo-shimmer overflow-hidden px-1">
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
        <div className="relative h-1.5 md:h-2 w-full max-w-[150px] md:max-w-[280px] mt-1 rounded-full overflow-hidden bg-gray-200/20">
          <div className={`absolute inset-0 rounded-full animate-logo-bar-expand origin-left ${light ? 'bg-white' : 'bg-[#32c5ff]'}`}></div>
        </div>
      </div>
    );
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-[#f0fdf4]">
        <LogoText />
        <div className="mt-8 bg-white p-6 md:p-10 rounded-[40px] shadow-2xl border-4 border-[#32c5ff] w-full max-w-2xl text-center animate-fade-in-up">
          <h2 className="text-2xl md:text-3xl font-black text-[#0c1c4e] mb-6 uppercase">Quem vai impactar hoje?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-4 rounded-3xl bg-blue-50 border-2 border-blue-100">
              <div className="text-5xl mb-4 p-4 bg-white rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-md">
                {player1.avatar}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {AVATARS.map(a => (
                  <button key={a} onClick={() => setPlayer1(p => ({ ...p, avatar: a }))} className={`text-xl p-1 rounded-lg transition-all ${player1.avatar === a ? 'bg-blue-200 scale-125 rotate-6' : 'hover:bg-white hover:scale-110'}`}>{a}</button>
                ))}
              </div>
              <input 
                type="text" 
                value={player1.name} 
                onChange={e => setPlayer1(p => ({ ...p, name: e.target.value }))}
                className="w-full p-2.5 rounded-xl border-2 border-[#32c5ff] text-center font-bold text-[#0c1c4e] focus:ring-4 focus:ring-blue-100 outline-none"
                placeholder="Jogador 1"
              />
            </div>

            <div className="p-4 rounded-3xl bg-blue-50 border-2 border-blue-100">
              <div className="text-5xl mb-4 p-4 bg-white rounded-full w-20 h-20 mx-auto flex items-center justify-center shadow-md">
                {player2.avatar}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {AVATARS.map(a => (
                  <button key={a} onClick={() => setPlayer2(p => ({ ...p, avatar: a }))} className={`text-xl p-1 rounded-lg transition-all ${player2.avatar === a ? 'bg-blue-200 scale-125 rotate-6' : 'hover:bg-white hover:scale-110'}`}>{a}</button>
                ))}
              </div>
              <input 
                type="text" 
                value={player2.name} 
                onChange={e => setPlayer2(p => ({ ...p, name: e.target.value }))}
                className="w-full p-2.5 rounded-xl border-2 border-[#32c5ff] text-center font-bold text-[#0c1c4e] focus:ring-4 focus:ring-blue-100 outline-none"
                placeholder="Jogador 2"
              />
            </div>
          </div>

          <button 
            onClick={initializeGame}
            className="group relative bg-[#32c5ff] hover:bg-[#0c1c4e] text-white text-2xl font-black py-4 px-10 rounded-full shadow-lg transition-all active:scale-95 uppercase italic overflow-hidden"
          >
            <span className="relative z-10">VAMOS IMPACTAR! 🚀</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    );
  }

  const currentPlayer = currentPlayerIndex === 0 ? player1 : player2;

  return (
    <div className="min-h-screen p-4 pb-24 flex flex-col items-center bg-[#f0fdf4]">
      {gameState === 'finished' && <ConfettiEffect />}
      
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button onClick={handleHint} disabled={!hintAvailable} className={`bg-white border-2 p-2.5 rounded-full shadow-lg text-lg transition-all ${hintAvailable ? 'border-yellow-400 animate-pulse' : 'opacity-50'}`}>💡</button>
        <button onClick={handleResetGame} className="bg-white border-2 border-[#0c1c4e] p-2.5 rounded-full shadow-lg text-lg hover:rotate-180 transition-transform duration-500">🔄</button>
        <button onClick={() => setIsMuted(!isMuted)} className="bg-white border-2 border-[#32c5ff] p-2.5 rounded-full shadow-lg text-lg">{isMuted ? '🔇' : '🔊'}</button>
      </div>

      <header className="text-center mb-4 flex flex-col items-center w-full max-w-4xl pt-4">
        <LogoText />
        
        <div className="flex items-center gap-4 mt-6 bg-white px-5 py-2.5 rounded-full shadow-md border border-blue-50">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${currentPlayerIndex === 0 ? 'bg-blue-100 ring-4 ring-[#32c5ff]/20 scale-105' : 'opacity-30 grayscale grayscale'}`}>
            <span className="text-2xl">{player1.avatar}</span>
            <span className="font-bold text-[#0c1c4e] text-sm uppercase tracking-tight">{player1.name}</span>
          </div>
          <div className="w-8 h-8 flex items-center justify-center bg-[#0c1c4e] text-white rounded-full text-xs font-black shadow-lg">Vez</div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${currentPlayerIndex === 1 ? 'bg-blue-100 ring-4 ring-[#32c5ff]/20 scale-105' : 'opacity-30 grayscale'}`}>
            <span className="text-2xl">{player2.avatar}</span>
            <span className="font-bold text-[#0c1c4e] text-sm uppercase tracking-tight">{player2.name}</span>
          </div>
        </div>
      </header>

      <ImpactBar points={points} />

      {/* Grade de Cards com espaçamento otimizado para os novos cards maiores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8 my-6 max-w-6xl px-4">
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

      {activeChallenge && (
        <div className="fixed inset-0 bg-[#0c1c4e]/90 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl border-4 border-[#32c5ff] animate-bounce-subtle">
            <h2 className="text-3xl font-black text-[#0c1c4e] mb-4 uppercase tracking-tight">MISSÃO! 🤝</h2>
            <p className="text-xl text-gray-700 mb-8 font-bold italic leading-relaxed">"{activeChallenge.text}"</p>
            <button onClick={completeChallenge} className="bg-[#32c5ff] hover:bg-[#0c1c4e] text-white text-xl font-black py-4 px-10 rounded-full shadow-xl transition-all w-full uppercase">CONCLUÍDO!</button>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="fixed inset-0 bg-[#0c1c4e]/95 flex flex-col items-center justify-center z-[60] p-6 text-center text-white">
          <div className="bg-white/10 backdrop-blur-xl rounded-[50px] p-12 max-w-2xl border-4 border-[#32c5ff] shadow-2xl animate-scale-up">
            <h1 className="text-5xl md:text-7xl font-black mb-4 text-[#32c5ff] uppercase italic animate-bounce">UAU! 🌍</h1>
            <p className="text-2xl font-bold mb-8">
              {player1.name} e {player2.name},<br/>
              vocês impactaram o mundo juntos hoje!
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={initializeGame} className="bg-[#32c5ff] text-white text-xl font-black py-4 px-8 rounded-full shadow-2xl hover:scale-105 transition-transform uppercase">De Novo!</button>
              <button onClick={() => setGameState('setup')} className="bg-white/20 text-white text-xl font-black py-4 px-8 rounded-full shadow-2xl uppercase">Trocar Dupla</button>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-[#0c1c4e]/60 flex items-center justify-center z-[70] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[30px] p-8 max-w-sm w-full text-center border-4 border-[#32c5ff]">
            <h3 className="text-xl font-black mb-4 uppercase">Recomeçar? 🔄</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 bg-gray-200 font-bold py-3 rounded-full">Não</button>
              <button onClick={initializeGame} className="flex-1 bg-[#0c1c4e] text-white font-bold py-3 rounded-full">Sim</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall { animation: confetti-fall linear forwards; }
        .animate-hint-shake { animation: hint-shake 0.5s infinite; }
        @keyframes hint-shake {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default App;
