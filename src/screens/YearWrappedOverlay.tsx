import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookmarkPlus,
  CheckCircle2,
  Coffee,
  Disc3,
  Flame,
  HelpCircle,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { SAMPLE_PHOTOS } from '../core/demoData';
import { haptics } from '../core/haptics';
import { useDemoStore } from '../core/useDemoStore';

function playWrappedTone(freq: number, dur = 0.7, vol = 0.08, type: OscillatorType = 'sine', enabled = true) {
  if (!enabled) return;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume().catch(() => undefined);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.05);
    setTimeout(() => {
      try {
        ctx.close();
      } catch {
        // ignore
      }
    }, (dur + 0.1) * 1000);
  } catch {
    // ignore audio block
  }
}

const CountUp: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);

  return (
    <>
      {val.toLocaleString()}
      {suffix}
    </>
  );
};

const LITTLE_THINGS_TABS = [
  {
    label: 'Rainy Soho Booth',
    note: 'You claimed the fogged window corner booth, ordered two espressos, and somehow rescued the morning before work even began.',
    photo: SAMPLE_PHOTOS[1].url,
    date: 'Nov 08',
  },
  {
    label: 'Montmartre Steps',
    note: 'We missed the 6:15 train completely on purpose just to watch every zinc rooftop turn bright copper.',
    photo: SAMPLE_PHOTOS[0].url,
    date: 'Oct 18',
  },
  {
    label: 'Platform 4 Goodnight',
    note: 'A 44-second voice note recorded in the middle of station announcements just so distance felt half an inch smaller.',
    photo: SAMPLE_PHOTOS[4].url,
    date: 'Sep 12',
  },
];

const ORBIT_NODES = [
  { text: 'Missed the 6:15 train on purpose', x: 24, y: 18 },
  { text: 'Who stole half the almond croissant', x: 78, y: 26 },
  { text: '2 AM voice notes from Platform 4', x: 18, y: 62 },
  { text: 'Lukewarm tea on Highway 1 cliffs', x: 82, y: 68 },
  { text: 'Our next chapter: Kyoto in autumn', x: 50, y: 90 },
];

const TRIVIA_OPTIONS = [
  { id: 'a', label: 'A', text: 'Elena spilled her iced oat latte on the table' },
  { id: 'b', label: 'B', text: "Elena stole half of Julian's almond croissant" },
  { id: 'c', label: 'C', text: 'We switched booths three times to dodge rain' },
];

