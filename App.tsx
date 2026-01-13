
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CardData, CardTheme, Challenge, PlayerProfile } from './types.ts';
import { CARD_PAIRS, CHALLENGES, MAX_IMPACT_POINTS } from './constants.tsx';
import MemoryCard from './components/MemoryCard.tsx';
import ImpactBar from './components/ImpactBar.tsx';

const SOUNDS = {
  flip: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/131/131-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  celebration: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  challenge: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  hint: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  whoosh: 'https://assets.mixkit.co/active_storage/sfx/599/599-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/256/256-preview.mp3'
};

const AVATARS = ['🌈', '🚀', '🦊', '🐱', '🐘', '🤖', '⭐', '🎈', '🦖', '🦄', '🦁', '🦉'];

const ConfettiEffect: React.FC = () => {
  const [pieces, setPieces] = useState<React.ReactElement[]>([]);
  useEffect(() => {
    const colors = ['#32c5ff', '#0c1c4e', '#facc15', '#f472b6', '#4ade80', '#fb923c', '#ffffff'];
    const shapes = ['rect', 'circle', 'triangle'];
    const newPieces = Array.from({ length: 100 }).map((_, i) => {
      const size = Math.random() * 10 + 6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const left = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 3 + 4;
      const rotation = Math.random() * 360;
      return (
        <div key={i} className="absolute animate-confetti-fall pointer-events-none"
          style={{
            left: `${left}%`, top: '-20px', width: `${size}px`, height: `${size}px`,
            backgroundColor: color, borderRadius: shape === 'circle' ? '50%' : shape === 'triangle' ? '0' : '2px',
            clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none',
            animationDelay: `${delay}s`, animationDuration: `${duration}s`,
            transform: `rotate(${rotation}deg)`, opacity: 0.9, zIndex: 100
          }}
        />
      );
    });
    setPieces(newPieces);
  }, []);
  return <div className="fixed inset-0 overflow-hidden pointer-events-none z-[100]">{pieces}</div>;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'finished'>('setup');
  const [players, setPlayers] = useState<PlayerProfile[]>([
    { name: 'Jogador 1', avatar: '🌈' }
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isSwitchingPlayer, setIsSwitchingPlayer] = useState(false);
  const [showTurnOverlay, setShowTurnOverlay] = useState(false);
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
      audioRefs.current[key] = audio;
    });
  }, []);

  const playSound = (soundKey: keyof typeof SOUNDS) => {
    if (isMuted) return;
    const sound = audioRefs.current[soundKey];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  };

  const addPlayer = () => {
    if (players.length < 4) {
      playSound('click');
      setPlayers([...players, { 
        name: `Jogador ${players.length + 1}`, 
        avatar: AVATARS[players.length % AVATARS.length] 
      }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 1) {
      playSound('click');
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, data: Partial<PlayerProfile>) => {
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], ...data };
    setPlayers(newPlayers);
  };

  const initializeGame = useCallback(() => {
    playSound('click');
    const deck: CardData[] = [];
    CARD_PAIRS.forEach((pair, index) => {
      deck.push({ id: index * 2, pairId: `pair-${index}`, content: pair.icon, type: 'icon', theme: pair.theme, label: pair.label });
      deck.push({ id: index * 2 + 1, pairId: `pair-${index}`, content: pair.icon, type: 'situation', theme: pair.theme, label: pair.situation });
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
    setShowTurnOverlay(false);
    setHintAvailable(true);
    setHintingCards([]);
  }, [players]);

  const switchPlayerWithEffect = useCallback(() => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    if (players.length === 1) return;
    setIsSwitchingPlayer(true);
    playSound('whoosh');
    setTimeout(() => {
      setCurrentPlayerIndex(nextIndex);
      setShowTurnOverlay(true);
      setTimeout(() => {
        setShowTurnOverlay(false);
        setIsSwitchingPlayer(false);
      }, 1200);
    }, 300);
  }, [currentPlayerIndex, players.length]);

  const handleCardClick = (card: CardData) => {
    if (isProcessing || isSwitchingPlayer || flippedCards.length >= 2 || activeChallenge || matchedPairs.includes(card.pairId)) return;
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
          setTimeout(() => {
            setFlippedCards([]);
            switchPlayerWithEffect();
            setIsProcessing(false);
          }, 800);
        }, 300);
      }
    }
  };

  const handleHint = () => {
    if (!hintAvailable || isProcessing || isSwitchingPlayer || flippedCards.length > 0 || activeChallenge) return;
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
    switchPlayerWithEffect();
    if (matchedPairs.length === CARD_PAIRS.length) {
      setTimeout(() => {
        setGameState('finished');
        playSound('celebration');
      }, 700);
    }
  };

  const handleResetGame = () => {
    playSound('click');
    setShowResetConfirm(true);
  };

  const handleGoHome = () => {
    playSound('click');
    setGameState('setup');
  };

  const LogoText = () => (
    <div className="flex flex-col items-center select-none group relative py-6">
      {/* Adereços Decorativos */}
      <div className="absolute top-2 -right-8 text-2xl animate-bounce-slow opacity-80 rotate-12">✨</div>
      <div className="absolute -bottom-2 -left-10 text-2xl animate-pulse opacity-60">🌍</div>
      
      {/* Container de Texto com Padding Lateral para evitar corte */}
      <div className="flex items-center gap-3 transform transition-all duration-500 group-hover:scale-110 px-4">
        <span className="text-4xl md:text-6xl font-black italic text-[#0c1c4e] tracking-tight drop-shadow-[0_6px_0_rgba(0,0,0,0.1)] relative">
          BORA
        </span>
        <span className="text-4xl md:text-6xl font-black italic bg-gradient-to-r from-[#32c5ff] via-[#1e3a8a] to-[#32c5ff] bg-[length:200%_auto] animate-shimmer-text bg-clip-text text-transparent tracking-normal drop-shadow-[0_6px_0_rgba(50,197,255,0.2)] pr-4">
          IMPACTAR
        </span>
      </div>
      
      {/* Barra de Subtítulo com Largura Ajustada */}
      <div className="relative mt-2 flex flex-col items-center">
        <div className="h-2 w-48 md:w-64 bg-[#0c1c4e]/10 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-[#32c5ff] to-transparent animate-shimmer-sweep"></div>
        </div>
        <div className="mt-1">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#0c1c4e]/50">Edição Kids</span>
        </div>
      </div>

      <style>{`
        @keyframes shimmer-text {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(20deg); }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-text { animation: shimmer-text 4s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 3.5s infinite ease-in-out; }
        .animate-shimmer-sweep { animation: shimmer-sweep 2.5s linear infinite; }
      `}</style>
    </div>
  );

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center bg-[#f0fdf4] relative overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#32c5ff]/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-400/5 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="z-10 w-full max-w-5xl flex flex-col items-center">
          <LogoText />
          
          <div className="mt-12 w-full text-center">
            <h2 className="text-xl font-black text-[#0c1c4e]/60 mb-10 uppercase tracking-[0.2em] italic">Escolha sua Equipe</h2>
            
            <div className="flex flex-wrap justify-center items-end gap-6 md:gap-10 mb-16">
              {players.map((player, idx) => (
                <div key={idx} className="group relative flex flex-col items-center animate-fade-in-up" style={{animationDelay: `${idx * 0.1}s`}}>
                  {players.length > 1 && (
                    <button 
                      onClick={() => removePlayer(idx)} 
                      className="absolute -top-2 -right-2 bg-white text-[#0c1c4e] w-8 h-8 rounded-full font-black shadow-xl border-2 border-gray-100 hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-95 z-20 transition-all flex items-center justify-center text-sm"
                    >
                      ✕
                    </button>
                  )}
                  
                  {/* Avatar Bubble */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.08)] flex items-center justify-center text-5xl md:text-7xl border-4 border-transparent group-hover:border-[#32c5ff] transition-all duration-300 transform group-hover:-translate-y-2 group-hover:rotate-3 overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-tr from-[#32c5ff]/5 to-transparent"></div>
                       {player.avatar}
                    </div>
                    
                    {/* Mini Avatar Picker */}
                    <div className="absolute -bottom-2 -left-2 -right-2 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-1 flex justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      {AVATARS.slice(0, 6).map(a => (
                        <button 
                          key={a} 
                          onClick={() => { playSound('click'); updatePlayer(idx, { avatar: a }); }} 
                          className={`text-sm p-1 rounded-lg transition-all ${player.avatar === a ? 'bg-[#32c5ff] text-white scale-110' : 'hover:bg-blue-50'}`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name Input Minimal */}
                  <input 
                    type="text" 
                    value={player.name} 
                    onChange={e => updatePlayer(idx, { name: e.target.value })} 
                    className="bg-transparent border-b-2 border-[#0c1c4e]/10 text-center font-black text-lg text-[#0c1c4e] py-1 outline-none focus:border-[#32c5ff] transition-all w-32 placeholder:opacity-30" 
                    placeholder="Nome..."
                  />
                </div>
              ))}

              {/* Discreto Botão Adicionar */}
              {players.length < 4 && (
                <button 
                  onClick={addPlayer} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-[40px] border-4 border-dashed border-[#0c1c4e]/10 flex flex-col items-center justify-center hover:bg-white hover:border-[#32c5ff] hover:scale-105 transition-all group mb-10"
                >
                  <span className="text-3xl text-[#0c1c4e]/20 group-hover:text-[#32c5ff] transition-colors">＋</span>
                  <span className="text-[10px] font-black uppercase text-[#0c1c4e]/20 group-hover:text-[#32c5ff] tracking-widest mt-1">Convidar</span>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-6 items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#32c5ff] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-all animate-pulse"></div>
                <button 
                  onClick={initializeGame} 
                  className="relative bg-[#32c5ff] hover:bg-[#0c1c4e] text-white text-2xl md:text-3xl font-black py-6 px-16 rounded-full shadow-2xl transition-all active:scale-95 uppercase italic hover:scale-105 border-b-8 border-black/10 overflow-hidden"
                >
                  <span className="relative z-10">VAMOS IMPACTAR! 🚀</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer-sweep"></div>
                </button>
              </div>
              
              <div className="flex items-center gap-3 px-6 py-2 bg-white/40 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
                <div className="flex -space-x-2">
                  {players.map((p, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs shadow-sm ring-2 ring-white">{p.avatar}</div>
                  ))}
                </div>
                <p className="text-[#0c1c4e] font-black text-[10px] uppercase tracking-[0.2em] opacity-60">
                  {players.length} {players.length === 1 ? 'Líder' : 'Heróis'} no time
                </p>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 flex flex-col items-center bg-[#f0fdf4]">
      {gameState === 'finished' && <ConfettiEffect />}
      
      {showTurnOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none">
          <div className="bg-white/90 backdrop-blur-xl border-8 border-[#32c5ff] p-12 rounded-[60px] shadow-[0_0_100px_rgba(50,197,255,0.5)] animate-turn-pop">
            <div className="text-8xl mb-6 text-center">{players[currentPlayerIndex].avatar}</div>
            <h1 className="text-6xl font-black text-[#0c1c4e] uppercase italic text-center leading-tight">
              VEZ DE <br/>
              <span className="text-[#32c5ff]">{players[currentPlayerIndex].name}!</span>
            </h1>
          </div>
        </div>
      )}

      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button onClick={handleGoHome} className="bg-white border-2 border-[#0c1c4e] p-2 rounded-full shadow-lg active:scale-95 transition-transform hover:rotate-12">🏠</button>
        <button onClick={handleHint} disabled={!hintAvailable} className={`bg-white border-2 p-2 rounded-full shadow-lg active:scale-95 ${hintAvailable ? 'border-yellow-400 hover:rotate-12' : 'opacity-50 grayscale cursor-not-allowed'}`}>💡</button>
        <button onClick={handleResetGame} className="bg-white border-2 border-[#0c1c4e] p-2 rounded-full shadow-lg active:scale-95 transition-transform hover:-rotate-12">🔄</button>
        <button onClick={() => { setIsMuted(!isMuted); playSound('click'); }} className="bg-white border-2 border-[#32c5ff] p-2 rounded-full shadow-lg active:scale-95">{isMuted ? '🔇' : '🔊'}</button>
      </div>

      <header className="text-center mb-2 flex flex-col items-center w-full max-w-4xl pt-2">
        <LogoText />
        
        <div className={`flex items-center gap-4 mt-2 bg-white/60 backdrop-blur px-6 py-2 rounded-full shadow-md transition-all duration-500 ${isSwitchingPlayer ? 'opacity-30 blur-sm' : ''}`}>
          {players.map((p, i) => (
            <div key={i} className="flex items-center gap-2 relative">
              <div className={`flex flex-col items-center transition-all duration-500 ${currentPlayerIndex === i ? 'scale-110 z-10' : 'opacity-40 scale-90 grayscale'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl shadow-md border-3 transition-all ${currentPlayerIndex === i ? 'bg-blue-50 border-[#32c5ff] animate-bounce-active ring-2 ring-[#32c5ff]/20' : 'bg-white border-gray-100'}`}>
                  {p.avatar}
                </div>
                <span className={`font-black text-[8px] uppercase tracking-tighter max-w-[50px] truncate ${currentPlayerIndex === i ? 'text-[#0c1c4e]' : 'text-gray-400'}`}>
                  {p.name}
                </span>
              </div>
              {i < players.length - 1 && <div className="w-2 h-0.5 bg-gray-200 rounded-full" />}
            </div>
          ))}
        </div>
      </header>

      <ImpactBar points={points} />

      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 my-2 max-w-7xl transition-all duration-500 ${isSwitchingPlayer ? 'opacity-30 blur-sm scale-95' : ''}`}>
        {cards.map((card) => (
          <div key={card.id} className={`${hintingCards.includes(card.id) ? 'animate-hint-shake z-10' : ''}`}>
             <MemoryCard card={card} isFlipped={flippedCards.some(c => c.id === card.id)} isMatched={matchedPairs.includes(card.pairId)} isNewlyMatched={newlyMatchedPair === card.pairId} onClick={handleCardClick} disabled={isProcessing || isSwitchingPlayer} />
          </div>
        ))}
      </div>

      {activeChallenge && (
        <div className="fixed inset-0 bg-[#0c1c4e]/90 flex items-center justify-center z-50 p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[50px] p-10 max-w-md w-full text-center shadow-2xl border-8 border-[#32c5ff] animate-modal-pop">
            <div className="text-7xl mb-6 animate-bounce">🌟</div>
            <h2 className="text-4xl font-black text-[#0c1c4e] mb-4 uppercase tracking-tighter">MISSÃO! 🤝</h2>
            <p className="text-2xl text-gray-700 mb-8 font-black italic px-4 leading-snug">"{activeChallenge.text}"</p>
            <button onClick={completeChallenge} className="bg-[#32c5ff] hover:bg-[#0c1c4e] text-white text-2xl font-black py-5 px-10 rounded-full shadow-xl w-full uppercase active:scale-95 border-b-8 border-black/20 hover:scale-105 transition-all">CONCLUÍDO!</button>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="fixed inset-0 bg-[#0c1c4e]/95 flex flex-col items-center justify-center z-[110] p-6 text-center text-white animate-fade-in overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {['🎉', '✨', '🎈', '🎊', '🌟'].map((emoji, i) => (
               <div key={i} className="absolute animate-float-victory text-4xl" style={{
                 left: `${Math.random() * 80 + 10}%`,
                 top: `${Math.random() * 80 + 10}%`,
                 animationDelay: `${i * 0.5}s`,
                 opacity: 0.6
               }}>{emoji}</div>
             ))}
          </div>

          <div className="relative bg-white/10 backdrop-blur-xl rounded-[60px] p-12 max-w-2xl border-8 border-[#32c5ff] shadow-[0_0_80px_rgba(50,197,255,0.4)] animate-modal-pop">
            <div className="absolute -top-10 -left-10 text-6xl animate-bounce">🎊</div>
            <div className="absolute -bottom-10 -right-10 text-6xl animate-bounce" style={{animationDelay: '0.3s'}}>🎉</div>
            <h1 className="text-7xl font-black mb-6 text-[#32c5ff] uppercase italic drop-shadow-lg tracking-tighter">UAU! 🌍</h1>
            <p className="text-3xl font-bold mb-4">Time de Impacto:</p>
            <div className="flex justify-center gap-6 mb-10 bg-white/5 p-6 rounded-3xl">
              {players.map((p, i) => (
                <div key={i} className="flex flex-col items-center transform hover:scale-110 transition-transform">
                  <span className="text-6xl mb-2 drop-shadow-md">{p.avatar}</span>
                  <span className="text-sm font-black uppercase text-[#32c5ff]">{p.name}</span>
                </div>
              ))}
            </div>
            <p className="text-2xl font-bold mb-10 italic">Vocês impactaram o mundo juntos hoje!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={initializeGame} className="bg-[#32c5ff] text-white text-2xl font-black py-5 px-10 rounded-full shadow-2xl active:scale-95 uppercase hover:scale-105 transition-all border-b-8 border-black/20">Jogar Novamente!</button>
              <button onClick={() => setGameState('setup')} className="bg-white/20 text-white text-2xl font-black py-5 px-10 rounded-full shadow-2xl uppercase active:scale-95 hover:bg-white/30 transition-all border-b-8 border-white/10">Trocar Equipe</button>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-[#0c1c4e]/60 flex items-center justify-center z-[120] p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[40px] p-10 max-sm:p-6 max-w-sm w-full text-center border-8 border-[#32c5ff] shadow-2xl animate-modal-pop">
            <h3 className="text-3xl font-black mb-8 uppercase text-[#0c1c4e] tracking-tight">Recomeçar? 🔄</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 bg-gray-200 font-black py-4 rounded-full active:scale-95 uppercase text-[#0c1c4e]">Não</button>
              <button onClick={initializeGame} className="flex-1 bg-[#0c1c4e] text-white font-black py-4 rounded-full active:scale-95 uppercase shadow-lg">Sim</button>
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
        @keyframes hint-shake { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes logo-pop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-logo-pop { animation: logo-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes turn-pop {
          0% { transform: scale(0.5) translateY(50px); opacity: 0; }
          20% { transform: scale(1.1) translateY(0); opacity: 1; }
          80% { transform: scale(1) translateY(0); opacity: 1; }
          100% { transform: scale(1.2) translateY(-50px); opacity: 0; }
        }
        .animate-turn-pop { animation: turn-pop 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes modal-pop { 0% { transform: scale(0) rotate(-10deg); opacity: 0; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
        .animate-modal-pop { animation: modal-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        @keyframes bounce-active { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        .animate-bounce-active { animation: bounce-active 1.5s infinite ease-in-out; }
        @keyframes float-victory {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.2); }
        }
        .animate-float-victory { animation: float-victory 3s infinite ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #32c5ff; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #0c1c4e; }
      `}</style>
    </div>
  );
};

export default App;
