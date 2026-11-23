import React from 'react';
import { useDemoStore } from '../../core/useDemoStore';
import { AtmosphereCanvas } from '../animations/AtmosphereCanvas';
import { DemoController } from './DemoController';
import { UndoToast } from './UndoToast';

interface Props {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<Props> = ({ children }) => {
  const activePersona = useDemoStore((s) => s.activePersona);
  const themesByPersona = useDemoStore((s) => s.themesByPersona);
  const atmosphereEnabled = useDemoStore((s) => s.atmosphereEnabled);
  const themeId = themesByPersona[activePersona] ?? 'classic-paper';

  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-[#181512] sm:py-4">
      <div
        data-theme={themeId}
        className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-2xl sm:h-[870px] sm:max-h-[94dvh] sm:rounded-[40px] sm:border-[6px] sm:border-[#2C2622]"
      >
        <div aria-hidden="true" className="paper-grain pointer-events-none absolute inset-0 z-[15]" />
        <DemoController />
        <AtmosphereCanvas theme={themeId} enabled={atmosphereEnabled} />
        <div className="no-scrollbar relative z-10 flex flex-1 flex-col overflow-hidden">{children}</div>
        <UndoToast />
      </div>
    </div>
  );
};
