'use client';

import { useMemo } from 'react';

import LanguageSelector from '@/components/LanguageSelector';
import NotificationBell from '@/components/NotificationBell';
import { Toaster } from '@/components/ui/sonner';
import { useOSStrings } from '@/i18n/os';
import { ThemeToggle } from '@/layouts/dark-mode/theme-toggle';
import { WindowProvider } from '@/layouts/os/WindowContext';
import { createDefaultApps } from '@/layouts/os/app-definitions';
import BootLoader from '@/layouts/os/components/BootLoader';
import DesktopContextMenu from '@/layouts/os/components/DesktopContextMenu';
import { DesktopShortcutsBoard } from '@/layouts/os/components/DesktopShortcutsBoard';
import BackgroundPlaceholder from '@/layouts/os/components/background-placeholder';
import ClockDisplay from '@/layouts/os/components/clock-display';
import Dock from '@/layouts/os/components/dock';
import { WidgetsBoard } from '@/layouts/os/components/widgets/WidgetsBoard';
import WindowItem from '@/layouts/os/components/window-item';
import { useDesktopState } from '@/layouts/os/useDesktopState';
import { WidgetsProvider } from '@/layouts/os/widgets/WidgetsContext';

type MacOSLayoutProps = {
  initialAppId?: string;
};

// LangToggle now reuses shared LanguageSelector for consistency
function LangToggle() {
  const s = useOSStrings();
  return (
    <LanguageSelector
      ariaLabel={s.topbar.langLabel}
      wrapperClassName="flex items-center gap-1 rounded-md border px-1.5 py-1 text-xs"
    />
  );
}

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

          <div className="fixed inset-x-0 top-0 z-[222] flex items-center justify-between border-b bg-black/20 p-2 text-xs text-white backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <img
                src="https://assets.apsaradigital.com/logo-white.png"
                alt="logo"
                className="mr-1 ml-2 w-[80px]"
              />
              ✦
              <TitleLabel
                title={windows.find((w) => w.id === activeId)?.title}
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <LangToggle />
              <NotificationBell />
              <ClockDisplay simple />
              <ThemeToggle />
            </div>
          </div>

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
            .filter((w) => !w.minimized)
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

function TitleLabel({ title }: { title: string | undefined }) {
  const s = useOSStrings();
  return (
    <p className="text-muted-foreground text-sm font-medium">
      {title || s.topbar.fallbackTitle}
    </p>
  );
}
