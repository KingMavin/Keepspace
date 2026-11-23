import React from 'react';
import { motion } from 'framer-motion';
import { ThemeMotif } from '../../core/types';

interface Props {
  motif: ThemeMotif;
  label?: string;
}

export const ThemeMotifBadge: React.FC<Props> = ({ motif, label }) => {
  const renderIcon = () => {
    switch (motif) {
      case 'moon-galaxy':
        return (
          <motion.svg
            viewBox="0 0 36 36"
            className="h-7 w-7 text-[var(--accent-primary)]"
            animate={{ rotate: [0, 6, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 3" />
            <path
              d="M21.5 10.5A7.5 7.5 0 1 0 26.5 23a6.2 6.2 0 1 1-5-12.5z"
              fill="currentColor"
            />
            <motion.circle
              cx="26"
              cy="11"
              r="1.8"
              fill="var(--accent-secondary)"
              animate={{ scale: [1, 1.45, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <circle cx="11" cy="12" r="1" fill="var(--accent-secondary)" />
          </motion.svg>
        );
      case 'spider-comic':
        return (
          <motion.svg
            viewBox="0 0 36 36"
            className="h-7 w-7"
            whileHover={{ scale: 1.12, rotate: -6 }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.8, repeat: Infinity }}
          >
            {/* Comic starburst + web lines */}
            <polygon
              points="18,3 22,10 30,7 26,15 33,20 25,24 27,32 19,27 12,33 12,24 4,22 10,16 6,8 14,11"
              fill="var(--accent-primary)"
              stroke="#0F172A"
              strokeWidth="1.4"
            />
            <circle cx="18" cy="18" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="1.2" />
          </motion.svg>
        );
      case 'pumpkin-bat':
        return (
          <motion.svg
            viewBox="0 0 36 36"
            className="h-7 w-7 text-[var(--accent-primary)]"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M18 8 C18 6 20 5 21 6" stroke="var(--accent-secondary)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <ellipse cx="18" cy="20" rx="10" ry="8" fill="currentColor" />
            <path d="M13 18 L15 16 L16 19 Z M20 19 L21 16 L23 18 Z M14 23 Q18 26 22 23" fill="#170B24" />
          </motion.svg>
        );
      case 'sakura-flower':
        return (
          <motion.svg
            viewBox="0 0 36 36"
            className="h-7 w-7 text-[var(--accent-primary)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 72, 144, 216, 288].map((deg) => (
              <ellipse
                key={deg}
                cx="18"
                cy="10"
                rx="3.4"
                ry="6"
                fill="currentColor"
                opacity="0.82"
                transform={`rotate(${deg} 18 18)`}
              />
            ))}
            <circle cx="18" cy="18" r="3" fill="#FDE047" />
          </motion.svg>
        );
      case 'goth-rose':
        return (
          <motion.svg
            viewBox="0 0 36 36"
            className="h-7 w-7 text-[var(--accent-primary)]"
            animate={{ scale: [1, 1.07, 1] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            <path d="M18 7 C25 11 26 20 18 27 C10 20 11 11 18 7 Z" fill="currentColor" opacity="0.88" />
            <path d="M18 12 C21 14 22 19 18 23 C14 19 15 14 18 12 Z" fill="#11070C" opacity="0.45" />
            <circle cx="18" cy="17" r="2.2" fill="var(--accent-secondary)" />
          </motion.svg>
        );
      case 'candle':
        return (
          <motion.svg viewBox="0 0 36 36" className="h-7 w-7">
            <rect x="14" y="17" width="8" height="12" rx="2" fill="var(--text-primary)" opacity="0.85" />
            <motion.path
              d="M18 7 C21 11 21 14 18 16 C15 14 15 11 18 7 Z"
              fill="var(--accent-primary)"
              animate={{ scaleY: [1, 1.15, 0.94, 1], scaleX: [1, 0.92, 1.05, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ transformOrigin: '18px 16px' }}
            />
          </motion.svg>
        );
      case 'fern-leaf':
        return (
          <motion.svg
            viewBox="0 0 36 36"
            className="h-7 w-7 text-[var(--accent-primary)]"
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M10 28 C12 18 18 10 27 7 C25 16 19 24 10 28 Z" fill="currentColor" opacity="0.85" />
            <path d="M10 28 L25 9" stroke="var(--bg-card)" strokeWidth="1.4" strokeLinecap="round" />
          </motion.svg>
        );
      case 'maple-mug':
        return (
          <motion.svg viewBox="0 0 36 36" className="h-7 w-7 text-[var(--accent-primary)]">
            <rect x="10" y="15" width="13" height="12" rx="3" fill="currentColor" />
            <path d="M23 18 C27 18 27 23 23 23" stroke="currentColor" strokeWidth="2.2" fill="none" />
            <motion.path
              d="M14 12 Q16 9 14 6 M19 12 Q21 9 19 6"
              stroke="var(--accent-secondary)"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              animate={{ y: [0, -2, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
          </motion.svg>
        );
      case 'wax-seal':
      default:
        return (
          <motion.svg
            viewBox="0 0 36 36"
            className="h-7 w-7 text-[var(--accent-primary)]"
            whileHover={{ rotate: 10 }}
          >
            <circle cx="18" cy="18" r="11" fill="currentColor" />
            <circle cx="18" cy="18" r="8" fill="none" stroke="var(--accent-contrast)" strokeOpacity="0.65" strokeDasharray="2 2" strokeWidth="1" />
            <path d="M15 18 C15 15 18 14 18 17 C18 14 21 15 21 18 C21 21 18 23 18 23 C18 23 15 21 15 18 Z" fill="var(--accent-contrast)" />
          </motion.svg>
        );
    }
  };

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-token)] bg-[var(--bg-card)] px-2.5 py-1 shadow-xs">
      {renderIcon()}
      {label && (
        <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[var(--text-primary)]">
          {label}
        </span>
      )}
    </div>
  );
};
