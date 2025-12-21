'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

import type { WindowContextType } from '@/layouts/os/WindowContext';
import type { WindowStateContextType } from '@/layouts/os/WindowStateContext';
import type { WindowActionsContextType } from '@/layouts/os/WindowActionsContext';
import { getViewportBounds } from '@/layouts/os/helpers';
import * as ShortcutActions from '@/layouts/os/state/actions';
import {
  createDefaultDesktopItems,
  DEFAULT_SHORTCUT_IDS,
  hydrateDesktopItems,
  hydrateFromV1,
  STORAGE_KEY,
  type PersistedDesktopState,
  type PersistedDesktopStateV1,
  type PersistedWindowState,
} from '@/layouts/os/state/persistence';
import type { AppDef, DesktopItem, WinState } from '@/layouts/os/types';

type UseDesktopStateArgs = {
  apps: AppDef[];
  initialAppId?: string;
};

export const MAX_DOCK_ITEMS = 10;
const INITIAL_DOCK_ITEMS = 8;

function normalizeDockIds(ids: string[]): string[] {
  const next: string[] = [];
  const seen = new Set<string>();

  for (const id of ids) {
    if (!id) continue;
    if (seen.has(id)) continue;
    seen.add(id);
    next.push(id);
    if (next.length >= MAX_DOCK_ITEMS) break;
  }

  return next;
}

function buildDefaultDockIds(apps: AppDef[]): string[] {
  const initial = apps.slice(0, INITIAL_DOCK_ITEMS).map((app) => app.id);
  return normalizeDockIds(initial);
}

