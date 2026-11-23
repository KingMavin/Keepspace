import React from 'react';
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Crown,
  HardDrive,
  HeartCrack,
  Lock,
  MessageSquareHeart,
  Mic,
  Palette,
  Smartphone,
} from 'lucide-react';
import { useDemoStore } from '../core/useDemoStore';

export const SettingsScreen: React.FC = () => {
  const subscriptionTier = useDemoStore((s) => s.subscriptionTier);
  const archivedSpaces = useDemoStore((s) => s.archivedSpaces);
  const lastBackupAt = useDemoStore((s) => s.lastBackupAt);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const openInstallPrompt = useDemoStore((s) => s.openInstallPrompt);

  const planLabel =
    subscriptionTier === 'couple_plus'
      ? 'Couple Plus (Both covered)'
      : subscriptionTier === 'individual_plus'
        ? 'Individual Plus'
        : 'Free Tier';

  const row = (
    title: string,
    subtitle: string,
    Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>,
    onClick: () => void,
    danger = false
  ) => (
    <button
      type="button"
      onClick={onClick}
      className="keepsake-card flex w-full items-center justify-between gap-3 rounded-2xl p-3.5 text-left transition-colors hover:bg-[var(--bg-elevated)]/40"
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            danger ? 'bg-rose-500/12 text-rose-500' : 'bg-[var(--bg-elevated)] text-[var(--accent-primary)]'
          }`}
        >
          <Icon className="h-4 w-4" strokeWidth={1.6} />
        </div>
        <div>
          <p className={`text-sm font-semibold ${danger ? 'text-rose-500' : 'text-[var(--text-primary)]'}`}>{title}</p>
          <p className="text-[11px] text-[var(--text-secondary)]">{subtitle}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-secondary)]" strokeWidth={1.6} />
    </button>
  );

  return (
    <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto px-4 pt-3 pb-8">
      <div className="border-b border-[var(--border-token)] pb-3">
        <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--text-secondary)]">
          Archive &amp; Preferences
        </p>
        <h1 className="keepsake-heading text-2xl">Settings</h1>
      </div>

      {/* Reviewer Feedback & Survey */}
      <section className="space-y-2">
        <h2 className="px-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--text-secondary)]">
          Review &amp; Feedback
        </h2>
        <button
          type="button"
          onClick={() => setActiveOverlay('feedback-survey')}
          className="keepsake-card flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-[var(--accent-primary)]/40 p-3.5 text-left transition-colors hover:bg-[var(--bg-elevated)]/40"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-primary)] text-[var(--accent-contrast)]">
              <MessageSquareHeart className="h-4 w-4" strokeWidth={1.7} />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">Feedback &amp; Quick Survey</p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Opens a quick survey on Google Forms &bull; Share your thoughts
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-[var(--accent-primary)]" strokeWidth={1.8} />
        </button>
      </section>

      {/* Keepsakes & Print */}
      <section className="space-y-2">
        <h2 className="px-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--text-secondary)]">
          Keepsakes &amp; Print
        </h2>
        <div className="space-y-2">
          {row(
            'Reading Appearance',
            'Themes, custom icons, textures & animations',
            Palette,
            () => setActiveOverlay('theme-studio')
          )}
          {row(
            'Linen Hardcover Book',
            'Cover cloths, spreads & print proof',
            BookOpen,
            () => setActiveOverlay('book-studio')
          )}
          {row(
            'Year in Review',
            'Replay 2025 story reel & attention trivia',
            Calendar,
            () => setActiveOverlay('year-wrapped')
          )}
          {row(
            'Voice Letters',
            'Bedtime recordings & spoken notes',
            Mic,
            () => setActiveOverlay('audio-scrapbook')
          )}
        </div>
      </section>

      {/* Device & Privacy */}
      <section className="space-y-2">
        <h2 className="px-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--text-secondary)]">
          Device &amp; Privacy
        </h2>
        <div className="space-y-2">
          {row(
            'Add to Home Screen',
            'Install as a fullscreen phone app',
            Smartphone,
            () => openInstallPrompt()
          )}
          {row(
            'Storage & Cloud Backup',
            `Last synced ${lastBackupAt} \u2022 Export & restore`,
            HardDrive,
            () => setActiveOverlay('storage-backup')
          )}
          {row(
            'Keepsake Plus Plan',
            `Current: ${planLabel}`,
            Crown,
            () => setActiveOverlay('paywall')
          )}
          {row(
            'Protected Past Vault',
            `${archivedSpaces.length} sealed volume${archivedSpaces.length === 1 ? '' : 's'} (PIN locked)`,
            Lock,
            () => setActiveOverlay('past-vault')
          )}
        </div>
      </section>

      {/* Relationship Space */}
      <section className="space-y-2">
        <h2 className="px-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-[var(--text-secondary)]">
          Relationship Space
        </h2>
        {row(
          'Turn the Page',
          'Leave space quietly \u2022 Seal or export chapter',
          HeartCrack,
          () => setActiveOverlay('turn-the-page'),
          true
        )}
      </section>
    </div>
  );
};
