'use client';

import { useMemo } from 'react';

import { Toaster } from '@workspace/ui/components/sonner';
import { WindowProvider } from '@/layouts/os/WindowContext';
import { createDefaultApps } from '@/layouts/os/app-definitions';
import BootLoader from '@/layouts/os/components/BootLoader';
import DesktopContextMenu from '@/layouts/os/components/DesktopContextMenu';
import { DesktopShortcutsBoard } from '@/layouts/os/components/DesktopShortcutsBoard';
import BackgroundPlaceholder from '@/layouts/os/components/background-placeholder';
import Dock from '@/layouts/os/components/dock';
import { WidgetsBoard } from '@/layouts/os/components/widgets/WidgetsBoard';
import WindowItem from '@/layouts/os/components/window-item';
import { useDesktopState } from '@/layouts/os/useDesktopState';
import { WidgetsProvider } from '@/layouts/os/widgets/WidgetsContext';
import Navbar from '@/layouts/os/components/navbar';

type MacOSLayoutProps = {
  initialAppId?: string;
};



export default function MacOSLayout({ initialAppId }: MacOSLayoutProps = {}) {
  const apps = useMemo(createDefaultApps, []);
  const { contextValue, windows, activeId } = useDesktopState({
    apps,
    initialAppId,
  });

  const content = (
    <WindowProvider value={contextValue}>
      <WidgetsProvider>
        <div className="text-foreground relative h-screen w-full overflow-hidden font-sans">
          <BackgroundPlaceholder />
          <BootLoader />

          <Navbar 
            activeWindowTitle={windows.find((w) => w.id === activeId)?.title}
          />

          <DesktopContextMenu>
            {/* ContextMenu wraps a full-screen relative container; render the desktop content and
              widgets as siblings so widgets can occupy the full screen drag area. */}
            <>
              <div className="absolute inset-0 mt-14 flex items-start justify-between gap-6 px-6 pb-6">
                <DesktopShortcutsBoard />
              </div>
              {/* WidgetsBoard renders absolute-positioned widgets over the desktop */}
              <WidgetsBoard />
            </>
          </DesktopContextMenu>

          {windows
            .sort((a, b) => a.z - b.z)
            .map((w) => (
              <WindowItem key={w.id} win={w} />
            ))}

          <Dock />
          <Toaster />
        </div>
      </WidgetsProvider>
    </WindowProvider>
  );

  return content;
}


