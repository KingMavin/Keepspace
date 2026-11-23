import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, MoreVertical, PlusSquare, Share, Smartphone, X } from 'lucide-react';
import { haptics } from '../../core/haptics';
import { useDemoStore } from '../../core/useDemoStore';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPwaModal: React.FC = () => {
  const showInstallPrompt = useDemoStore((s) => s.showInstallPrompt);
  const activeOverlay = useDemoStore((s) => s.activeOverlay);
  const dismissInstallPrompt = useDemoStore((s) => s.dismissInstallPrompt);
  const showToast = useDemoStore((s) => s.showToast);

  const isVisible = showInstallPrompt || activeOverlay === 'install-pwa';

  const defaultPlatform =
    typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent)
      ? 'ios'
      : 'android';

  const [platform, setPlatform] = useState<'ios' | 'android'>(defaultPlatform);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isVisible) return null;

  const triggerNativeInstall = async () => {
    if (!deferredPrompt) return;
    haptics.medium();
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('Keepsake added to your Home Screen!');
      dismissInstallPrompt();
    }
    setDeferredPrompt(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-xs"
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="keepsake-card relative w-full rounded-3xl p-5 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={() => {
            haptics.light();
            dismissInstallPrompt();
          }}
          aria-label="Dismiss Add to Home Screen prompt"
          className="absolute top-3.5 right-3.5 rounded-full p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Wax-seal app emblem */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-primary)] text-[var(--accent-contrast)] shadow-md">
          <Smartphone className="h-7 w-7" strokeWidth={1.6} />
        </div>

        <h2 className="keepsake-heading mt-3.5 text-2xl leading-tight">
          Add Keepsake to your Home Screen
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
          Install this web app on your phone so it opens fullscreen like a native iOS or Android app&mdash;with instant offline loading and no browser address bar.
        </p>

        {/* Platform Switcher */}
        <div className="mt-4 flex rounded-xl bg-[var(--bg-elevated)] p-1">
          <button
            type="button"
            onClick={() => setPlatform('ios')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
              platform === 'ios' ? 'bg-[var(--bg-card)] shadow-xs text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            iPhone (Safari)
          </button>
          <button
            type="button"
            onClick={() => setPlatform('android')}
            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
              platform === 'android' ? 'bg-[var(--bg-card)] shadow-xs text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
            }`}
          >
            Android (Chrome)
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-3 rounded-2xl border border-[var(--border-token)] bg-[var(--bg-primary)] p-3.5 text-left text-xs">
          {platform === 'ios' ? (
            <ol className="space-y-2.5 text-[var(--text-secondary)]">
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[var(--accent-primary)] font-bold">
                  1
                </span>
                <span className="flex items-center gap-1.5">
                  Tap <Share className="inline h-3.5 w-3.5 text-[var(--accent-primary)]" /> <strong className="text-[var(--text-primary)]">Share</strong> in Safari&rsquo;s bottom bar
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[var(--accent-primary)] font-bold">
                  2
                </span>
                <span className="flex items-center gap-1.5">
                  Scroll and tap <PlusSquare className="inline h-3.5 w-3.5 text-[var(--accent-primary)]" /> <strong className="text-[var(--text-primary)]">Add to Home Screen</strong>
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[var(--accent-primary)] font-bold">
                  3
                </span>
                <span>
                  Tap <strong className="text-[var(--text-primary)]">Add</strong> in the top-right corner
                </span>
              </li>
            </ol>
          ) : (
            <div className="space-y-2.5">
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={triggerNativeInstall}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--accent-primary)] py-2 text-xs font-semibold text-[var(--accent-contrast)]"
                >
                  <Download className="h-3.5 w-3.5" /> Install App Now
                </button>
              )}
              <ol className="space-y-2.5 text-[var(--text-secondary)]">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[var(--accent-primary)] font-bold">
                    1
                  </span>
                  <span className="flex items-center gap-1.5">
                    Tap the <MoreVertical className="inline h-3.5 w-3.5 text-[var(--accent-primary)]" /> <strong className="text-[var(--text-primary)]">menu icon</strong> in Chrome
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[var(--accent-primary)] font-bold">
                    2
                  </span>
                  <span>
                    Tap <strong className="text-[var(--text-primary)]">Add to Home screen</strong> or <strong className="text-[var(--text-primary)]">Install app</strong>
                  </span>
                </li>
              </ol>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            haptics.light();
            dismissInstallPrompt();
          }}
          className="mt-4 w-full rounded-2xl bg-[var(--accent-primary)] py-3 text-xs font-semibold text-[var(--accent-contrast)] shadow-md"
        >
          Continue to Keepsake
        </button>
      </motion.div>
    </motion.div>
  );
};
