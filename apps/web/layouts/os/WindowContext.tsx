'use client';

import {
  createContext,
  useContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { AppDef, DesktopItem, WinState } from './types';

export type WindowInteractionState = {
  draggingWindowId: string | null;
  resizingWindowId: string | null;
};

export type WindowContextType = {
  windows: WinState[];
  apps: AppDef[];
  activeId: string | null;
  interaction: WindowInteractionState;
  shortcuts: DesktopItem[];
  setShortcuts: Dispatch<SetStateAction<DesktopItem[]>>;
  reorderShortcuts: (activeId: string, overId: string) => void;
  // Desktop grouping helpers
  addToGroup: (itemId: string, groupId: string) => void;
  createGroupWithItems: (label: string, itemIds: string[]) => void;
  removeFromGroup: (itemId: string, groupId: string) => void;
  ungroup: (groupId: string) => void;
  renameGroup: (groupId: string, label: string) => void;
  // Desktop shortcut helpers
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
  ) => string; // returns new subwindow id
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
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

const WindowContext = createContext<WindowContextType | null>(null);

export function useWindowContext() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowContext must be used within WindowProvider');
  }
  return context;
}

export function WindowProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: WindowContextType;
}) {
  return (
    <WindowContext.Provider value={value}>{children}</WindowContext.Provider>
  );
}
