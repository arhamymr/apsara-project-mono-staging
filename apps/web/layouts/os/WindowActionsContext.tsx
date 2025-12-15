'use client';

import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { AppDef, DesktopItem } from './types';

/**
 * Separate context for window actions (functions that don't change often)
 * This prevents re-renders when only window state changes
 */
export type WindowActionsContextType = {
  apps: AppDef[];
  shortcuts: DesktopItem[];
  setShortcuts: Dispatch<SetStateAction<DesktopItem[]>>;
  reorderShortcuts: (activeId: string, overId: string) => void;
  addToGroup: (itemId: string, groupId: string) => void;
  createGroupWithItems: (label: string, itemIds: string[]) => void;
  removeFromGroup: (itemId: string, groupId: string) => void;
  ungroup: (groupId: string) => void;
  renameGroup: (groupId: string, label: string) => void;
  addShortcutForApp: (appId: string) => void;
  removeShortcutForApp: (appId: string) => void;
  dockAppIds: string[];
  openApp: (app: AppDef) => void;
  openAppById: (appId: string) => void;
  openAppWithOptions: (
    app: AppDef,
    options?: {
      width?: number;
      height?: number;
      x?: number;
      y?: number;
      title?: string;
      focus?: boolean;
    },
  ) => void;
  openAppByIdWithOptions: (
    appId: string,
    options?: {
      width?: number;
      height?: number;
      x?: number;
      y?: number;
      title?: string;
      focus?: boolean;
    },
  ) => void;
  openSubWindow: (
    parentWindowId: string,
    options: {
      title: string;
      content: ReactNode;
      width?: number;
      height?: number;
    },
  ) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleMaximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (
    id: string,
    width: number,
    height: number,
    x: number,
    y: number,
  ) => void;
  setDraggingWindow: (id: string | null) => void;
  setResizingWindow: (id: string | null) => void;
  setDockAppIds: Dispatch<SetStateAction<string[]>>;
  resetState: () => void;
  clearWindow: (appId: string) => void;
  clearAllWindows: () => void;
};

const WindowActionsContext = createContext<WindowActionsContextType | null>(null);

export function useWindowActions() {
  const context = useContext(WindowActionsContext);
  if (!context) {
    throw new Error('useWindowActions must be used within WindowActionsProvider');
  }
  return context;
}

export function WindowActionsProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: WindowActionsContextType;
}) {
  return (
    <WindowActionsContext.Provider value={value}>
      {children}
    </WindowActionsContext.Provider>
  );
}
