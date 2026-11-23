import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Edit3,
  Lock,
  MapPin,
  Mic,
  Music,
  Pause,
  Play,
  RotateCw,
  Sun,
  Trash2,
} from 'lucide-react';
import { useDemoStore } from '../core/useDemoStore';

export const MemoryDetailModal: React.FC = () => {
  const selectedMemoryId = useDemoStore((s) => s.selectedMemoryId);
  const activePersona = useDemoStore((s) => s.activePersona);
  const memories = useDemoStore((s) => s.memories);

  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const editMemory = useDemoStore((s) => s.editMemory);
  const updateBackNote = useDemoStore((s) => s.updateBackNote);
  const deleteMemoryForMe = useDemoStore((s) => s.deleteMemoryForMe);
  const deleteMemoryForBoth = useDemoStore((s) => s.deleteMemoryForBoth);
  const setOtherAudioActive = useDemoStore((s) => s.setOtherAudioActive);

  const mem = memories.find((m) => m.id === selectedMemoryId);
  const [flipped, setFlipped] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(mem?.title || '');
  const [draftBody, setDraftBody] = useState(mem?.body || '');
  const [draftBack, setDraftBack] = useState(mem?.backNote || '');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [playingVoice, setPlayingVoice] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setOtherAudioActive(playingVoice);
    return () => setOtherAudioActive(false);
  }, [playingVoice, setOtherAudioActive]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!mem) return null;

  const isAuthor = mem.authorId === activePersona;
  const elapsedMs = now - mem.createdAt;
  const remainingMs = Math.max(0, 10 * 60 * 1000 - elapsedMs);
  const canEdit = isAuthor && remainingMs > 0;
  const mins = Math.floor(remainingMs / 60000);
  const secs = Math.floor((remainingMs % 60000) / 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-0 z-40 flex flex-col overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-token)] px-4 py-3">
        <button
          type="button"
          onClick={() => setActiveOverlay('none')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} /> Back
        </button>

        <div className="flex items-center gap-2">
          {canEdit ? (
            <button
              type="button"
              onClick={() => setEditing((e) => !e)}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-primary)]/15 px-2.5 py-1 text-[11px] font-bold text-[var(--accent-primary)]"
            >
              <Clock className="h-3 w-3" />
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')} &bull; Edit
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-elevated)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-secondary)]">
              <Lock className="h-3 w-3" />
              {isAuthor ? 'Archive Locked' : `By ${mem.authorName}`}
            </span>
          )}

          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            aria-label="Delete Memory"
            className="rounded-full border border-[var(--border-token)] p-1.5 text-rose-500 hover:bg-rose-500/10"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {/* Scroll Body */}
      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-4 pb-8">
        {/* 3D Flip Polaroid Card */}
        {(mem.photoUrl || mem.doodleDataUrl || mem.backNote) && (
          <div style={{ perspective: 1200 }}>
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              onClick={() => setFlipped((f) => !f)}
              className="preserve-3d relative h-[300px] w-full cursor-pointer"
            >
              {/* Front Archival Polaroid */}
              <div className="polaroid-frame backface-hidden absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl p-3 pb-4">
                <div className="overflow-hidden rounded-xl border border-black/5">
                  <img
                    src={mem.photoUrl || mem.doodleDataUrl}
                    alt={mem.title}
                    className="h-56 w-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between px-1 pt-2">
                  <span className="font-hand text-xl text-[var(--text-primary)]">
                    {mem.locationLabel || mem.memoryDate}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--accent-primary)]">
                    <RotateCw className="h-3.5 w-3.5" strokeWidth={1.6} /> Turn over
                  </span>
                </div>
              </div>

              {/* Back Textured Postcard Reverse */}
              <div
                style={{ transform: 'rotateY(180deg)' }}
                className="polaroid-frame lined-note-bg backface-hidden absolute inset-0 flex flex-col justify-between rounded-2xl p-5"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--accent-primary)]">
                        Reverse Inscription
                      </span>
                      <p className="mt-0.5 text-[10px] text-[var(--text-secondary)]">{mem.memoryDate}</p>
                    </div>
                    {/* Tactile Postcard Stamp Box */}
                    <div className="flex h-11 w-9 flex-col items-center justify-center border border-dashed border-[var(--border-token)] bg-[var(--bg-primary)]/60 text-[8px] font-semibold tracking-widest uppercase text-[var(--text-secondary)]">
                      <span>{mem.authorName.slice(0, 2)}</span>
                      <RotateCw className="mt-1 h-2.5 w-2.5" />
                    </div>
                  </div>
                  <p className="font-hand mt-4 text-2xl leading-relaxed text-[var(--text-primary)]">
                    {mem.backNote || 'Tap below to leave a private margin note on the reverse of this print.'}
                  </p>
                </div>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex gap-2 border-t border-[var(--border-token)] pt-3"
                >
                  <input
                    value={draftBack}
                    onChange={(e) => setDraftBack(e.target.value)}
                    placeholder="Write on reverse..."
                    className="flex-1 rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-2.5 py-1.5 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => updateBackNote(mem.id, draftBack)}
                    className="rounded-xl bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-contrast)]"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Editable or Read-only Story Body */}
        {editing ? (
          <div className="keepsake-card space-y-3 rounded-2xl p-4">
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-3 py-2 text-sm font-bold"
            />
            <textarea
              value={draftBody}
              onChange={(e) => setDraftBody(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] p-3 text-sm"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  editMemory(mem.id, draftTitle, draftBody);
                  setEditing(false);
                }}
                className="flex-1 rounded-xl bg-[var(--accent-primary)] py-2.5 text-xs font-semibold text-[var(--accent-contrast)]"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-xl border border-[var(--border-token)] px-4 py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="keepsake-card rounded-2xl p-4">
            <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--text-secondary)]">
              <span>{mem.memoryDate}</span>
              <span>
                By {mem.authorName}
                {mem.editedAt && ' \u2022 Edited'}
              </span>
            </div>
            <h2 className="keepsake-heading mt-2 text-2xl">{mem.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{mem.body}</p>

            {(mem.weatherStamp || mem.distanceLabel) && (
              <div className="mt-3.5 flex flex-wrap gap-3 border-t border-[var(--border-token)]/70 pt-3 text-[11px] font-medium text-[var(--text-secondary)]">
                {mem.weatherStamp && (
                  <span className="inline-flex items-center gap-1.5">
                    <Sun className="h-3.5 w-3.5 text-[var(--accent-secondary)]" strokeWidth={1.6} />
                    {mem.weatherStamp}
                  </span>
                )}
                {mem.distanceLabel && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[var(--accent-primary)]" strokeWidth={1.6} />
                    {mem.distanceLabel}
                  </span>
                )}
              </div>
            )}

            {mem.voiceDuration && (
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-[var(--bg-elevated)] p-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPlayingVoice((p) => !p)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-primary)] text-[var(--accent-contrast)]"
                  >
                    {playingVoice ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <div>
                    <p className="text-xs font-bold">{mem.voiceLabel || 'Voice Keepsake'}</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">{playingVoice ? 'Playing memo...' : mem.voiceDuration}</p>
                  </div>
                </div>
                <Mic className="h-4 w-4 text-[var(--accent-primary)]" strokeWidth={1.6} />
              </div>
            )}

            {mem.song && (
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-[var(--border-token)] p-2.5">
                <div className="h-10 w-10 rounded-xl" style={{ background: mem.song.coverGradient }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{mem.song.title}</p>
                  <p className="truncate text-[10px] text-[var(--text-secondary)]">{mem.song.artist}</p>
                </div>
                <Music className="h-4 w-4 text-[var(--accent-primary)]" strokeWidth={1.6} />
              </div>
            )}
          </div>
        )}

        {canEdit && !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-[var(--border-token)] bg-[var(--bg-card)] py-2.5 text-xs font-semibold"
          >
            <Edit3 className="h-3.5 w-3.5 text-[var(--accent-primary)]" strokeWidth={1.6} /> Edit Text ({mins}m {secs}s left)
          </button>
        )}
      </div>

      {/* Dual Deletion Sheet */}
      {deleteOpen && (
        <div className="absolute inset-0 z-50 flex items-end bg-black/55 backdrop-blur-xs">
          <div className="w-full space-y-2.5 rounded-t-3xl border-t border-[var(--border-token)] bg-[var(--bg-card)] p-5 pb-8">
            <h3 className="keepsake-heading text-xl">Remove this memory?</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              {isAuthor
                ? 'Because you authored this memory, you can hide it from your device or delete it for both partners.'
                : `Because ${mem.authorName} wrote this memory, you can remove it from your timeline without changing ${mem.authorName}'s archive.`}
            </p>

            {isAuthor && (
              <button
                type="button"
                onClick={() => deleteMemoryForBoth(mem.id)}
                className="w-full rounded-2xl bg-rose-600 py-3 text-xs font-semibold text-white"
              >
                Delete for Both Partners
              </button>
            )}
            <button
              type="button"
              onClick={() => deleteMemoryForMe(mem.id)}
              className="w-full rounded-2xl border border-[var(--border-token)] bg-[var(--bg-elevated)] py-3 text-xs font-semibold"
            >
              Delete for Me Only
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(false)}
              className="w-full py-2 text-xs font-semibold text-[var(--text-secondary)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
