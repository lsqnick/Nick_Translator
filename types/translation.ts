export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  timestamp: Date;
  category?: 'meeting' | 'travel' | 'casual' | 'business';
  confidence?: number;
  rrtProcessed?: boolean;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  supported: boolean;
  offlineAvailable?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  originalPrice?: string;
  popular?: boolean;
  features: string[];
  badge?: string;
}

export interface UserSettings {
  autoDetectLanguage: boolean;
  enableVibration: boolean;
  saveConversations: boolean;
  offlineMode: boolean;
  nightMode: boolean;
  notifications: boolean;
  highQualityAudio: boolean;
  backgroundListening: boolean;
}
