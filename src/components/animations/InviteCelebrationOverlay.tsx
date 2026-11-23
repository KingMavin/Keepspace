import React, { useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

interface Props {
  triggerKey: number;
}

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vRot: number;
  color: string;
  glitter: boolean;
}

const COLORS = ['#FDE047', '#E11D48', '#38BDF8', '#34D399', '#F472B6', '#FB923C', '#C084FC'];

export const InviteCelebrationOverlay: React.FC<Props> = ({ triggerKey }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Deterministic vector confetti & glitter shower emitted from left/right trumpet bells
  const vectorBursts = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => {
        const fromLeft = i % 2 === 0;
        const spreadX = 36 + ((i * 29) % 210);
        const arcPeakY = -48 - ((i * 19) % 110);
        const fallY = 140 + ((i * 37) % 260);
        return {
          id: i,
          fromLeft,
          startX: fromLeft ? 44 : 336,
          endX: fromLeft ? 44 + spreadX : 336 - spreadX,
          peakY: arcPeakY,
          fallY,
          delay: (i % 6) * 0.045,
          size: 7 + (i % 5) * 2,
          rot: (i % 2 === 0 ? 1 : -1) * (160 + (i % 5) * 60),
          color: COLORS[i % COLORS.length],
          isGlitter: i % 3 !== 0,
        };
      }),
    []
  );

  useEffect(() => {
    // Gentle fanfare chord via Web Audio API
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) {
        const ctx = new AC();
        if (ctx.state === 'suspended') ctx.resume().catch(() => undefined);
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          const start = ctx.currentTime + i * 0.1;
          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.075, start + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
          osc.connect(gain).connect(ctx.destination);
          osc.start(start);
          osc.stop(start + 0.6);
        });
        setTimeout(() => {
          try {
            ctx.close();
          } catch {
            // ignore
          }
        }, 1200);
      }
    } catch {
      // ignore audio blocks
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    canvas.width = parent?.clientWidth || 390;
    canvas.height = parent?.clientHeight || 760;

    // 90 confetti + glitter particles firing cleanly from both side trumpets
    const pieces: ConfettiPiece[] = Array.from({ length: 90 }, (_, i) => {
      const fromLeft = i % 2 === 0;
      return {
        x: fromLeft ? 48 : canvas.width - 48,
        y: canvas.height * 0.24 + (Math.random() - 0.5) * 24,
        vx: (fromLeft ? 1 : -1) * (2.6 + Math.random() * 5.8),
        vy: -4.2 - Math.random() * 6.4,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.25,
        color: COLORS[i % COLORS.length],
        glitter: i % 2 === 0,
      };
    });

    let frame = 0;
    let raf = 0;

    const render = () => {
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of pieces) {
        p.vy += 0.2;
        p.vx *= 0.986;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vRot;

        const fade = frame > 145 ? Math.max(0, 1 - (frame - 145) / 65) : 1;
        if (fade <= 0) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.color;

        if (p.glitter) {
          ctx.beginPath();
          ctx.moveTo(0, -p.w * 0.75);
          ctx.lineTo(p.w * 0.35, 0);
          ctx.lineTo(0, p.w * 0.75);
          ctx.lineTo(-p.w * 0.35, 0);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      if (frame < 210) {
        raf = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [triggerKey]);

  return (
    <div key={triggerKey} className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {/* Canvas Particle Confetti & Glitter Layer */}
      <canvas ref={canvasRef} className="h-full w-full" />

      {/* Vector Confetti & 4-Point Glitter Burst (always crisp at every frame rate) */}
      {vectorBursts.map((b) => (
        <motion.div
          key={b.id}
          initial={{ x: b.startX, y: 185, scale: 0.4, opacity: 1, rotate: 0 }}
          animate={{
            x: [b.startX, (b.startX + b.endX) / 2, b.endX],
            y: [185, 185 + b.peakY, 185 + b.fallY],
            scale: [0.5, 1.15, 0.85],
            opacity: [0, 1, 1, 0],
            rotate: b.rot,
          }}
          transition={{ duration: 2.3, delay: b.delay, times: [0, 0.25, 0.78, 1], ease: 'easeOut' }}
          className="absolute top-0 left-0"
        >
          {b.isGlitter ? (
            <svg width={b.size * 1.4} height={b.size * 1.4} viewBox="0 0 24 24" fill={b.color}>
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2Z" />
            </svg>
          ) : (
            <div
              className="rounded-xs"
              style={{ width: b.size, height: b.size * 0.55, backgroundColor: b.color }}
            />
          )}
        </motion.div>
      ))}

      {/* Left Edge Golden Fanfare Trumpet */}
      <motion.div
        initial={{ x: -85, y: 0, rotate: -26, opacity: 0 }}
        animate={{ x: [-85, -2, -6], rotate: [-26, -8, -12], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.7, times: [0, 0.14, 0.8, 1] }}
        className="absolute top-[22%] left-0"
      >
        <svg viewBox="0 0 96 68" className="h-20 w-24 drop-shadow-lg">
          <path d="M6 38 L58 28 L82 10 L82 54 L58 38 L6 44 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
          <ellipse cx="82" cy="32" rx="6" ry="22" fill="#FDE047" stroke="#78350F" strokeWidth="1.8" />
          <path d="M36 40 L36 62 L46 56 L56 62 L56 38 Z" fill="#E11D48" stroke="#881337" strokeWidth="1.5" />
          <path d="M88 20 Q94 32 88 44" stroke="#FDE047" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Right Edge Golden Fanfare Trumpet */}
      <motion.div
        initial={{ x: 85, y: 0, rotate: 26, opacity: 0 }}
        animate={{ x: [85, 2, 6], rotate: [26, 8, 12], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.7, times: [0, 0.14, 0.8, 1] }}
        className="absolute top-[22%] right-0"
      >
        <svg viewBox="0 0 96 68" className="h-20 w-24 -scale-x-100 drop-shadow-lg">
          <path d="M6 38 L58 28 L82 10 L82 54 L58 38 L6 44 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="2" />
          <ellipse cx="82" cy="32" rx="6" ry="22" fill="#FDE047" stroke="#78350F" strokeWidth="1.8" />
          <path d="M36 40 L36 62 L46 56 L56 62 L56 38 Z" fill="#38BDF8" stroke="#075985" strokeWidth="1.5" />
          <path d="M88 20 Q94 32 88 44" stroke="#FDE047" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
};
