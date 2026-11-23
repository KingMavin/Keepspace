import React, { useEffect } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { BottomNav } from './components/layout/BottomNav';
import { InstallPwaModal } from './components/layout/InstallPwaModal';
import { MobileFrame } from './components/layout/MobileFrame';
import { ReviewerIntroModal } from './components/layout/ReviewerIntroModal';
import { assetPreloader } from './core/assetPreloader';
import { SAMPLE_PHOTOS } from './core/demoData';
import { mixtapeAudio } from './core/mixtapeAudio';
import { useDemoStore } from './core/useDemoStore';
import { AudioScrapbookDrawer } from './screens/AudioScrapbookDrawer';
import { BookStudioScreen } from './screens/BookStudioScreen';
import { CreateMemorySheet } from './screens/CreateMemorySheet';
import { DoodleWidgetDrawer } from './screens/DoodleWidgetDrawer';
import { FeedbackSurveySheet } from './screens/FeedbackSurveySheet';
import { HomeScreen } from './screens/HomeScreen';
import { MemoryDetailModal } from './screens/MemoryDetailModal';
import { OnboardingFlow } from './screens/OnboardingFlow';
import { PaywallSheet } from './screens/PaywallSheet';
import { PlayAndLettersScreen } from './screens/PlayAndLettersScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { SplashScreen } from './screens/SplashScreen';
import { StorageAndBackupScreen } from './screens/StorageAndBackupScreen';
import { ThemeStudioScreen } from './screens/ThemeStudioScreen';
import { TimelineScreen } from './screens/TimelineScreen';
import { TurnThePageFlow } from './screens/TurnThePageFlow';
import { YearWrappedOverlay } from './screens/YearWrappedOverlay';

