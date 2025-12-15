import type {
  DesktopAppShortcut,
  DesktopGroup,
  DesktopItem,
} from '@/layouts/os/types';
import { arrayMove } from '@dnd-kit/sortable';
import { cloneShortcut, findShortcut } from './persistence';
import type React from 'react';

export function reorderShortcuts(
  items: DesktopItem[],
  activeId: string,
  overId: string,
): DesktopItem[] {
  if (activeId === overId) return items;
  const oldIndex = items.findIndex((i) => i.id === activeId);
  const newIndex = items.findIndex((i) => i.id === overId);
  if (oldIndex === -1 || newIndex === -1) return items;
  return arrayMove(items, oldIndex, newIndex);
}

export function addToGroup(
  items: DesktopItem[],
  itemId: string,
  groupId: string,
): DesktopItem[] {
  const next: DesktopItem[] = [];
  let moved: DesktopAppShortcut | null = null;
  for (const it of items) {
    if (it.id === itemId && it.type === 'app') {
      moved = it;
      continue;
    }
    next.push(it);
  }
  if (!moved) return items;
  return next.map((it) => {
    if (it.type === 'group' && it.id === groupId) {
      if (it.children.some((c) => c.id === moved!.id)) return it;
      return { ...it, children: [...it.children, moved!] };
    }
    return it;
  });
}

export function createGroupWithItems(
  items: DesktopItem[],
  label: string,
  itemIds: string[],
): DesktopItem[] {
  const children: DesktopAppShortcut[] = [];
  const remaining: DesktopItem[] = [];
  const toTake = new Set(itemIds);
  for (const it of items) {
    if (it.type === 'app' && toTake.has(it.id)) {
      children.push(it);
    } else {
      remaining.push(it);
    }
  }
  if (children.length === 0) return items;
  const group: DesktopGroup = {
    type: 'group',
    id: `grp-${Date.now()}`,
    label: label || 'Group',
    children,
  };
  return [group, ...remaining];
}

export function removeFromGroup(
  items: DesktopItem[],
  itemId: string,
  groupId: string,
): DesktopItem[] {
  const next: DesktopItem[] = [];
  let removed: DesktopAppShortcut | null = null;
  for (const it of items) {
    if (it.type === 'group' && it.id === groupId) {
      const children = it.children.filter((c) => {
        if (c.id === itemId) {
          removed = c;
          return false;
        }
        return true;
      });
      next.push({ ...it, children });
    } else {
      next.push(it);
    }
  }
  if (removed) {
    next.push(removed);
  }
  return next.filter((it) =>
    it.type === 'group' ? it.children.length > 0 : true,
  );
}

export function ungroup(items: DesktopItem[], groupId: string): DesktopItem[] {
  const next: DesktopItem[] = [];
  for (const it of items) {
    if (it.type === 'group' && it.id === groupId) {
      next.push(...it.children);
    } else {
      next.push(it);
    }
  }
  return next;
}

export function renameGroup(
  items: DesktopItem[],
  groupId: string,
  label: string,
): DesktopItem[] {
  return items.map((it) =>
    it.type === 'group' && it.id === groupId
      ? { ...it, label: label || it.label }
      : it,
  );
}

export function addShortcutForApp(
  items: DesktopItem[],
  appId: string,
  appName?: string,
  appIcon?: React.ReactNode,
): DesktopItem[] {
  const exists = items.some((it) =>
    it.type === 'app'
      ? it.appId === appId
      : it.children.some((c) => c.appId === appId),
  );
  if (exists) return items;

  // Try to find from default shortcuts first
  const base = findShortcut(appId);
  if (base) {
    return [cloneShortcut(base), ...items];
  }

  // If not in defaults, create a new shortcut from app info
  if (appName && appIcon) {
    const newShortcut: DesktopAppShortcut = {
      type: 'app',
      id: appId,
      appId: appId,
      label: appName,
      icon: appIcon,
    };
    return [newShortcut, ...items];
  }

  return items;
}

export function removeShortcutForApp(
  items: DesktopItem[],
  appId: string,
): DesktopItem[] {
  const next: DesktopItem[] = [];
  for (const it of items) {
    if (it.type === 'app') {
      if (it.appId === appId) continue;
      next.push(it);
    } else {
      const children = it.children.filter((c) => c.appId !== appId);
      if (children.length) {
        next.push({ ...it, children });
      }
    }
  }
  return next;
}
