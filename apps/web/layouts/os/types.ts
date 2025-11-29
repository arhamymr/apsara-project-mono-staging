// Types for macOS-like desktop layout
import type { ReactNode } from 'react';

export type WinState = {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  content: ReactNode;
  minimized?: boolean;
  maximized?: boolean;
  prev?: { x: number; y: number; w: number; h: number } | null;
  /** Optional: id of the parent window if this is a sub-window */
  parentId?: string | null;
  /** Mark as sub-window (ephemeral; not persisted) */
  sub?: boolean;
};

export type AppDef = {
  id: string; // Unique identifier for the app
  name: string; // Display name
  icon: ReactNode | string; // Icon component or emoji string
  content: ReactNode; // Window content component
  defaultSize?: { width: number; height?: number }; // Optional default window size
};

// Desktop items can be single app shortcuts or grouped containers
export type DesktopAppShortcut = {
  type: 'app';
  id: string; // unique within desktop items
  label: string;
  icon: ReactNode;
  appId: string;
};

export type DesktopGroup = {
  type: 'group';
  id: string; // unique within desktop items
  label: string;
  icon?: ReactNode; // optional override icon for the group (else preview)
  children: DesktopAppShortcut[];
};

export type DesktopItem = DesktopAppShortcut | DesktopGroup;
