
export enum CardTheme {
  SOLIDARITY = 'SOLIDARITY',
  ENVIRONMENT = 'ENVIRONMENT',
  EMPATHY = 'EMPATHY',
  EDUCATION = 'EDUCATION',
  INCLUSION = 'INCLUSION',
  ANIMALS = 'ANIMALS',
  KINDNESS = 'KINDNESS',
  SHARING = 'SHARING',
  RESPECT = 'RESPECT',
  HEALTH = 'HEALTH',
  PEACE = 'PEACE'
}

export interface CardData {
  id: number;
  pairId: string;
  content: string;
  type: 'icon' | 'situation';
  theme: CardTheme;
  label: string;
}

export interface Challenge {
  id: number;
  text: string;
  points: number;
  type: 'reflection' | 'action';
}

export interface PlayerProfile {
  name: string;
  avatar: string;
}
