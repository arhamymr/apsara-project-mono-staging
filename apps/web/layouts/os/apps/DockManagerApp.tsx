import * as React from 'react';

import { Input } from '@workspace/ui/components/input';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { useWindowContext } from '@/layouts/os/WindowContext';
import type { AppDef } from '@/layouts/os/types';
import { MAX_DOCK_ITEMS } from '@/layouts/os/useDesktopState';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Check } from 'lucide-react';

const toId = (v: unknown) => String(v);

function filterApps(apps: AppDef[], query: string): AppDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return apps;
  return apps.filter((a) => a.name?.toLowerCase().includes(q));
}

function AppIcon({ icon }: { icon: AppDef['icon'] }) {
  if (typeof icon === 'string') {
    const s = icon.trim();
    const looksLikeUrl = /^(https?:)?\/\//i.test(s) || s.startsWith('data:');
    if (looksLikeUrl) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={s} alt="" className="h-10 w-10 rounded-lg object-cover" />;
    }
    return (
      <span
        aria-hidden="true"
        className="text-3xl"
        title={s}
      >
        {s.length > 2 ? s.slice(0, 2) : s}
      </span>
    );
  }
  return <span className="text-3xl">{icon}</span>;
}

export default function DockManagerApp() {
  const { apps, dockAppIds, setDockAppIds } = useWindowContext();

  const dockIds = React.useMemo(() => dockAppIds.map(toId), [dockAppIds]);

  const s = {
    heading: 'Configure Dock',
    search: 'Search apps...',
    pinAll: 'Pin all',
    unpinAll: 'Unpin all',
    none: 'No apps found.',
    pinned: 'pinned',
  } as const;

  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => filterApps(apps, query), [apps, query]);

  const isPinned = React.useCallback(
    (id: unknown) => dockIds.includes(toId(id)),
    [dockIds],
  );

  const toggleId = React.useCallback(
    (rawId: unknown) => {
      const id = toId(rawId);
      setDockAppIds((prev) => {
        const next = new Set(prev.map(toId));
        if (next.has(id)) {
          next.delete(id);
          return Array.from(next);
        }
        if (next.size >= MAX_DOCK_ITEMS) {
          toast.warning(`Dock supports up to ${MAX_DOCK_ITEMS} apps.`);
          return prev;
        }
        next.add(id);
        return Array.from(next);
      });
    },
    [setDockAppIds],
  );

  const setPinnedForIds = React.useCallback(
    (rawIds: unknown[], shouldPin: boolean) => {
      const ids = rawIds.map(toId);
      setDockAppIds((prev) => {
        const next = new Set(prev.map(toId));
        let limitReached = false;
        if (shouldPin) {
          for (const id of ids) {
            if (next.has(id)) continue;
            if (next.size >= MAX_DOCK_ITEMS) {
              limitReached = true;
              break;
            }
            next.add(id);
          }
        } else {
          ids.forEach((id) => next.delete(id));
        }
        if (limitReached) {
          toast.warning(`Dock supports up to ${MAX_DOCK_ITEMS} apps.`);
        }
        return Array.from(next);
      });
    },
    [setDockAppIds],
  );

  const pinAll = React.useCallback(() => {
    setPinnedForIds(
      filtered.map((a) => a.id),
      true,
    );
  }, [filtered, setPinnedForIds]);

  const unpinAll = React.useCallback(() => {
    setPinnedForIds(
      filtered.map((a) => a.id),
      false,
    );
  }, [filtered, setPinnedForIds]);

  const pinnedCount = dockIds.length;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium">{s.heading}</h2>
          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
            {pinnedCount} {s.pinned}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            className="hover:bg-muted/40 rounded border px-2 py-1 text-xs"
            onClick={pinAll}
          >
            {s.pinAll}
          </button>
          <button
            className="hover:bg-muted/40 rounded border px-2 py-1 text-xs"
            onClick={unpinAll}
          >
            {s.unpinAll}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 pb-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={s.search}
          aria-label="Search"
        />
      </div>

      {/* Grid View */}
      <ScrollArea className="flex-1 px-3 pb-3">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">{s.none}</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {filtered.map((app) => {
              const checked = isPinned(app.id);
              return (
                <button
                  key={toId(app.id)}
                  className={cn(
                    'group relative flex flex-col items-center gap-2 rounded-xl p-3 transition-all',
                    'hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    checked && 'bg-primary/10 ring-primary/30 ring-1',
                  )}
                  onClick={() => toggleId(app.id)}
                  aria-pressed={checked}
                  aria-label={`${app.name} - ${checked ? 'Pinned' : 'Not pinned'}`}
                >
                  {/* Check indicator */}
                  {checked && (
                    <div className="bg-primary absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full">
                      <Check className="text-primary-foreground h-3 w-3" />
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div className={cn(
                    'flex h-14 w-14 items-center justify-center rounded-xl transition-transform',
                    'bg-muted/60 group-hover:scale-105',
                    checked && 'bg-primary/20',
                  )}>
                    <AppIcon icon={app.icon} />
                  </div>
                  
                  {/* Name */}
                  <span className={cn(
                    'w-full truncate text-center text-xs',
                    checked ? 'text-foreground font-medium' : 'text-muted-foreground',
                  )}>
                    {app.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
