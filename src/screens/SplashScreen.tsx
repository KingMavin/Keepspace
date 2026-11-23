import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { assetPreloader } from '../core/assetPreloader';
import { SAMPLE_PHOTOS } from '../core/demoData';
import { useDemoStore } from '../core/useDemoStore';

export const SplashScreen: React.FC = () => {
  const dismissSplash = useDemoStore((s) => s.dismissSplash);
  const memories = useDemoStore((s) => s.memories);
  const activePersona = useDemoStore((s) => s.activePersona);

  const [progress, setProgress] = useState(10);
  const [statusLabel, setStatusLabel] = useState('Opening your archive\u2026');
  const dismissedRef = useRef(false);

  const safeDismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    assetPreloader.startBackgroundPreload(SAMPLE_PHOTOS.map((p) => p.url));
    dismissSplash();
  };

  useEffect(() => {
    const visible = memories.filter(
      (m) => !m.isDeletedForAll && !m.hiddenForUsers.includes(activePersona)
    );
    const homeCriticalUrls = [
      visible[0]?.photoUrl,
      visible.find((m) => m.isOnThisDay)?.photoUrl,
      SAMPLE_PHOTOS[0]?.url,
    ];

    const minSplashDuration = new Promise<void>((resolve) => window.setTimeout(resolve, 3000));
    const criticalAssetsLoad = assetPreloader.preloadHomeCriticalAssets(
      homeCriticalUrls,
      (pct, label) => {
        setProgress(pct);
        setStatusLabel(label);
      }
    );

    let cancelled = false;
    Promise.all([minSplashDuration, criticalAssetsLoad]).then(() => {
      if (!cancelled) {
        safeDismiss();
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      onClick={safeDismiss}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && safeDismiss()}
      className="relative flex flex-1 cursor-pointer flex-col items-center justify-between bg-[var(--bg-primary)] px-8 py-12 text-center select-none"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 42%, var(--bg-elevated) 0%, var(--bg-primary) 72%)',
      }}
    >
      <div className="h-4 w-full" />

      <div className="flex flex-col items-center">
        {/* Animated Embossed Wax Seal with Interlocking Thread */}
        <motion.div
          initial={{ scale: 1.16, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.2 }}
          className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-[var(--accent-primary)]/40 bg-[var(--accent-primary)] shadow-xl"
        >
          <div className="absolute inset-1.5 rounded-full border border-dashed border-white/35" />
          <svg viewBox="0 0 80 80" className="h-14 w-14 text-[var(--accent-contrast)]" fill="none">
            <motion.path
              d="M22 40 C22 25, 42 22, 44 38 C46 54, 24 56, 28 42"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            />
            <motion.path
              d="M58 40 C58 55, 38 58, 36 42 C34 26, 56 24, 52 38"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="keepsake-heading mt-7 text-4xl font-semibold"
        >
          Keepsake
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="font-hand mt-2 text-2xl text-[var(--accent-primary)]"
        >
          &ldquo;Your story, held safely.&rdquo;
        </motion.p>
      </div>

      {/* Priority Network Preload Gate Indicator */}
      <div className="flex w-full max-w-[230px] flex-col items-center gap-3">
        <div className="w-full space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider uppercase text-[var(--text-secondary)]">
            <span>{statusLabel}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
            <div
              className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-token)] bg-[var(--bg-card)]/80 px-3.5 py-1.5 text-[11px] font-medium text-[var(--text-secondary)]"
        >
          <Lock className="h-3 w-3 text-[var(--accent-primary)]" />
          Private &amp; Local-First Archive
        </motion.div>
      </div>
    </div>
  );
};
