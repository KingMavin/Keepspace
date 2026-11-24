import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, Feather, Home, Plus, Settings, Shield, Trash2 } from 'lucide-react';
import { haptics } from '../../core/haptics';
import { MainTab } from '../../core/types';
import { useDemoStore } from '../../core/useDemoStore';

export const BottomNav: React.FC = () => {
  const activeTab = useDemoStore((s) => s.activeTab);
  const spaceStatus = useDemoStore((s) => s.spaceStatus);
  const setActiveTab = useDemoStore((s) => s.setActiveTab);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const showToast = useDemoStore((s) => s.showToast);

  if (spaceStatus === 'partner_left') {
    return (
      <div className="pb-safe relative z-30 border-t border-[var(--border-token)] bg-[var(--bg-card)]/95 px-3 pt-2.5 backdrop-blur-md">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveOverlay('turn-the-page')}
            className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[var(--accent-primary)] py-2.5 text-[11px] font-semibold text-[var(--accent-contrast)]"
          >
            <Shield className="h-4 w-4" />
            Seal Past Vault
          </button>
          <button
            type="button"
            onClick={() => {
              showToast('Downloaded encrypted .keepsake.zip archive');
              setActiveOverlay('storage-backup');
            }}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-[var(--border-token)] bg-[var(--bg-elevated)] py-2.5 text-[11px] font-semibold text-[var(--text-primary)]"
          >
            <Download className="h-4 w-4" />
            Export File
          </button>
          <button
            type="button"
            onClick={() => setActiveOverlay('turn-the-page')}
            className="flex flex-col items-center justify-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 text-[11px] font-semibold text-rose-500"
          >
            <Trash2 className="h-4 w-4" />
            Delete Space
          </button>
        </div>
      </div>
    );
  }

  const navBtn = (tab: MainTab, label: string, Icon: React.ComponentType<{ className?: string }>) => {
    const active = activeTab === tab;
    return (
      <button
        type="button"
        onClick={() => {
          haptics.light();
          setActiveTab(tab);
        }}
        className={`relative isolate flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 transition-colors ${
          active ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'
        }`}
      >
        {active && (
          <motion.span
            layoutId="bottom-tab-pill"
            transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
            className="absolute inset-x-1.5 inset-y-0.5 -z-10 rounded-2xl bg-[var(--accent-primary)]/12"
          />
        )}
        <Icon className="h-5 w-5" />
        <span className="text-[10px] font-semibold tracking-wide">{label}</span>
      </button>
    );
  };

  return (
    <nav className="pb-safe relative z-30 flex items-center justify-between border-t border-[var(--border-token)] bg-[var(--bg-card)]/92 px-2 pt-1.5 backdrop-blur-lg">
      {navBtn('home', 'Home', Home)}
      {navBtn('timeline', 'Timeline', BookOpen)}

      <div className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={() => {
            haptics.medium();
            setActiveOverlay('create-memory');
          }}
          aria-label="Add Memory"
          className="-mt-6 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[var(--bg-primary)] bg-[var(--accent-primary)] text-[var(--accent-contrast)] shadow-lg transition-transform active:scale-95"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {navBtn('play', 'Fun & Music', Feather)}
      {navBtn('settings', 'Settings', Settings)}
    </nav>
  );
};
