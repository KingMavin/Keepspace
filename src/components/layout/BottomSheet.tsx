import React from 'react';
import { motion, PanInfo, useDragControls } from 'framer-motion';
import { haptics } from '../../core/haptics';

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  maxHeightClass?: string;
}

export const BottomSheet: React.FC<Props> = ({
  onClose,
  children,
  maxHeightClass = 'max-h-[90%]',
}) => {
  const dragControls = useDragControls();

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 90 || info.velocity.y > 420) {
      haptics.light();
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={() => {
        haptics.light();
        onClose();
      }}
      className="absolute inset-0 z-40 flex items-end bg-black/55 backdrop-blur-xs"
    >
      <motion.div
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0 }}
        dragElastic={{ top: 0.08, bottom: 0.55 }}
        onDragEnd={handleDragEnd}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', bounce: 0.1, duration: 0.36 }}
        className={`flex ${maxHeightClass} w-full flex-col overflow-hidden rounded-t-3xl border-t border-[var(--border-token)] bg-[var(--bg-card)] shadow-2xl`}
      >
        {/* iOS/Android Drag Handle */}
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="flex w-full shrink-0 cursor-grab touch-none items-center justify-center pt-2.5 pb-1 active:cursor-grabbing"
        >
          <span className="h-1.5 w-10 rounded-full bg-[var(--text-secondary)]/30" />
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain">{children}</div>
      </motion.div>
    </motion.div>
  );
};
