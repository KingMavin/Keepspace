import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, FileText, ShoppingBag } from 'lucide-react';
import { SAMPLE_PHOTOS } from '../core/demoData';
import { useDemoStore } from '../core/useDemoStore';

const COVERS = [
  { name: 'Terracotta Linen', bg: '#C05A3F', text: '#FAF7F2' },
  { name: 'Botanical Sage', bg: '#3D6B4F', text: '#F2F5F0' },
  { name: 'Velvet Noir', bg: '#18181B', text: '#E3B368' },
];

export const BookStudioScreen: React.FC = () => {
  const spaceName = useDemoStore((s) => s.spaceName);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const showToast = useDemoStore((s) => s.showToast);

  const [coverIdx, setCoverIdx] = useState(0);
  const [spineTitle, setSpineTitle] = useState(`${spaceName} • Year Two`);
  const [spread, setSpread] = useState(1);

  const cover = COVERS[coverIdx];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute inset-0 z-40 flex flex-col overflow-hidden bg-[var(--bg-primary)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-token)] px-4 py-3">
        <button
          type="button"
          onClick={() => setActiveOverlay('none')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h2 className="keepsake-heading text-lg">Anniversary Book Studio</h2>
        <span className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
          Linen Edition
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {/* Hardcover Mockup */}
        <div className="keepsake-card rounded-3xl p-5 text-center">
          <div
            className="mx-auto flex h-52 w-40 flex-col justify-between rounded-r-2xl rounded-l-md p-4 text-left shadow-xl transition-colors"
            style={{ backgroundColor: cover.bg, color: cover.text }}
          >
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase opacity-80">Linen Hardcover</span>
            <div>
              <p className="font-display text-lg font-semibold leading-tight">{spineTitle}</p>
              <p className="font-hand mt-1 text-base opacity-90">128 printed pages</p>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {COVERS.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setCoverIdx(i)}
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${
                  coverIdx === i ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15' : 'border-[var(--border-token)]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <input
            value={spineTitle}
            onChange={(e) => setSpineTitle(e.target.value)}
            className="mt-3 w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-3 py-2 text-center text-xs font-semibold"
          />
        </div>

        {/* 2-Page Spread Proof Previewer */}
        <div className="keepsake-card rounded-3xl p-4">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-[var(--accent-primary)]" /> Spread Pages {spread * 2 - 1}–{spread * 2}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setSpread((s) => Math.max(1, s - 1))}
                className="rounded-lg border border-[var(--border-token)] p-1"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setSpread((s) => Math.min(4, s + 1))}
                className="rounded-lg border border-[var(--border-token)] p-1"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-[var(--border-token)] bg-[#FAF7F2] p-3 text-[#2B2118]">
            <img
              src={SAMPLE_PHOTOS[spread % SAMPLE_PHOTOS.length].url}
              alt="Book spread"
              className="h-28 w-full rounded-lg object-cover"
            />
            <div className="flex flex-col justify-center">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#C05A3F]">Chapter {spread}</p>
              <p className="font-display mt-1 text-xs font-semibold">
                {SAMPLE_PHOTOS[spread % SAMPLE_PHOTOS.length].label}
              </p>
              <p className="font-hand mt-1 text-sm text-[#6E5D4F]">3mm print bleed & QR audio link verified.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => showToast('Generated print-ready PDF proof!')}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[var(--border-token)] bg-[var(--bg-card)] py-3 text-xs font-semibold"
          >
            <FileText className="h-4 w-4 text-[var(--accent-primary)]" /> Export Print PDF
          </button>
          <button
            type="button"
            onClick={() => showToast('Hardcover linen print order previewed!')}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[var(--accent-primary)] py-3 text-xs font-semibold text-[var(--accent-contrast)]"
          >
            <ShoppingBag className="h-4 w-4" /> Preview Print Order
          </button>
        </div>
      </div>
    </motion.div>
  );
};
