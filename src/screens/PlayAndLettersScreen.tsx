import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Archive,
  Award,
  BookOpen,
  Check,
  Compass,
  Disc3,
  Eye,
  Feather,
  HelpCircle,
  Lock,
  Music,
  Pause,
  Play,
  Plus,
  SkipBack,
  SkipForward,
  Timer,
  Volume2,
} from 'lucide-react';
import { ScratchCardCanvas } from '../components/animations/ScratchCardCanvas';
import { ThemeMotifBadge } from '../components/animations/ThemeMotifBadge';
import { THEMES } from '../core/demoData';
import { haptics } from '../core/haptics';
import { mixtapeAudio } from '../core/mixtapeAudio';
import { useDemoStore } from '../core/useDemoStore';

type SubTab = 'mixtape' | 'letters' | 'countdowns' | 'quizzes' | 'capsules' | 'bucket';

const THOUGHT_STARTERS: Record<'letters' | 'quizzes' | 'capsules', Array<{ a: string; b: string; c: string }>> = {
  letters: [
    {
      a: 'What felt quiet this week',
      b: 'Open this when the week feels too loud—remembering our slow Sunday morning.',
      c: 'A quiet appreciation',
    },
    {
      a: 'A small thing you did',
      b: 'I noticed how gently you checked in before my commute. Still smiling about it.',
      c: 'Tiny kindness',
    },
  ],
  quizzes: [
    {
      a: 'Which corner booth did we claim in Soho during the downpour?',
      b: 'The booth by the fogged window with almond croissants',
      c: 'Loser brings Sunday coffee',
    },
    {
      a: 'What song was playing when we pulled off Highway 1?',
      b: 'Texas Sun — Khruangbin & Leon Bridges',
      c: 'Winner picks tonight’s film',
    },
  ],
  capsules: [
    {
      a: 'For us next autumn',
      b: 'Open this when the week feels too loud and read how excited we were for Kyoto.',
      c: '2027-10-15',
    },
    {
      a: 'One year from tonight',
      b: 'I hope we are reading this with mugs of tea on the porch.',
      c: '2027-11-20',
    },
  ],
};

