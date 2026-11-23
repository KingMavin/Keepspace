import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Crown, Feather, Lock } from 'lucide-react';
import { ThemeMotifBadge } from '../components/animations/ThemeMotifBadge';
import { THEMES } from '../core/demoData';
import { useDemoStore } from '../core/useDemoStore';

export const ThemeStudioScreen: React.FC = () => {
  const activePersona = useDemoStore((s) => s.activePersona);
  const themesByPersona = useDemoStore((s) => s.themesByPersona);
  const subscriptionTier = useDemoStore((s) => s.subscriptionTier);
  const atmosphereEnabled = useDemoStore((s) => s.atmosphereEnabled);

  const setThemeForActivePersona = useDemoStore((s) => s.setThemeForActivePersona);
  const toggleAtmosphere = useDemoStore((s) => s.toggleAtmosphere);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);

  const activeTheme = themesByPersona[activePersona];
  const selectedMeta = THEMES.find((t) => t.id === activeTheme) ?? THEMES[0];
  const hasPlus = subscriptionTier !== 'free';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute inset-0 z-40 flex flex-col overflow-hidden bg-[var(--bg-primary)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--border-token)] px-4 py-3">
        <button
          type="button"
          onClick={() => setActiveOverlay('none')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.6} /> Back
        </button>
        <h2 className="keepsake-heading text-lg">Theme Studio</h2>
        <button
          type="button"
          onClick={toggleAtmosphere}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
            atmosphereEnabled ? 'bg-[var(--accent-primary)] text-[var(--accent-contrast)]' : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
          }`}
        >
          <Feather className="h-3 w-3" strokeWidth={1.6} /> Motion {atmosphereEnabled ? 'On' : 'Off'}
        </button>
      </div>

      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {/* Live Preview Card */}
        <div className="keepsake-card rounded-2xl p-4">
          <div className="flex items-center justify-between gap-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--text-secondary)]">
            <span className="truncate">{selectedMeta.issueTag}</span>
            <ThemeMotifBadge motif={selectedMeta.motif} label={selectedMeta.badgeSymbol} />
          </div>
          <h3 className="keepsake-heading mt-2 text-2xl">{selectedMeta.heroSectionLabel}</h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">{selectedMeta.vibe}</p>
          <p className="font-hand mt-2 text-xl text-[var(--accent-primary)]">
            &ldquo;{selectedMeta.particleLabel}&rdquo;
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--accent-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-contrast)]">
              {selectedMeta.pulseLabel}
            </span>
            <span className="rounded-full border border-[var(--border-token)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-semibold">
              {activePersona === 'julian' ? 'Julian' : 'Elena'} Only
            </span>
          </div>
        </div>

        {/* All 9 Themes List */}
        <div className="space-y-2.5">
          {THEMES.map((t) => {
            const selected = activeTheme === t.id;
            const locked = t.tier === 'plus' && !hasPlus;
            return (
              <div
                key={t.id}
                onClick={() => setThemeForActivePersona(t.id)}
                className={`keepsake-card cursor-pointer rounded-2xl p-3.5 transition ${
                  selected ? 'ring-2 ring-[var(--accent-primary)]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-1">
                      {t.swatches.map((hex) => (
                        <span
                          key={hex}
                          className="h-6 w-6 rounded-full border border-black/15"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold">{t.name}</p>
                        {t.tier === 'free' ? (
                          <span className="rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                            Free
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-[var(--accent-primary)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--accent-primary)]">
                            <Crown className="h-2.5 w-2.5" /> Plus
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)]">{t.vibe}</p>
                    </div>
                  </div>

                  {selected ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-primary)] text-[var(--accent-contrast)]">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : locked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--bg-elevated)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-secondary)]">
                      <Lock className="h-3 w-3" /> Try
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {!hasPlus && (
          <button
            type="button"
            onClick={() => setActiveOverlay('paywall')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)] shadow-md"
          >
            <Crown className="h-4 w-4" /> Unlock All Plus Themes (Keepsake Plus)
          </button>
        )}
      </div>
    </motion.div>
  );
};
