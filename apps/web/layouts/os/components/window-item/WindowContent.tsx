import { cn } from '@/lib/utils';
import { forwardRef, type ReactNode } from 'react';
import { WindowTitleBar } from './WindowTitleBar';

interface WindowContentProps {
  title: string;
  active: boolean;
  isSub: boolean;
  maximized: boolean;
  content: ReactNode;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

export const WindowContent = forwardRef<HTMLDivElement, WindowContentProps>(
  function WindowContent(
    {
      title,
      active,
      isSub,
      maximized,
      content,
      onMinimize,
      onToggleMaximize,
      onClose,
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-muted @container flex h-full w-full flex-col overflow-hidden rounded-sm border transition-all',
          active &&
            (isSub
              ? 'ring-1 ring-amber-500/30 ring-offset-1 ring-offset-transparent'
              : 'ring-1 ring-green-500/20 ring-offset-1 ring-offset-transparent'),
        )}
        aria-label={title}
      >
        <WindowTitleBar
          title={title}
          maximized={maximized}
          onMinimize={onMinimize}
          onToggleMaximize={onToggleMaximize}
          onClose={onClose}
        />
        <div className="bg-card flex-1 overflow-hidden select-text">
          {content}
        </div>
      </div>
    );
  },
);
