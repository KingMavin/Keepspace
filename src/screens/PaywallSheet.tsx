import React, { useState } from 'react';
import { Check, Crown, Lock, X } from 'lucide-react';
import { BottomSheet } from '../components/layout/BottomSheet';
import { haptics } from '../core/haptics';
import { useDemoStore } from '../core/useDemoStore';

export const PaywallSheet: React.FC = () => {
  const [yearly, setYearly] = useState(true);
  const subscriptionTier = useDemoStore((s) => s.subscriptionTier);
  const setSubscriptionTier = useDemoStore((s) => s.setSubscriptionTier);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const showToast = useDemoStore((s) => s.showToast);

  return (
    <BottomSheet onClose={() => setActiveOverlay('none')}>
      <div className="bg-[var(--bg-primary)] px-5 pt-2 pb-8">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-primary)]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">
            <Crown className="h-3 w-3" /> Keepsake Plus
          </span>
          <button
            type="button"
            onClick={() => setActiveOverlay('none')}
            className="rounded-full p-1.5 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="keepsake-heading mt-3 text-2xl">Choose your plan</h2>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          Upgrade just for yourself, or cover both partners with automatic Encrypted Cloud Vault Backup.
        </p>

        {/* Billing Interval Toggle */}
        <div className="mt-4 flex rounded-2xl bg-[var(--bg-elevated)] p-1">
          <button
            type="button"
            onClick={() => setYearly(false)}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold ${
              !yearly ? 'bg-[var(--bg-card)] shadow-xs' : 'text-[var(--text-secondary)]'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setYearly(true)}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold ${
              yearly ? 'bg-[var(--bg-card)] shadow-xs' : 'text-[var(--text-secondary)]'
            }`}
          >
            Yearly
          </button>
        </div>

        {/* Couple Plus Card (Prices Hidden / Locked) */}
        <div className="keepsake-card mt-4 rounded-3xl border-2 border-[var(--accent-primary)] p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="rounded-full bg-[var(--accent-primary)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent-contrast)]">
                Best Value &bull; Covers Both
              </span>
              <h3 className="keepsake-heading mt-1.5 text-xl">Couple Plus</h3>
            </div>
            <div className="inline-flex items-center gap-1 rounded-xl border border-[var(--border-token)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--text-secondary)]">
              <Lock className="h-3 w-3 text-[var(--accent-primary)]" /> Pricing Locked
            </div>
          </div>

          <ul className="mt-3 space-y-1.5 text-xs text-[var(--text-secondary)]">
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> All 9 Reading Appearances &amp; Paper Motion for <strong>BOTH</strong> partners
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Automatic Encrypted Cloud Vault Backup &amp; new phone restore
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Unlimited Photo Roll Imports, Voice Letters &amp; Linen Prints
            </li>
          </ul>

          <button
            type="button"
            onClick={() => {
              setSubscriptionTier('couple_plus');
              setActiveOverlay('none');
            }}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[var(--accent-primary)] py-3 text-xs font-semibold text-[var(--accent-contrast)]"
          >
            <Crown className="h-4 w-4" />
            {subscriptionTier === 'couple_plus' ? 'Active Plan' : 'Activate Couple Plus (Preview)'}
          </button>
        </div>

        {/* Individual Plus Card (Prices Hidden / Locked) */}
        <div className="keepsake-card mt-3 rounded-3xl p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="keepsake-heading text-lg">Individual Plus</h3>
              <p className="text-[11px] text-[var(--text-secondary)]">1 user &bull; Keeps themes across any space</p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-xl border border-[var(--border-token)] bg-[var(--bg-elevated)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-secondary)]">
              <Lock className="h-3 w-3 text-[var(--accent-primary)]" /> Preview Access
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSubscriptionTier('individual_plus');
              setActiveOverlay('none');
            }}
            className="mt-3 w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-elevated)] py-2.5 text-xs font-semibold"
          >
            {subscriptionTier === 'individual_plus' ? 'Active Plan' : 'Choose Individual Plus (Preview)'}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
          <button type="button" onClick={() => showToast('Restored purchases from preview store')} className="underline">
            Restore Purchases
          </button>
          <button
            type="button"
            onClick={() => {
              haptics.light();
              setSubscriptionTier('free');
            }}
            className="underline"
          >
            Switch to Free Tier
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
