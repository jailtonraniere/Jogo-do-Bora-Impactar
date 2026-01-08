
import { CardTheme, Challenge } from './types.ts';

// O conteúdo agora foca no elemento central da ilustração artística
export const CARD_PAIRS: { theme: CardTheme; icon: string; situation: string; label: string; color: string; secondaryColor: string }[] = [
  { theme: CardTheme.ENVIRONMENT, icon: '🌳', situation: 'Plantando Árvore', label: 'Natureza', color: '#a7f3d0', secondaryColor: '#059669' },
  { theme: CardTheme.SOLIDARITY, icon: '🎁', situation: 'Doando Brinquedo', label: 'Solidariedade', color: '#fecaca', secondaryColor: '#dc2626' },
  { theme: CardTheme.EMPATHY, icon: '🤝', situation: 'Ajudando Amigo', label: 'Empatia', color: '#fef08a', secondaryColor: '#ca8a04' },
  { theme: CardTheme.EDUCATION, icon: '📖', situation: 'Lendo Juntos', label: 'Aprender', color: '#bfdbfe', secondaryColor: '#2563eb' },
  { theme: CardTheme.INCLUSION, icon: '🎡', situation: 'Todos Brincam', label: 'Inclusão', color: '#ddd6fe', secondaryColor: '#7c3aed' },
  { theme: CardTheme.ANIMALS, icon: '🐾', situation: 'Cuidando do Pet', label: 'Animais', color: '#fed7aa', secondaryColor: '#ea580c' },
  { theme: CardTheme.KINDNESS, icon: '✨', situation: 'Gesto Gentil', label: 'Gentileza', color: '#fbcfe8', secondaryColor: '#db2777' },
  { theme: CardTheme.SHARING, icon: '🍕', situation: 'Dividindo Lanche', label: 'Compartilhar', color: '#bae6fd', secondaryColor: '#0284c7' },
];

export const CHALLENGES: Record<CardTheme, Challenge> = {
  [CardTheme.ENVIRONMENT]: { id: 1, text: 'Diga algo que podemos fazer para salvar a natureza!', points: 2, type: 'action' },
  [CardTheme.SOLIDARITY]: { id: 2, text: 'Dê um abraço ou um toque de mãos no seu colega!', points: 2, type: 'action' },
  [CardTheme.EMPATHY]: { id: 3, text: 'Faça uma carinha feliz e mostre para o seu amigo!', points: 2, type: 'action' },
  [CardTheme.EDUCATION]: { id: 4, text: 'Conte algo bom que você aprendeu hoje!', points: 2, type: 'action' },
  [CardTheme.INCLUSION]: { id: 5, text: 'Batam palmas juntos em ritmo de festa!', points: 2, type: 'action' },
  [CardTheme.ANIMALS]: { id: 6, text: 'Imitem o som do animal que vocês mais gostam!', points: 2, type: 'action' },
  [CardTheme.KINDNESS]: { id: 7, text: 'Diga um elogio bem bonito para o seu colega agora!', points: 2, type: 'action' },
  [CardTheme.SHARING]: { id: 8, text: 'Conte sobre algo legal que você já dividiu com alguém!', points: 2, type: 'action' },
  [CardTheme.RESPECT]: { id: 9, text: 'Faça um sinal de positivo com as duas mãos!', points: 2, type: 'action' },
  [CardTheme.HEALTH]: { id: 10, text: 'Pulem corda 5 vezes juntos!', points: 2, type: 'action' },
  [CardTheme.PEACE]: { id: 11, text: 'Respirem fundo 3 vezes bem devagar!', points: 2, type: 'action' },
};

export const MAX_IMPACT_POINTS = CARD_PAIRS.length * 2;
