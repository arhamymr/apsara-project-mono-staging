import { Button } from '@workspace/ui/components/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@workspace/ui/components/context-menu';
import { Input } from '@workspace/ui/components/input';
import { useWindowActions } from '@/layouts/os/WindowActionsContext';
import { cn } from '@/lib/utils';
import { Grid3x3, MonitorDown, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useAppLauncher } from './hooks/useAppLauncher';
import type { AppDef } from '@/layouts/os/types';

type AppLauncherProps = {
  onOpenChange?: (open: boolean) => void;
};

export default function AppLauncher({ onOpenChange }: AppLauncherProps) {
  const { isOpen, setIsOpen, closeMenu, containerRef, panelRef, triggerRef } =
    useAppLauncher({ onOpenChange });
  const { apps, openApp, addShortcutForApp, shortcuts } = useWindowActions();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return apps;
    const query = searchQuery.toLowerCase();
    return apps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.id.toLowerCase().includes(query),
    );
  }, [apps, searchQuery]);

  const handleAppClick = useCallback(
    (app: AppDef) => {
      openApp(app);
      closeMenu();
      setSearchQuery('');
    },
    [openApp, closeMenu],
  );

  const handleAddToDesktop = useCallback(
    (appId: string) => {
      addShortcutForApp(appId);
    },
    [addShortcutForApp],
  );

  const isOnDesktop = useCallback(
    (appId: string) => {
      return shortcuts.some((item) =>
        item.type === 'app'
          ? item.appId === appId
          : item.children.some((c) => c.appId === appId),
      );
    },
    [shortcuts],
  );

  const handleCloseMenu = useCallback(() => {
    closeMenu();
    setSearchQuery('');
  }, [closeMenu]);

  return (
    <div ref={containerRef} className="relative">
      <Button
        ref={triggerRef}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="App Launcher"
        variant={'outline'}
        size="icon"
        onClick={() => setIsOpen((v) => !v)}
        className="bg-muted h-9 w-9"
      >
        <Grid3x3 className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[1001]" onClick={handleCloseMenu} />

          <div
            ref={panelRef}
            role="dialog"
            aria-label="App Launcher"
            className="bg-background absolute bottom-[50px] right-0 z-[1002] mb-3 w-[480px] overflow-hidden rounded-lg border shadow-2xl"
          >
            <div className="flex flex-col gap-4 p-4">
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  autoFocus
                />
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {filteredApps.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center text-sm">
                    No apps found
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {filteredApps.map((app) => {
                      const icon =
                        typeof app.icon === 'string' ? app.icon : app.icon;
                      const alreadyOnDesktop = isOnDesktop(app.id);
                      return (
                        <ContextMenu key={app.id}>
                          <ContextMenuTrigger asChild>
                            <button
                              type="button"
                              onClick={() => handleAppClick(app)}
                              className={cn(
                                'group flex flex-col items-center justify-center gap-2 rounded-lg p-3',
                                'hover:bg-muted/50 transition-colors',
                                'focus:ring-primary focus:ring-2 focus:outline-none',
                              )}
                              title={app.name}
                            >
                              <span
                                className="text-4xl transition-transform group-hover:scale-110"
                                aria-hidden
                              >
                                {icon}
                              </span>
                              <span className="text-foreground line-clamp-2 text-center text-xs">
                                {app.name}
                              </span>
                            </button>
                          </ContextMenuTrigger>
                          <ContextMenuContent className="z-[9999] w-48">
                            <ContextMenuItem
                              onSelect={() => handleAddToDesktop(app.id)}
                              disabled={alreadyOnDesktop}
                            >
                              <MonitorDown className="mr-2 h-4 w-4" />
                              {alreadyOnDesktop ? 'Already on Desktop' : 'Add to Desktop'}
                            </ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="text-muted-foreground border-t pt-3 text-center text-xs">
                {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''}{' '}
                available
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
