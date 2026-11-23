import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Feather, ImagePlus, MapPin, Music, PenLine, Sun, X } from 'lucide-react';
import exifr from 'exifr';
import { BottomSheet } from '../components/layout/BottomSheet';
import { MIXTAPE_SONGS, SAMPLE_PHOTOS } from '../core/demoData';
import { haptics } from '../core/haptics';
import { MixtapeSong } from '../core/types';
import { useDemoStore } from '../core/useDemoStore';

interface Props {
  initialMode?: 'single' | 'batch';
}

interface BatchDraft {
  id: string;
  url: string;
  date: string;
  location: string;
  title: string;
  weather: string;
}

const REFLECTION_PROMPTS = [
  'What small detail from today do you want to remember ten years from now?',
  'Describe the exact sound or light in the room when you took this.',
  'What made both of you laugh unexpectedly today?',
  'If this moment had a chapter title in your book, what would it be?',
];

export const CreateMemorySheet: React.FC<Props> = ({ initialMode = 'single' }) => {
  const [mode, setMode] = useState<'single' | 'batch'>(initialMode);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const addMemory = useDemoStore((s) => s.addMemory);
  const addMemoriesBatch = useDemoStore((s) => s.addMemoriesBatch);
  const showToast = useDemoStore((s) => s.showToast);

  // Single memory state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [backNote, setBackNote] = useState('');
  const [showBackNote, setShowBackNote] = useState(false);
  const [promptIndex, setPromptIndex] = useState<number | null>(null);
  const [memoryDate, setMemoryDate] = useState(new Date().toISOString().slice(0, 10));
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [includePhoto, setIncludePhoto] = useState(true);
  const [locationLabel, setLocationLabel] = useState('London, Soho');
  const [includeWeather, setIncludeWeather] = useState(true);
  const [selectedSong, setSelectedSong] = useState<MixtapeSong | undefined>(undefined);

  // Batch EXIF state
  const [batchItems, setBatchItems] = useState<BatchDraft[]>(
    SAMPLE_PHOTOS.slice(0, 4).map((p, idx) => ({
      id: `b-${idx}`,
      url: p.url,
      date: p.date,
      location: p.location,
      title: p.label,
      weather: p.weather,
    }))
  );

  const handleSinglePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setIncludePhoto(true);
    try {
      const exif = await exifr.parse(file);
      if (exif?.DateTimeOriginal) {
        const d = new Date(exif.DateTimeOriginal).toISOString().slice(0, 10);
        setMemoryDate(d);
        showToast(`EXIF date found: ${d} (raw GPS stripped)`);
      } else {
        showToast('Photo attached cleanly');
      }
    } catch {
      showToast('Photo attached cleanly');
    }
  };

  const handleBatchFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    if (!files.length) return;
    const drafts: BatchDraft[] = await Promise.all(
      files.map(async (file, i) => {
        const url = URL.createObjectURL(file);
        let date = new Date(file.lastModified || Date.now()).toISOString().slice(0, 10);
        try {
          const exif = await exifr.parse(file);
          if (exif?.DateTimeOriginal) {
            date = new Date(exif.DateTimeOriginal).toISOString().slice(0, 10);
          }
        } catch {
          // ignore
        }
        return {
          id: `up-${Date.now()}-${i}`,
          url,
          date,
          location: 'GPS Stripped \u2022 Private',
          title: file.name.replace(/\.[^.]+$/, ''),
          weather: 'Clear',
        };
      })
    );
    drafts.sort((a, b) => b.date.localeCompare(a.date));
    setBatchItems(drafts);
    showToast(`Sorted ${drafts.length} photos chronologically by date`);
  };

  const submitSingle = (e: React.FormEvent) => {
    e.preventDefault();
    addMemory({
      type: includePhoto ? 'photo' : 'text',
      title: title.trim() || 'Quiet Moment Together',
      body: body.trim() || 'Captured right here in our private archive.',
      memoryDate,
      photoUrl: includePhoto ? photoUrl : undefined,
      backNote: showBackNote && backNote.trim() ? backNote.trim() : undefined,
      locationLabel: locationLabel.trim() || undefined,
      weatherStamp: includeWeather ? 'Crisp 14°C' : undefined,
      distanceLabel: '0 miles apart',
      song: selectedSong,
    });
  };

  const submitBatch = () => {
    const sorted = [...batchItems].sort((a, b) => b.date.localeCompare(a.date));
    addMemoriesBatch(
      sorted.map((item) => ({
        type: 'photo',
        title: item.title || 'Backfilled Memory',
        body: 'Added chronologically from photo library.',
        memoryDate: item.date,
        photoUrl: item.url,
        locationLabel: item.location,
        weatherStamp: item.weather,
      }))
    );
  };

  return (
    <BottomSheet onClose={() => setActiveOverlay('none')}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-token)] px-5 py-3">
        <div className="flex gap-1 rounded-xl bg-[var(--bg-elevated)] p-1">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${
              mode === 'single' ? 'bg-[var(--bg-card)] shadow-xs' : 'text-[var(--text-secondary)]'
            }`}
          >
            Single Keepsake
          </button>
          <button
            type="button"
            onClick={() => setMode('batch')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${
              mode === 'batch' ? 'bg-[var(--bg-card)] shadow-xs' : 'text-[var(--text-secondary)]'
            }`}
          >
            Import Roll
          </button>
        </div>

        <button
          type="button"
          onClick={() => setActiveOverlay('none')}
          aria-label="Close composer"
          className="rounded-full p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Body */}
      {mode === 'single' ? (
        <form onSubmit={submitSingle} className="no-scrollbar flex-1 space-y-3.5 overflow-y-auto px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--border-token)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-semibold">
                <Camera className="h-3.5 w-3.5 text-[var(--accent-primary)]" strokeWidth={1.6} /> Choose Photo
                <input type="file" accept="image/*" onChange={handleSinglePhoto} className="hidden" />
              </label>
              <button
                type="button"
                onClick={() => setIncludePhoto((v) => !v)}
                className="rounded-full border border-[var(--border-token)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]"
              >
                {includePhoto ? 'Text Only' : 'Include Photo'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                haptics.light();
                setPromptIndex((prev) => (prev === null ? 0 : (prev + 1) % REFLECTION_PROMPTS.length));
              }}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border-token)] bg-[var(--bg-card)] px-2.5 py-1 text-[11px] font-medium text-[var(--accent-primary)]"
            >
              <Feather className="h-3 w-3" strokeWidth={1.6} /> Writing prompt
            </button>
          </div>

          {promptIndex !== null && (
            <div className="rounded-xl border-l-2 border-l-[var(--accent-primary)] bg-[var(--bg-elevated)]/70 px-3 py-2 text-xs italic text-[var(--text-secondary)]">
              &ldquo;{REFLECTION_PROMPTS[promptIndex]}&rdquo;
            </div>
          )}

          {includePhoto && (
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border-token)]">
              <img src={photoUrl} alt="Selected preview" className="h-40 w-full object-cover" />
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto bg-[var(--bg-elevated)] p-2">
                {SAMPLE_PHOTOS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => {
                      setPhotoUrl(s.url);
                      setMemoryDate(s.date);
                      setLocationLabel(s.location);
                    }}
                    className="h-9 w-12 shrink-0 overflow-hidden rounded-lg border border-[var(--border-token)]"
                  >
                    <img src={s.url} alt={s.label} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <label className="block">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">Date</span>
              <input
                type="date"
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-3 py-2 text-xs"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">City (No raw GPS)</span>
              <input
                value={locationLabel}
                onChange={(e) => setLocationLabel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-3 py-2 text-xs"
              />
            </label>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give this moment a title..."
            className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm font-semibold outline-none"
          />

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            placeholder="Write what you want to hold onto..."
            className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] p-3 text-sm outline-none"
          />

          {/* Optional Add-ons Row */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowBackNote((b) => !b)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${
                showBackNote
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/12 text-[var(--accent-primary)]'
                  : 'border-[var(--border-token)]'
              }`}
            >
              <PenLine className="h-3 w-3" strokeWidth={1.6} /> Write on back of photo
            </button>
            <button
              type="button"
              onClick={() => setIncludeWeather((w) => !w)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${
                includeWeather
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/12 text-[var(--accent-primary)]'
                  : 'border-[var(--border-token)]'
              }`}
            >
              <Sun className="h-3 w-3" strokeWidth={1.6} /> Weather Stamp {includeWeather ? 'On' : 'Off'}
            </button>
          </div>

          {showBackNote && (
            <textarea
              value={backNote}
              onChange={(e) => setBackNote(e.target.value)}
              rows={2}
              placeholder="Handwritten note tucked on the back of this print..."
              className="font-hand lined-note-bg w-full rounded-xl border border-dashed border-[var(--accent-primary)] bg-[var(--bg-elevated)] p-3 text-xl outline-none"
            />
          )}

          {/* Attach Mixtape Song */}
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--text-secondary)]">
              <Music className="h-3 w-3" strokeWidth={1.6} /> Attach Shared Mixtape Track (Optional)
            </span>
            <div className="no-scrollbar mt-1.5 flex gap-2 overflow-x-auto pb-1">
              {MIXTAPE_SONGS.map((song) => (
                <button
                  key={song.id}
                  type="button"
                  onClick={() => setSelectedSong((cur) => (cur?.id === song.id ? undefined : song))}
                  className={`shrink-0 rounded-xl border px-3 py-1.5 text-left text-[11px] ${
                    selectedSong?.id === song.id
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/12 font-bold'
                      : 'border-[var(--border-token)] bg-[var(--bg-primary)]'
                  }`}
                >
                  {song.title}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="w-full rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)] shadow-md"
            >
              Seal in Vault
            </button>
            <p className="text-center text-[10px] text-[var(--text-secondary)]">
              Editable for 10 minutes after saving &bull; Stored locally on device
            </p>
          </div>
        </form>
      ) : (
        <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="keepsake-heading text-lg">Chronological Photo Import</h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Reads photo dates automatically, strips raw GPS coordinates, and sorts cleanly into chapters.
              </p>
            </div>
            <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-xl bg-[var(--bg-elevated)] px-3 py-2 text-xs font-semibold">
              <ImagePlus className="h-4 w-4 text-[var(--accent-primary)]" strokeWidth={1.6} /> Pick Files
              <input type="file" accept="image/*" multiple onChange={handleBatchFiles} className="hidden" />
            </label>
          </div>

          <div className="space-y-2.5">
            {batchItems.map((item, i) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border-token)] bg-[var(--bg-primary)] p-2"
              >
                <img src={item.url} alt={item.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1 space-y-1">
                  <input
                    value={item.title}
                    onChange={(e) =>
                      setBatchItems((arr) => arr.map((x) => (x.id === item.id ? { ...x, title: e.target.value } : x)))
                    }
                    className="w-full bg-transparent text-xs font-bold outline-none"
                  />
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                    <span className="rounded-full bg-[var(--accent-primary)]/15 px-2 py-0.5 font-bold text-[var(--accent-primary)]">
                      {item.date}
                    </span>
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin className="h-2.5 w-2.5 shrink-0" strokeWidth={1.6} /> {item.location}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              haptics.success();
              submitBatch();
            }}
            className="w-full rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)] shadow-md"
          >
            Add All {batchItems.length} Memories Chronologically
          </button>
        </div>
      )}
    </BottomSheet>
  );
};
