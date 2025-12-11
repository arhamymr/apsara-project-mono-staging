import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@workspace/ui/components/context-menu';
import type { ReactNode } from 'react';

interface WindowContextMenuProps {
  children: ReactNode;
  maximized: boolean;
  onBringToFront: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}

export function WindowContextMenu({
  children,
  maximized,
  onBringToFront,
  onMinimize,
  onToggleMaximize,
  onClose,
}: WindowContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onSelect={onBringToFront}>
          Bring to Front
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={onMinimize}>Minimize</ContextMenuItem>
        {maximized ? (
          <ContextMenuItem onSelect={onToggleMaximize}>Restore</ContextMenuItem>
        ) : (
          <ContextMenuItem onSelect={onToggleMaximize}>Maximize</ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={onClose}>Close</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
