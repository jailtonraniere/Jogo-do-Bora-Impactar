
import { CardTheme, Challenge } from './types';

export const CARD_PAIRS: { theme: CardTheme; icon: string; situation: string; label: string }[] = [
  { theme: CardTheme.SOLIDARITY, icon: '🤝', situation: 'Crianças doando brinquedos', label: 'Solidariedade' },
  { theme: CardTheme.ENVIRONMENT, icon: '🌱', situation: 'Plantando uma árvore juntos', label: 'Meio Ambiente' },
  { theme: CardTheme.EMPATHY, icon: '😊', situation: 'Ouvindo um amigo com atenção', label: 'Empatia' },
  { theme: CardTheme.EDUCATION, icon: '📚', situation: 'Ensinando algo novo a alguém', label: 'Educação' },
  { theme: CardTheme.INCLUSION, icon: '♿', situation: 'Brincando todos juntos na roda', label: 'Inclusão' },
  { theme: CardTheme.ANIMALS, icon: '🐾', situation: 'Cuidando de um animal de rua', label: 'Cuidado Animal' },
  { theme: CardTheme.KINDNESS, icon: '🍭', situation: 'Dando um doce para alegrar alguém', label: 'Gentileza' },
  { theme: CardTheme.SHARING, icon: '🍕', situation: 'Dividindo o lanche no recreio', label: 'Compartilhar' },
  { theme: CardTheme.RESPECT, icon: '✋', situation: 'Esperando a vez de falar', label: 'Respeito' },
  { theme: CardTheme.HEALTH, icon: '🍎', situation: 'Escolhendo comer frutas juntos', label: 'Saúde' },
  { theme: CardTheme.PEACE, icon: '🕊️', situation: 'Resolvendo briguinhas com conversa', label: 'Paz' },
];

export const CHALLENGES: Record<CardTheme, Challenge> = {
  [CardTheme.SOLIDARITY]: { id: 1, text: 'Dê um abraço ou um toque de mãos no seu colega!', points: 2, type: 'action' },
  [CardTheme.ENVIRONMENT]: { id: 2, text: 'Diga algo que podemos fazer para salvar a natureza!', points: 2, type: 'action' },
  [CardTheme.EMPATHY]: { id: 3, text: 'Faça uma carinha feliz e mostre para o seu amigo!', points: 2, type: 'action' },
  [CardTheme.EDUCATION]: { id: 4, text: 'Conte algo bom que você aprendeu hoje!', points: 2, type: 'action' },
  [CardTheme.INCLUSION]: { id: 5, text: 'Batam palmas juntos em ritmo de festa!', points: 2, type: 'action' },
  [CardTheme.ANIMALS]: { id: 6, text: 'Imitem o som do animal que vocês mais gostam!', points: 2, type: 'action' },
  [CardTheme.KINDNESS]: { id: 7, text: 'Diga um elogio bem bonito para o seu colega agora!', points: 2, type: 'action' },
  [CardTheme.SHARING]: { id: 8, text: 'Conte sobre algo legal que você já dividiu com alguém!', points: 2, type: 'action' },
  [CardTheme.RESPECT]: { id: 9, text: 'Faça um sinal de positivo com as duas mãos!', points: 2, type: 'action' },
  [CardTheme.HEALTH]: { id: 10, text: 'Pulem corda (ou simulem o pulo) 5 vezes juntos!', points: 2, type: 'action' },
  [CardTheme.PEACE]: { id: 11, text: 'Respirem fundo 3 vezes bem devagar e juntos!', points: 2, type: 'action' },
};

export const MAX_IMPACT_POINTS = CARD_PAIRS.length * 2;