export const YearWrappedOverlay: React.FC = () => {
  const spaceName = useDemoStore((s) => s.spaceName);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const addMemory = useDemoStore((s) => s.addMemory);
  const showToast = useDemoStore((s) => s.showToast);
  const setOtherAudioActive = useDemoStore((s) => s.setOtherAudioActive);

  const [chapter, setChapter] = useState(0);
  const [soundOn, setSoundOn] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setOtherAudioActive(soundOn);
    return () => setOtherAudioActive(false);
  }, [soundOn, setOtherAudioActive]);

  // Chapter 1 (Stats) staggered entrance
  const [statsRevealed, setStatsRevealed] = useState(0);

  // Chapter 2 (Little Things) active tab
  const [littleTab, setLittleTab] = useState(0);

  // Chapter 3 (Orbit Constellation) lit node index
  const [litNode, setLitNode] = useState(-1);

  // Chapter 4 (Attention Trivia) selected option
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Chapter 6 (Hold-to-Seal Wish) progress
  const [holdProgress, setHoldProgress] = useState(0);
  const [wishSealed, setWishSealed] = useState(false);
  const rafRef = useRef(0);
  const holdStartRef = useRef(0);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

    if (chapter === 0) {
      playWrappedTone(659.25, 0.9, 0.06, 'sine', soundOn);
    }

    if (chapter === 1) {
      setStatsRevealed(0);
      const timers = [0, 1, 2, 3].map((i) =>
        setTimeout(() => {
          setStatsRevealed(i + 1);
          playWrappedTone(330 + i * 75, 0.14, 0.04, 'triangle', soundOn);
        }, 280 + i * 260)
      );
      return () => timers.forEach(clearTimeout);
    }

    if (chapter === 3) {
      setLitNode(-1);
      const timers = ORBIT_NODES.map((_, i) =>
        setTimeout(() => {
          setLitNode(i);
          playWrappedTone([523.25, 587.33, 659.25, 783.99, 880][i], 0.45, 0.05, 'sine', soundOn);
        }, 420 + i * 480)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [chapter, soundOn]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const next = () => {
    haptics.light();
    setChapter((c) => Math.min(6, c + 1));
  };

  const finishWish = () => {
    cancelAnimationFrame(rafRef.current);
    setHoldProgress(1);
    setWishSealed(true);
    haptics.success();
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) =>
      setTimeout(() => playWrappedTone(f, 1.1, 0.06, 'sine', soundOn), idx * 120)
    );
  };

  const startHold = () => {
    if (wishSealed) return;
    holdStartRef.current = performance.now();
    playWrappedTone(261.63, 2.2, 0.05, 'triangle', soundOn);
    const step = (t: number) => {
      const p = Math.min(1, (t - holdStartRef.current) / 2100);
      setHoldProgress(p);
      if (p >= 1) finishWish();
      else rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const cancelHold = () => {
    if (wishSealed) return;
    cancelAnimationFrame(rafRef.current);
    setHoldProgress(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="no-scrollbar absolute inset-0 z-50 flex flex-col overflow-y-auto bg-[#13100E] text-[#FAF6EE]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 50% 18%, rgba(224, 122, 95, 0.22), transparent 55%), radial-gradient(circle at 80% 80%, rgba(242, 204, 143, 0.12), transparent 50%)',
      }}
      ref={containerRef}
    >
      {/* Fixed 7-Segment Story Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-[#13100E]/88 px-4 pt-3.5 pb-3 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveOverlay('none')}
          aria-label="Exit Yearly Wrapped"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#FAF6EE] hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-1 gap-1.5" aria-label={`Chapter ${chapter + 1} of 7`}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <span
              key={i}
              className="h-1 flex-1 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: i <= chapter ? '#F2CC8F' : 'rgba(250, 246, 238, 0.2)',
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSoundOn((s) => !s)}
          aria-label={soundOn ? 'Mute sounds' : 'Enable sounds'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#F2CC8F] hover:bg-white/20"
        >
          {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </header>

      {/* CHAPTER 0 — OPENING */}
      {chapter === 0 && (
        <motion.section
          key="wrap-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex flex-1 flex-col items-center justify-center px-6 py-8 text-center"
        >
          {/* Floating warm stars */}
          {[
            { x: 14, y: 18, s: 3 },
            { x: 84, y: 22, s: 4 },
            { x: 22, y: 68, s: 3 },
            { x: 80, y: 74, s: 3.5 },
            { x: 52, y: 12, s: 2.5 },
          ].map((dot, idx) => (
            <motion.span
              key={idx}
              animate={{ opacity: [0.3, 0.9, 0.3], y: [0, -6, 0] }}
              transition={{ duration: 3 + idx * 0.5, repeat: Infinity }}
              className="pointer-events-none absolute rounded-full bg-[#F2CC8F]"
              style={{ left: `${dot.x}%`, top: `${dot.y}%`, width: dot.s, height: dot.s }}
            />
          ))}

          <p className="text-[10px] font-bold tracking-[0.26em] uppercase text-[#F2CC8F]">
            A Very Personal Edition
          </p>

          <h2 className="font-display mt-5 text-4xl font-bold leading-none tracking-tight text-[#FAF6EE]">
            {spaceName}
            <br />
            <span className="relative mt-2 inline-block">
              <span className="absolute -inset-x-2 bottom-1 h-3 rounded-sm bg-[#E07A5F]/85" />
              <span className="relative z-10">2025 Wrapped</span>
            </span>
          </h2>

          <p className="mt-5 max-w-[260px] text-sm leading-relaxed text-[#FAF6EE]/80">
            365 days of ordinary magic. Every mile bridged, voice note kept, and slow Sunday morning.
          </p>

          <button
            type="button"
            onClick={next}
            className="mt-9 rounded-full bg-[#F2CC8F] px-8 py-3.5 text-sm font-bold text-[#13100E] shadow-lg transition hover:brightness-105"
          >
            Let&rsquo;s open it
          </button>
        </motion.section>
      )}

      {/* CHAPTER 1 — BENTO STATS */}
      {chapter === 1 && (
        <motion.section
          key="wrap-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col justify-between px-4 pt-2 pb-8"
        >
          <div className="space-y-3">
            <h2 className="font-display text-3xl font-bold uppercase leading-[0.95] text-[#FAF6EE]">
              First, the <span className="text-[#F2CC8F]">numbers</span> behind us.
            </h2>

            {/* Card 1: Champagne Gold */}
            <motion.div
              animate={{ opacity: statsRevealed >= 1 ? 1 : 0, y: statsRevealed >= 1 ? 0 : 12 }}
              className="relative rounded-3xl bg-[#F2CC8F] p-5 text-[#13100E]"
            >
              <p className="text-[10px] font-bold tracking-[0.22em] uppercase opacity-75">
                Memories &amp; Polaroids Saved
              </p>
              <p className="font-display mt-1 text-5xl font-bold leading-none">
                {statsRevealed >= 1 && <CountUp to={184} />}
              </p>
              <p className="mt-1.5 text-xs font-semibold">
                884 Days Together (21,216 Hours of shared story)
              </p>
              <span className="absolute top-3.5 right-3.5 rotate-6 rounded-md border border-[#13100E]/50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                Verified Archive
              </span>
            </motion.div>

            {/* Row: Card 2 (Coral) & Card 3 (Sage) */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                animate={{ opacity: statsRevealed >= 2 ? 1 : 0, y: statsRevealed >= 2 ? 0 : 12 }}
                className="relative flex min-h-[142px] flex-col justify-between rounded-3xl bg-[#E07A5F] p-4 text-[#13100E]"
              >
                <div>
                  <p className="font-display text-3xl font-bold leading-none">
                    {statsRevealed >= 2 && <CountUp to={3410} suffix=" mi" />}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold leading-snug">
                    Farthest apart &rarr; 0 mi reunited in Paris &amp; London.
                  </p>
                </div>
                <span className="self-start rounded-md border border-[#13100E]/45 px-2 py-0.5 text-[9px] font-bold uppercase">
                  Top 1% Travelers
                </span>
              </motion.div>

              <motion.div
                animate={{ opacity: statsRevealed >= 3 ? 1 : 0, y: statsRevealed >= 3 ? 0 : 12 }}
                className="flex min-h-[142px] flex-col justify-between rounded-3xl bg-[#81B29A] p-4 text-[#13100E]"
              >
                <Coffee className="h-5 w-5" />
                <div>
                  <p className="font-display text-3xl font-bold leading-none">
                    {statsRevealed >= 3 && <CountUp to={47} />}
                  </p>
                  <p className="mt-1 text-xs font-semibold leading-snug">
                    Voice notes &amp; 112 bakery mornings shared.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Card 4: Dashed Mixtape Anthem */}
            <motion.div
              animate={{ opacity: statsRevealed >= 4 ? 1 : 0, y: statsRevealed >= 4 ? 0 : 12 }}
              className="flex items-center justify-between gap-3 rounded-3xl border border-dashed border-[#F2CC8F]/50 bg-white/5 p-4"
            >
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#F2CC8F]">
                  Most Replayed Anthem
                </p>
                <p className="font-display mt-1 text-lg font-semibold text-[#FAF6EE]">
                  Texas Sun &mdash; Played 38 Times
                </p>
                <p className="text-xs text-[#FAF6EE]/70">Zero streaks required &bull; Pure memories</p>
              </div>
              <Disc3 className="h-8 w-8 shrink-0 text-[#E07A5F]" />
            </motion.div>
          </div>

          <button
            type="button"
            onClick={next}
            className="mt-5 w-full rounded-full bg-[#F2CC8F] py-3.5 text-xs font-bold uppercase tracking-widest text-[#13100E]"
          >
            Continue
          </button>
        </motion.section>
      )}

      {/* CHAPTER 2 — IT'S THE LITTLE THINGS */}
      {chapter === 2 && (
        <motion.section
          key="wrap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col justify-between px-4 pt-2 pb-8"
        >
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[0.95]">
              It&rsquo;s the little things, <span className="text-[#E5989B]">actually.</span>
            </h2>

            {/* Interactive Tab Switcher */}
            <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto pb-1">
              {LITTLE_THINGS_TABS.map((t, idx) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => {
                    playWrappedTone([523, 659, 784][idx], 0.5, 0.05, 'triangle', soundOn);
                    setLittleTab(idx);
                  }}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    littleTab === idx
                      ? 'bg-[#E5989B] text-[#13100E]'
                      : 'border border-white/20 bg-white/5 text-[#FAF6EE]/80'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Featured Polaroid Swap */}
            <motion.div
              key={littleTab}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 rounded-2xl bg-[#FAF6EE] p-3 pb-4 text-[#2B2118] shadow-xl"
            >
              <img
                src={LITTLE_THINGS_TABS[littleTab].photo}
                alt={LITTLE_THINGS_TABS[littleTab].label}
                className="h-44 w-full rounded-xl object-cover"
              />
              <div className="mt-2.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#C05A3F]">
                <span>{LITTLE_THINGS_TABS[littleTab].label}</span>
                <span>{LITTLE_THINGS_TABS[littleTab].date}</span>
              </div>
              <p className="font-hand mt-1 text-lg leading-snug text-[#2B2118]">
                {LITTLE_THINGS_TABS[littleTab].note}
              </p>
            </motion.div>

            {/* 3 Mini Memory Book Cards */}
            <p className="mt-5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#FAF6EE]/60">
              Memory Book Highlights
            </p>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {[
                { src: SAMPLE_PHOTOS[2].url, caption: 'Big Sur Fog', rot: '-2.5deg' },
                { src: SAMPLE_PHOTOS[3].url, caption: 'Desert Stars', rot: '2deg' },
                { src: SAMPLE_PHOTOS[5].url, caption: 'Kyoto Maple', rot: '-1.5deg' },
              ].map((card) => (
                <div
                  key={card.caption}
                  style={{ transform: `rotate(${card.rot})` }}
                  className="rounded-xl bg-[#FAF6EE] p-1.5 pb-2 text-center text-[#2B2118] shadow-md"
                >
                  <img src={card.src} alt={card.caption} className="h-16 w-full rounded-lg object-cover" />
                  <p className="font-hand mt-1 text-sm leading-none">{card.caption}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={next}
            className="mt-6 w-full rounded-full bg-[#F2CC8F] py-3.5 text-xs font-bold uppercase tracking-widest text-[#13100E]"
          >
            Continue
          </button>
        </motion.section>
      )}

      {/* CHAPTER 3 — OUR WORLD CONSTELLATION */}
      {chapter === 3 && (
        <motion.section
          key="wrap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col justify-between px-4 pt-2 pb-8"
        >
          <h2 className="font-display text-3xl font-bold uppercase leading-[0.95]">
            Everything always orbits back to <span className="text-[#81B29A]">us.</span>
          </h2>

          <div className="relative mx-auto my-4 h-72 w-full max-w-[340px]">
            <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
              <ellipse
                cx="50"
                cy="52"
                rx="38"
                ry="30"
                fill="none"
                stroke="rgba(242, 204, 143, 0.2)"
                strokeWidth="0.5"
              />
              {ORBIT_NODES.map((n, k) => (
                <g key={k} style={{ opacity: litNode >= k ? 1 : 0.15, transition: 'opacity 0.5s' }}>
                  <line x1="50" y1="52" x2={n.x} y2={n.y} stroke="#E07A5F" strokeWidth="0.6" />
                  <circle cx={n.x} cy={n.y} r="1.8" fill="#F2CC8F" />
                </g>
              ))}
              <circle cx="50" cy="52" r="7" fill="rgba(224, 122, 95, 0.28)" />
              <circle cx="50" cy="52" r="2.6" fill="#FAF6EE" />
            </svg>

            {ORBIT_NODES.map((n, k) => (
              <span
                key={k}
                style={{
                  left: `${n.x}%`,
                  top: `${n.y}%`,
                  opacity: litNode >= k ? 1 : 0,
                  transform: `translateX(-50%) ${n.y < 50 ? 'translateY(-120%)' : 'translateY(10px)'}`,
                }}
                className="pointer-events-none absolute max-w-[115px] text-center text-[9px] font-bold uppercase tracking-wider text-[#FAF6EE] transition-opacity duration-500"
              >
                {n.text}
              </span>
            ))}

            <span
              className="font-hand pointer-events-none absolute top-[55%] left-1/2 -translate-x-1/2 text-2xl text-[#F2CC8F]"
            >
              us
            </span>
          </div>

          <button
            type="button"
            onClick={next}
            className="w-full rounded-full bg-[#F2CC8F] py-3.5 text-xs font-bold uppercase tracking-widest text-[#13100E]"
          >
            Continue
          </button>
        </motion.section>
      )}

      {/* CHAPTER 4 — ATTENTION CHECK TRIVIA (JUST ONE QUESTION) */}
      {chapter === 4 && (
        <motion.section
          key="wrap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col justify-between px-4 pt-2 pb-8"
        >
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E07A5F]/20 px-3 py-1 text-[10px] font-bold tracking-[0.18em] uppercase text-[#E07A5F]">
              <HelpCircle className="h-3.5 w-3.5" /> Attention Check
            </span>

            <h2 className="font-display text-3xl font-bold leading-tight text-[#FAF6EE]">
              Let&rsquo;s see who actually pays attention.
            </h2>

            <div className="rounded-3xl border border-white/15 bg-white/5 p-5">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#F2CC8F]">
                Question 1 of 1
              </p>
              <p className="font-display mt-2 text-lg leading-snug text-[#FAF6EE]">
                On our rainy morning in Soho, what happened while Julian stepped away to grab napkins?
              </p>

              <div className="mt-4 space-y-2.5">
                {TRIVIA_OPTIONS.map((opt) => {
                  const chosen = selectedAnswer === opt.id;
                  const isCorrect = opt.id === 'b';
                  const revealed = selectedAnswer !== null;

                  let cardStyle = 'border-white/15 bg-white/5 text-[#FAF6EE]';
                  if (revealed && isCorrect) {
                    cardStyle = 'border-[#81B29A] bg-[#81B29A]/25 text-[#FAF6EE]';
                  } else if (chosen && !isCorrect) {
                    cardStyle = 'border-[#E07A5F] bg-[#E07A5F]/25 text-[#FAF6EE]';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={revealed}
                      onClick={() => {
                        setSelectedAnswer(opt.id);
                        if (opt.id === 'b') {
                          haptics.success();
                          playWrappedTone(880, 0.5, 0.08, 'sine', soundOn);
                        } else {
                          haptics.warning();
                          playWrappedTone(220, 0.35, 0.06, 'sawtooth', soundOn);
                        }
                      }}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left text-xs font-medium transition ${cardStyle}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold">
                        {opt.label}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                      {revealed && isCorrect && <CheckCircle2 className="h-4 w-4 shrink-0 text-[#81B29A]" />}
                    </button>
                  );
                })}
              </div>

              {selectedAnswer && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                  animate={{ opacity: 1, scale: 1, rotate: -1 }}
                  className="mt-4 rounded-2xl border border-[#F2CC8F]/50 bg-[#F2CC8F]/15 p-3 text-center"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-[#F2CC8F]">
                    {selectedAnswer === 'b'
                      ? '100% Pays Attention \u2022 Croissant Detective!'
                      : "Caught! She actually stole half of Julian's almond croissant."}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={!selectedAnswer}
            onClick={next}
            className="mt-4 w-full rounded-full bg-[#F2CC8F] py-3.5 text-xs font-bold uppercase tracking-widest text-[#13100E] disabled:opacity-35"
          >
            Read Year Letter
          </button>
        </motion.section>
      )}

      {/* CHAPTER 5 — FULL ARCHIVAL LETTER */}
      {chapter === 5 && (
        <motion.section
          key="wrap-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-1 flex-col justify-between px-4 pt-2 pb-8"
        >
          <div className="lined-note-bg rounded-3xl bg-[#FAF6EE] p-6 text-[#2B2118] shadow-2xl">
            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#C05A3F]">
              A Few Words From This Chapter
            </p>
            <h3 className="font-display mt-2 text-2xl font-bold">Dear Us,</h3>
            <div className="mt-3 space-y-3 text-xs leading-relaxed text-[#4E3F33]">
              <p>
                What a year of airports, late train platforms, voice memos taped in the rain, and finding home inside
                the smallest routines.
              </p>
              <p>
                Even when cities put 3,410 miles between us, every saved Polaroid and whispered song kept our table set
                for two. No algorithm needed—just our quiet archive held safely on our phones.
              </p>
              <p>Here is to keeping every ordinary day just as carefully next year.</p>
            </div>
            <p className="font-hand mt-5 text-2xl text-[#C05A3F]">&mdash; Forever in our archive</p>
          </div>

          <button
            type="button"
            onClick={next}
            className="mt-5 w-full rounded-full bg-[#F2CC8F] py-3.5 text-xs font-bold uppercase tracking-widest text-[#13100E]"
          >
            Make a Wish for 2027
          </button>
        </motion.section>
      )}

      {/* CHAPTER 6 — HOLD TO SEAL WISH FINALE */}
      {chapter === 6 && (
        <motion.section
          key="wrap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center"
        >
          {!wishSealed ? (
            <>
              <h2 className="font-display text-3xl font-bold uppercase leading-none">
                Seal a wish for <span className="text-[#F2CC8F]">next year.</span>
              </h2>

              <button
                type="button"
                aria-label="Press and hold to seal your wish"
                onPointerDown={startHold}
                onPointerUp={cancelHold}
                onPointerLeave={cancelHold}
                onPointerCancel={cancelHold}
                onContextMenu={(e) => e.preventDefault()}
                className="relative my-9 flex h-40 w-40 items-center justify-center rounded-full bg-[#1F1814] select-none"
              >
                <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#F2CC8F"
                    strokeWidth="2.5"
                    strokeDasharray={289}
                    strokeDashoffset={289 * (1 - holdProgress)}
                  />
                </svg>
                <motion.div
                  animate={{ scale: 1 + holdProgress * 0.35 }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E07A5F]/25 text-[#F2CC8F]"
                >
                  <Flame className="h-9 w-9" />
                </motion.div>
              </button>

              <p className="text-xs text-[#FAF6EE]/75">Press and hold the lantern to seal your wish.</p>
              <button
                type="button"
                onClick={finishWish}
                className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-[#F2CC8F] underline underline-offset-4"
              >
                Or tap here instead
              </button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="w-full space-y-4">
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#81B29A]">Wish Sealed</p>
              <h2 className="font-display text-4xl font-bold uppercase leading-[0.9]">
                Happy Year Ahead,
                <br />
                <span className="text-[#F2CC8F]">{spaceName}.</span>
              </h2>
              <p className="font-hand text-2xl text-[#FAF6EE]/90">
                &ldquo;Stored safely on your phones—never behind a streak.&rdquo;
              </p>

              <div className="space-y-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    addMemory({
                      type: 'milestone',
                      title: '2025 Year Wrapped Highlight',
                      body: '184 memories saved across 3,410 miles and reunited moments.',
                      memoryDate: new Date().toISOString().slice(0, 10),
                    });
                  }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#F2CC8F] py-3 text-xs font-bold uppercase tracking-wider text-[#13100E]"
                >
                  <BookmarkPlus className="h-4 w-4" /> Save Recap to Our Story
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast('Annual Wrapped saved to gallery');
                    setActiveOverlay('none');
                  }}
                  className="w-full rounded-full border border-white/25 py-2.5 text-xs font-semibold text-[#FAF6EE]"
                >
                  Close Wrapped
                </button>
                <div className="flex justify-center gap-4 pt-1 text-[11px] text-[#FAF6EE]/65 underline">
                  <button type="button" onClick={() => setChapter(5)}>
                    Read letter again
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWishSealed(false);
                      setHoldProgress(0);
                      setSelectedAnswer(null);
                      setChapter(0);
                    }}
                  >
                    Replay Wrapped
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>
      )}
    </motion.div>
  );
};
