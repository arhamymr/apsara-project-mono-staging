import * as React from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWindowContext } from '@/layouts/os/WindowContext';
import type { AppDef } from '@/layouts/os/types';
import { MAX_DOCK_ITEMS } from '@/layouts/os/useDesktopState';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const toId = (v: unknown) => String(v);

function filterApps(apps: AppDef[], query: string): AppDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return apps;
  return apps.filter((a) => a.name?.toLowerCase().includes(q));
}

function IconCell({ icon }: { icon: AppDef['icon'] }) {
  if (typeof icon === 'string') {
    const s = icon.trim();
    const looksLikeUrl = /^(https?:)?\/\//i.test(s) || s.startsWith('data:');
    if (looksLikeUrl) {
      return <img src={s} alt="" className="h-4 w-4 rounded-sm object-cover" />;
    }
    return (
      <span
        aria-hidden="true"
        className="bg-muted text-md grid size-6 place-items-center rounded-sm"
        title={s}
      >
        {s.length > 2 ? s.slice(0, 2) : s}
      </span>
    );
  }
  return <span className="h-4 w-4">{icon}</span>;
}

export default function DockManagerApp() {
  const { apps, dockAppIds, setDockAppIds } = useWindowContext();

  // always treat dock ids as strings
  const dockIds = React.useMemo(() => dockAppIds.map(toId), [dockAppIds]);

  const s = {
    heading: 'Configure Dock',
    search: 'Search',
    pinAll: 'Pin all',
    unpinAll: 'Unpin all',
    allApps: 'All apps',
    none: 'No apps found.',
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

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-3">
        <h2 className="text-sm font-medium">{s.heading}</h2>
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
      <div className="p-3 pb-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`${s.search}…`}
          aria-label={s.search}
        />
      </div>

      {/* Single list */}
      <div className="p-3 pt-1">
        <h3 className="text-muted-foreground mb-2 text-xs font-semibold uppercase">
          {s.allApps}
        </h3>

        <ScrollArea className="h-[calc(100vh-240px)] pr-2">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground text-xs">{s.none}</p>
          ) : (
            <div role="list" aria-label="App list">
              {filtered.map((app) => {
                const checked = isPinned(app.id);
                return (
                  <div
                    key={toId(app.id)}
                    className={cn(
                      'group mx-1 my-0.5 flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1',
                      checked ? 'bg-muted/40' : 'hover:bg-muted/20',
                    )}
                    onClick={() => toggleId(app.id)}
                    role="listitem"
                    data-checked={checked ? 'true' : 'false'}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <IconCell icon={app.icon} />
                      <span className="truncate text-lg leading-none">
                        {app.name}
                      </span>
                    </div>
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => {
                        if (v === 'indeterminate') return;
                        toggleId(app.id);
                      }}
                      aria-label={checked ? 'Unpin from Dock' : 'Pin to Dock'}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
