import { cn } from '@/lib/utils';
import { forwardRef, memo, useMemo, type ReactNode } from 'react';
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

/**
 * Memoized window content wrapper
 * Prevents re-renders when only parent window state changes
 */
const MemoizedContent = memo(function MemoizedContent({ 
  content 
}: { 
  content: ReactNode 
}) {
  return (
    <div className="bg-card flex-1 overflow-hidden select-text">
      {content}
    </div>
  );
});

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
    // Memoize className to prevent recalculation
    const containerClassName = useMemo(() => cn(
      'bg-muted @container flex h-full w-full flex-col overflow-hidden rounded-sm border transition-shadow',
      active &&
        (isSub
          ? 'ring-1 ring-amber-500/30 ring-offset-1 ring-offset-transparent'
          : 'ring-1 ring-green-500/20 ring-offset-1 ring-offset-transparent'),
    ), [active, isSub]);

    return (
      <div
        ref={ref}
        className={containerClassName}
        aria-label={title}
      >
        <WindowTitleBar
          title={title}
          maximized={maximized}
          onMinimize={onMinimize}
          onToggleMaximize={onToggleMaximize}
          onClose={onClose}
        />
        <MemoizedContent content={content} />
      </div>
    );
  },
);
