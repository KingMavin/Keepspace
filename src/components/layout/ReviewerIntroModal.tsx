import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Feather,
  Home,
  Plus,
  Settings,
  Sparkles,
} from 'lucide-react';
import { haptics } from '../../core/haptics';
import { useDemoStore } from '../../core/useDemoStore';

type ScreenGuideKey = 'home' | 'timeline' | 'play' | 'settings' | 'create';

interface GuideCardContent {
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  intro?: string;
  items: Array<{ label: string; text: string }>;
}

const SCREEN_GUIDES: Record<ScreenGuideKey, GuideCardContent> = {
  home: {
    badge: 'Welcome \u2022 Home Screen',
    icon: Home,
    title: 'What is Keepsake?',
    intro:
      'Keepsake is a private scrapbook app for couples to save photos, songs, and letters away from social media. Right now, you\u2019re exploring a sample couple: Elena & Julian.',
    items: [
      { label: 'Newest Photo', text: 'Tap the main photo card to flip it over and read the secret note on the back.' },
      { label: 'Thinking of You & Distance', text: 'Tap to send a quick heart alert or see how far apart you are.' },
      { label: 'Top Bar', text: 'Use As: Julian/Elena to switch partners, Try Screens for special demos, or Feedback anytime.' },
    ],
  },
  timeline: {
    badge: 'Timeline Screen',
    icon: BookOpen,
    title: 'Your Memories by Month',
    items: [
      { label: 'Monthly Scrapbook', text: 'All your photos, voice notes, and doodles organized cleanly by month and year.' },
      { label: 'Search & Filter', text: 'Filter by Photos, Voice, or Mixtape, or search by city or word.' },
      { label: 'Add or Import Photos', text: 'Tap the big + button at the bottom to add a new memory or import older photos.' },
    ],
  },
  play: {
    badge: 'Fun & Music Screen',
    icon: Feather,
    title: 'Mixtape, Letters & Couple Games',
    items: [
      { label: 'Shared Mixtape', text: 'Press Play on your couple playlist\u2014the music keeps playing while you browse the app.' },
      { label: 'Letters & Time Capsules', text: 'Write love notes or lock a letter until a future anniversary date.' },
      { label: 'Quizzes & Countdowns', text: 'Rub the silver scratch-off card to reveal quiz answers, or set a trip countdown.' },
    ],
  },
  settings: {
    badge: 'Settings & Extras',
    icon: Settings,
    title: 'Themes, Print Book & Feedback',
    items: [
      { label: 'Send Feedback (Top)', text: 'Tap Feedback & Quick Survey right at the top to share your thoughts on Google Forms!' },
      { label: 'Change App Theme', text: 'Try all 9 themes (like Comic or Space & Moon)\u2014each changes the colors, icons, and animations.' },
      { label: 'Book, Wrapped & Voice', text: 'Preview a printed hardcover book, watch the 2025 Year in Review, or record voice notes.' },
    ],
  },
  create: {
    badge: 'Add a Memory',
    icon: Plus,
    title: 'Save a New Moment',
    items: [
      { label: 'Add Photo or Text', text: 'Pick a photo, write a title/story, and add a secret note on the back of the photo.' },
      { label: '10-Minute Edit Rule', text: 'Just like WhatsApp, only the person who wrote a memory can edit it for 10 minutes after saving.' },
    ],
  },
};

export const ReviewerIntroModal: React.FC = () => {
  const activeTab = useDemoStore((s) => s.activeTab);
  const activeOverlay = useDemoStore((s) => s.activeOverlay);
  const showSplash = useDemoStore((s) => s.showSplash);
  const showInstallPrompt = useDemoStore((s) => s.showInstallPrompt);
  const spaceStatus = useDemoStore((s) => s.spaceStatus);
  const seenScreenGuides = useDemoStore((s) => s.seenScreenGuides);
  const dismissScreenGuide = useDemoStore((s) => s.dismissScreenGuide);

  if (showSplash || showInstallPrompt || spaceStatus !== 'active') return null;

  let screenKey: ScreenGuideKey | null = null;
  if (activeOverlay === 'create-memory') {
    screenKey = 'create';
  } else if (activeOverlay === 'none') {
    screenKey = activeTab;
  }

  if (!screenKey || seenScreenGuides[screenKey]) return null;

  const current = SCREEN_GUIDES[screenKey];
  const Icon = current.icon ?? Sparkles;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/55 p-5 backdrop-blur-md"
    >
      <motion.div
        key={screenKey}
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="keepsake-card lined-note-bg relative flex w-full max-w-[350px] flex-col rounded-3xl p-5 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--accent-primary)]">
            <Icon className="h-3 w-3" /> {current.badge}
          </span>
        </div>

        <h2 className="keepsake-heading mt-3 text-2xl leading-snug">{current.title}</h2>
        {current.intro && (
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">{current.intro}</p>
        )}

        <div className="mt-3 space-y-2">
          {current.items.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[var(--border-token)]/70 bg-[var(--bg-primary)]/80 px-3 py-2 text-[11px] leading-snug"
            >
              <span className="font-bold text-[var(--accent-primary)]">{item.label}: </span>
              <span className="text-[var(--text-secondary)]">{item.text}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            haptics.light();
            dismissScreenGuide(screenKey);
          }}
          className="mt-5 w-full rounded-2xl bg-[var(--accent-primary)] py-3 text-xs font-bold text-[var(--accent-contrast)] shadow-md"
        >
          Got it, let me try!
        </button>
      </motion.div>
    </motion.div>
  );
};
