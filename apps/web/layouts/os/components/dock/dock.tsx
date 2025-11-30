import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as React from 'react';
import type { AppDef } from '../../types';

type DockAppTileProps = {
  app: AppDef;
  count: number;
  isActive: boolean;
  isCurrentActive: boolean;
  onPress: () => void;
  onTogglePin?: (id: string) => void;
  isMinimized?: boolean;
};

export function DockAppTile({
  app,
  count,
  isActive,
  isCurrentActive,
  onPress,
  onTogglePin,
  isMinimized = false,
}: DockAppTileProps) {
  const icon = React.useMemo(
    () => (typeof app.icon === 'string' ? app.icon : app.icon),
    [app.icon],
  );

  const tileButton = (
    <button
      type="button"
      role="menuitem"
      aria-label={app.name}
      aria-pressed={isCurrentActive}
      data-active={isCurrentActive ? '' : undefined}
      onClick={onPress}
      className={cn(
        'group relative isolate cursor-pointer rounded-md',
        'flex flex-col items-center justify-center',
        'transition-transform duration-150',
        'hover:bg-muted/20 hover:scale-[1.2] active:scale-[1.2]',
        'text-foreground',
        'min-w-10 @md:min-w-12',
        'px-1.5 py-1',
        isMinimized && 'opacity-60', // Dimmed appearance for minimized windows
      )}
    >
      <span
        className={cn(
          'leading-none transition-transform',
          'text-2xl',
          'group-hover:scale-110',
          isCurrentActive && 'scale-110',
        )}
        aria-hidden
      >
        {icon}
      </span>

      {/* Indicator for active windows */}
      {isActive && !isMinimized && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute -bottom-1 left-1/2 size-1.5 w-6 -translate-x-1/2 rounded-full',
            isCurrentActive
              ? 'bg-green-500' // Green for active window
              : 'bg-blue-500', // Blue for inactive active windows
          )}
        />
      )}

      {/* Indicator for minimized windows */}
      {isMinimized && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute -bottom-1 left-1/2 size-1.5 w-6 -translate-x-1/2 rounded-full',
            'bg-yellow-500', // Yellow for minimized windows
          )}
        />
      )}

      {/* Count indicator for multiple windows of the same app */}
      {count > 1 && (
        <span
          aria-label={`${count} windows`}
          className={cn(
            'absolute -top-0.5 -right-0.5',
            'flex size-4 items-center justify-center rounded-full',
            'bg-destructive text-destructive-foreground',
            'text-[10px] leading-none font-bold',
          )}
        >
          {count}
        </span>
      )}

      <VisuallyHidden>
        {isCurrentActive
          ? 'Active window'
          : isMinimized
            ? 'Minimized window'
            : isActive
              ? 'Open window'
              : 'Inactive app'}
      </VisuallyHidden>
    </button>
  );

  return (
    <ContextMenu>
      <Tooltip>
        <ContextMenuTrigger asChild>
          <TooltipTrigger asChild>{tileButton}</TooltipTrigger>
        </ContextMenuTrigger>
        <TooltipContent
          side="top"
          sideOffset={6}
          className="z-[10050] px-2 py-1 text-xs"
        >
          {app.name}
          {isMinimized && ' (Minimized)'}
          {isCurrentActive && ' (Active)'}
        </TooltipContent>
      </Tooltip>
      {onTogglePin && (
        <ContextMenuContent className="z-[10050] w-44">
          <ContextMenuItem onSelect={() => onTogglePin(app.id)}>
            Unpin from Dock
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
}
