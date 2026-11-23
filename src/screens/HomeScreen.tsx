import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Feather,
  HardDrive,
  Heart,
  MapPin,
  Pause,
  PenLine,
  Play,
  RotateCw,
  Timer,
} from 'lucide-react';
import { ThemeMotifBadge } from '../components/animations/ThemeMotifBadge';
import { THEMES } from '../core/demoData';
import { haptics } from '../core/haptics';
import { mixtapeAudio } from '../core/mixtapeAudio';
import { useDemoStore } from '../core/useDemoStore';

export const HomeScreen: React.FC = () => {
  const activePersona = useDemoStore((s) => s.activePersona);
  const themesByPersona = useDemoStore((s) => s.themesByPersona);
  const spaceName = useDemoStore((s) => s.spaceName);
  const spaceStatus = useDemoStore((s) => s.spaceStatus);
  const distanceMiles = useDemoStore((s) => s.distanceMiles);
  const memories = useDemoStore((s) => s.memories);
  const countdowns = useDemoStore((s) => s.countdowns);
  const quizzes = useDemoStore((s) => s.quizzes);
  const mixtape = useDemoStore((s) => s.mixtape);
  const activeSongId = useDemoStore((s) => s.activeSongId);
  const isPlayingSong = useDemoStore((s) => s.isPlayingSong);
  const isOtherAudioActive = useDemoStore((s) => s.isOtherAudioActive);
  const thinkingPulseAt = useDemoStore((s) => s.thinkingPulseAt);

  const [miniBars, setMiniBars] = useState<number[]>(() => mixtapeAudio.getCalmWaveHeights(5, 0, false));

  useEffect(() => {
    const active = isPlayingSong && !isOtherAudioActive;
    if (!active) {
      setMiniBars(mixtapeAudio.getCalmWaveHeights(5, 0, false));
      return;
    }
    const id = window.setInterval(() => {
      setMiniBars(mixtapeAudio.getCalmWaveHeights(5, performance.now(), true));
    }, 65);
    return () => window.clearInterval(id);
  }, [isPlayingSong, isOtherAudioActive]);

  const setActiveTab = useDemoStore((s) => s.setActiveTab);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const openMemoryDetail = useDemoStore((s) => s.openMemoryDetail);
  const triggerThinkingPing = useDemoStore((s) => s.triggerThinkingPing);
  const toggleReunionDistance = useDemoStore((s) => s.toggleReunionDistance);
  const togglePlaySong = useDemoStore((s) => s.togglePlaySong);

  const activeThemeId = themesByPersona[activePersona] ?? 'classic-paper';
  const themeMeta = THEMES.find((t) => t.id === activeThemeId) ?? THEMES[0];

  const visibleMemories = memories.filter(
    (m) => !m.isDeletedForAll && !m.hiddenForUsers.includes(activePersona)
  );
  const latestMemory = visibleMemories[0];
  const onThisDay = visibleMemories.find((m) => m.isOnThisDay);
  const topCountdown = countdowns[0];
  const pendingQuiz = quizzes.find((q) => !q.isScratched);
  const activeSong = mixtape.find((s) => s.id === activeSongId) ?? mixtape[0];
  const partnerName = activePersona === 'julian' ? 'Elena' : 'Julian';
  const pulseRecent = thinkingPulseAt && Date.now() - thinkingPulseAt < 2500;

  return (
    <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-4 pt-3 pb-8">
      {/* Silent Exit Partner B Notice */}
      {spaceStatus === 'partner_left' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--border-token)] bg-[var(--bg-elevated)] p-4 text-xs"
        >
          <p className="font-semibold text-[var(--text-primary)]">
            {partnerName} has left this space. New posts are paused.
          </p>
          <p className="mt-1 leading-relaxed text-[var(--text-secondary)]">
            This space closed quietly without alerts. Seal this chapter into your Past Vault or export an offline copy below.
          </p>
        </motion.div>
      )}

      {/* Theme-Responsive Front-Cover Masthead */}
      <header className="space-y-3 border-b border-[var(--border-token)] pb-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[var(--accent-primary)]">
              {themeMeta.issueTag}
            </p>
            <h1 className="keepsake-heading mt-0.5 text-3xl leading-none">{spaceName}</h1>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveOverlay('theme-studio')}
              title="Change Theme Vibe"
              className="transition-transform active:scale-95"
            >
              <ThemeMotifBadge motif={themeMeta.motif} label={themeMeta.badgeSymbol} />
            </button>
            <button
              type="button"
              onClick={() => setActiveOverlay('storage-backup')}
              aria-label="Local Vault & Backup Status"
              title="Device Archive & Backup"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-token)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <HardDrive className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => {
              haptics.light();
              toggleReunionDistance();
            }}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
              distanceMiles === 0
                ? 'border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 text-[var(--text-primary)]'
                : 'border-[var(--border-token)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
            }`}
          >
            <MapPin className="h-3 w-3 text-[var(--accent-primary)]" strokeWidth={1.7} />
            {distanceMiles === 0 ? 'Together again \u2022 0 mi apart' : `${distanceMiles} mi apart \u2022 Paris & London`}
          </button>

          <button
            type="button"
            onClick={() => {
              haptics.light();
              triggerThinkingPing();
            }}
            className="relative inline-flex items-center gap-1.5 overflow-visible rounded-full border border-[var(--border-token)] bg-[var(--bg-card)] px-3 py-1 text-[11px] font-semibold text-[var(--accent-primary)]"
          >
            {pulseRecent && (
              <motion.span
                initial={{ scale: 0.9, opacity: 0.65 }}
                animate={{ scale: 2.1, opacity: 0 }}
                transition={{ duration: 0.85 }}
                className="pointer-events-none absolute inset-0 rounded-full border border-[var(--accent-primary)]"
              />
            )}
            <Heart className="h-3 w-3 fill-current" />
            {themeMeta.pulseLabel}
          </button>
        </div>
      </header>

      {/* Compact Shared Mixtape Mini-Player */}
      {activeSong && (
        <div className="keepsake-card flex items-center justify-between gap-2.5 rounded-2xl px-3.5 py-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('play')}
            className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center gap-[2px] rounded-xl border border-[var(--border-token)] px-1 text-white shadow-xs"
              style={{ background: activeSong.coverGradient }}
            >
              {miniBars.map((pct, i) => (
                <span
                  key={i}
                  style={{ height: `${Math.max(24, Math.min(82, pct))}%` }}
                  className="w-[2.5px] rounded-full bg-white/95 transition-[height] duration-200 ease-out"
                />
              ))}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold tracking-[0.14em] uppercase text-[var(--accent-primary)]">
                Shared Mixtape{' '}
                {isPlayingSong ? (isOtherAudioActive ? '\u2022 Paused for voice' : '\u2022 Playing') : ''}
              </p>
              <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
                {activeSong.title} <span className="font-normal text-[var(--text-secondary)]">&mdash; {activeSong.artist}</span>
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              haptics.light();
              togglePlaySong(activeSong.id);
            }}
            aria-label={isPlayingSong ? 'Pause Mixtape' : 'Play Mixtape'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-primary)] text-[var(--accent-contrast)] shadow-xs"
          >
            {isPlayingSong ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
          </button>
        </div>
      )}

      {/* Hero Polaroid Keepsake */}
      {latestMemory && (
        <section aria-label={themeMeta.heroSectionLabel}>
          <div className="mb-2 flex items-center justify-between px-0.5 text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-secondary)]">
            <span>
              {themeMeta.heroSectionLabel} &bull; {latestMemory.authorName}
            </span>
            <span>{latestMemory.memoryDate}</span>
          </div>

          <div
            onClick={() => openMemoryDetail(latestMemory.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && openMemoryDetail(latestMemory.id)}
            style={{ transform: 'rotate(-0.6deg)' }}
            className="polaroid-frame cursor-pointer rounded-2xl p-3 pb-4 transition-transform duration-200 hover:rotate-0 active:scale-[0.985]"
          >
            {latestMemory.photoUrl && (
              <div className="overflow-hidden rounded-xl border border-black/5">
                <img
                  src={latestMemory.photoUrl}
                  alt={latestMemory.title}
                  className="h-52 w-full object-cover"
                />
              </div>
            )}

            <div className="mt-3 flex items-end justify-between gap-2 px-1">
              <div className="min-w-0">
                <h2 className="keepsake-heading truncate text-lg">{latestMemory.title}</h2>
                <p className="font-hand mt-0.5 line-clamp-1 text-xl text-[var(--text-secondary)]">
                  &ldquo;{latestMemory.backNote || latestMemory.body}&rdquo;
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--bg-elevated)] px-2.5 py-1 text-[10px] font-semibold text-[var(--accent-primary)]">
                <RotateCw className="h-3 w-3" strokeWidth={1.6} /> Turn over
              </span>
            </div>
          </div>
        </section>
      )}

      {/* On This Day — Tucked-In Archival Slip */}
      {onThisDay && (
        <div
          onClick={() => openMemoryDetail(onThisDay.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openMemoryDetail(onThisDay.id)}
          className="keepsake-card cursor-pointer rounded-2xl border-l-[3px] border-l-[var(--accent-primary)] p-3.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--accent-primary)]">
              On This Day &bull; One Year Ago
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" strokeWidth={1.6} />
          </div>
          <div className="mt-2.5 flex items-center gap-3">
            {onThisDay.photoUrl && (
              <img
                src={onThisDay.photoUrl}
                alt={onThisDay.title}
                className="h-14 w-14 shrink-0 rounded-lg border border-[var(--border-token)] object-cover"
              />
            )}
            <div className="min-w-0">
              <h3 className="keepsake-heading truncate text-base">{onThisDay.title}</h3>
              <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                {onThisDay.body}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Up Next & Daily Ritual Strip */}
      <div className="keepsake-card grid grid-cols-2 divide-x divide-[var(--border-token)] overflow-hidden rounded-2xl">
        {topCountdown ? (
          <button
            type="button"
            onClick={() => setActiveTab('play')}
            className="flex flex-col justify-between p-3.5 text-left transition-colors hover:bg-[var(--bg-elevated)]/40"
          >
            <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--text-secondary)]">
              <Timer className="h-3.5 w-3.5 text-[var(--accent-primary)]" strokeWidth={1.6} />
              <span>Up Next</span>
            </div>
            <div className="mt-2.5">
              <p className="keepsake-heading truncate text-sm">
                {topCountdown.isMystery && !topCountdown.isRevealed && topCountdown.authorId !== activePersona
                  ? 'A surprise awaits\u2026'
                  : topCountdown.title}
              </p>
              <p className="mt-1 text-xs font-semibold text-[var(--accent-primary)]">28 days remaining</p>
            </div>
          </button>
        ) : (
          <div className="p-3.5" />
        )}

        <button
          type="button"
          onClick={() => setActiveTab('play')}
          className="flex flex-col justify-between p-3.5 text-left transition-colors hover:bg-[var(--bg-elevated)]/40"
        >
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <Feather className="h-3.5 w-3.5 text-[var(--accent-primary)]" strokeWidth={1.6} />
              Ritual
            </span>
            {pendingQuiz && (
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
            )}
          </div>
          <div className="mt-2.5">
            <p className="keepsake-heading text-sm">
              {pendingQuiz ? 'Scratch-off ready' : 'Letters & capsules'}
            </p>
            <p className="mt-1 line-clamp-1 text-xs text-[var(--text-secondary)]">
              {pendingQuiz ? pendingQuiz.question : 'Write a note for later'}
            </p>
          </div>
        </button>
      </div>

      {/* Quiet Lock-Screen Note Invitation */}
      <button
        type="button"
        onClick={() => setActiveOverlay('doodle-widget')}
        className="keepsake-card flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors hover:bg-[var(--bg-elevated)]/50"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[var(--accent-primary)]">
            <PenLine className="h-4 w-4" strokeWidth={1.6} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-primary)]">
              Leave a doodle on {partnerName}&rsquo;s Home Screen
            </p>
            <p className="text-[11px] text-[var(--text-secondary)]">
              Sketched by hand &bull; Updates partner widget quietly
            </p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" strokeWidth={1.6} />
      </button>
    </div>
  );
};
