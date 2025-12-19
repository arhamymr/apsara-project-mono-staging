'use client';

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { WinState } from './types';

/**
 * Separate context for window state (data that changes frequently)
 * Components can subscribe to specific windows using selectors
 */
export type WindowStateContextType = {
  windows: WinState[];
  activeId: string | null;
  draggingWindowId: string | null;
  resizingWindowId: string | null;
};

const WindowStateContext = createContext<WindowStateContextType | null>(null);

export function useWindowState() {
  const context = useContext(WindowStateContext);
  if (!context) {
    throw new Error('useWindowState must be used within WindowStateProvider');
  }
  return context;
}

/**
 * Selector hook to get a specific window's state
 * Only re-renders when the specific window changes
 */
export function useWindowById(windowId: string): WinState | undefined {
  const { windows } = useWindowState();
  return useMemo(
    () => windows.find((w) => w.id === windowId),
    [windows, windowId]
  );
}

/**
 * Selector hook to check if a window is active
 */
export function useIsWindowActive(windowId: string): boolean {
  const { activeId } = useWindowState();
  return activeId === windowId;
}

/**
 * Selector hook to get all windows for a specific app
 */
export function useWindowsByAppId(appId: string): WinState[] {
  const { windows } = useWindowState();
  return useMemo(
    () => windows.filter((w) => w.appId === appId),
    [windows, appId]
  );
}

/**
 * Selector hook to get parent window title
 */
export function useParentWindowTitle(parentId: string | null | undefined): string | undefined {
  const { windows } = useWindowState();
  return useMemo(() => {
    if (!parentId) return undefined;
    return windows.find((w) => w.id === parentId)?.title;
  }, [windows, parentId]);
}

export function WindowStateProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: WindowStateContextType;
}) {
  return (
    <WindowStateContext.Provider value={value}>
      {children}
    </WindowStateContext.Provider>
  );
}
