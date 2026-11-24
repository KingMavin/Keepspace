import React from 'react';
import { ExternalLink, Heart, MessageSquareHeart, X } from 'lucide-react';
import { BottomSheet } from '../components/layout/BottomSheet';
import { haptics } from '../core/haptics';
import { useDemoStore } from '../core/useDemoStore';

const GOOGLE_FORM_URL = 'https://forms.gle/ytoWsfa5WPt8FHuBA';

export const FeedbackSurveySheet: React.FC = () => {
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const showToast = useDemoStore((s) => s.showToast);

  return (
    <BottomSheet onClose={() => setActiveOverlay('none')}>
      <div className="space-y-4 px-5 pt-2 pb-8">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-primary)]/12 px-3 py-1 text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--accent-primary)]">
            <MessageSquareHeart className="h-3.5 w-3.5" /> Reviewer Feedback &amp; Survey
          </span>
          <button
            type="button"
            onClick={() => setActiveOverlay('none')}
            aria-label="Close feedback sheet"
            className="rounded-full p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <h2 className="keepsake-heading text-2xl leading-tight">We&rsquo;d love your honest thoughts</h2>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            Thank you so much for spending time exploring the Keepsake preview! Tapping the button below will take you to a quick, friendly 2-minute survey on{' '}
            <strong className="text-[var(--text-primary)]">Google Forms</strong> where you can share your feedback, let us know which themes or animations stood out, and tell us anything we should make better.
          </p>
        </div>

        <div className="keepsake-card space-y-2.5 rounded-2xl p-4 text-xs text-[var(--text-secondary)]">
          <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--accent-primary)]">
            What the quick survey asks
          </p>
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[10px] font-bold text-[var(--accent-primary)]">
              1
            </span>
            <p>How the overall look, themes, and feel came across on your phone</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[10px] font-bold text-[var(--accent-primary)]">
              2
            </span>
            <p>Your favorite features (Mixtape, Year Wrapped, Photo Cards, or Invite Fanfare)</p>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[10px] font-bold text-[var(--accent-primary)]">
              3
            </span>
            <p>Anything that felt confusing, slow, or missing before launch</p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              haptics.success();
              showToast('Opening Google Forms survey in a new tab...');
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)] shadow-md"
          >
            <Heart className="h-4 w-4 fill-current" />
            Continue to Google Forms Survey
            <ExternalLink className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={() => setActiveOverlay('none')}
            className="w-full rounded-2xl border border-[var(--border-token)] bg-[var(--bg-card)] py-2.5 text-xs font-semibold text-[var(--text-secondary)]"
          >
            Back to App
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
