import { Card } from "@workspace/ui/components/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { useOSStrings } from "@/i18n/os";
import { useWindowContext } from "@/layouts/os/WindowContext";
import { MAX_DOCK_ITEMS } from "@/layouts/os/useDesktopState";
import { cn } from "@/lib/utils";
import { XCircle } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import AppLauncher from "../app-launcher";
import { DockAppTile } from "./dock";
// DockSettings popover replaced by right-click windowed manager

export default function Dock() {
  const {
    apps,
    windows,
    activeId,
    openApp,
    focusWindow,
    restoreWindow,
    dockAppIds,
    setDockAppIds,
    clearAllWindows,
    minimizeWindow,
  } = useWindowContext();
  const hasMaximizedWindow = React.useMemo(
    () => windows.some((window) => window.maximized && !window.minimized),
    [windows]
  );

  const [appLauncherOpen, setAppLauncherOpen] = React.useState(false);

  const dockApps = React.useMemo(
    () => apps.filter((app) => dockAppIds.includes(app.id)),
    [apps, dockAppIds]
  );

  // Separate active windows from dock apps
  const activeWindows = React.useMemo(
    () => windows.filter((window) => !window.minimized),
    [windows]
  );

  const minimizedWindows = React.useMemo(
    () => windows.filter((window) => window.minimized),
    [windows]
  );

  // Get app IDs that have active windows (to avoid showing duplicate icons)
  const activeAppIds = React.useMemo(
    () => new Set(windows.map((window) => window.appId)),
    [windows]
  );

  const toggleDockApp = React.useCallback(
    (id: string) => {
      setDockAppIds((previous) => {
        if (previous.includes(id)) {
          return previous.filter((item) => item !== id);
        }
        if (previous.length >= MAX_DOCK_ITEMS) {
          toast.warning(`Dock supports up to ${MAX_DOCK_ITEMS} apps.`);
          return previous;
        }
        return [...previous, id];
      });
    },
    [setDockAppIds]
  );

  const s = useOSStrings();

  return (
    <TooltipProvider delayDuration={150}>
      <div className="fixed bottom-3 left-1/2 z-[9999] -translate-x-1/2">
        <Card
          role="menubar"
          aria-label="Desktop dock"
          className={cn(
            "flex flex-row items-center justify-center px-3 py-2 @md:gap-2 @md:px-5",
            "rounded-xl border bg-transparent shadow-none backdrop-blur-xl transition-all duration-300",
            hasMaximizedWindow && !appLauncherOpen
              ? "translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          )}
        >
          <nav
            className="ml-2 flex items-end gap-3 @md:gap-4"
            aria-label="Applications"
          >
            {/* Docked apps on the left - only show if no active windows for this app */}
            {dockApps.map((app) => {
              // Skip if this app already has active windows (shown in active windows section)
              if (activeAppIds.has(app.id)) {
                return null;
              }

              return (
                <DockAppTile
                  key={app.id}
                  app={app}
                  count={0}
                  isActive={false}
                  isCurrentActive={false}
                  onPress={() => openApp(app)}
                  onTogglePin={toggleDockApp}
                />
              );
            })}
          </nav>

          {/* Separator between docked apps and active windows */}
          {activeWindows.length > 0 && (
            <div className="bg-border mx-1 h-6 w-px" />
          )}

          {/* Active windows on the right side */}
          <nav
            className="flex items-end gap-3 @md:gap-4"
            aria-label="Active windows"
          >
            {[...activeWindows, ...minimizedWindows].map((window) => {
              const app = apps.find((a) => a.id === window.appId);
              if (!app) return null;

              const isCurrentActive = window.id === activeId;
              const isMinimized = window.minimized;
              const isActive = !isMinimized;

              return (
                <DockAppTile
                  key={`window-${window.id}`}
                  app={app}
                  count={0} // No count needed for individual windows
                  isActive={isActive}
                  isCurrentActive={isCurrentActive}
                  isMinimized={isMinimized}
                  onPress={() => {
                    if (isMinimized) {
                      // Restore the window if it's minimized
                      restoreWindow(window.id);
                    } else {
                      // Focus or minimize the window
                      if (window.id === activeId) {
                        minimizeWindow(window.id);
                      } else {
                        focusWindow(window.id);
                      }
                    }
                  }}
                  onTogglePin={toggleDockApp}
                />
              );
            })}
          </nav>
          <AppLauncher onOpenChange={setAppLauncherOpen} />
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={clearAllWindows}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                  "text-muted-foreground hover:bg-muted/40 cursor-pointer"
                )}
                title={s.dock.closeAll}
                aria-label={s.dock.closeAll}
              >
                <XCircle className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">{s.dock.closeAll}</TooltipContent>
          </Tooltip>

          {/* Dock settings moved to Desktop right-click > Manage Apps */}
        </Card>
      </div>
    </TooltipProvider>
  );
}
