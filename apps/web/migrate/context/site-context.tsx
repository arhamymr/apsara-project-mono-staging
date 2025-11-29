/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import * as React from 'react';

export type Website = {
  id: string | number;
  name: string;
  plan?: string | null;
  [k: string]: any;
};

type Ctx = {
  sites: Website[];
  activeSite: Website | null;
  hydrate: (sites: Website[]) => void;
  setActiveSite: (site: Website) => void;
  switchTo: (id: Website['id']) => void;
  isActive: (id: Website['id']) => boolean;
  clearActive: () => void;
};

const SiteCtx = React.createContext<Ctx | null>(null);

// ——— Persistence keys
const LS_KEY = 'active_site_id';

function readLS(): string | null {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null;
  } catch {
    return null;
  }
}
function writeLS(id: string | number | null) {
  try {
    if (typeof window === 'undefined') return;
    if (id == null) localStorage.removeItem(LS_KEY);
    else localStorage.setItem(LS_KEY, String(id));
  } catch {
    /* empty */
  }
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [sites, setSites] = React.useState<Website[]>([]);
  // read once on mount
  const [activeId, setActiveId] = React.useState<string | number | null>(() =>
    readLS(),
  );

  const activeSite = React.useMemo(
    () => sites.find((s) => String(s.id) === String(activeId)) ?? null,
    [sites, activeId],
  );

  // ——— Public: hydrate from anywhere (e.g., SiteSwitcher with usePage().props.websites)
  const hydrate = React.useCallback(
    (incoming: Website[]) => {
      const list = Array.isArray(incoming) ? incoming : [];
      setSites(list);

      if (!list.length) {
        setActiveId(null);
        writeLS(null);
        return;
      }

      // Keep current active if still valid; else use LS; else fallback first
      const current = activeId;
      const stillValid =
        current && list.some((s) => String(s.id) === String(current));
      let next: any = stillValid ? current : null;

      if (!next) {
        const stored = readLS();
        const storedOk =
          stored && list.some((s) => String(s.id) === String(stored));
        next = storedOk ? stored : list[0]?.id;
      }

      setActiveId(next);
      writeLS(next);
    },
    [activeId],
  );

  const setActiveSite = React.useCallback((site: Website) => {
    setActiveId(site.id);
    writeLS(site.id);
  }, []);

  const switchTo = React.useCallback(
    (id: Website['id']) => {
      if (sites.some((s) => String(s.id) === String(id))) {
        setActiveId(id);
        writeLS(id);
      }
    },
    [sites],
  );

  const isActive = React.useCallback(
    (id: Website['id']) => String(id) === String(activeId),
    [activeId],
  );

  const clearActive = React.useCallback(() => {
    setActiveId(null);
    writeLS(null);
  }, []);

  // ——— Persist on leave (extra safety)
  React.useEffect(() => {
    const persist = () => writeLS(activeId ?? null);
    // pagehide works on mobile/Safari; beforeunload is legacy fallback
    window.addEventListener('pagehide', persist);
    window.addEventListener('beforeunload', persist);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') persist();
    });
    return () => {
      window.removeEventListener('pagehide', persist);
      window.removeEventListener('beforeunload', persist);
    };
  }, [activeId]);

  // ——— Cross-tab sync
  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== LS_KEY) return;
      // only react if value actually changed
      const next = e.newValue;
      if (next == null) {
        setActiveId(null);
        return;
      }
      if (String(next) !== String(activeId)) {
        // ensure the selected id exists in current sites; if not, keep current
        if (sites.some((s) => String(s.id) === String(next))) {
          setActiveId(next);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [activeId, sites]);

  // ——— Optional: persist on Inertia navigation start (uncomment if you want)
  // import { router } from '@inertiajs/react' where this file is used,
  // or pass a callback from outside; keeping this file framework-agnostic.

  const value = React.useMemo<Ctx>(
    () => ({
      sites,
      activeSite,
      hydrate,
      setActiveSite,
      switchTo,
      isActive,
      clearActive,
    }),
    [
      sites,
      activeSite,
      hydrate,
      setActiveSite,
      switchTo,
      isActive,
      clearActive,
    ],
  );

  return <SiteCtx.Provider value={value}>{children}</SiteCtx.Provider>;
}

export function useActiveSite() {
  const ctx = React.useContext(SiteCtx);
  if (!ctx) throw new Error('useActiveSite must be used within <SiteProvider>');
  return ctx;
}
