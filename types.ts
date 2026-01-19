
export enum TabType {
  HOME = 'home',
  CHAT = 'chat',
  STORY = 'story',
  EVENT = 'event',
  PROFILE = 'profile'
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
  isThinking?: boolean;
  isHighlight?: boolean;
  groundingUrls?: string[];
  imageUrl?: string; 
  isSystem?: boolean;
}

export interface IconMeme {
  id: string;
  dataUrl: string;
  tags: string[];
  note: string;
}

export interface StoryCard {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  prompt: string;
  isHot: boolean;
  createdAt: number;
}

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: 'ceo_gift' | 'miu_miu';
  description: string;
  minLevel?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface GiftHistoryEntry {
  id: string;
  name: string;
  icon: string;
  timestamp: number;
  affinityGained: number;
}

export interface Mission {
  id: string;
  title: string;
  reward: number;
  icon: string;
  target: number;
  current: number;
  claimed: boolean;
}

export interface ActivityLog {
  id: string;
  user: 'Ethereal' | 'Trác Lẫm';
  action: string;
  time: number;
}
