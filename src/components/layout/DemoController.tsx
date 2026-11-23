import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, MessageSquareHeart, Radio, RotateCcw, UserCheck } from 'lucide-react';
import { useDemoStore } from '../../core/useDemoStore';

export const DemoController: React.FC = () => {
  const [open, setOpen] = useState(false);
  const activePersona = useDemoStore((s) => s.activePersona);
  const spaceStatus = useDemoStore((s) => s.spaceStatus);
  const switchPersona = useDemoStore((s) => s.switchPersona);
  const setShowSplash = useDemoStore((s) => s.setShowSplash);
  const setActiveTab = useDemoStore((s) => s.setActiveTab);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const setOnboardingStep = useDemoStore((s) => s.setOnboardingStep);
  const triggerRelayIncoming = useDemoStore((s) => s.triggerRelayIncoming);
  const triggerSilentLeave = useDemoStore((s) => s.triggerSilentLeave);
  const resetDemo = useDemoStore((s) => s.resetDemo);

  return (
    <div className="z-40 border-b border-white/10 bg-[#1F1B18] px-3 py-1.5 text-[11px] text-[#FAF7F2]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-semibold tracking-wide text-amber-200">UX DEMO</span>
          <button
            type="button"
            onClick={() => switchPersona(activePersona === 'julian' ? 'elena' : 'julian')}
            className="ml-1 inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 font-semibold text-white hover:bg-white/20"
          >
            <UserCheck className="h-3 w-3 text-amber-300" />
            {activePersona === 'julian' ? 'Julian (Partner A)' : 'Elena (Partner B)'}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              useDemoStore.setState({ showSplash: false, showInstallPrompt: false });
              setActiveOverlay('feedback-survey');
            }}
            className="inline-flex items-center gap-1 rounded-md bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold text-amber-200 hover:bg-amber-400/30"
          >
            <MessageSquareHeart className="h-3 w-3" /> Feedback
          </button>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium hover:bg-white/20"
          >
            Flows
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-2 grid grid-cols-2 gap-1.5 border-t border-white/10 pt-2 pb-1">
          <button
            type="button"
            onClick={() => {
              setShowSplash(true);
              setOpen(false);
            }}
            className="rounded-lg bg-white/10 px-2 py-1.5 text-left hover:bg-white/20"
          >
            0. Replay Splash Screen
          </button>
          <button
            type="button"
            onClick={() => {
              useDemoStore.setState({ spaceStatus: 'onboarding', onboardingStep: 1, showSplash: false });
              setOpen(false);
            }}
            className="rounded-lg bg-white/10 px-2 py-1.5 text-left hover:bg-white/20"
          >
            1. Creator Onboarding
          </button>
          <button
            type="button"
            onClick={() => {
              switchPersona('elena');
              useDemoStore.setState({ spaceStatus: 'onboarding', onboardingStep: 5, showSplash: false });
              setOpen(false);
            }}
            className="rounded-lg bg-white/10 px-2 py-1.5 text-left hover:bg-white/20"
          >
            2. Partner Gift Unwrap (5A/5B)
          </button>
          <button
            type="button"
            onClick={() => {
              useDemoStore.setState({ spaceStatus: 'active', showSplash: false });
              triggerRelayIncoming();
              setOpen(false);
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-500/20 px-2 py-1.5 text-left text-amber-200 hover:bg-amber-500/30"
          >
            <Radio className="h-3 w-3" />
            3. Simulate Relay Card
          </button>
          <button
            type="button"
            onClick={() => {
              useDemoStore.setState({ spaceStatus: 'active', showSplash: false });
              setActiveOverlay('theme-studio');
              setOpen(false);
            }}
            className="rounded-lg bg-white/10 px-2 py-1.5 text-left hover:bg-white/20"
          >
            4. Theme Studio (9 Themes)
          </button>
          <button
            type="button"
            onClick={() => {
              useDemoStore.setState({ spaceStatus: 'active', showSplash: false });
              setActiveOverlay('year-wrapped');
              setOpen(false);
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1.5 text-left hover:bg-white/20"
          >
            <Calendar className="h-3 w-3" />
            5. 2025 Year Wrapped
          </button>
          <button
            type="button"
            onClick={() => {
              triggerSilentLeave();
              setOpen(false);
            }}
            className="rounded-lg bg-rose-500/20 px-2 py-1.5 text-left text-rose-200 hover:bg-rose-500/30"
          >
            6. Silent Exit (Partner View)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveOverlay('past-vault');
              setOpen(false);
            }}
            className="rounded-lg bg-white/10 px-2 py-1.5 text-left hover:bg-white/20"
          >
            7. Past Vault (PIN: 1234)
          </button>
          <button
            type="button"
            onClick={() => {
              if (spaceStatus !== 'active') {
                useDemoStore.setState({ spaceStatus: 'active', showSplash: false });
              }
              setActiveTab('home');
              setOpen(false);
            }}
            className="rounded-lg bg-white/10 px-2 py-1.5 text-left hover:bg-white/20"
          >
            8. Active Home Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              useDemoStore.setState({ spaceStatus: 'active', showSplash: false, showInstallPrompt: false, showReviewerIntro: true });
              setActiveTab('home');
              setOpen(false);
            }}
            className="rounded-lg bg-white/10 px-2 py-1.5 text-left hover:bg-white/20"
          >
            9. Replay Reviewer Intro Guide
          </button>
          <button
            type="button"
            onClick={() => {
              resetDemo();
              setOnboardingStep(1);
              setOpen(false);
            }}
            className="inline-flex items-center gap-1 rounded-lg bg-white/15 px-2 py-1.5 text-left font-semibold text-white hover:bg-white/25"
          >
            <RotateCcw className="h-3 w-3" />
            Reset All Demo Data
          </button>
        </div>
      )}
    </div>
  );
};
