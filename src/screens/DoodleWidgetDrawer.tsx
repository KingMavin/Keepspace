import React, { useEffect, useRef, useState } from 'react';
import { BookmarkPlus, Eraser, Send, Smartphone, X } from 'lucide-react';
import { BottomSheet } from '../components/layout/BottomSheet';
import { haptics } from '../core/haptics';
import { useDemoStore } from '../core/useDemoStore';

const INK_COLORS = ['#C05A3F', '#2B2118', '#2563EB', '#D96B8A', '#3D6B4F'];

export const DoodleWidgetDrawer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [ink, setInk] = useState(INK_COLORS[0]);
  const [previewLock, setPreviewLock] = useState(false);
  const [snapshot, setSnapshot] = useState<string>('');

  const addMemory = useDemoStore((s) => s.addMemory);
  const setActiveOverlay = useDemoStore((s) => s.setActiveOverlay);
  const showToast = useDemoStore((s) => s.showToast);

  useEffect(() => {
    clearCanvas();
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setSnapshot(canvas.toDataURL('image/png'));
  };

  const drawAt = (clientX: number, clientY: number, move: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.strokeStyle = ink;
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (!move) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleSaveToTimeline = () => {
    const url = canvasRef.current?.toDataURL('image/png') || snapshot;
    addMemory({
      type: 'doodle',
      title: 'Home Screen Finger Doodle',
      body: 'Sketched right onto the live widget canvas and archived to Our Story.',
      memoryDate: new Date().toISOString().slice(0, 10),
      doodleDataUrl: url,
      backNote: 'Sent to your lock screen this morning!',
    });
  };

  return (
    <BottomSheet onClose={() => setActiveOverlay('none')}>
      <div className="space-y-3.5 px-5 pt-2 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[var(--accent-primary)]">
              Partner Lock Screen Note
            </span>
            <h3 className="keepsake-heading text-xl">Finger Doodle &amp; Note</h3>
          </div>
          <button type="button" onClick={() => setActiveOverlay('none')} className="rounded-full p-1.5 text-[var(--text-secondary)]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!previewLock ? (
          <>
            <div className="overflow-hidden rounded-2xl border-2 border-[var(--border-token)]">
              <canvas
                ref={canvasRef}
                width={340}
                height={220}
                className="h-52 w-full cursor-crosshair touch-none"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  drawing.current = true;
                  drawAt(e.clientX, e.clientY, false);
                }}
                onPointerMove={(e) => {
                  if (drawing.current) drawAt(e.clientX, e.clientY, true);
                }}
                onPointerUp={() => {
                  drawing.current = false;
                  if (canvasRef.current) setSnapshot(canvasRef.current.toDataURL('image/png'));
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {INK_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setInk(c)}
                    className={`h-6 w-6 rounded-full border-2 ${ink === c ? 'scale-110 border-[var(--text-primary)]' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={clearCanvas}
                className="inline-flex items-center gap-1 rounded-xl border border-[var(--border-token)] px-2.5 py-1 text-xs font-semibold"
              >
                <Eraser className="h-3.5 w-3.5" /> Clear
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-3xl bg-slate-900 p-5 text-center text-white">
            <p className="text-3xl font-light">09:41</p>
            <p className="text-[11px] opacity-70">Friday, Nov 20</p>
            <div className="mx-auto mt-3 w-48 overflow-hidden rounded-2xl border border-white/20 bg-[#FAF7F2] p-2">
              {snapshot && <img src={snapshot} alt="Lock screen widget" className="h-28 w-full rounded-xl object-cover" />}
            </div>
            <p className="mt-2 text-[11px] opacity-75">Simulated Partner Phone Lock-Screen Widget</p>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            if (canvasRef.current) setSnapshot(canvasRef.current.toDataURL('image/png'));
            setPreviewLock((v) => !v);
          }}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[var(--border-token)] bg-[var(--bg-elevated)] py-2 text-xs font-semibold"
        >
          <Smartphone className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
          {previewLock ? 'Back to Drawing Canvas' : 'Preview on Phone Lock Screen'}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              showToast('Beamed doodle straight to partner home screen widget!');
              setActiveOverlay('none');
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[var(--accent-primary)] py-3 text-xs font-semibold text-[var(--accent-contrast)]"
          >
            <Send className="h-3.5 w-3.5" /> Send to Widget
          </button>
          <button
            type="button"
            onClick={() => {
              haptics.success();
              handleSaveToTimeline();
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-[var(--border-token)] py-3 text-xs font-semibold"
          >
            <BookmarkPlus className="h-3.5 w-3.5" /> Save to Timeline
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
