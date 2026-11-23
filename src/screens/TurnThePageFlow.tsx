import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Download, Heart, Lock, Plus, Shield, Trash2 } from 'lucide-react';
import { haptics } from '../core/haptics';
import { useDemoStore } from '../core/useDemoStore';

interface Props {
  initialView: 'turn-the-page' | 'past-vault';
}

export const TurnThePageFlow: React.FC<Props> = ({ initialView }) => {
  const spaceStatus = useDemoStore((s) => s.spaceStatus);
  const archivedSpaces = useDemoStore((s) => s.archivedSpaces);
  const pastVaultPin = useDemoStore((s) => s.pastVaultPin);

  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const triggerSilentLeave = useDemoStore((s) => s.triggerSilentLeave);
  const sealSpaceToPastVault = useDemoStore((s) => s.sealSpaceToPastVault);
  const deleteCurrentSpaceCleanly = useDemoStore((s) => s.deleteCurrentSpaceCleanly);
  const deleteArchivedSpace = useDemoStore((s) => s.deleteArchivedSpace);
  const startNewSpaceFlow = useDemoStore((s) => s.startNewSpaceFlow);
  const showToast = useDemoStore((s) => s.showToast);

  const [step, setStep] = useState<'exit-options' | 'set-pin' | 'sealing' | 'pin-unlock' | 'vault-browser'>(
    initialView === 'past-vault' ? 'pin-unlock' : 'exit-options'
  );
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('1234');
  const [pinError, setPinError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [holdingDelete, setHoldingDelete] = useState(false);
  const holdTimerRef = useRef<number | null>(null);

  const startHoldDelete = () => {
    setHoldingDelete(true);
    holdTimerRef.current = window.setTimeout(() => {
      haptics.warning();
      setHoldingDelete(false);
      deleteCurrentSpaceCleanly();
    }, 1400);
  };

  const cancelHoldDelete = () => {
    setHoldingDelete(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  // Fresh Page Landing
  if (spaceStatus === 'fresh_page' && initialView !== 'past-vault') {
    return (
      <div className="flex flex-1 flex-col items-center justify-between bg-[var(--bg-primary)] px-6 py-12 text-center">
        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={() => setStep('pin-unlock')}
            className="inline-flex items-center gap-1 rounded-full border border-[var(--border-token)] px-3 py-1 text-[11px] font-semibold text-[var(--text-secondary)]"
          >
            <Lock className="h-3 w-3" /> Past Vault ({archivedSpaces.length})
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-[290px]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]">
            <Book className="h-8 w-8" />
          </div>
          <h1 className="keepsake-heading mt-5 text-3xl">Every story has new chapters.</h1>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
            Your personal account and any Individual Plus themes are right here whenever you’re ready for what comes next.
          </p>
        </motion.div>

        <div className="w-full space-y-2.5">
          <button
            type="button"
            onClick={startNewSpaceFlow}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)]"
          >
            <Plus className="h-4 w-4" /> Start a New Space
          </button>
          <button
            type="button"
            onClick={() => {
              useDemoStore.getState().setOnboardingStep(5);
              useDemoStore.setState({ spaceStatus: 'onboarding', activeOverlay: 'none' });
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-token)] bg-[var(--bg-card)] py-3 text-xs font-semibold"
          >
            <Heart className="h-4 w-4 text-[var(--accent-primary)]" /> Join a Partner’s Invite
          </button>
        </div>
      </div>
    );
  }

  const pressDigit = (d: string) => {
    setPinError('');
    const next = pinInput + d;
    setPinInput(next);
    if (next.length === 4) {
      if (next === pastVaultPin || next === '1234') {
        setStep('vault-browser');
        setPinInput('');
      } else {
        setPinError(`Incorrect PIN (try ${pastVaultPin})`);
        setPinInput('');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
        <h2 className="keepsake-heading text-lg">
          {step === 'pin-unlock' || step === 'vault-browser' ? 'Past Vault' : 'Turn the Page'}
        </h2>
        <div className="w-12" />
      </div>

      {/* Step 1: Exit & Silent Leave Options */}
      {step === 'exit-options' && (
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <div className="keepsake-card rounded-3xl p-4">
            <h3 className="keepsake-heading text-xl">A Quiet, Dignified Exit</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
              Leaving sends <strong>zero push notifications</strong> to your partner’s phone. They will calmly see inside the app that you left next time they open it.
            </p>
            <button
              type="button"
              onClick={triggerSilentLeave}
              className="mt-3 w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-elevated)] py-2.5 text-xs font-semibold"
            >
              Simulate Partner B Opening App After Leave →
            </button>
          </div>

          <button
            type="button"
            onClick={() => showToast('Exported .keepsake.zip archive')}
            className="keepsake-card flex w-full items-center gap-3 rounded-2xl p-4 text-left"
          >
            <Download className="h-5 w-5 text-[var(--accent-primary)]" />
            <div>
              <p className="text-sm font-bold">Export My Memories First (.zip)</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Save a copy before locking or deleting</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setStep('set-pin')}
            className="keepsake-card flex w-full items-center gap-3 rounded-2xl border-2 border-[var(--accent-primary)]/40 p-4 text-left"
          >
            <Shield className="h-5 w-5 text-[var(--accent-primary)]" />
            <div>
              <p className="text-sm font-bold">Leave & Seal in Past Vault</p>
              <p className="text-[11px] text-[var(--text-secondary)]">Hide behind a 4-digit PIN & start a fresh relationship space</p>
            </div>
          </button>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex w-full items-center justify-center gap-1.5 py-2 text-xs font-semibold text-rose-500"
            >
              <Trash2 className="h-3.5 w-3.5" /> Leave & Delete Space Permanently
            </button>
          ) : (
            <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-center">
              <p className="text-xs font-semibold text-rose-500">Are you sure? Your local view will be cleared.</p>
              <button
                type="button"
                onPointerDown={startHoldDelete}
                onPointerUp={cancelHoldDelete}
                onPointerLeave={cancelHoldDelete}
                onPointerCancel={cancelHoldDelete}
                className="relative mt-2 w-full overflow-hidden rounded-xl bg-rose-600/25 py-2.5 text-xs font-semibold text-white select-none"
              >
                <span
                  style={{
                    width: holdingDelete ? '100%' : '0%',
                    transition: holdingDelete ? 'width 1400ms linear' : 'width 180ms ease-out',
                  }}
                  className="absolute inset-y-0 left-0 bg-rose-600"
                />
                <span className="relative z-10">
                  {holdingDelete ? 'Keep Holding to Delete...' : 'Hold 1.4s to Confirm Delete Space'}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Set 4-Digit PIN & Wax Seal Animation */}
      {step === 'set-pin' && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <Lock className="h-8 w-8 text-[var(--accent-primary)]" />
          <h3 className="keepsake-heading mt-3 text-2xl">Set Past Vault PIN</h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            A new partner will have zero visibility into anything sealed inside your Past Vault.
          </p>
          <input
            type="text"
            maxLength={4}
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
            className="mt-5 w-36 rounded-2xl border border-[var(--border-token)] bg-[var(--bg-card)] py-3 text-center text-2xl font-bold tracking-[0.4em]"
          />
          <button
            type="button"
            onClick={() => {
              setStep('sealing');
              setTimeout(() => {
                sealSpaceToPastVault(newPin);
              }, 1200);
            }}
            className="mt-5 w-full rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)]"
          >
            Seal Journal Chapter & Move On
          </button>
        </div>
      )}

      {/* Wax-Sealing Cover Animation (A12) */}
      {step === 'sealing' && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 1, rotateY: 0 }}
            animate={{ scale: 0.85, rotateY: 25 }}
            transition={{ duration: 0.9 }}
            className="keepsake-card flex h-52 w-40 flex-col items-center justify-center rounded-2xl border-2 border-[var(--accent-primary)] p-4"
          >
            <Lock className="h-8 w-8 text-[var(--accent-primary)]" />
            <p className="keepsake-heading mt-3 text-base">Chapter Sealed</p>
          </motion.div>
          <p className="mt-4 text-xs text-[var(--text-secondary)]">Moving safely to Past Vault...</p>
        </div>
      )}

      {/* PIN Keypad Unlock */}
      {step === 'pin-unlock' && (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <Lock className="h-7 w-7 text-[var(--accent-primary)]" />
          <h3 className="keepsake-heading mt-3 text-2xl">Unlock Past Vault</h3>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Demo PIN is {pastVaultPin}</p>

          <div className="my-5 flex gap-3">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-3.5 w-3.5 rounded-full border border-[var(--accent-primary)] ${
                  pinInput.length > i ? 'bg-[var(--accent-primary)]' : ''
                }`}
              />
            ))}
          </div>
          {pinError && <p className="mb-3 text-xs font-semibold text-rose-500">{pinError}</p>}

          <div className="grid w-56 grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, idx) =>
              k === '' ? (
                <div key={idx} />
              ) : (
                <button
                  key={idx}
                  type="button"
                  onClick={() => (k === '⌫' ? setPinInput((p) => p.slice(0, -1)) : pressDigit(k))}
                  className="keepsake-card flex h-12 items-center justify-center rounded-2xl text-base font-bold active:scale-95"
                >
                  {k}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Read-Only Past Vault Browser */}
      {step === 'vault-browser' && (
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {archivedSpaces.length === 0 ? (
            <p className="mt-10 text-center text-xs text-[var(--text-secondary)]">No archived chapters in your Past Vault.</p>
          ) : (
            archivedSpaces.map((arch) => (
              <div key={arch.id} className="keepsake-card space-y-2.5 rounded-3xl p-4">
                <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                  <span className="font-bold uppercase tracking-wider">{arch.dateRange}</span>
                  <span>{arch.memoryCount} memories • Read-Only</span>
                </div>
                <h3 className="keepsake-heading text-xl">{arch.title}</h3>
                <p className="font-hand text-lg text-[var(--accent-primary)]">{arch.coverQuote}</p>
                <div className="space-y-1.5 rounded-2xl bg-[var(--bg-elevated)] p-3 text-xs">
                  {arch.highlights.map((h) => (
                    <p key={h.title}>
                      <strong>{h.date}:</strong> {h.title}
                    </p>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => showToast(`Exported ${arch.title} (.zip)`)}
                    className="flex-1 rounded-xl border border-[var(--border-token)] py-2 text-xs font-semibold"
                  >
                    Export .zip
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteArchivedSpace(arch.id)}
                    className="rounded-xl bg-rose-500/15 px-3 py-2 text-xs font-semibold text-rose-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};
