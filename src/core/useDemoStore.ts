import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ActiveOverlay,
  ArchivedSpace,
  BucketListItem,
  CountdownItem,
  LetterItem,
  MainTab,
  MemoryItem,
  MixtapeSong,
  PersonaId,
  QuizItem,
  SpaceStatus,
  SpaceType,
  SubscriptionTier,
  ThemeId,
  TimeCapsuleItem,
} from './types';
import {
  INITIAL_ARCHIVED_SPACES,
  INITIAL_BUCKET_LIST,
  INITIAL_CAPSULES,
  INITIAL_COUNTDOWNS,
  INITIAL_LETTERS,
  INITIAL_MEMORIES,
  INITIAL_QUIZZES,
  MIXTAPE_SONGS,
  SAMPLE_PHOTOS,
  THEMES,
} from './demoData';

interface ToastState {
  id: number;
  message: string;
  undoMemoryId?: string;
}

interface DemoStore {
  // Navigation & Persona
  showSplash: boolean;
  showInstallPrompt: boolean;
  installPromptDismissed: boolean;
  seenScreenGuides: Record<string, boolean>;
  activeTab: MainTab;
  activeOverlay: ActiveOverlay;
  selectedMemoryId: string | null;
  onboardingStep: 1 | 2 | 3 | 4 | 5;
  activePersona: PersonaId;

  // Space & Subscriptions
  spaceName: string;
  spaceType: SpaceType;
  relationshipStartDate: string;
  spaceStatus: SpaceStatus;
  inviteRevoked: boolean;
  subscriptionTier: SubscriptionTier;
  themesByPersona: Record<PersonaId, ThemeId>;
  atmosphereEnabled: boolean;
  distanceMiles: number;
  lastBackupAt: string;
  pastVaultPin: string;

  // Domain Content
  memories: MemoryItem[];
  letters: LetterItem[];
  countdowns: CountdownItem[];
  quizzes: QuizItem[];
  capsules: TimeCapsuleItem[];
  bucketList: BucketListItem[];
  archivedSpaces: ArchivedSpace[];
  mixtape: MixtapeSong[];
  activeSongId: string | null;
  isPlayingSong: boolean;
  isOtherAudioActive: boolean;
  mixtapeElapsedSec: number;

  // UI Feedback
  toast: ToastState | null;
  milestoneBannerCount: number | null;
  thinkingPulseAt: number | null;

  // Actions
  togglePlaySong: (songId?: string) => void;
  setMixtapeElapsedSec: (sec: number) => void;
  setOtherAudioActive: (active: boolean) => void;
  addMixtapeSong: (title: string, artist: string, dedication: string) => void;
  dismissSplash: () => void;
  setShowSplash: (v: boolean) => void;
  dismissInstallPrompt: () => void;
  openInstallPrompt: () => void;
  dismissScreenGuide: (screenKey: string) => void;
  resetScreenGuides: () => void;
  setActiveTab: (tab: MainTab) => void;
  setActiveOverlay: (overlay: ActiveOverlay) => void;
  openMemoryDetail: (id: string) => void;
  setOnboardingStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  switchPersona: (persona: PersonaId) => void;

  setThemeForActivePersona: (theme: ThemeId) => void;
  toggleAtmosphere: () => void;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  setSpaceDetails: (details: { spaceName?: string; spaceType?: SpaceType; relationshipStartDate?: string }) => void;
  completeOnboardingToHome: () => void;
  toggleInviteRevoked: () => void;

  addMemory: (input: Omit<MemoryItem, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'hiddenForUsers'>) => void;
  addMemoriesBatch: (items: Array<Omit<MemoryItem, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'hiddenForUsers'>>) => void;
  editMemory: (id: string, title: string, body: string) => boolean;
  updateBackNote: (id: string, note: string) => void;
  deleteMemoryForMe: (id: string) => void;
  deleteMemoryForBoth: (id: string) => void;
  undoLastDelete: (id: string) => void;

  addLetter: (title: string, body: string, promptUsed?: string) => void;
  promoteLetterToStory: (letterId: string) => void;

  addCountdown: (title: string, targetDate: string, isMystery: boolean, emoji: string) => void;
  revealMysteryCountdown: (id: string) => void;

  addQuiz: (question: string, correctAnswer: string, wager?: string) => void;
  markQuizScratched: (id: string, promote?: boolean) => void;

  addCapsule: (title: string, message: string, unlockDate: string, isMutual: boolean) => void;
  unsealCapsule: (id: string) => void;

