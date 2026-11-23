import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  Check,
  Copy,
  Feather,
  Gift,
  Heart,
  Lock,
  Mail,
  PartyPopper,
  RotateCcw,
  Share2,
  ShieldCheck,
  Users,
} from 'lucide-react';
import exifr from 'exifr';
import { InviteCelebrationOverlay } from '../components/animations/InviteCelebrationOverlay';
import { SAMPLE_PHOTOS } from '../core/demoData';
import { haptics } from '../core/haptics';
import { useDemoStore } from '../core/useDemoStore';

export const OnboardingFlow: React.FC = () => {
  const onboardingStep = useDemoStore((s) => s.onboardingStep);
  const spaceName = useDemoStore((s) => s.spaceName);
  const spaceType = useDemoStore((s) => s.spaceType);
  const relationshipStartDate = useDemoStore((s) => s.relationshipStartDate);
  const inviteRevoked = useDemoStore((s) => s.inviteRevoked);

  const setOnboardingStep = useDemoStore((s) => s.setOnboardingStep);
  const setSpaceDetails = useDemoStore((s) => s.setSpaceDetails);
  const completeOnboardingToHome = useDemoStore((s) => s.completeOnboardingToHome);
  const toggleInviteRevoked = useDemoStore((s) => s.toggleInviteRevoked);
  const addMemory = useDemoStore((s) => s.addMemory);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const showToast = useDemoStore((s) => s.showToast);

  // Screen 1 Auth Sheet state
  const [authModalOpen, setAuthModalOpen] = useState<'signup' | 'signin' | null>(null);
  const [birthYear, setBirthYear] = useState('2001');
  const [email, setEmail] = useState('julian@keepsake.app');
  const [ageError, setAgeError] = useState('');

  // Screen 2 Space Setup state
  const [yourName, setYourName] = useState('Julian');
  const [partnerName, setPartnerName] = useState('Elena');

  // Screen 3 First Memory state
  const [mode, setMode] = useState<'photo' | 'text'>('photo');
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [exifDate, setExifDate] = useState<string>('2026-10-18');
  const [caption, setCaption] = useState('First sunset on the Montmartre steps.');

  // Screen 5 Partner Gift Preview & Unwrap state
  const [unwrapped, setUnwrapped] = useState(false);
  const [celebrationKey, setCelebrationKey] = useState(0);

  useEffect(() => {
    if (onboardingStep === 5) {
      setUnwrapped(false);
    }
  }, [onboardingStep]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const age = 2026 - Number(birthYear || 2020);
    if (age < 18) {
      setAgeError('Keepsake requires users to be 18 or older.');
      return;
    }
    setAgeError('');
    if (authModalOpen === 'signin') {
      setAuthModalOpen(null);
      completeOnboardingToHome();
      showToast('Signed back into Elena & Julian');
    } else {
      setAuthModalOpen(null);
      setOnboardingStep(2);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    try {
      const exif = await exifr.parse(file);
      if (exif?.DateTimeOriginal) {
        const iso = new Date(exif.DateTimeOriginal).toISOString().slice(0, 10);
        setExifDate(iso);
        showToast(`EXIF date detected: ${iso}`);
      } else {
        showToast('Photo loaded (no embedded EXIF date — using selected date)');
      }
    } catch {
      showToast('Photo attached');
    }
  };

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto px-5 py-5">
      {/* SCREEN 1: Welcome & Auth */}
      {onboardingStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col justify-between py-2"
        >
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-token)] bg-[var(--bg-card)] px-3 py-1 text-[11px] font-semibold tracking-widest uppercase text-[var(--accent-primary)]">
              <Lock className="h-3 w-3" /> Private Couple Space
            </span>
            <h1 className="keepsake-heading mt-4 text-4xl font-semibold leading-tight">Keepsake</h1>
            <p className="mx-auto mt-2 max-w-[260px] text-sm text-[var(--text-secondary)]">
              A private home for the story you’re making together—on your phones, never a public feed.
            </p>
          </div>

          {/* Looping stacked polaroid preview */}
          <div className="relative my-6 flex h-56 items-center justify-center">
            <motion.div
              animate={{ rotate: [-5, -3, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="keepsake-card absolute h-48 w-44 -translate-x-8 rounded-2xl p-2"
            >
              <img src={SAMPLE_PHOTOS[2].url} alt="Sample Big Sur" className="h-36 w-full rounded-xl object-cover" />
              <p className="font-hand mt-1.5 text-center text-base text-[var(--text-secondary)]">Big Sur Pullout</p>
            </motion.div>
            <motion.div
              animate={{ rotate: [4, 6, 4], y: [0, -4, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="keepsake-card relative z-10 h-52 w-48 translate-x-6 rounded-2xl p-2.5 shadow-xl"
            >
              <img src={SAMPLE_PHOTOS[0].url} alt="Sample Paris" className="h-38 w-full rounded-xl object-cover" />
              <p className="font-hand mt-1.5 text-center text-lg font-bold text-[var(--text-primary)]">
                Golden Hour Steps ✦
              </p>
            </motion.div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => setAuthModalOpen('signup')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)] shadow-md active:scale-[0.99]"
            >
              Start a Space <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setAuthModalOpen('signin')}
              className="w-full rounded-2xl border border-[var(--border-token)] bg-[var(--bg-card)] py-3 text-sm font-semibold text-[var(--text-primary)]"
            >
              I already have a Space • Sign In
            </button>
            <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-[var(--text-secondary)]">
              <button type="button" onClick={() => showToast('Privacy Policy: Zero ads, local-first relay, full export.')} className="underline">
                Privacy Policy
              </button>
              <span>•</span>
              <button type="button" onClick={() => showToast('18+ age verification enforced')} className="underline">
                18+ Terms
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* SCREEN 2: Space Setup */}
      {onboardingStep === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setOnboardingStep(1)}
                className="rounded-full border border-[var(--border-token)] p-2 text-[var(--text-secondary)]"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-secondary)]">Step 1 of 3</span>
              <div className="w-8" />
            </div>

            <h2 className="keepsake-heading mt-5 text-2xl">Name your shared space</h2>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              You can edit everything or skip optional details anytime.
            </p>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)]">Your First Name</span>
                  <input
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-card)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-primary)]"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)]">Partner Name (opt.)</span>
                  <input
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-card)] px-3 py-2.5 text-sm outline-none focus:border-[var(--accent-primary)]"
                  />
                </label>
              </div>

              <label className="block">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)]">Relationship Start Date</span>
                  <button
                    type="button"
                    onClick={() => setSpaceDetails({ relationshipStartDate: '' })}
                    className="text-[11px] font-medium text-[var(--accent-primary)]"
                  >
                    Skip Date
                  </button>
                </div>
                <div className="relative mt-1">
                  <Calendar className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-[var(--text-secondary)]" />
                  <input
                    type="date"
                    value={relationshipStartDate}
                    onChange={(e) => setSpaceDetails({ relationshipStartDate: e.target.value })}
                    className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-card)] py-2.5 pr-3 pl-9 text-sm outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </label>

              <div>
                <span className="text-[11px] font-semibold text-[var(--text-secondary)]">Space Mode</span>
                <div className="mt-1.5 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSpaceDetails({ spaceType: 'couple' })}
                    className={`rounded-2xl border p-3 text-left transition ${
                      spaceType === 'couple'
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                        : 'border-[var(--border-token)] bg-[var(--bg-card)]'
                    }`}
                  >
                    <Heart className="h-4 w-4 text-[var(--accent-primary)]" />
                    <p className="mt-1.5 text-xs font-bold">Romantic Couple</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">Milestones, capsules & quizzes</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSpaceDetails({ spaceType: 'duo_friends' });
                      showToast('Best Friends / Duo slot preview enabled');
                    }}
                    className={`rounded-2xl border p-3 text-left transition ${
                      spaceType === 'duo_friends'
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                        : 'border-[var(--border-token)] bg-[var(--bg-card)]'
                    }`}
                  >
                    <Users className="h-4 w-4 text-[var(--accent-secondary)]" />
                    <p className="mt-1.5 text-xs font-bold">Best Friends / Duo</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">Swaps labels for friendship</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setSpaceDetails({ spaceName: `${partnerName || 'Partner'} & ${yourName || 'You'}` });
              setOnboardingStep(3);
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)] shadow-md"
          >
            Continue to First Memory <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {/* SCREEN 3: First Memory & EXIF Quick-Pick */}
      {onboardingStep === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setOnboardingStep(2)}
                className="rounded-full border border-[var(--border-token)] p-2 text-[var(--text-secondary)]"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-secondary)]">Step 2 of 3</span>
              <button
                type="button"
                onClick={() => setOnboardingStep(4)}
                className="text-xs font-semibold text-[var(--accent-primary)]"
              >
                Skip
              </button>
            </div>

            <h2 className="keepsake-heading mt-4 text-2xl">Wrap a first memory inside</h2>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              So {partnerName || 'your partner'} opens a warm gift instead of an empty screen.
            </p>

            <div className="mt-4 flex gap-2 rounded-xl bg-[var(--bg-elevated)] p-1">
              <button
                type="button"
                onClick={() => setMode('photo')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
                  mode === 'photo' ? 'bg-[var(--bg-card)] shadow-sm' : 'text-[var(--text-secondary)]'
                }`}
              >
                Photo + EXIF Date
              </button>
              <button
                type="button"
                onClick={() => setMode('text')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
                  mode === 'text' ? 'bg-[var(--bg-card)] shadow-sm' : 'text-[var(--text-secondary)]'
                }`}
              >
                Text Note Only
              </button>
            </div>

            {mode === 'photo' && (
              <div className="keepsake-card mt-4 overflow-hidden rounded-2xl p-2.5">
                <img src={photoUrl} alt="First memory" className="h-44 w-full rounded-xl object-cover" />
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[var(--bg-elevated)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent-primary)]">
                    EXIF Date: {exifDate}
                  </span>
                  <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-[var(--border-token)] px-2.5 py-1 text-[11px] font-semibold">
                    <Camera className="h-3 w-3" /> Upload Own
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="Write a personal note for your partner..."
              className="mt-3 w-full rounded-2xl border border-[var(--border-token)] bg-[var(--bg-card)] p-3 text-sm outline-none focus:border-[var(--accent-primary)]"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              addMemory({
                type: mode === 'photo' ? 'photo' : 'text',
                title: 'The Memory I Wrapped for You',
                body: caption,
                memoryDate: exifDate,
                photoUrl: mode === 'photo' ? photoUrl : undefined,
                backNote: `Made by ${yourName} while setting up our space.`,
              });
              setOnboardingStep(4);
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)] shadow-md"
          >
            Save & Prepare Gift Link <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      )}

      {/* SCREEN 4: Privacy-Safe Gift Invite Sheet */}
      {onboardingStep === 4 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setOnboardingStep(3)}
                className="rounded-full border border-[var(--border-token)] p-2 text-[var(--text-secondary)]"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--text-secondary)]">Step 3 of 3</span>
              <div className="w-8" />
            </div>

            <h2 className="keepsake-heading mt-4 text-2xl">Send your privacy-safe gift</h2>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              Private memories stay hidden behind encryption until {partnerName || 'your partner'} signs in and accepts.
            </p>

            <div className="keepsake-card mt-5 rounded-3xl p-5 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]">
                <Gift className="h-7 w-7" />
              </div>
              <p className="mt-3 text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-secondary)]">
                Public Link Preview Only
              </p>
              <p className="keepsake-heading mt-1 text-lg">
                “{yourName || 'Julian'} made a private Keepsake space for you.”
              </p>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                {inviteRevoked ? 'Link revoked — generate a new one below.' : 'Expires in 7 days • Single-use encrypted token'}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={inviteRevoked}
                  onClick={() => showToast('Gift invite link copied to clipboard')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-token)] bg-[var(--bg-elevated)] py-2.5 text-xs font-semibold disabled:opacity-40"
                >
                  <Copy className="h-3.5 w-3.5" /> Copy Link
                </button>
                <button
                  type="button"
                  disabled={inviteRevoked}
                  onClick={() => showToast('Opened native WhatsApp / iMessage share sheet')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent-primary)] py-2.5 text-xs font-semibold text-[var(--accent-contrast)] disabled:opacity-40"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share Gift
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleInviteRevoked}
              className="mt-3 flex w-full items-center justify-center gap-1.5 py-2 text-xs font-semibold text-rose-500"
            >
              {inviteRevoked ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5" /> Generate Fresh Invite Link
                </>
              ) : (
                'Revoke Invite Link'
              )}
            </button>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                useDemoStore.getState().switchPersona('elena');
                setUnwrapped(false);
                setOnboardingStep(5);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 py-3 text-xs font-bold text-[var(--accent-primary)]"
            >
              <Feather className="h-4 w-4" /> Test Partner View: Open Link as {partnerName || 'Elena'} →
            </button>
            <button
              type="button"
              onClick={completeOnboardingToHome}
              className="w-full rounded-2xl bg-[var(--bg-card)] py-3 text-xs font-semibold text-[var(--text-secondary)] border border-[var(--border-token)]"
            >
              Continue to Home Waiting Screen
            </button>
          </div>
        </motion.div>
      )}

      {/* SCREEN 5: Partner Privacy Preview (5A) -> Gift Unwrap Animation (5B) */}
      {onboardingStep === 5 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col justify-between py-2">
          {!unwrapped ? (
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-primary)]/15 px-3 py-1 text-[11px] font-semibold text-[var(--accent-primary)]">
                  <ShieldCheck className="h-3.5 w-3.5" /> Privacy-Safe Consent Gate
                </span>
                <h2 className="keepsake-heading mt-4 text-2xl leading-snug">
                  {yourName || 'Julian'} invited you to a private space together.
                </h2>
                <div className="keepsake-card mt-4 space-y-3 rounded-2xl p-4 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <p><strong className="text-[var(--text-primary)]">Your Own Account:</strong> Never a shared password. You can edit your own entries for 10 minutes.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <p><strong className="text-[var(--text-primary)]">Local-First Privacy:</strong> Photos and notes live on your phones, with silent exit anytime.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    haptics.success();
                    setCelebrationKey((k) => k + 1);
                    setUnwrapped(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)] shadow-lg"
                >
                  <Gift className="h-4 w-4" /> Accept & Unwrap Keepsake
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOnboardingStep(1);
                    showToast('Declined quietly — no alert sent to inviter');
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-[var(--text-secondary)]"
                >
                  Decline Privately
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="relative flex flex-1 flex-col justify-between"
            >
              <InviteCelebrationOverlay triggerKey={celebrationKey} />

              <div className="text-center">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      haptics.medium();
                      setCelebrationKey((k) => k + 1);
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border-token)] bg-[var(--bg-card)] px-3 py-1 text-[11px] font-semibold text-[var(--accent-primary)]"
                  >
                    <PartyPopper className="h-3 w-3" /> Replay Fanfare
                  </button>
                  <button
                    type="button"
                    onClick={completeOnboardingToHome}
                    className="rounded-full border border-[var(--border-token)] px-3 py-1 text-[11px] font-medium text-[var(--text-secondary)]"
                  >
                    Skip Animation
                  </button>
                </div>
                <p className="font-hand mt-3 text-2xl text-[var(--accent-primary)]">Welcome to {spaceName}</p>
                <h2 className="keepsake-heading mt-1 text-2xl">{yourName || 'Julian'} started this for you</h2>

                <motion.div
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25, type: 'spring', stiffness: 240, damping: 22 }}
                  className="polaroid-frame mt-5 overflow-hidden rounded-2xl p-3 text-left"
                >
                  {mode === 'photo' && <img src={photoUrl} alt="Unwrapped gift" className="h-48 w-full rounded-xl object-cover" />}
                  <p className="font-hand mt-3 text-xl text-[var(--text-primary)]">“{caption}”</p>
                  <p className="mt-1 text-[11px] text-[var(--text-secondary)]">{exifDate} • First Memory</p>
                </motion.div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    completeOnboardingToHome();
                    setActiveOverlay('batch-backfill');
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)]"
                >
                  <Feather className="h-4 w-4" /> Batch Backfill Old Photos (EXIF)
                </button>
                <button
                  type="button"
                  onClick={completeOnboardingToHome}
                  className="w-full rounded-2xl border border-[var(--border-token)] bg-[var(--bg-card)] py-3 text-xs font-semibold"
                >
                  Go to Home Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Auth + 18+ Age Gate Modal */}
      <AnimatePresence>
        {authModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end bg-black/50 backdrop-blur-xs"
          >
            <motion.form
              onSubmit={handleAuthSubmit}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="w-full rounded-t-3xl border-t border-[var(--border-token)] bg-[var(--bg-card)] p-5 pb-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="keepsake-heading text-xl">
                  {authModalOpen === 'signup' ? 'Create Your Account' : 'Sign In to Keepsake'}
                </h3>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(null)}
                  className="text-xs font-semibold text-[var(--text-secondary)]"
                >
                  Close
                </button>
              </div>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Individual credentials protect each partner’s privacy.
              </p>

              <div className="mt-4 space-y-3">
                <label className="block">
                  <span className="text-[11px] font-semibold text-[var(--text-secondary)]">Email</span>
                  <div className="relative mt-1">
                    <Mail className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-[var(--text-secondary)]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] py-2.5 pr-3 pl-9 text-sm outline-none"
                    />
                  </div>
                </label>

                {authModalOpen === 'signup' && (
                  <label className="block">
                    <span className="text-[11px] font-semibold text-[var(--text-secondary)]">Birth Year (18+ Verification)</span>
                    <input
                      type="number"
                      min="1920"
                      max="2026"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[var(--border-token)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm outline-none"
                    />
                  </label>
                )}
                {ageError && <p className="text-xs font-semibold text-rose-500">{ageError}</p>}
              </div>

              <button
                type="submit"
                className="mt-5 w-full rounded-2xl bg-[var(--accent-primary)] py-3.5 text-sm font-semibold text-[var(--accent-contrast)]"
              >
                {authModalOpen === 'signup' ? 'Verify Age & Continue' : 'Sign In'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
