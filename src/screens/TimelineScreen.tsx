import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brush,
  Download,
  ImagePlus,
  MapPin,
  Mic,
  Music,
  RotateCw,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { ThemeMotifBadge } from '../components/animations/ThemeMotifBadge';
import { THEMES } from '../core/demoData';
import { haptics } from '../core/haptics';
import { MemoryItem } from '../core/types';
import { useDemoStore } from '../core/useDemoStore';

type FilterType = 'all' | 'photo' | 'voice' | 'doodle' | 'mixtape';

function formatChapterLabel(dateStr: string): string {
  const [y, m] = dateStr.split('-').map(Number);
  if (!y || !m) return 'UNDATED ARCHIVE';
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
}

export const TimelineScreen: React.FC = () => {
  const activePersona = useDemoStore((s) => s.activePersona);
  const themesByPersona = useDemoStore((s) => s.themesByPersona);
  const memories = useDemoStore((s) => s.memories);
  const openMemoryDetail = useDemoStore((s) => s.openMemoryDetail);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const ackRelayDownload = useDemoStore((s) => s.ackRelayDownload);

  const activeThemeId = themesByPersona[activePersona] ?? 'classic-paper';
  const themeMeta = THEMES.find((t) => t.id === activeThemeId) ?? THEMES[0];

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const visibleMemories = useMemo(() => {
    return memories
      .filter((m) => !m.isDeletedForAll && !m.hiddenForUsers.includes(activePersona))
      .filter((m) => {
        if (filter === 'photo') return m.type === 'photo';
        if (filter === 'voice') return m.type === 'voice' || Boolean(m.voiceLabel);
        if (filter === 'doodle') return m.type === 'doodle';
        if (filter === 'mixtape') return Boolean(m.song);
        return true;
      })
      .filter((m) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.body.toLowerCase().includes(q) ||
          (m.locationLabel || '').toLowerCase().includes(q) ||
          (m.backNote || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.memoryDate.localeCompare(a.memoryDate));
  }, [memories, activePersona, filter, searchQuery]);

  const chapters = useMemo(() => {
    const groups: Array<{ label: string; items: MemoryItem[] }> = [];
    for (const item of visibleMemories) {
      const label = formatChapterLabel(item.memoryDate);
      const last = groups[groups.length - 1];
      if (last && last.label === label) {
        last.items.push(item);
      } else {
        groups.push({ label, items: [item] });
      }
    }
    return groups;
  }, [visibleMemories]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Top Timeline Controls */}
      <div className="border-b border-[var(--border-token)] bg-[var(--bg-primary)]/95 px-4 pt-3 pb-2.5 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-[var(--accent-primary)]">
              {themeMeta.issueTag}
            </p>
            <div className="flex items-center gap-2">
              <h1 className="keepsake-heading text-2xl">Our Story</h1>
              <ThemeMotifBadge motif={themeMeta.motif} />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search Archive"
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-medium ${
                searchOpen
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-[var(--accent-contrast)]'
                  : 'border-[var(--border-token)] bg-[var(--bg-card)] text-[var(--text-primary)]'
              }`}
            >
              <Search className="h-3.5 w-3.5" strokeWidth={1.6} /> Search
            </button>
            <button
              type="button"
              onClick={() => setActiveOverlay('batch-backfill')}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border-token)] bg-[var(--bg-card)] px-2.5 py-1.5 text-[11px] font-medium"
            >
              <ImagePlus className="h-3.5 w-3.5 text-[var(--accent-primary)]" strokeWidth={1.6} /> Backfill
            </button>
            <button
              type="button"
              onClick={() => setActiveOverlay('audio-scrapbook')}
              aria-label="Voice Letters"
              title="Voice Letters"
              className="rounded-full border border-[var(--border-token)] bg-[var(--bg-card)] p-1.5 text-[var(--accent-primary)]"
            >
              <Mic className="h-4 w-4" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {/* Quiet Archive Search Drawer */}
        {searchOpen && (
          <div className="mt-2.5 rounded-2xl border border-[var(--border-token)] bg-[var(--bg-card)] p-2.5">
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-[var(--text-secondary)]" strokeWidth={1.6} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places, captions, or dates..."
                className="flex-1 bg-transparent text-xs outline-none"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')}>
                  <X className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                </button>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['Paris', 'Big Sur', 'Espresso', 'Platform'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setSearchQuery(chip)}
                  className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter Chips */}
        <div className="no-scrollbar mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5">
          {(
            [
              ['all', 'All Entries'],
              ['photo', 'Polaroids'],
              ['voice', 'Voice'],
              ['doodle', 'Doodles'],
              ['mixtape', 'Mixtape'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                haptics.light();
                setFilter(id);
              }}
              className={`relative isolate shrink-0 rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                filter === id
                  ? 'text-[var(--accent-contrast)]'
                  : 'border border-[var(--border-token)] bg-[var(--bg-card)] text-[var(--text-secondary)]'
              }`}
            >
              {filter === id && (
                <motion.span
                  layoutId="timeline-filter-pill"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.32 }}
                  className="absolute inset-0 -z-10 rounded-full bg-[var(--accent-primary)]"
                />
              )}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Editorial Chapters */}
      <div className="no-scrollbar relative flex-1 overflow-y-auto px-4 py-4 pb-8">
        {chapters.length === 0 ? (
          <div className="keepsake-card rounded-2xl p-6 text-center">
            <p className="keepsake-heading text-lg">No matching keepsakes</p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Clear your filters or tap + below to add a moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {chapters.map((chapter) => (
              <section key={chapter.label} className="space-y-4">
                {/* Month / Year Editorial Divider */}
                <div className="flex items-center gap-3">
                  <h2 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[var(--text-secondary)]">
                    {chapter.label}
                  </h2>
                  <div className="h-px flex-1 bg-[var(--border-token)]" />
                  <span className="text-[10px] font-medium text-[var(--text-secondary)]">
                    {chapter.items.length} {chapter.items.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>

                <div className="relative space-y-5 pl-5">
                  <div className="absolute top-2 bottom-2 left-1.5 w-px bg-[var(--border-token)]" />

                  {chapter.items.map((mem, index) => {
                    const isPolaroid = Boolean(mem.photoUrl || mem.doodleDataUrl);
                    const tilt = index % 2 === 0 ? '-0.4deg' : '0.4deg';

                    return (
                      <motion.div
                        key={mem.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index * 0.04, 0.2) }}
                        className="relative"
                      >
                        {/* Spine node */}
                        <span className="absolute top-5 -left-[18px] h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-primary)] bg-[var(--accent-primary)]" />

                        {mem.isRelayIncoming ? (
                          <div className="keepsake-card relative overflow-hidden rounded-2xl p-4">
                            <div className="shimmer-bar pointer-events-none absolute inset-0" />
                            <div className="relative flex items-center justify-between gap-3">
                              <div>
                                <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--accent-primary)]">
                                  Incoming from {mem.authorName}
                                </p>
                                <p className="keepsake-heading mt-1 text-base">Encrypted memory ready</p>
                                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                                  Save locally to your device and clear relay copy.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => ackRelayDownload(mem.id)}
                                className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-[var(--accent-primary)] px-3 py-2 text-xs font-semibold text-[var(--accent-contrast)] shadow"
                              >
                                <Download className="h-3.5 w-3.5" /> Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            onClick={() => openMemoryDetail(mem.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && openMemoryDetail(mem.id)}
                            style={isPolaroid ? { transform: `rotate(${tilt})` } : undefined}
                            className={`cursor-pointer overflow-hidden rounded-2xl transition-transform hover:rotate-0 active:scale-[0.985] ${
                              isPolaroid
                                ? 'polaroid-frame p-3 pb-4'
                                : 'keepsake-card lined-note-bg p-4'
                            }`}
                          >
                            <div className="flex items-center justify-between px-0.5 pb-2 text-[10px] font-medium tracking-[0.12em] uppercase text-[var(--text-secondary)]">
                              <span className="font-semibold text-[var(--text-primary)]">
                                {mem.authorName}
                                {mem.editedAt && <span className="ml-1.5 font-normal opacity-70">(Edited)</span>}
                              </span>
                              <span>{mem.memoryDate}</span>
                            </div>

                            {isPolaroid && (
                              <div className="relative overflow-hidden rounded-xl border border-black/5">
                                <img
                                  src={mem.photoUrl || mem.doodleDataUrl}
                                  alt={mem.title}
                                  className="h-48 w-full object-cover"
                                />
                                {mem.backNote && (
                                  <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                                    <RotateCw className="h-3 w-3" strokeWidth={1.6} /> Turn over
                                  </span>
                                )}
                              </div>
                            )}

                            <div className={isPolaroid ? 'px-0.5 pt-3' : 'pt-1'}>
                              <h3 className="keepsake-heading text-lg leading-snug">{mem.title}</h3>
                              <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">{mem.body}</p>

                              {(mem.locationLabel || mem.weatherStamp || mem.voiceDuration || mem.song || mem.type === 'doodle') && (
                                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-[var(--border-token)]/70 pt-2.5 text-[10px] font-medium tracking-wider uppercase text-[var(--text-secondary)]">
                                  {mem.locationLabel && (
                                    <span className="inline-flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-[var(--accent-primary)]" strokeWidth={1.5} />
                                      {mem.locationLabel}
                                    </span>
                                  )}
                                  {mem.weatherStamp && (
                                    <span className="inline-flex items-center gap-1">
                                      <Sun className="h-3 w-3 text-[var(--accent-secondary)]" strokeWidth={1.5} />
                                      {mem.weatherStamp}
                                    </span>
                                  )}
                                  {mem.voiceDuration && (
                                    <span className="inline-flex items-center gap-1 text-[var(--accent-primary)]">
                                      <Mic className="h-3 w-3" strokeWidth={1.5} /> {mem.voiceDuration}
                                    </span>
                                  )}
                                  {mem.song && (
                                    <span className="inline-flex items-center gap-1 text-[var(--text-primary)]">
                                      <Music className="h-3 w-3" strokeWidth={1.5} /> {mem.song.title}
                                    </span>
                                  )}
                                  {mem.type === 'doodle' && (
                                    <span className="inline-flex items-center gap-1 text-[var(--accent-primary)]">
                                      <Brush className="h-3 w-3" strokeWidth={1.5} /> Sketch
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
