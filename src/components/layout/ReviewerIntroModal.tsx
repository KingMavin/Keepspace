import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Feather,
  MessageSquareHeart,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { haptics } from '../../core/haptics';
import { useDemoStore } from '../../core/useDemoStore';

const INTRO_NOTES = [
  {
    badge: 'Note 1 of 4 • The Screens',
    icon: Compass,
    title: 'A quick guide to the screens',
    items: [
      { label: 'Home', text: 'Your relationship cover, latest Polaroid, distance pill & Mixtape bar.' },
      { label: 'Our Story', text: 'Chronological timeline grouped by month, archive search & photo import.' },
      { label: '+ Button', text: 'Add a new Polaroid, note, mixtape track, or photo roll batch.' },
      { label: 'Play', text: 'Persistent Mixtape player, love letters, scratch-off quizzes & time capsules.' },
      { label: 'Settings', text: 'Custom themes, book studio, voice letters, backup & privacy vault.' },
    ],
  },
  {
    badge: 'Note 2 of 4 • Top Controls',
    icon: SlidersHorizontal,
    title: 'How to use the top "Flows" bar',
    body: 'Look at the dark strip at the very top of your screen—that is your quick Reviewer Control Bar:',
    items: [
      {
        label: 'Julian / Elena',
        text: 'Tap the name pill anytime to switch between Partner A & Partner B. Each partner keeps their own theme and 10-minute edit window.',
      },
      {
        label: 'Flows Menu',
        text: 'Tap "Flows" at the top right to jump straight to special experiences like Partner Gift Unwrap (with trumpets & confetti), 2025 Year Wrapped, Incoming Relay, or Silent Exit.',
      },
    ],
  },
  {
    badge: 'Note 3 of 4 • Little Details',
    icon: Feather,
    title: 'Fun things to try out',
    items: [
      { label: 'Flip Polaroids', text: 'Tap any photo card to flip it in 3D and read or write notes on the back.' },
      {
        label: 'Change Themes',
        text: 'Open Theme Studio in Settings to try Comic, Space/Moon, Halloween & more—each transforms icons, colors & animations.',
      },
      {
        label: 'Mixtape Keeps Playing',
        text: 'Press Play in Mixtape and browse around—songs stay playing across the entire app until another audio starts.',
      },
    ],
  },
  {
    badge: 'Note 4 of 4 • Feedback & Survey',
    icon: MessageSquareHeart,
    title: 'Where to share your feedback',
    body: 'Whenever you have finished exploring, we would love to hear what stood out or felt confusing:',
    items: [
      {
        label: 'Settings -> Feedback',
        text: 'Open Settings (or tap the Feedback button in the top bar) to find "Feedback & Quick Survey".',
      },
      {
        label: '2-Min Survey',
        text: 'Tapping it gives you a quick link to our short Google Forms survey so you can drop your honest thoughts.',
      },
    ],
  },
];

export const ReviewerIntroModal: React.FC = () => {
  const showReviewerIntro = useDemoStore((s) => s.showReviewerIntro);
  const dismissReviewerIntro = useDemoStore((s) => s.dismissReviewerIntro);
  const [step, setStep] = useState(0);

  if (!showReviewerIntro) return null;

  const current = INTRO_NOTES[step];
  const Icon = current.icon ?? Sparkles;
  const isFirst = step === 0;
  const isLast = step === INTRO_NOTES.length - 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/55 p-5 backdrop-blur-md"
    >
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="keepsake-card lined-note-bg relative flex w-full max-w-[350px] flex-col justify-between rounded-3xl p-5 shadow-2xl"
      >
        <div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-elevated)] px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--accent-primary)]">
              <Icon className="h-3 w-3" /> {current.badge}
            </span>
            <div className="flex gap-1">
              {INTRO_NOTES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step ? 'w-4 bg-[var(--accent-primary)]' : 'w-1.5 bg-[var(--border-token)]'
                  }`}
                />
              ))}
            </div>
          </div>

          <h2 className="keepsake-heading mt-3 text-xl leading-snug">{current.title}</h2>
          {current.body && (
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">{current.body}</p>
          )}

          <div className="mt-3 space-y-2">
            {current.items.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[var(--border-token)]/70 bg-[var(--bg-primary)]/75 px-3 py-2 text-[11px] leading-snug"
              >
                <span className="font-bold text-[var(--accent-primary)]">{item.label}: </span>
                <span className="text-[var(--text-secondary)]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next or "Let me have it!" Controls */}
        <div className="mt-5 flex items-center justify-between gap-2.5 pt-2 border-t border-[var(--border-token)]/70">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => {
              haptics.light();
              setStep((s) => Math.max(0, s - 1));
            }}
            className="inline-flex items-center gap-1 rounded-2xl border border-[var(--border-token)] bg-[var(--bg-card)] px-4 py-2.5 text-xs font-semibold text-[var(--text-primary)] disabled:opacity-35"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </button>

          {!isLast ? (
            <button
              type="button"
              onClick={() => {
                haptics.light();
                setStep((s) => Math.min(INTRO_NOTES.length - 1, s + 1));
              }}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-2xl bg-[var(--accent-primary)] py-2.5 text-xs font-semibold text-[var(--accent-contrast)] shadow-sm"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                haptics.success();
                setStep(0);
                dismissReviewerIntro();
              }}
              className="flex-1 rounded-2xl bg-[var(--accent-primary)] py-2.5 text-xs font-bold text-[var(--accent-contrast)] shadow-md"
            >
              Let me have it!
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