export function App() {
  const showSplash = useDemoStore((s) => s.showSplash);
  const showInstallPrompt = useDemoStore((s) => s.showInstallPrompt);
  const showReviewerIntro = useDemoStore((s) => s.showReviewerIntro);
  const spaceStatus = useDemoStore((s) => s.spaceStatus);
  const activeTab = useDemoStore((s) => s.activeTab);
  const activeOverlay = useDemoStore((s) => s.activeOverlay);
  const milestoneBannerCount = useDemoStore((s) => s.milestoneBannerCount);
  const dismissMilestone = useDemoStore((s) => s.dismissMilestone);
  const openMemoryDetail = useDemoStore((s) => s.openMemoryDetail);
  const memories = useDemoStore((s) => s.memories);
  const activeSongId = useDemoStore((s) => s.activeSongId);
  const isPlayingSong = useDemoStore((s) => s.isPlayingSong);
  const isOtherAudioActive = useDemoStore((s) => s.isOtherAudioActive);

  // Persistent app-wide Mixtape audio playback (ducks cleanly when voice notes or Wrapped audio play)
  useEffect(() => {
    const shouldPlay = isPlayingSong && !isOtherAudioActive && !showSplash;
    mixtapeAudio.sync(activeSongId, shouldPlay);
    if (!shouldPlay) return;

    const id = window.setInterval(() => {
      const { mixtapeElapsedSec, setMixtapeElapsedSec } = useDemoStore.getState();
      setMixtapeElapsedSec(mixtapeElapsedSec + 1 >= 252 ? 0 : mixtapeElapsedSec + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [activeSongId, isPlayingSong, isOtherAudioActive, showSplash]);

  useEffect(() => () => mixtapeAudio.stop(), []);

  // Tier 2: Prioritize assets for the active screen whenever navigation changes
  useEffect(() => {
    if (showSplash) return;
    if (activeOverlay === 'year-wrapped' || activeOverlay === 'book-studio') {
      assetPreloader.prioritizeScreen(activeOverlay, SAMPLE_PHOTOS.map((p) => p.url));
    } else if (activeTab === 'timeline') {
      assetPreloader.prioritizeScreen(
        'timeline',
        memories.map((m) => m.photoUrl)
      );
    } else if (activeTab === 'home') {
      assetPreloader.prioritizeScreen('home', [
        memories[0]?.photoUrl,
        memories.find((m) => m.isOnThisDay)?.photoUrl,
      ]);
    }
  }, [activeTab, activeOverlay, showSplash, memories]);

  return (
    <MotionConfig reducedMotion="user">
      <MobileFrame>
        {showSplash ? (
          <SplashScreen />
        ) : spaceStatus === 'onboarding' ? (
          <OnboardingFlow />
        ) : spaceStatus === 'fresh_page' && activeOverlay !== 'past-vault' ? (
          <TurnThePageFlow initialView="turn-the-page" />
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
                className="flex flex-1 flex-col overflow-hidden"
              >
                {activeTab === 'home' && <HomeScreen />}
                {activeTab === 'timeline' && <TimelineScreen />}
                {activeTab === 'play' && <PlayAndLettersScreen />}
                {activeTab === 'settings' && <SettingsScreen />}
              </motion.div>
            </AnimatePresence>
            <BottomNav />
          </>
        )}

        {/* Post-Splash PWA Add to Home Screen & Reviewer Intro Tour */}
        <AnimatePresence>
          {(showInstallPrompt || activeOverlay === 'install-pwa') && <InstallPwaModal key="install-pwa" />}
          {showReviewerIntro && <ReviewerIntroModal key="reviewer-intro" />}
        </AnimatePresence>

        {/* Overlays & Modals */}
        <AnimatePresence>
          {activeOverlay === 'create-memory' && <CreateMemorySheet key="create-memory" initialMode="single" />}
          {activeOverlay === 'batch-backfill' && <CreateMemorySheet key="batch-backfill" initialMode="batch" />}
          {activeOverlay === 'memory-detail' && <MemoryDetailModal key="memory-detail" />}
          {activeOverlay === 'theme-studio' && <ThemeStudioScreen key="theme-studio" />}
          {activeOverlay === 'storage-backup' && <StorageAndBackupScreen key="storage-backup" />}
          {activeOverlay === 'paywall' && <PaywallSheet key="paywall" />}
          {activeOverlay === 'turn-the-page' && <TurnThePageFlow key="turn-the-page" initialView="turn-the-page" />}
          {activeOverlay === 'past-vault' && <TurnThePageFlow key="past-vault" initialView="past-vault" />}
          {activeOverlay === 'year-wrapped' && <YearWrappedOverlay key="year-wrapped" />}
          {activeOverlay === 'audio-scrapbook' && <AudioScrapbookDrawer key="audio-scrapbook" />}
          {activeOverlay === 'book-studio' && <BookStudioScreen key="book-studio" />}
          {activeOverlay === 'doodle-widget' && <DoodleWidgetDrawer key="doodle-widget" />}
          {activeOverlay === 'feedback-survey' && <FeedbackSurveySheet key="feedback-survey" />}
        </AnimatePresence>

        {/* Milestone Celebration Modal */}
        <AnimatePresence>
          {milestoneBannerCount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.75 }}
                animate={{ scale: 1 }}
                className="keepsake-card w-full space-y-3 rounded-3xl p-6 text-center"
              >
                <p className="text-3xl">&#10022;</p>
                <h3 className="keepsake-heading text-2xl">{milestoneBannerCount} Memories Saved!</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Your archive just reached {milestoneBannerCount} moments together.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const first = memories[memories.length - 1];
                    dismissMilestone();
                    if (first) openMemoryDetail(first.id);
                  }}
                  className="w-full rounded-2xl bg-[var(--accent-primary)] py-3 text-xs font-semibold text-[var(--accent-contrast)]"
                >
                  Revisit Our First Memory
                </button>
                <button type="button" onClick={dismissMilestone} className="w-full py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                  Continue
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </MobileFrame>
    </MotionConfig>
  );
}

export default App;
