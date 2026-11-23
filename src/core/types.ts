export type PersonaId = 'julian' | 'elena';

export type ThemeId =
  | 'classic-paper'
  | 'evening-noir'
  | 'goth-velvet'
  | 'halloween'
  | 'comic-hero'
  | 'nature-botanical'
  | 'sakura-rose'
  | 'cozy-autumn'
  | 'midnight-starlight';

export type SubscriptionTier = 'free' | 'individual_plus' | 'couple_plus';

export type SpaceStatus = 'onboarding' | 'active' | 'partner_left' | 'fresh_page';

export type SpaceType = 'couple' | 'duo_friends';

export type MainTab = 'home' | 'timeline' | 'play' | 'settings';

export type ActiveOverlay =
  | 'none'
  | 'create-memory'
  | 'batch-backfill'
  | 'memory-detail'
  | 'theme-studio'
  | 'storage-backup'
  | 'paywall'
  | 'turn-the-page'
  | 'past-vault'
  | 'year-wrapped'
  | 'audio-scrapbook'
  | 'book-studio'
  | 'doodle-widget'
  | 'ai-search'
  | 'feedback-survey'
  | 'install-pwa';

export type ThemeMotif =
  | 'wax-seal'
  | 'candle'
  | 'goth-rose'
  | 'pumpkin-bat'
  | 'spider-comic'
  | 'fern-leaf'
  | 'sakura-flower'
  | 'maple-mug'
  | 'moon-galaxy';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tier: 'free' | 'plus';
  vibe: string;
  swatches: [string, string, string, string];
  particleLabel: string;
  issueTag: string;
  heroSectionLabel: string;
  pulseLabel: string;
  pulseToast: string;
  badgeSymbol: string;
  motif: ThemeMotif;
}

export interface MixtapeSong {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverGradient: string;
  dedication?: string;
}

export interface MemoryItem {
  id: string;
  authorId: PersonaId;
  authorName: string;
  type: 'photo' | 'text' | 'voice' | 'doodle' | 'milestone';
  title: string;
  body: string;
  memoryDate: string; // YYYY-MM-DD
  createdAt: number; // epoch ms (controls live 10-min edit window!)
  editedAt?: number;
  photoUrl?: string;
  doodleDataUrl?: string;
  backNote?: string;
  locationLabel?: string;
  weatherStamp?: string;
  distanceLabel?: string;
  song?: MixtapeSong;
  voiceDuration?: string;
  voiceLabel?: string;
  hiddenForUsers: PersonaId[];
  isDeletedForAll?: boolean;
  isRelayIncoming?: boolean;
  isOnThisDay?: boolean;
}

export interface LetterItem {
  id: string;
  authorId: PersonaId;
  authorName: string;
  title: string;
  body: string;
  promptUsed?: string;
  createdAt: number;
  editedAt?: number;
  promotedToTimeline?: boolean;
  hiddenForUsers: PersonaId[];
}

export interface CountdownItem {
  id: string;
  authorId: PersonaId;
  title: string;
  targetDate: string; // YYYY-MM-DD
  location?: string;
  isMystery: boolean;
  isRevealed?: boolean;
  emoji: string;
}

export interface QuizItem {
  id: string;
  authorId: PersonaId;
  question: string;
  correctAnswer: string;
  wager?: string;
  partnerGuess?: string;
  isScratched: boolean;
  promotedToTimeline?: boolean;
}

export interface TimeCapsuleItem {
  id: string;
  authorId: PersonaId;
  title: string;
  message: string;
  unlockDate: string; // YYYY-MM-DD
  isUnlocked: boolean;
  isMutual: boolean;
  hasOpened?: boolean;
}

export interface BucketListItem {
  id: string;
  title: string;
  category: 'Date Night' | 'Travel' | 'Everyday';
  completed: boolean;
  completedDate?: string;
  promotedToMemory?: boolean;
}

export interface ArchivedSpace {
  id: string;
  title: string;
  dateRange: string;
  memoryCount: number;
  coverQuote: string;
  highlights: Array<{ title: string; date: string; note: string }>;
}
