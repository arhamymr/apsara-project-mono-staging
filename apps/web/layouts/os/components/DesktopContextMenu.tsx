'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@workspace/ui/components/context-menu';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { useWidgets } from '@/layouts/os/widgets/WidgetsContext';
import { FilePlus, RefreshCcw, Settings, XCircle } from 'lucide-react';
import { type PropsWithChildren } from 'react';

export default function DesktopContextMenu({ children }: PropsWithChildren) {
  const { openAppById, resetState, clearAllWindows } = useWindowContext();
  const { clearWidgets } = useWidgets();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {/* Wrap the entire desktop area to capture right-clicks */}
        <div className="relative h-full w-full">{children}</div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel>Desktop</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={() => openAppById('notes')}>
          <FilePlus className="mr-2 h-4 w-4" />
          New Note
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => openAppById('settings-hub')}>
          <Settings className="mr-2 h-4 w-4" />
          Desktop Settings
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={() => clearWidgets()}>
          <XCircle className="mr-2 h-4 w-4" />
          Remove All Widgets
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => clearAllWindows()}>
          <XCircle className="mr-2 h-4 w-4" />
          Close All Windows
        </ContextMenuItem>
        <ContextMenuItem onSelect={() => resetState()}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reset Desktop
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
