import { useWindowContext } from '@/layouts/os/WindowContext';
import type { AppDef } from '@/layouts/os/types';
import * as React from 'react';

function toId(id: string) {
  return id.trim().toLowerCase();
}

function filterApps(apps: AppDef[], query: string): AppDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return apps;
  return apps.filter(
    (a) => a.name?.toLowerCase().includes(q) || a.id.toLowerCase().includes(q),
  );
}

function SafeIcon({ icon }: { icon: AppDef['icon'] }) {
  if (typeof icon === 'string') {
    return <span className="text-xl leading-none">{icon}</span>;
  }
  return <span className="h-5 w-5">{icon as React.ReactNode}</span>;
}

export default function DesktopIconsManagerApp() {
  const { apps, shortcuts, addShortcutForApp, removeShortcutForApp } =
    useWindowContext();

  const [query, setQuery] = React.useState('');
  const filtered = React.useMemo(() => filterApps(apps, query), [apps, query]);

  const presentIds = React.useMemo(() => {
    const set = new Set<string>();
    shortcuts.forEach((it) => {
      if (it.type === 'app') set.add(toId(it.appId));
      else it.children.forEach((c) => set.add(toId(c.appId)));
    });
    return set;
  }, [shortcuts]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-3">
        <h2 className="text-sm font-medium">Manage Desktop Icons</h2>
        <p className="text-muted-foreground text-xs">
          Add or remove which apps appear as desktop shortcuts.
        </p>
      </div>
      <div className="flex items-center gap-2 border-b p-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search apps..."
          className="bg-background/60 w-full rounded-md border px-2 py-1 text-sm outline-none"
        />
      </div>
      <div className="flex-1 overflow-auto p-3">
        {filtered.length === 0 ? (
          <div className="text-muted-foreground text-sm">No apps found.</div>
        ) : (
          <ul className="space-y-1" role="list" aria-label="Apps">
            {filtered.map((app) => {
              const isPresent = presentIds.has(toId(app.id));
              return (
                <li
                  key={app.id}
                  className="group hover:bg-muted/30 flex items-center justify-between rounded-md px-2 py-1"
                >
                  <div className="flex items-center gap-2">
                    <SafeIcon icon={app.icon} />
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm">{app.name}</span>
                      <span className="text-muted-foreground text-[11px]">
                        {app.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isPresent ? (
                      <button
                        className="rounded-md bg-red-500/10 px-2 py-1 text-xs text-red-400 hover:bg-red-500/20"
                        onClick={() => removeShortcutForApp(app.id)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/20"
                        onClick={() => addShortcutForApp(app.id)}
                      >
                        Add
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