export const PlayAndLettersScreen: React.FC = () => {
  const [subTab, setSubTab] = useState<SubTab>('mixtape');
  const activePersona = useDemoStore((s) => s.activePersona);
  const themesByPersona = useDemoStore((s) => s.themesByPersona);
  const letters = useDemoStore((s) => s.letters);
  const countdowns = useDemoStore((s) => s.countdowns);
  const quizzes = useDemoStore((s) => s.quizzes);
  const capsules = useDemoStore((s) => s.capsules);
  const bucketList = useDemoStore((s) => s.bucketList);
  const mixtape = useDemoStore((s) => s.mixtape);
  const activeSongId = useDemoStore((s) => s.activeSongId);
  const isPlayingSong = useDemoStore((s) => s.isPlayingSong);
  const isOtherAudioActive = useDemoStore((s) => s.isOtherAudioActive);
  const mixtapeElapsedSec = useDemoStore((s) => s.mixtapeElapsedSec);

  const togglePlaySong = useDemoStore((s) => s.togglePlaySong);
  const setMixtapeElapsedSec = useDemoStore((s) => s.setMixtapeElapsedSec);
  const addMixtapeSong = useDemoStore((s) => s.addMixtapeSong);
  const addLetter = useDemoStore((s) => s.addLetter);
  const promoteLetterToStory = useDemoStore((s) => s.promoteLetterToStory);
  const addCountdown = useDemoStore((s) => s.addCountdown);
  const revealMysteryCountdown = useDemoStore((s) => s.revealMysteryCountdown);
  const addQuiz = useDemoStore((s) => s.addQuiz);
  const markQuizScratched = useDemoStore((s) => s.markQuizScratched);
  const addCapsule = useDemoStore((s) => s.addCapsule);
  const unsealCapsule = useDemoStore((s) => s.unsealCapsule);
  const toggleBucketItem = useDemoStore((s) => s.toggleBucketItem);
  const addBucketItem = useDemoStore((s) => s.addBucketItem);
  const promoteBucketToMemory = useDemoStore((s) => s.promoteBucketToMemory);
  const showToast = useDemoStore((s) => s.showToast);

  // Compose drawers
  const [composerOpen, setComposerOpen] = useState<SubTab | null>(null);
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [textC, setTextC] = useState('');
  const [isMystery, setIsMystery] = useState(false);
  const [starterIdx, setStarterIdx] = useState(0);

  const activeThemeId = themesByPersona[activePersona] ?? 'classic-paper';
  const themeMeta = THEMES.find((t) => t.id === activeThemeId) ?? THEMES[0];

  const activeIdx = Math.max(0, mixtape.findIndex((s) => s.id === activeSongId));
  const currentSong = mixtape[activeIdx] ?? mixtape[0];

  const [barHeights, setBarHeights] = useState<number[]>(() =>
    mixtapeAudio.getCalmWaveHeights(32, 0, false)
  );
  const totalSec = 252; // 04:12 baseline track runtime

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Smooth, calm ocean-wave bar movement synchronized with app-wide Mixtape state
  useEffect(() => {
    const active = isPlayingSong && !isOtherAudioActive;
    if (!active) {
      setBarHeights(mixtapeAudio.getCalmWaveHeights(32, 0, false));
      return;
    }

    const id = window.setInterval(() => {
      setBarHeights(mixtapeAudio.getCalmWaveHeights(32, performance.now(), true));
    }, 65);
    return () => window.clearInterval(id);
  }, [isPlayingSong, isOtherAudioActive]);

  const stepTrack = (delta: number) => {
    if (!mixtape.length) return;
    const nextIdx = (activeIdx + delta + mixtape.length) % mixtape.length;
    haptics.light();
    togglePlaySong(mixtape[nextIdx].id);
    if (!isPlayingSong) {
      // Switch and start playing cleanly
      useDemoStore.setState({ activeSongId: mixtape[nextIdx].id, isPlayingSong: true });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (composerOpen === 'mixtape') {
      addMixtapeSong(
        textA || 'Late Night Vinyl',
        textB || 'Our Shared Record',
        textC || 'Saved for quiet evenings together.'
      );
    } else if (composerOpen === 'letters') {
      addLetter(textA || 'Thinking of you tonight', textB || 'Leaving this letter here for morning.', textC || undefined);
    } else if (composerOpen === 'countdowns') {
      addCountdown(textA || 'Weekend Getaway', textB || '2026-12-28', isMystery, '');
    } else if (composerOpen === 'quizzes') {
      addQuiz(textA || 'Where did we get caught in the rain?', textB || 'Outside the Montmartre bakery', textC || 'Loser buys coffee');
    } else if (composerOpen === 'capsules') {
      addCapsule(textA || 'Anniversary Letter', textB || 'Opening this one year from today.', textC || '2027-11-20', true);
    } else if (composerOpen === 'bucket') {
      addBucketItem(textA || 'Stargaze from a rooftop', 'Date Night');
    }
    setComposerOpen(null);
    setTextA('');
    setTextB('');
    setTextC('');
    setIsMystery(false);
  };

  const cycleThoughtStarter = () => {
    if (composerOpen !== 'letters' && composerOpen !== 'quizzes' && composerOpen !== 'capsules') return;
    const pool = THOUGHT_STARTERS[composerOpen];
    const item = pool[starterIdx % pool.length];
    setStarterIdx((i) => i + 1);
    setTextA(item.a);
    setTextB(item.b);
    setTextC(item.c);
    haptics.light();
    showToast('Loaded a thought starter — edit to make it yours');
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* Header & 6-Tab Switcher */}
      <div className="border-b border-[var(--border-token)] bg-[var(--bg-primary)]/95 px-4 pt-3 pb-2.5 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[var(--accent-primary)]">
              {themeMeta.issueTag}
            </p>
            <div className="flex items-center gap-2">
              <h1 className="keepsake-heading text-2xl">Mixtape, Letters &amp; Games</h1>
              <ThemeMotifBadge motif={themeMeta.motif} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setComposerOpen(subTab)}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-contrast)]"
          >
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>

        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-0.5">
          {(
            [
              ['mixtape', 'Mixtape', Disc3],
              ['letters', 'Letters', BookOpen],
              ['countdowns', 'Countdowns', Timer],
              ['quizzes', 'Quizzes', HelpCircle],
              ['capsules', 'Time Capsules', Archive],
              ['bucket', 'Bucket List', Compass],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                haptics.light();
                setSubTab(id);
              }}
              className={`relative isolate inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                subTab === id
                  ? 'text-[var(--accent-contrast)]'
                  : 'border border-[var(--border-token)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
              }`}
            >
              {subTab === id && (
                <motion.span
                  layoutId="play-subtab-pill"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.32 }}
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--accent-primary)]"
                />
              )}
              <Icon className="h-3 w-3" strokeWidth={1.6} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Tab Content */}
      <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4 pb-8">
        {subTab === 'mixtape' && currentSong && (
          <div className="space-y-4">
            {/* Spinning Cassette & Vinyl Deck */}
            <div className="keepsake-card overflow-hidden rounded-3xl p-4">
              <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.16em] uppercase text-[var(--accent-primary)]">
                <span>Side A &bull; Our Mixtape</span>
                <span>
                  {isPlayingSong ? (isOtherAudioActive ? 'Paused for Voice Audio' : 'Playing Across App') : 'Paused'}
                </span>
              </div>

              {/* Interactive 32-Column Moving Soundwave Deck */}
              <div
                className="relative mt-3 flex flex-col justify-between overflow-hidden rounded-2xl p-4 text-white shadow-inner"
                style={{ background: currentSong.coverGradient }}
              >
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                  <span className="rounded-md bg-black/25 px-2 py-0.5">
                    {isPlayingSong && !isOtherAudioActive ? 'Calm Wave' : 'Soundwave'}
                  </span>
                  <span className="rounded-md bg-black/25 px-2 py-0.5 tabular-nums">
                    {formatTime(mixtapeElapsedSec)} / {currentSong.duration}
                  </span>
                </div>

                {/* 32 Vertical Moving Audio Columns (Smooth Calm Wave) */}
                <div
                  role="slider"
                  aria-label="Audio waveform progress"
                  aria-valuemin={0}
                  aria-valuemax={totalSec}
                  aria-valuenow={mixtapeElapsedSec}
                  className="my-4 flex h-20 items-center justify-between gap-[3px] rounded-xl border border-white/20 bg-black/30 px-3 py-2.5 backdrop-blur-xs"
                >
                  {barHeights.map((pct, idx) => {
                    const progressRatio = mixtapeElapsedSec / totalSec;
                    const isPassed = idx / barHeights.length <= progressRatio;
                    return (
                      <button
                        key={idx}
                        type="button"
                        aria-label={`Seek to ${Math.round((idx / barHeights.length) * 100)}%`}
                        onClick={() => {
                          haptics.light();
                          setMixtapeElapsedSec(Math.round((idx / barHeights.length) * totalSec));
                          if (!isPlayingSong) togglePlaySong(currentSong.id);
                        }}
                        className="flex h-full flex-1 items-center justify-center p-0"
                      >
                        <span
                          className="w-full rounded-full transition-[height,background-color] duration-200 ease-out"
                          style={{
                            height: `${pct}%`,
                            backgroundColor: isPassed ? '#FFFFFF' : 'rgba(255, 255, 255, 0.38)',
                            boxShadow:
                              isPassed && isPlayingSong && !isOtherAudioActive
                                ? '0 0 8px rgba(255, 255, 255, 0.45)'
                                : 'none',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>

                <div>
                  <h3 className="keepsake-heading text-xl text-white">{currentSong.title}</h3>
                  <p className="text-xs text-white/85">{currentSong.artist}</p>
                </div>
              </div>

              {currentSong.dedication && (
                <p className="font-hand mt-3 rounded-xl bg-[var(--bg-elevated)] px-3 py-2 text-lg leading-snug text-[var(--text-primary)]">
                  &ldquo;{currentSong.dedication}&rdquo;
                </p>
              )}

              {/* Deck Controls */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => stepTrack(-1)}
                  aria-label="Previous track"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-token)] bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    haptics.medium();
                    togglePlaySong(currentSong.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-primary)] px-6 py-2.5 text-xs font-semibold text-[var(--accent-contrast)] shadow-md"
                >
                  {isPlayingSong ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlayingSong ? 'Pause' : 'Play Mixtape'}
                </button>
                <button
                  type="button"
                  onClick={() => stepTrack(1)}
                  aria-label="Next track"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-token)] bg-[var(--bg-elevated)] text-[var(--text-primary)]"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Tracklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-secondary)]">
                <span>Shared Tracklist</span>
                <span>{mixtape.length} tracks</span>
              </div>

              {mixtape.map((song, idx) => {
                const isSelected = song.id === currentSong.id;
                return (
                  <button
                    key={song.id}
                    type="button"
                    onClick={() => {
                      haptics.light();
                      togglePlaySong(song.id);
                    }}
                    className={`keepsake-card flex w-full items-center justify-between gap-3 rounded-2xl p-3 text-left transition ${
                      isSelected ? 'ring-2 ring-[var(--accent-primary)]' : ''
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                        style={{ background: song.coverGradient }}
                      >
                        {isSelected && isPlayingSong ? (
                          <Volume2 className="h-4 w-4 animate-pulse" />
                        ) : (
                          String(idx + 1).padStart(2, '0')
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-[var(--text-primary)]">{song.title}</p>
                        <p className="truncate text-[11px] text-[var(--text-secondary)]">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2 text-[11px] text-[var(--text-secondary)]">
                      <span>{song.duration}</span>
                      <Music className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {subTab === 'letters' &&
          letters.map((letItem) => (
            <div key={letItem.id} className="keepsake-card lined-note-bg rounded-2xl p-4">
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--text-secondary)]">
                <span className="text-[var(--accent-primary)]">From {letItem.authorName}</span>
                <span>{letItem.promotedToTimeline ? 'In Our Story' : 'Private Letter'}</span>
              </div>
              <h3 className="keepsake-heading mt-1.5 text-lg">{letItem.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">{letItem.body}</p>
              {!letItem.promotedToTimeline && (
                <button
                  type="button"
                  onClick={() => promoteLetterToStory(letItem.id)}
                  className="mt-3 rounded-xl border border-[var(--border-token)] bg-[var(--bg-elevated)] px-3 py-1.5 text-[11px] font-semibold"
                >
                  + Add to Our Story
                </button>
              )}
            </div>
          ))}

        {subTab === 'countdowns' &&
          countdowns.map((cd) => {
            const hiddenForViewer = cd.isMystery && !cd.isRevealed && cd.authorId !== activePersona;
            return (
              <div key={cd.id} className="keepsake-card rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[var(--accent-primary)]">
                    <Timer className="h-4 w-4" strokeWidth={1.6} />
                  </div>
                  {cd.isMystery && (
                    <span className="rounded-full bg-[var(--accent-primary)]/12 px-2.5 py-0.5 text-[10px] font-semibold text-[var(--accent-primary)]">
                      Mystery Countdown
                    </span>
                  )}
                </div>
                <h3 className="keepsake-heading mt-3 text-xl">
                  {hiddenForViewer ? 'A little surprise awaits\u2026' : cd.title}
                </h3>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Target Date: {cd.targetDate} {cd.location && !hiddenForViewer ? `\u2022 ${cd.location}` : ''}
                </p>
                {cd.isMystery && !cd.isRevealed && cd.authorId === activePersona && (
                  <button
                    type="button"
                    onClick={() => revealMysteryCountdown(cd.id)}
                    className="mt-3 inline-flex items-center gap-1 rounded-xl bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-contrast)]"
                  >
                    <Eye className="h-3.5 w-3.5" /> Reveal Surprise Now
                  </button>
                )}
              </div>
            );
          })}

        {subTab === 'quizzes' &&
          quizzes.map((qz) => (
            <div key={qz.id} className="keepsake-card space-y-3 rounded-2xl p-4">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-semibold text-[var(--accent-primary)]">
                  Written by {qz.authorId === 'julian' ? 'Julian' : 'Elena'}
                </span>
                {qz.wager && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
                    <Award className="h-3 w-3 text-[var(--accent-primary)]" strokeWidth={1.6} /> {qz.wager}
                  </span>
                )}
              </div>
              <h3 className="keepsake-heading text-lg leading-snug">{qz.question}</h3>
              <ScratchCardCanvas
                hiddenText={qz.correctAnswer}
                initiallyRevealed={qz.isScratched}
                onRevealed={() => {
                  haptics.success();
                  markQuizScratched(qz.id, false);
                }}
              />
              {qz.isScratched && !qz.promotedToTimeline && (
                <button
                  type="button"
                  onClick={() => markQuizScratched(qz.id, true)}
                  className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-elevated)] py-2 text-xs font-semibold"
                >
                  + Save Result to Our Story
                </button>
              )}
            </div>
          ))}

        {subTab === 'capsules' &&
          capsules.map((cap) => (
            <motion.div layout key={cap.id} className="keepsake-card rounded-2xl p-4">
              <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.14em] uppercase">
                <span className="text-[var(--accent-primary)]">
                  {cap.isMutual ? 'Mutual Capsule' : 'Solo Capsule'} &bull; Opens {cap.unlockDate}
                </span>
                {!cap.isUnlocked && <Lock className="h-3.5 w-3.5 text-[var(--text-secondary)]" strokeWidth={1.6} />}
              </div>
              <h3 className="keepsake-heading mt-1.5 text-lg">{cap.title}</h3>
              {cap.hasOpened ? (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lined-note-bg mt-2 rounded-xl bg-[var(--bg-elevated)] p-3 text-xs leading-relaxed">
                  {cap.message}
                </motion.p>
              ) : (
                <div className="mt-3">
                  {cap.isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => {
                        haptics.success();
                        unsealCapsule(cap.id);
                      }}
                      className="w-full rounded-xl bg-[var(--accent-primary)] py-2.5 text-xs font-semibold text-[var(--accent-contrast)]"
                    >
                      Break Wax Seal &amp; Read Letter
                    </button>
                  ) : (
                    <p className="text-xs italic text-[var(--text-secondary)]">Wax-sealed safely until {cap.unlockDate}.</p>
                  )}
                </div>
              )}
            </motion.div>
          ))}

        {subTab === 'bucket' &&
          bucketList.map((item) => (
            <div key={item.id} className="keepsake-card flex items-center justify-between gap-3 rounded-2xl p-3.5">
              <button
                type="button"
                onClick={() => {
                  haptics.success();
                  toggleBucketItem(item.id);
                }}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    item.completed
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--accent-contrast)]'
                      : 'border-[var(--border-token)]'
                  }`}
                >
                  {item.completed && <Check className="h-3.5 w-3.5" />}
                </span>
                <div>
                  <p className={`text-xs font-semibold ${item.completed ? 'line-through opacity-70' : ''}`}>{item.title}</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">{item.category}</p>
                </div>
              </button>
              {item.completed && !item.promotedToMemory && (
                <button
                  type="button"
                  onClick={() => promoteBucketToMemory(item.id)}
                  className="shrink-0 rounded-xl bg-[var(--bg-elevated)] px-2.5 py-1.5 text-[10px] font-bold text-[var(--accent-primary)]"
                >
                  + Story
                </button>
              )}
            </div>
          ))}
      </div>

      {/* Creation Sheet */}
      {composerOpen && (
        <div className="absolute inset-0 z-40 flex items-end bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-3 rounded-t-3xl border-t border-[var(--border-token)] bg-[var(--bg-card)] p-5 pb-8"
          >
            <div className="flex items-center justify-between">
              <h3 className="keepsake-heading text-xl capitalize">
                New {composerOpen === 'bucket' ? 'Bucket List Goal' : composerOpen === 'mixtape' ? 'Mixtape Track' : composerOpen.slice(0, -1)}
              </h3>
              <div className="flex items-center gap-2">
                {(composerOpen === 'letters' || composerOpen === 'quizzes' || composerOpen === 'capsules') && (
                  <button
                    type="button"
                    onClick={cycleThoughtStarter}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border-token)] bg-[var(--bg-elevated)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent-primary)]"
                  >
                    <Feather className="h-3 w-3" strokeWidth={1.6} /> Thought Starter
                  </button>
                )}
                <button type="button" onClick={() => setComposerOpen(null)} className="text-xs font-semibold text-[var(--text-secondary)]">
                  Close
                </button>
              </div>
            </div>

            <input
              required
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder={
                composerOpen === 'mixtape'
                  ? 'Song title...'
                  : composerOpen === 'quizzes'
                    ? 'Write a custom quiz question...'
                    : composerOpen === 'bucket'
                      ? 'What do you want to do together?'
                      : 'Title...'
              }
              className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm outline-none"
            />

            {composerOpen !== 'bucket' && (
              <input
                value={textB}
                onChange={(e) => setTextB(e.target.value)}
                placeholder={
                  composerOpen === 'mixtape'
                    ? 'Artist name...'
                    : composerOpen === 'countdowns'
                      ? 'YYYY-MM-DD (e.g. 2026-12-28)'
                      : composerOpen === 'quizzes'
                        ? 'Correct hidden answer...'
                        : 'Write your message...'
                }
                className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm outline-none"
              />
            )}

            {composerOpen === 'mixtape' && (
              <input
                value={textC}
                onChange={(e) => setTextC(e.target.value)}
                placeholder="Dedication note (why this song reminds you of us)..."
                className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-3 py-2 text-xs outline-none"
              />
            )}

            {composerOpen === 'quizzes' && (
              <input
                value={textC}
                onChange={(e) => setTextC(e.target.value)}
                placeholder="Optional wager (e.g. Winner picks dinner)"
                className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-3 py-2 text-xs outline-none"
              />
            )}

            {composerOpen === 'capsules' && (
              <input
                type="date"
                value={textC || '2027-10-15'}
                onChange={(e) => setTextC(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-3 py-2 text-xs outline-none"
              />
            )}

            {composerOpen === 'countdowns' && (
              <label className="flex items-center gap-2 text-xs font-medium">
                <input type="checkbox" checked={isMystery} onChange={(e) => setIsMystery(e.target.checked)} />
                Mystery Mode (Hide title from partner until timer hits zero)
              </label>
            )}

            <button
              type="submit"
              className="w-full rounded-2xl bg-[var(--accent-primary)] py-3 text-sm font-semibold text-[var(--accent-contrast)]"
            >
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