  toggleBucketItem: (id: string) => void;
  addBucketItem: (title: string, category: BucketListItem['category']) => void;
  promoteBucketToMemory: (id: string) => void;

  triggerThinkingPing: () => void;
  toggleReunionDistance: () => void;
  triggerRelayIncoming: () => void;
  ackRelayDownload: (id: string) => void;
  runCloudBackup: () => void;

  triggerSilentLeave: () => void;
  sealSpaceToPastVault: (pin: string) => void;
  deleteCurrentSpaceCleanly: () => void;
  deleteArchivedSpace: (id: string) => void;
  startNewSpaceFlow: () => void;

  showToast: (message: string, undoMemoryId?: string) => void;
  clearToast: () => void;
  dismissMilestone: () => void;
  resetDemo: () => void;
}

const PERSONA_NAMES: Record<PersonaId, string> = {
  julian: 'Julian',
  elena: 'Elena',
};

export const useDemoStore = create<DemoStore>()(
  persist(
    (set, get) => ({
      showSplash: true,
      showInstallPrompt: false,
      installPromptDismissed: false,
      seenScreenGuides: {},
      activeTab: 'home',
      activeOverlay: 'none',
      selectedMemoryId: null,
      onboardingStep: 1,
      activePersona: 'julian',

      spaceName: 'Elena & Julian',
      spaceType: 'couple',
      relationshipStartDate: '2024-06-14',
      spaceStatus: 'active',
      inviteRevoked: false,
      subscriptionTier: 'free',
      themesByPersona: {
        julian: 'classic-paper',
        elena: 'evening-noir',
      },
      atmosphereEnabled: true,
      distanceMiles: 214,
      lastBackupAt: 'Today, 09:14 AM',
      pastVaultPin: '1234',

      memories: INITIAL_MEMORIES,
      letters: INITIAL_LETTERS,
      countdowns: INITIAL_COUNTDOWNS,
      quizzes: INITIAL_QUIZZES,
      capsules: INITIAL_CAPSULES,
      bucketList: INITIAL_BUCKET_LIST,
      archivedSpaces: INITIAL_ARCHIVED_SPACES,
      mixtape: MIXTAPE_SONGS,
      activeSongId: MIXTAPE_SONGS[0]?.id ?? null,
      isPlayingSong: false,
      isOtherAudioActive: false,
      mixtapeElapsedSec: 42,

      toast: null,
      milestoneBannerCount: null,
      thinkingPulseAt: null,

      dismissSplash: () =>
        set({
          showSplash: false,
          showInstallPrompt: false,
        }),
      setShowSplash: (v) =>
        set(
          v
            ? {
                showSplash: true,
                showInstallPrompt: false,
                installPromptDismissed: false,
                seenScreenGuides: {},
              }
            : { showSplash: false }
        ),
      dismissInstallPrompt: () =>
        set({
          showInstallPrompt: false,
          installPromptDismissed: true,
          activeOverlay: 'none',
        }),
      openInstallPrompt: () => set({ showInstallPrompt: true, activeOverlay: 'install-pwa' }),
      dismissScreenGuide: (screenKey) =>
        set((s) => ({
          seenScreenGuides: { ...s.seenScreenGuides, [screenKey]: true },
        })),
      resetScreenGuides: () =>
        set({
          seenScreenGuides: {},
          toast: { id: Date.now(), message: 'Screen guides reset — tap tabs to see them again' },
        }),
      setMixtapeElapsedSec: (sec) => set({ mixtapeElapsedSec: sec }),
      setOtherAudioActive: (active) => set({ isOtherAudioActive: active }),
      setActiveTab: (tab) => set({ activeTab: tab, activeOverlay: 'none' }),
      setActiveOverlay: (overlay) => set({ activeOverlay: overlay }),
      openMemoryDetail: (id) => set({ selectedMemoryId: id, activeOverlay: 'memory-detail' }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      switchPersona: (persona) =>
        set((s) => ({
          activePersona: persona,
          toast: { id: Date.now(), message: `Viewing app as ${PERSONA_NAMES[persona]} (${s.themesByPersona[persona]})` },
        })),

      setThemeForActivePersona: (theme) =>
        set((s) => ({
          themesByPersona: { ...s.themesByPersona, [s.activePersona]: theme },
          toast: { id: Date.now(), message: `Applied theme for ${PERSONA_NAMES[s.activePersona]} only` },
        })),

      toggleAtmosphere: () =>
        set((s) => ({
          atmosphereEnabled: !s.atmosphereEnabled,
          toast: { id: Date.now(), message: !s.atmosphereEnabled ? 'Subtle paper motion enabled' : 'Clean static paper surface active' },
        })),

      setSubscriptionTier: (tier) =>
        set({
          subscriptionTier: tier,
          toast: {
            id: Date.now(),
            message:
              tier === 'couple_plus'
                ? 'Couple Plus unlocked for BOTH Julian & Elena!'
                : tier === 'individual_plus'
                  ? 'Individual Plus unlocked for your account!'
                  : 'Switched to Free Tier',
          },
        }),

      setSpaceDetails: (details) =>
        set((s) => ({
          spaceName: details.spaceName ?? s.spaceName,
          spaceType: details.spaceType ?? s.spaceType,
          relationshipStartDate: details.relationshipStartDate ?? s.relationshipStartDate,
        })),

      completeOnboardingToHome: () =>
        set({
          spaceStatus: 'active',
          activeTab: 'home',
          activeOverlay: 'none',
          onboardingStep: 1,
        }),

      toggleInviteRevoked: () =>
        set((s) => ({
          inviteRevoked: !s.inviteRevoked,
          toast: { id: Date.now(), message: !s.inviteRevoked ? 'Invite link revoked securely' : 'Fresh gift link generated' },
        })),

      addMemory: (input) =>
        set((s) => {
          const newMem: MemoryItem = {
            ...input,
            id: `mem-${Date.now()}`,
            authorId: s.activePersona,
            authorName: PERSONA_NAMES[s.activePersona],
            createdAt: Date.now(),
            hiddenForUsers: [],
          };
          const next = [newMem, ...s.memories];
          const milestone = next.length === 10 || next.length % 10 === 0 ? next.length : null;
          return {
            memories: next,
            activeOverlay: 'none',
            milestoneBannerCount: milestone,
            toast: { id: Date.now(), message: 'Saved locally & synced to relay (10-min edit window active)' },
          };
        }),

      addMemoriesBatch: (items) =>
        set((s) => {
          const created: MemoryItem[] = items.map((item, idx) => ({
            ...item,
            id: `mem-batch-${Date.now()}-${idx}`,
            authorId: s.activePersona,
            authorName: PERSONA_NAMES[s.activePersona],
            createdAt: Date.now(),
            hiddenForUsers: [],
          }));
          return {
            memories: [...created, ...s.memories],
            activeOverlay: 'none',
            activeTab: 'timeline',
            toast: { id: Date.now(), message: `Added ${created.length} EXIF-dated memories (GPS stripped for privacy)` },
          };
        }),

      editMemory: (id, title, body) => {
        const state = get();
        const item = state.memories.find((m) => m.id === id);
        if (!item) return false;
        const within10Min = Date.now() - item.createdAt <= 10 * 60 * 1000;
        if (item.authorId !== state.activePersona || !within10Min) return false;
        set({
          memories: state.memories.map((m) => (m.id === id ? { ...m, title, body, editedAt: Date.now() } : m)),
          toast: { id: Date.now(), message: 'Memory updated inside 10-minute edit window' },
        });
        return true;
      },

      updateBackNote: (id, note) =>
        set((s) => ({
          memories: s.memories.map((m) => (m.id === id ? { ...m, backNote: note } : m)),
          toast: { id: Date.now(), message: 'Saved secret note on back of Polaroid' },
        })),

      deleteMemoryForMe: (id) =>
        set((s) => ({
          memories: s.memories.map((m) =>
            m.id === id ? { ...m, hiddenForUsers: [...new Set([...m.hiddenForUsers, s.activePersona])] } : m
          ),
          activeOverlay: 'none',
          selectedMemoryId: null,
          toast: { id: Date.now(), message: `Hidden from ${PERSONA_NAMES[s.activePersona]}'s timeline only`, undoMemoryId: id },
        })),

      deleteMemoryForBoth: (id) =>
        set((s) => ({
          memories: s.memories.map((m) => (m.id === id ? { ...m, isDeletedForAll: true } : m)),
          activeOverlay: 'none',
          selectedMemoryId: null,
          toast: { id: Date.now(), message: 'Deleted for both partners', undoMemoryId: id },
        })),

      undoLastDelete: (id) =>
        set((s) => ({
          memories: s.memories.map((m) =>
            m.id === id
              ? { ...m, isDeletedForAll: false, hiddenForUsers: m.hiddenForUsers.filter((u) => u !== s.activePersona) }
              : m
          ),
          toast: { id: Date.now(), message: 'Memory restored to timeline' },
        })),

      addLetter: (title, body, promptUsed) =>
        set((s) => ({
          letters: [
            {
              id: `let-${Date.now()}`,
              authorId: s.activePersona,
              authorName: PERSONA_NAMES[s.activePersona],
              title,
              body,
              promptUsed,
              createdAt: Date.now(),
              hiddenForUsers: [],
            },
            ...s.letters,
          ],
          toast: { id: Date.now(), message: 'Letter placed in Shared Journal' },
        })),

      promoteLetterToStory: (letterId) =>
        set((s) => {
          const letter = s.letters.find((l) => l.id === letterId);
          if (!letter || letter.promotedToTimeline) return s;
          const promotedMemory: MemoryItem = {
            id: `mem-let-${Date.now()}`,
            authorId: letter.authorId,
            authorName: letter.authorName,
            type: 'text',
            title: letter.title,
            body: letter.body,
            memoryDate: new Date().toISOString().slice(0, 10),
            createdAt: Date.now(),
            locationLabel: 'Journal Entry',
            hiddenForUsers: [],
          };
          return {
            letters: s.letters.map((l) => (l.id === letterId ? { ...l, promotedToTimeline: true } : l)),
            memories: [promotedMemory, ...s.memories],
            toast: { id: Date.now(), message: 'Letter promoted to Our Story Timeline!' },
          };
        }),

      addCountdown: (title, targetDate, isMystery, emoji) =>
        set((s) => ({
          countdowns: [
            {
              id: `cd-${Date.now()}`,
              authorId: s.activePersona,
              title,
              targetDate,
              isMystery,
              isRevealed: false,
              emoji,
            },
            ...s.countdowns,
          ],
          toast: { id: Date.now(), message: isMystery ? 'Mystery Countdown armed — title hidden from partner!' : 'Countdown added' },
        })),

      revealMysteryCountdown: (id) =>
        set((s) => ({
          countdowns: s.countdowns.map((c) => (c.id === id ? { ...c, isRevealed: true } : c)),
          toast: { id: Date.now(), message: 'Mystery Countdown unwrapped!' },
        })),

      addQuiz: (question, correctAnswer, wager) =>
        set((s) => ({
          quizzes: [
            {
              id: `qz-${Date.now()}`,
              authorId: s.activePersona,
              question,
              correctAnswer,
              wager,
              isScratched: false,
            },
            ...s.quizzes,
          ],
          toast: { id: Date.now(), message: 'Custom quiz sent to partner!' },
        })),

      markQuizScratched: (id, promote) =>
        set((s) => {
          const quiz = s.quizzes.find((q) => q.id === id);
          let nextMemories = s.memories;
          if (promote && quiz && !quiz.promotedToTimeline) {
            nextMemories = [
              {
                id: `mem-qz-${Date.now()}`,
                authorId: s.activePersona,
                authorName: PERSONA_NAMES[s.activePersona],
                type: 'milestone',
                title: `Quiz Memory: ${quiz.question}`,
                body: `Answer revealed: ${quiz.correctAnswer}${quiz.wager ? ` • Wager: ${quiz.wager}` : ''}`,
                memoryDate: new Date().toISOString().slice(0, 10),
                createdAt: Date.now(),
                hiddenForUsers: [],
              },
              ...s.memories,
            ];
          }
          return {
            quizzes: s.quizzes.map((q) => (q.id === id ? { ...q, isScratched: true, promotedToTimeline: promote ?? q.promotedToTimeline } : q)),
            memories: nextMemories,
            toast: promote ? { id: Date.now(), message: 'Quiz moment saved to Our Story Timeline!' } : s.toast,
          };
        }),

      addCapsule: (title, message, unlockDate, isMutual) =>
        set((s) => ({
          capsules: [
            {
              id: `cap-${Date.now()}`,
              authorId: s.activePersona,
              title,
              message,
              unlockDate,
              isUnlocked: false,
              isMutual,
            },
            ...s.capsules,
          ],
          toast: { id: Date.now(), message: `Time Capsule wax-sealed until ${unlockDate}` },
        })),

      unsealCapsule: (id) =>
        set((s) => ({
          capsules: s.capsules.map((c) => (c.id === id ? { ...c, hasOpened: true, isUnlocked: true } : c)),
          toast: { id: Date.now(), message: 'Time Capsule unsealed!' },
        })),

      toggleBucketItem: (id) =>
        set((s) => ({
          bucketList: s.bucketList.map((b) =>
            b.id === id
              ? { ...b, completed: !b.completed, completedDate: !b.completed ? new Date().toISOString().slice(0, 10) : undefined }
              : b
          ),
        })),

      addBucketItem: (title, category) =>
        set((s) => ({
          bucketList: [{ id: `bl-${Date.now()}`, title, category, completed: false }, ...s.bucketList],
          toast: { id: Date.now(), message: 'Added to Shared Bucket List' },
        })),

      promoteBucketToMemory: (id) =>
        set((s) => {
          const item = s.bucketList.find((b) => b.id === id);
          if (!item) return s;
          return {
            bucketList: s.bucketList.map((b) => (b.id === id ? { ...b, promotedToMemory: true } : b)),
            memories: [
              {
                id: `mem-bl-${Date.now()}`,
                authorId: s.activePersona,
                authorName: PERSONA_NAMES[s.activePersona],
                type: 'milestone',
                title: `Bucket List Completed: ${item.title}`,
                body: `Checked off together in ${item.category}!`,
                memoryDate: new Date().toISOString().slice(0, 10),
                createdAt: Date.now(),
                hiddenForUsers: [],
              },
              ...s.memories,
            ],
            toast: { id: Date.now(), message: 'Bucket List goal added to Timeline!' },
          };
        }),

      triggerThinkingPing: () =>
        set((s) => {
          const activeTheme = s.themesByPersona[s.activePersona] ?? 'classic-paper';
          const themeMeta = THEMES.find((t) => t.id === activeTheme) ?? THEMES[0];
          return {
            thinkingPulseAt: Date.now(),
            toast: { id: Date.now(), message: themeMeta.pulseToast },
          };
        }),

      togglePlaySong: (songId) =>
        set((s) => {
          const targetId = songId ?? s.activeSongId ?? s.mixtape[0]?.id ?? null;
          if (!targetId) return s;
          if (songId && songId !== s.activeSongId) {
            return { activeSongId: songId, isPlayingSong: true };
          }
          return { activeSongId: targetId, isPlayingSong: !s.isPlayingSong };
        }),

      addMixtapeSong: (title, artist, dedication) =>
        set((s) => {
          const newSong: MixtapeSong = {
            id: `song-${Date.now()}`,
            title: title.trim() || 'Untitled Track',
            artist: artist.trim() || 'Shared Record',
            duration: '03:42',
            coverGradient: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            dedication: dedication.trim() || undefined,
          };
          return {
            mixtape: [newSong, ...s.mixtape],
            activeSongId: newSong.id,
            isPlayingSong: true,
            toast: { id: Date.now(), message: `Added "${newSong.title}" to Our Mixtape` },
          };
        }),

      toggleReunionDistance: () =>
        set((s) => {
          const nextDist = s.distanceMiles === 0 ? 214 : 0;
          return {
            distanceMiles: nextDist,
            toast: {
              id: Date.now(),
              message: nextDist === 0 ? '0 miles apart — Reunited!' : 'Long-distance stamp active (214 miles apart)',
            },
          };
        }),

      triggerRelayIncoming: () =>
        set((s) => {
          const sender: PersonaId = s.activePersona === 'julian' ? 'elena' : 'julian';
          const incoming: MemoryItem = {
            id: `mem-relay-${Date.now()}`,
            authorId: sender,
            authorName: PERSONA_NAMES[sender],
            type: 'photo',
            title: 'Fresh Polaroid from Transit Relay',
            body: 'Encrypted memory payload downloaded directly to your phone. Server relay copy purged on ACK!',
            memoryDate: new Date().toISOString().slice(0, 10),
            createdAt: Date.now(),
            photoUrl: SAMPLE_PHOTOS[5].url,
            backNote: 'Found this autumn postcard tucked inside my coat.',
            locationLabel: 'Kyoto, Japan',
            weatherStamp: 'Amber Breeze 16°C',
            distanceLabel: '0 miles apart',
            isRelayIncoming: true,
            hiddenForUsers: [],
          };
          return {
            memories: [incoming, ...s.memories],
            activeTab: 'timeline',
            activeOverlay: 'none',
            toast: { id: Date.now(), message: 'Incoming encrypted memory arriving in Timeline...' },
          };
        }),

      ackRelayDownload: (id) =>
        set((s) => ({
          memories: s.memories.map((m) => (m.id === id ? { ...m, isRelayIncoming: false } : m)),
          toast: { id: Date.now(), message: 'Downloaded locally • Server relay purged (ACK sent)' },
        })),

      runCloudBackup: () =>
        set({
          lastBackupAt: `Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
          toast: { id: Date.now(), message: 'Encrypted Cloud Vault snapshot synced to R2!' },
        }),

      triggerSilentLeave: () =>
        set((s) => ({
          spaceStatus: 'partner_left',
          activePersona: s.activePersona === 'julian' ? 'elena' : 'julian',
          activeOverlay: 'none',
          activeTab: 'home',
          toast: {
            id: Date.now(),
            message: 'Zero push notification sent. Showing quiet disconnected state.',
          },
        })),

      sealSpaceToPastVault: (pin) =>
        set((s) => {
          const visibleCount = s.memories.filter((m) => !m.isDeletedForAll).length;
          const sealed: ArchivedSpace = {
            id: `arch-${Date.now()}`,
            title: s.spaceName,
            dateRange: `${s.relationshipStartDate.slice(0, 4)} – 2026`,
            memoryCount: visibleCount,
            coverQuote: 'Sealed respectfully inside your private Past Vault.',
            highlights: s.memories.slice(0, 3).map((m) => ({
              title: m.title,
              date: m.memoryDate,
              note: m.body,
            })),
          };
          return {
            archivedSpaces: [sealed, ...s.archivedSpaces],
            pastVaultPin: pin || '1234',
            spaceStatus: 'fresh_page',
            activeOverlay: 'none',
            toast: { id: Date.now(), message: 'Chapter wax-sealed inside Past Vault behind PIN' },
          };
        }),

      deleteCurrentSpaceCleanly: () =>
        set({
          spaceStatus: 'fresh_page',
          memories: [],
          letters: [],
          activeOverlay: 'none',
          toast: { id: Date.now(), message: 'Space removed. Personal account & themes preserved.' },
        }),

      deleteArchivedSpace: (id) =>
        set((s) => ({
          archivedSpaces: s.archivedSpaces.filter((a) => a.id !== id),
          toast: { id: Date.now(), message: 'Archived volume permanently purged' },
        })),

      startNewSpaceFlow: () =>
        set({
          spaceStatus: 'onboarding',
          onboardingStep: 2,
          spaceName: 'New Chapter',
          activeOverlay: 'none',
          memories: [],
          letters: [],
          toast: { id: Date.now(), message: 'Starting fresh — keeping your existing account & Plus perks!' },
        }),

      showToast: (message, undoMemoryId) => set({ toast: { id: Date.now(), message, undoMemoryId } }),
      clearToast: () => set({ toast: null }),
      dismissMilestone: () => set({ milestoneBannerCount: null }),

      resetDemo: () =>
        set({
          showSplash: false,
          showInstallPrompt: false,
          installPromptDismissed: false,
          seenScreenGuides: {},
          activeTab: 'home',
          activeOverlay: 'none',
          selectedMemoryId: null,
          onboardingStep: 1,
          activePersona: 'julian',
          spaceName: 'Elena & Julian',
          spaceType: 'couple',
          relationshipStartDate: '2024-06-14',
          spaceStatus: 'active',
          inviteRevoked: false,
          subscriptionTier: 'free',
          themesByPersona: { julian: 'classic-paper', elena: 'evening-noir' },
          atmosphereEnabled: true,
          distanceMiles: 214,
          lastBackupAt: 'Today, 09:14 AM',
          pastVaultPin: '1234',
          memories: INITIAL_MEMORIES,
          letters: INITIAL_LETTERS,
          countdowns: INITIAL_COUNTDOWNS,
          quizzes: INITIAL_QUIZZES,
          capsules: INITIAL_CAPSULES,
          bucketList: INITIAL_BUCKET_LIST,
          archivedSpaces: INITIAL_ARCHIVED_SPACES,
          mixtape: MIXTAPE_SONGS,
          activeSongId: MIXTAPE_SONGS[0]?.id ?? null,
          isPlayingSong: false,
          isOtherAudioActive: false,
          mixtapeElapsedSec: 42,
          toast: { id: Date.now(), message: 'Demo reset to fresh Elena & Julian story!' },
          milestoneBannerCount: null,
          thinkingPulseAt: null,
        }),
    }),
    {
      name: 'keepsake-demo-v6',
    }
  )
);
