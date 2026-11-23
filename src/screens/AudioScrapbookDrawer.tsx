import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Pause, Play, Square, X } from 'lucide-react';
import { BottomSheet } from '../components/layout/BottomSheet';
import { haptics } from '../core/haptics';
import { useDemoStore } from '../core/useDemoStore';

export const AudioScrapbookDrawer: React.FC = () => {
  const memories = useDemoStore((s) => s.memories);
  const addMemory = useDemoStore((s) => s.addMemory);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const setOtherAudioActive = useDemoStore((s) => s.setOtherAudioActive);

  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [title, setTitle] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    setOtherAudioActive(recording || playingId !== null);
    return () => setOtherAudioActive(false);
  }, [recording, playingId, setOtherAudioActive]);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const audioMemories = memories.filter((m) => m.type === 'voice' || m.voiceDuration);

  const saveVoiceMemo = () => {
    setRecording(false);
    const dur = `00:${String(Math.max(5, seconds)).padStart(2, '0')}`;
    addMemory({
      type: 'voice',
      title: title.trim() || 'Voice Memo Keepsake',
      body: 'Recorded directly into the Audio Scrapbook.',
      memoryDate: new Date().toISOString().slice(0, 10),
      voiceDuration: dur,
      voiceLabel: title.trim() || 'Recorded Voice Letter',
    });
  };

  return (
    <BottomSheet onClose={() => setActiveOverlay('none')} maxHeightClass="max-h-[85%]">
      <div className="px-5 pt-2 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--accent-primary)]">
              Voice Letters &bull; Local Archive
            </span>
            <h3 className="keepsake-heading text-xl">Audio Scrapbook</h3>
          </div>
          <button type="button" onClick={() => setActiveOverlay('none')} className="rounded-full p-1.5 text-[var(--text-secondary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Waveform Recorder */}
        <div className="mt-4 rounded-3xl border border-[var(--border-token)] bg-[var(--bg-elevated)] p-4 text-center">
          <div className="flex h-12 items-center justify-center gap-1">
            {Array.from({ length: 20 }).map((_, idx) => (
              <motion.span
                key={idx}
                animate={{
                  height: recording ? [10, 14 + ((idx * 17) % 28), 8] : 8,
                }}
                transition={{
                  repeat: recording ? Infinity : 0,
                  duration: 0.55 + (idx % 4) * 0.12,
                }}
                className="w-1.5 rounded-full bg-[var(--accent-primary)]"
              />
            ))}
          </div>

          <p className="mt-2 text-lg font-bold tabular-nums">
            00:{String(seconds).padStart(2, '0')}
          </p>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Name this voice note (e.g. Rainy Night Laugh)"
            className="mt-2 w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-card)] px-3 py-2 text-xs outline-none"
          />

          <div className="mt-3 flex justify-center gap-2">
            {!recording ? (
              <button
                type="button"
                onClick={() => {
                  setSeconds(0);
                  setRecording(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-primary)] px-4 py-2 text-xs font-semibold text-[var(--accent-contrast)]"
              >
                <Mic className="h-3.5 w-3.5" /> Start Recording
              </button>
            ) : (
              <button
                type="button"
                onClick={saveVoiceMemo}
                className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white"
              >
                <Square className="h-3.5 w-3.5" /> Stop & Save to Timeline
              </button>
            )}
          </div>
        </div>

        {/* Playlist */}
        <div className="mt-4 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Saved Voice Letters ({audioMemories.length})
          </p>
          {audioMemories.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-2xl border border-[var(--border-token)] bg-[var(--bg-primary)] p-3">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setPlayingId((id) => (id === m.id ? null : m.id))}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-primary)] text-[var(--accent-contrast)]"
                >
                  {playingId === m.id ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </button>
                <div>
                  <p className="text-xs font-bold">{m.voiceLabel || m.title}</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">
                    {m.authorName} • {m.voiceDuration || '00:30'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-[var(--text-secondary)]">{m.memoryDate}</span>
            </div>
          ))}
        </div>
      </div>
    </BottomSheet>
  );
};
