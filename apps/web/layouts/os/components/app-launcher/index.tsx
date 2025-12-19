import { Button } from '@workspace/ui/components/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@workspace/ui/components/context-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { useWindowActions } from '@/layouts/os/WindowActionsContext';
import { cn } from '@/lib/utils';
import { Grid3x3, MonitorDown, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import type { AppDef } from '@/layouts/os/types';

type AppLauncherProps = {
  onOpenChange?: (open: boolean) => void;
};

export default function AppLauncher({ onOpenChange }: AppLauncherProps) {
  const { apps, openApp, addShortcutForApp, shortcuts } = useWindowActions();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) {
        setSearchQuery('');
      }
      onOpenChange?.(open);
    },
    [onOpenChange],
  );

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
      handleOpenChange(false);
    },
    [openApp, handleOpenChange],
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          aria-label="App Launcher"
          variant="outline"
          size="icon"
          className="bg-muted h-9 w-9"
        >
          <Grid3x3 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-0 z-[99999]">
        <DialogHeader className="sr-only">
          <DialogTitle>App Launcher</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4">
          <div className="max-h-[400px] overflow-y-auto">
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
                            'group flex w-full flex-col items-center justify-center gap-2 rounded-lg p-3',
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
                      <ContextMenuContent className="z-[99999999] w-48">
                        <ContextMenuItem
                          onSelect={() => {
                            if (!alreadyOnDesktop) {
                              handleAddToDesktop(app.id);
                            }
                          }}
                          disabled={alreadyOnDesktop}
                        >
                          <MonitorDown className="mr-2 h-4 w-4" />
                          {alreadyOnDesktop
                            ? 'Already on Desktop'
                            : 'Add to Desktop'}
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative border-t pt-3">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 mt-1.5" />
            <Input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
