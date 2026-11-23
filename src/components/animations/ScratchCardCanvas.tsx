import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Props {
  hiddenText: string;
  initiallyRevealed?: boolean;
  onRevealed: () => void;
}

export const ScratchCardCanvas: React.FC<Props> = ({ hiddenText, initiallyRevealed = false, onRevealed }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [revealed, setRevealed] = useState(initiallyRevealed);
  const [percent, setPercent] = useState(initiallyRevealed ? 100 : 0);

  useEffect(() => {
    if (initiallyRevealed || revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#D89A6C');
    grad.addColorStop(0.5, '#C05A3F');
    grad.addColorStop(1, '#9E4128');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Foil texture pattern
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc((i * 47) % w, (i * 29) % h, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCRATCH HERE TO REVEAL ANSWER', w / 2, h / 2 + 4);
  }, [initiallyRevealed, revealed]);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    const total = data.length / 4;
    for (let i = 3; i < data.length; i += 16) {
      if (data[i] === 0) cleared++;
    }
    const pct = Math.min(100, Math.round((cleared / (total / 4)) * 100));
    setPercent(pct);

    if (pct >= 52 && !revealed) {
      setRevealed(true);
      onRevealed();
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-[var(--border-token)] bg-[var(--bg-elevated)] p-4 flex items-center justify-center text-center">
        <motion.div
          animate={{ scale: revealed ? 1.02 : 0.98 }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          className="px-2"
        >
          <p className="font-hand text-2xl font-bold leading-snug text-[var(--accent-primary)]">{hiddenText}</p>
        </motion.div>

        {!revealed && (
          <canvas
            ref={canvasRef}
            width={340}
            height={112}
            className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
            onPointerDown={(e) => {
              drawingRef.current = true;
              scratchAt(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (drawingRef.current) scratchAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => {
              drawingRef.current = false;
            }}
            onPointerLeave={() => {
              drawingRef.current = false;
            }}
          />
        )}
      </div>

      {!revealed && (
        <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <span>Rub foil to reveal ({percent}%)</span>
          <button
            type="button"
            onClick={() => {
              setRevealed(true);
              setPercent(100);
              onRevealed();
            }}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-[var(--accent-primary)] hover:bg-[var(--bg-elevated)]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Tap to Reveal
          </button>
        </div>
      )}
    </div>
  );
};
