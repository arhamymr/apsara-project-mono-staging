import { cn } from '@/lib/utils';
import { WindowControls } from './WindowControls';

type WindowTitleBarProps = {
  title: string;
  maximized: boolean;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
};

export function WindowTitleBar({
  title,
  maximized,
  onMinimize,
  onToggleMaximize,
  onClose,
}: WindowTitleBarProps) {
  return (
    <div
      className={cn(
        'text-muted-foreground flex select-none',
        maximized
          ? 'cursor-default'
          : 'cursor-all-scroll active:cursor-all-scroll',
        'items-center justify-between gap-2 px-2 py-1',
        'window-drag-handle border-b',
      )}
    >
      <div className="pointer-events-none text-xs font-medium">{title}</div>
      <WindowControls
        maximized={maximized}
        onMinimize={onMinimize}
        onToggleMaximize={onToggleMaximize}
        onClose={onClose}
      />
    </div>
  );
}
