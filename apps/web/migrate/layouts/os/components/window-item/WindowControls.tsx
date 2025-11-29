import { Button } from '@/components/ui/button';
import { useOSStrings } from '@/i18n/os';
import { cn } from '@/lib/utils';
import { Minimize, Minus, Square, X } from 'lucide-react';

type WindowControlsProps = {
  maximized: boolean;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
};

export function WindowControls({
  maximized,
  onMinimize,
  onToggleMaximize,
  onClose,
}: WindowControlsProps) {
  const s = useOSStrings();
  return (
    <div className="pointer-events-auto flex items-center gap-0.5">
      <Button
        onClick={onMinimize}
        variant="ghost"
        size="icon"
        className={cn('h-6 w-6 cursor-pointer hover:bg-black/10')}
        aria-label={s.window.minimize}
        title={s.window.minimize}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Button
        onClick={onToggleMaximize}
        variant="ghost"
        size="icon"
        className={cn('h-6 w-6 cursor-pointer hover:bg-black/10')}
        aria-label={s.window.maximize}
        title={maximized ? s.window.restore : s.window.maximize}
      >
        {maximized ? (
          <Minimize className="h-3 w-3" />
        ) : (
          <Square className="h-3 w-3" />
        )}
      </Button>
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className={cn(
          'h-6 w-6 cursor-pointer hover:bg-red-100/20 hover:text-red-700',
        )}
        aria-label={s.window.close}
        title={s.window.close}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