export function useDesktopState({ apps, initialAppId }: UseDesktopStateArgs): {
  contextValue: WindowContextType;
  stateContextValue: WindowStateContextType;
  actionsContextValue: WindowActionsContextType;
  windows: WinState[];
  activeId: string | null;
} {
  const [windows, setWindows] = useState<WinState[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggingWindowId, setDraggingWindowId] = useState<string | null>(null);
  const [resizingWindowId, setResizingWindowId] = useState<string | null>(null);
  const [shortcuts, setShortcuts] = useState<DesktopItem[]>(
    createDefaultDesktopItems,
  );
  const [dockAppIds, setDockAppIdsState] = useState<string[]>(() =>
    buildDefaultDockIds(apps),
  );
  const zSeed = useRef(10);
  const hasOpenedInitialApp = useRef(false);
  const isHydrated = useRef(false);

  const defaultDockIds = useMemo(() => buildDefaultDockIds(apps), [apps]);

  const setDockAppIds = useCallback<Dispatch<SetStateAction<string[]>>>(
    (updater) => {
      setDockAppIdsState((prev) => {
        const next =
          typeof updater === 'function'
            ? (updater as (prev: string[]) => string[])(prev)
            : updater;
        return normalizeDockIds(next);
      });
    },
    [],
  );

  useEffect(() => {
    setDockAppIdsState((prev) => {
      const appIds = new Set(apps.map((app) => app.id));
      const filtered = prev.filter((id) => appIds.has(id));
      // Do NOT auto-append missing apps; respect user's pinned subset
      return normalizeDockIds(filtered);
    });
  }, [apps]);

  useEffect(() => {
    if (typeof window === 'undefined' || isHydrated.current) {
      return;
    }

    let parsed: PersistedDesktopState | PersistedDesktopStateV1 | null = null;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        parsed = JSON.parse(raw) as PersistedDesktopState;
      }
    } catch (error) {
      console.error('[macOS layout] Failed to restore desktop state', error);
    }

    if (parsed) {
      if (Array.isArray(parsed.windows)) {
        const restored = parsed.windows
          .map((win) => {
            const app = apps.find((item) => item.id === win.appId);
            if (!app) return null;

            const safePrev =
              win.prev &&
              typeof win.prev === 'object' &&
              Number.isFinite(win.prev.x) &&
              Number.isFinite(win.prev.y) &&
              Number.isFinite(win.prev.w) &&
              Number.isFinite(win.prev.h)
                ? {
                    x: win.prev.x,
                    y: win.prev.y,
                    w: win.prev.w,
                    h: win.prev.h,
                  }
                : null;

            const fallbackWidth = app.defaultSize?.width ?? 640;
            const fallbackHeight = app.defaultSize?.height ?? 380;

            return {
              id: win.id ?? `${app.name}-${Date.now()}`,
              appId: app.id,
              title: win.title ?? app.name,
              x: Number.isFinite(win.x) ? win.x : 80,
              y: Number.isFinite(win.y) ? win.y : 120,
              w:
                Number.isFinite(win.w) && (win.w ?? 0) > 0
                  ? win.w
                  : fallbackWidth,
              h:
                Number.isFinite(win.h) && (win.h ?? 0) > 0
                  ? win.h
                  : fallbackHeight,
              z: Number.isFinite(win.z) ? win.z : 10,
              content: app.content,
              minimized: Boolean(win.minimized),
              maximized: Boolean(win.maximized),
              prev: safePrev,
            } as WinState;
          })
          .filter((win): win is WinState => win != null);

        if (restored.length) {
          setWindows(restored);
          const highestZ = restored.reduce(
            (max, win) => (win.z > max ? win.z : max),
            10,
          );
          zSeed.current = highestZ;
        }
      }

      if (typeof parsed.activeId === 'string') {
        setActiveId(parsed.activeId);
      }

      const anyParsed = parsed as { shortcuts?: unknown; desktopItems?: unknown };
      if (Array.isArray(anyParsed.shortcuts)) {
        setShortcuts(hydrateFromV1(anyParsed.shortcuts as string[]));
      } else if (Array.isArray(anyParsed.desktopItems)) {
        setShortcuts(hydrateDesktopItems(anyParsed.desktopItems, apps));
      }

      if (Array.isArray(parsed.dockAppIds)) {
        const appIds = apps.map((app) => app.id);
        const filtered = parsed.dockAppIds.filter((id) => appIds.includes(id));
        // Respect saved subset exactly (even if empty)
        setDockAppIdsState(normalizeDockIds(filtered));
      }
    }

    isHydrated.current = true;
  }, [apps]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated.current) {
      return;
    }

    const serializedWindows: PersistedWindowState[] = windows
      .filter((win) => !win.sub)
      .map((win) => ({
        id: win.id,
        appId: win.appId,
        title: win.title,
        x: win.x,
        y: win.y,
        w: win.w,
        h: win.h,
        z: win.z,
        minimized: Boolean(win.minimized),
        maximized: Boolean(win.maximized),
        prev: win.prev
          ? {
              x: win.prev.x,
              y: win.prev.y,
              w: win.prev.w,
              h: win.prev.h,
            }
          : null,
      }));

    const payload: PersistedDesktopState = {
      windows: serializedWindows,
      activeId,
      dockAppIds,
      desktopItems: shortcuts.map((item) =>
        item.type === 'group'
          ? {
              type: 'group' as const,
              id: item.id,
              label: item.label,
              children: item.children.map((c) => 
                // Save additional metadata for non-default shortcuts
                DEFAULT_SHORTCUT_IDS.includes(c.id)
                  ? c.id
                  : { id: c.id, appId: c.appId, label: c.label }
              ),
            }
          : DEFAULT_SHORTCUT_IDS.includes(item.id)
            ? ({ type: 'app', id: item.id } as const)
            : ({ type: 'app', id: item.id, appId: item.appId, label: item.label } as const),
      ),
    };

    const isDefaultDock =
      dockAppIds.length === defaultDockIds.length &&
      dockAppIds.every((id, index) => id === defaultDockIds[index]);
    const shortcutIdsFlat = payload.desktopItems.flatMap((i) =>
      i.type === 'group' ? i.children : [i.id],
    );
    const isDefaultShortcuts =
      shortcutIdsFlat.length === DEFAULT_SHORTCUT_IDS.length &&
      shortcutIdsFlat.every((id, index) => id === DEFAULT_SHORTCUT_IDS[index]);
    const isDefaultState =
      payload.windows.length === 0 &&
      payload.activeId == null &&
      isDefaultDock &&
      isDefaultShortcuts;

    try {
      if (isDefaultState) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (error) {
      console.error('[macOS layout] Failed to persist desktop state', error);
    }
  }, [windows, activeId, dockAppIds, shortcuts, apps, defaultDockIds]);

  const internalOpenApp = useCallback(
    (
      app: AppDef,
      options?: {
        width?: number;
        height?: number;
        x?: number;
        y?: number;
        title?: string;
        focus?: boolean;
      },
    ) => {
      setWindows((prev) => {
        const existingWindow = prev.find((w) => w.appId === app.id && !w.sub);

        if (existingWindow) {
          if (existingWindow.minimized) {
            const nextZ = ++zSeed.current;
            return prev.map((w) =>
              w.id === existingWindow.id
                ? { ...w, minimized: false, z: nextZ }
                : w,
            );
          }
          return prev.map((w) =>
            w.id === existingWindow.id ? { ...w, minimized: true } : w,
          );
        }

        const nextZ = ++zSeed.current;
        const baseX = options?.x ?? 80 + (prev.length % 6) * 24;
        const baseY = options?.y ?? 120 + (prev.length % 6) * 16;
        const id = `${app.name}-${Date.now()}`;
        const defaultSize = app.defaultSize ?? { width: 640, height: 380 };
        const width = options?.width ?? defaultSize.width;
        const height = options?.height ?? defaultSize.height ?? 380;

        const win: WinState = {
          id,
          appId: app.id,
          title: options?.title ?? app.name,
          x: baseX,
          y: baseY,
          w: width,
          h: height,
          z: nextZ,
          content: app.content,
          minimized: false,
          maximized: false,
          prev: null,
        };
        return [...prev, win];
      });
    },
    [],
  );

  const openApp = useCallback(
    (app: AppDef) => internalOpenApp(app),
    [internalOpenApp],
  );

  const openAppWithOptions = useCallback(
    (
      app: AppDef,
      options?: {
        width?: number;
        height?: number;
        x?: number;
        y?: number;
        title?: string;
        focus?: boolean;
      },
    ) => internalOpenApp(app, options),
    [internalOpenApp],
  );

  const openAppById = useCallback(
    (id: string) => {
      const target = apps.find((app) => app.id === id);
      if (target) {
        openApp(target);
      }
    },
    [apps, openApp],
  );

  const openAppByIdWithOptions = useCallback(
    (
      id: string,
      options?: {
        width?: number;
        height?: number;
        x?: number;
        y?: number;
        title?: string;
        focus?: boolean;
      },
    ) => {
      const target = apps.find((app) => app.id === id);
      if (target) {
        openAppWithOptions(target, options);
      }
    },
    [apps, openAppWithOptions],
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      // gather all descendant sub-windows recursively
      const toRemove = new Set<string>();
      const visit = (wid: string) => {
        toRemove.add(wid);
        prev.forEach((w) => {
          if (w.parentId === wid) visit(w.id);
        });
      };
      visit(id);
      return prev.filter((w) => !toRemove.has(w.id));
    });
    setActiveId((a) => (a === id ? null : a));
    setDraggingWindowId((current) => (current === id ? null : current));
    setResizingWindowId((current) => (current === id ? null : current));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const nextZ = ++zSeed.current;
      return prev.map((w) => (w.id === id ? { ...w, z: nextZ } : w));
    });
    setActiveId(id);
  }, []);

  useEffect(() => {
    if (!initialAppId || hasOpenedInitialApp.current) {
      return;
    }
    const exists = apps.some((app) => app.id === initialAppId);
    if (!exists) {
      return;
    }
    hasOpenedInitialApp.current = true;
    openAppById(initialAppId);
  }, [initialAppId, apps, openAppById]);

  const updateWindowPosition = useCallback(
    (id: string, x: number, y: number) => {
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
    },
    [],
  );

  const updateWindowSize = useCallback(
    (id: string, w: number, h: number, x: number, y: number) => {
      setWindows((prev) =>
        prev.map((win) => (win.id === id ? { ...win, w, h, x, y } : win)),
      );
    },
    [],
  );

  const setDraggingWindow = useCallback((id: string | null) => {
    setDraggingWindowId(id);
  }, []);

  const setResizingWindow = useCallback((id: string | null) => {
    setResizingWindowId(id);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, minimized: true, maximized: false } : w,
      ),
    );
    setActiveId((a) => (a === id ? null : a));
    setDraggingWindowId((current) => (current === id ? null : current));
    setResizingWindowId((current) => (current === id ? null : current));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    const nextZ = ++zSeed.current;
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, minimized: false, z: nextZ } : w,
      ),
    );
    setActiveId(id);
  }, []);

  const toggleMaximizeWindow = useCallback(
    (id: string) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id) return w;
          if (!w.maximized) {
            const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
            const vh = typeof window !== 'undefined' ? window.innerHeight : 720;
            return {
              ...w,
              prev: { x: w.x, y: w.y, w: w.w, h: w.h },
              x: 0,
              y: 0,
              w: vw,
              h: vh,
              z: 1001,
              maximized: true,
              minimized: false,
            };
          } else {
            const p = w.prev;
            if (p) {
              return {
                ...w,
                x: p.x,
                y: p.y,
                w: p.w,
                h: p.h,
                maximized: false,
                prev: null,
              };
            }
            const bounds = getViewportBounds(w.w, w.h);
            return { ...w, x: bounds.minX, y: bounds.minY, maximized: false };
          }
        }),
      );
      focusWindow(id);
      setDraggingWindowId(null);
      setResizingWindowId(null);
    },
    [focusWindow],
  );

  const clearWindow = useCallback((appId: string) => {
    setWindows((prev) => {
      const target = prev.find((win) => win.appId === appId);
      if (!target) {
        return prev;
      }
      setActiveId((current) => (current === target.id ? null : current));
      setDraggingWindowId((current) =>
        current === target.id ? null : current,
      );
      setResizingWindowId((current) =>
        current === target.id ? null : current,
      );
      // Remove all windows for this appId including any sub-windows belonging to those
      const parentIds = new Set(
        prev.filter((w) => w.appId === appId).map((w) => w.id),
      );
      const toRemove = new Set<string>();
      const visit = (wid: string) => {
        toRemove.add(wid);
        prev.forEach((w) => {
          if (w.parentId === wid) visit(w.id);
        });
      };
      parentIds.forEach((pid) => visit(pid));
      return prev.filter((w) => !toRemove.has(w.id));
    });
  }, []);

  const clearAllWindows = useCallback(() => {
    setWindows([]);
    setActiveId(null);
    setDraggingWindowId(null);
    setResizingWindowId(null);
  }, []);

  const resetState = useCallback(() => {
    setWindows([]);
    setActiveId(null);
    setDraggingWindowId(null);
    setResizingWindowId(null);
    setShortcuts(createDefaultDesktopItems());
    setDockAppIds(buildDefaultDockIds(apps));
    zSeed.current = 10;
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error('[macOS layout] Failed to reset desktop state', error);
    }
  }, [apps, setDockAppIds]);

  const reorderShortcuts = useCallback((activeId: string, overId: string) => {
    setShortcuts((prev) =>
      ShortcutActions.reorderShortcuts(prev, activeId, overId),
    );
  }, []);

  const addToGroup = useCallback((itemId: string, groupId: string) => {
    setShortcuts((prev) => ShortcutActions.addToGroup(prev, itemId, groupId));
  }, []);

  const createGroupWithItems = useCallback(
    (label: string, itemIds: string[]) => {
      setShortcuts((prev) =>
        ShortcutActions.createGroupWithItems(prev, label, itemIds),
      );
    },
    [],
  );

  const removeFromGroup = useCallback((itemId: string, groupId: string) => {
    setShortcuts((prev) =>
      ShortcutActions.removeFromGroup(prev, itemId, groupId),
    );
  }, []);

  const ungroup = useCallback((groupId: string) => {
    setShortcuts((prev) => ShortcutActions.ungroup(prev, groupId));
  }, []);

  const renameGroup = useCallback((groupId: string, label: string) => {
    setShortcuts((prev) => ShortcutActions.renameGroup(prev, groupId, label));
  }, []);

  const addShortcutForApp = useCallback(
    (appId: string) => {
      console.log('[useDesktopState] addShortcutForApp called with:', appId);
      const app = apps.find((a) => a.id === appId);
      if (!app) {
        console.warn(`[addShortcutForApp] App not found: ${appId}`);
        return;
      }
      console.log('[useDesktopState] Found app:', app.name);
      // Create icon element with fallback
      const iconElement = app.icon ? (
        typeof app.icon === 'string' ? (
          <span className="text-4xl">{app.icon}</span>
        ) : (
          app.icon
        )
      ) : (
        <span className="text-4xl">📱</span>
      );
      setShortcuts((prev) => {
        console.log('[useDesktopState] Current shortcuts:', prev.length);
        const result = ShortcutActions.addShortcutForApp(
          prev,
          appId,
          app.name,
          iconElement,
        );
        console.log('[useDesktopState] New shortcuts:', result.length);
        return result;
      });
    },
    [apps],
  );

  const removeShortcutForApp = useCallback((appId: string) => {
    setShortcuts((prev) => ShortcutActions.removeShortcutForApp(prev, appId));
  }, []);

  // Memoized openSubWindow callback
  const openSubWindow = useCallback(
    (
      parentWindowId: string,
      options: {
        title: string;
        content: React.ReactNode;
        width?: number;
        height?: number;
      }
    ) => {
      let newId = '';
      setWindows((prev) => {
        const parent = prev.find((w) => w.id === parentWindowId);
        if (!parent) return prev;
        const nextZ = ++zSeed.current;
        const id = `${parent.title}-sub-${Date.now()}`;
        newId = id;
        const width =
          options.width ??
          Math.max(360, Math.min(720, Math.floor(parent.w * 0.6)));
        const height =
          options.height ??
          Math.max(220, Math.min(600, Math.floor(parent.h * 0.6)));
        const x = parent.x + Math.max(12, Math.floor((parent.w - width) / 2));
        const y =
          parent.y + Math.max(12, Math.floor((parent.h - height) / 2));
        return [
          ...prev,
          {
            id,
            appId: parent.appId,
            title: options.title,
            x,
            y,
            w: width,
            h: height,
            z: nextZ,
            content: options.content,
            minimized: false,
            maximized: false,
            prev: null,
            parentId: parent.id,
            sub: true,
          },
        ];
      });
      return newId;
    },
    []
  );

  // Split state context - changes frequently, minimal dependencies
  const stateContextValue = useMemo<WindowStateContextType>(
    () => ({
      windows,
      activeId,
      draggingWindowId,
      resizingWindowId,
    }),
    [windows, activeId, draggingWindowId, resizingWindowId]
  );

  // Split actions context - stable references, rarely changes
  const actionsContextValue = useMemo<WindowActionsContextType>(
    () => ({
      apps,
      shortcuts,
      setShortcuts,
      reorderShortcuts,
      addToGroup,
      createGroupWithItems,
      removeFromGroup,
      ungroup,
      renameGroup,
      addShortcutForApp,
      removeShortcutForApp,
      dockAppIds,
      openApp,
      openAppById,
      openAppWithOptions,
      openAppByIdWithOptions,
      openSubWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      setDraggingWindow,
      setResizingWindow,
      setDockAppIds,
      resetState,
      clearWindow,
      clearAllWindows,
    }),
    [
      apps,
      shortcuts,
      setShortcuts,
      reorderShortcuts,
      addToGroup,
      createGroupWithItems,
      removeFromGroup,
      ungroup,
      renameGroup,
      addShortcutForApp,
      removeShortcutForApp,
      dockAppIds,
      openApp,
      openAppById,
      openAppWithOptions,
      openAppByIdWithOptions,
      openSubWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      setDraggingWindow,
      setResizingWindow,
      setDockAppIds,
      resetState,
      clearWindow,
      clearAllWindows,
    ]
  );

  // Legacy combined context for backward compatibility
  const contextValue = useMemo<WindowContextType>(
    () => ({
      windows,
      apps,
      activeId,
      interaction: {
        draggingWindowId,
        resizingWindowId,
      },
      shortcuts,
      setShortcuts,
      reorderShortcuts,
      addToGroup,
      createGroupWithItems,
      removeFromGroup,
      ungroup,
      renameGroup,
      addShortcutForApp,
      removeShortcutForApp,
      dockAppIds,
      openApp,
      openAppById,
      openAppWithOptions,
      openAppByIdWithOptions,
      openSubWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      setDraggingWindow,
      setResizingWindow,
      setDockAppIds,
      resetState,
      clearWindow,
      clearAllWindows,
    }),
    [
      windows,
      apps,
      activeId,
      draggingWindowId,
      resizingWindowId,
      shortcuts,
      setShortcuts,
      reorderShortcuts,
      addToGroup,
      createGroupWithItems,
      removeFromGroup,
      ungroup,
      renameGroup,
      addShortcutForApp,
      removeShortcutForApp,
      dockAppIds,
      openApp,
      openAppById,
      openAppWithOptions,
      openAppByIdWithOptions,
      openSubWindow,
      closeWindow,
      minimizeWindow,
      restoreWindow,
      toggleMaximizeWindow,
      focusWindow,
      updateWindowPosition,
      updateWindowSize,
      setDraggingWindow,
      setResizingWindow,
      setDockAppIds,
      resetState,
      clearWindow,
      clearAllWindows,
    ],
  );

  return { contextValue, stateContextValue, actionsContextValue, windows, activeId };
}
