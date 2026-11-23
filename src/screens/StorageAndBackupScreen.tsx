import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, CloudUpload, Download, HardDrive, QrCode, Radio, Smartphone, X } from 'lucide-react';
import { useDemoStore } from '../core/useDemoStore';

export const StorageAndBackupScreen: React.FC = () => {
  const memories = useDemoStore((s) => s.memories);
  const letters = useDemoStore((s) => s.letters);
  const subscriptionTier = useDemoStore((s) => s.subscriptionTier);
  const lastBackupAt = useDemoStore((s) => s.lastBackupAt);

  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const triggerRelayIncoming = useDemoStore((s) => s.triggerRelayIncoming);
  const runCloudBackup = useDemoStore((s) => s.runCloudBackup);
  const showToast = useDemoStore((s) => s.showToast);

  const [wifiOnly, setWifiOnly] = useState(true);
  const [backingUp, setBackingUp] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const pendingRelay = memories.filter((m) => m.isRelayIncoming).length;
  const localMb = Math.max(12, memories.length * 4 + letters.length * 1);

  const handleBackupClick = () => {
    if (subscriptionTier !== 'couple_plus') {
      setActiveOverlay('paywall');
      return;
    }
    setBackingUp(true);
    setTimeout(() => {
      setBackingUp(false);
      runCloudBackup();
    }, 900);
  };

  const handleExportArchive = () => {
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), memories, letters }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keepsake-encrypted-archive.keepsake.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported portable .keepsake.json archive');
  };

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
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h2 className="keepsake-heading text-lg">Storage & Cloud Backup</h2>
        <div className="w-12" />
      </div>

      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {/* On This Device */}
        <div className="keepsake-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-[var(--accent-primary)]" strokeWidth={1.6} />
              <h3 className="text-sm font-bold">On This iPhone</h3>
            </div>
            <span className="text-xs font-bold text-[var(--accent-primary)]">{localMb} MB used</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
            <div className="h-full w-1/4 rounded-full bg-[var(--accent-primary)]" />
          </div>
          <p className="mt-2.5 text-[11px] leading-relaxed text-[var(--text-secondary)]">
            Your memories and photos stay right on your device so your archive remains private and opens even without signal.
          </p>
        </div>

        {/* Private Relay Queue */}
        <div className="keepsake-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-amber-500" strokeWidth={1.6} />
              <h3 className="text-sm font-bold">Private Relay</h3>
            </div>
            <span className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-0.5 text-[10px] font-bold">
              {pendingRelay} pending
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
            When your partner sends a photo, our relay holds the encrypted delivery briefly until your phone downloads it and clears the server copy.
          </p>
          <button
            type="button"
            onClick={triggerRelayIncoming}
            className="mt-3 w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-elevated)] py-2.5 text-xs font-semibold"
          >
            Simulate Incoming Partner Relay &rarr;
          </button>
        </div>

        {/* Cloud Vault Backup */}
        <div className="keepsake-card rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudUpload className="h-4 w-4 text-[var(--accent-primary)]" strokeWidth={1.6} />
              <h3 className="text-sm font-bold">Cloud Vault Backup</h3>
            </div>
            {subscriptionTier === 'couple_plus' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Active
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Last synced: {lastBackupAt}</p>

          <label className="mt-3 flex items-center justify-between text-xs font-medium">
            <span>Auto-backup on Wi-Fi only</span>
            <input type="checkbox" checked={wifiOnly} onChange={(e) => setWifiOnly(e.target.checked)} />
          </label>

          <button
            type="button"
            disabled={backingUp}
            onClick={handleBackupClick}
            className="mt-3 w-full rounded-2xl bg-[var(--accent-primary)] py-3 text-xs font-semibold text-[var(--accent-contrast)]"
          >
            {backingUp
              ? 'Encrypting & Uploading Snapshot...'
              : subscriptionTier === 'couple_plus'
                ? 'Back Up Now'
                : 'Upgrade to Couple Plus for Auto Cloud Backup'}
          </button>
        </div>

        {/* Export Archive & Direct Transfer */}
        <div className="keepsake-card space-y-2.5 rounded-2xl p-4">
          <h3 className="text-sm font-bold">Transfer to New Phone & Export</h3>
          <button
            type="button"
            onClick={handleExportArchive}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-token)] bg-[var(--bg-elevated)] py-2.5 text-xs font-semibold"
          >
            <Download className="h-3.5 w-3.5" strokeWidth={1.6} /> Export Offline Archive (.zip)
          </button>
          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-token)] py-2.5 text-xs font-semibold text-[var(--text-secondary)]"
          >
            <QrCode className="h-3.5 w-3.5 text-[var(--accent-primary)]" strokeWidth={1.6} /> Direct Device-to-Device Transfer
          </button>
        </div>
      </div>

      {/* Clean Partner QR Restore Modal (Zero Crypto Jargon) */}
      {qrModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-5 backdrop-blur-xs">
          <div className="keepsake-card w-full space-y-3 rounded-3xl p-5 text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">Partner Restore</span>
              <button type="button" onClick={() => setQrModalOpen(false)}>
                <X className="h-4 w-4 text-[var(--text-secondary)]" />
              </button>
            </div>
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--accent-primary)] bg-[var(--bg-elevated)]">
              <QrCode className="h-24 w-24 text-[var(--text-primary)]" />
            </div>
            <h3 className="keepsake-heading text-xl">Copy Archive From Partner’s Phone</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Got a new phone without Cloud Backup? Have your partner open Settings → Restore QR and scan this code on Wi-Fi to transfer your timeline directly.
            </p>
            <button
              type="button"
              onClick={() => {
                setQrModalOpen(false);
                showToast('Simulated direct partner transfer completed!');
              }}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-2xl bg-[var(--accent-primary)] py-3 text-xs font-semibold text-[var(--accent-contrast)]"
            >
              <Smartphone className="h-4 w-4" /> Simulate Successful Phone Transfer
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
