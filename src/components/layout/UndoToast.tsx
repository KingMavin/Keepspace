import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { useDemoStore } from '../../core/useDemoStore';

export const UndoToast: React.FC = () => {
  const toast = useDemoStore((s) => s.toast);
  const clearToast = useDemoStore((s) => s.clearToast);
  const undoLastDelete = useDemoStore((s) => s.undoLastDelete);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => clearToast(), 4000);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -22, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -18, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="pointer-events-auto absolute top-11 left-3.5 right-3.5 z-[60] flex items-center justify-between gap-2.5 rounded-2xl border border-[var(--border-token)] bg-[var(--bg-card)]/95 px-3.5 py-2.5 text-xs font-medium text-[var(--text-primary)] shadow-xl backdrop-blur-md"
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="h-2.5 w-1 shrink-0 rounded-full bg-[var(--accent-primary)]" />
            <span className="leading-snug">{toast.message}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {toast.undoMemoryId && (
              <button
                type="button"
                onClick={() => undoLastDelete(toast.undoMemoryId!)}
                className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-primary)] px-2.5 py-1 text-[11px] font-semibold text-[var(--accent-contrast)]"
              >
                <RotateCcw className="h-3 w-3" />
                Undo
              </button>
            )}
            <button
              type="button"
              onClick={clearToast}
              aria-label="Dismiss notification"
              className="rounded-full p-1 text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
