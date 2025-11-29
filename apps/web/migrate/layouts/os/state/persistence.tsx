import type {
  DesktopAppShortcut,
  DesktopGroup,
  DesktopItem,
} from '@/layouts/os/types';

export const STORAGE_KEY = 'apsara.os.desktop-state';

export type PersistedWindowState = {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized?: boolean;
  maximized?: boolean;
  prev?: { x: number; y: number; w: number; h: number } | null;
};

export type PersistedDesktopStateV1 = {
  windows: PersistedWindowState[];
  activeId: string | null;
  dockAppIds: string[];
  shortcuts: string[];
};

export type PersistedDesktopState = {
  windows: PersistedWindowState[];
  activeId: string | null;
  dockAppIds: string[];
  desktopItems: (
    | { type: 'app'; id: string }
    | { type: 'group'; id: string; label: string; children: string[] }
  )[];
};

// Defaults and helpers for desktop items
export const DEFAULT_SHORTCUTS: DesktopAppShortcut[] = [
  {
    type: 'app',
    id: 'finder',
    appId: 'finder',
    label: 'Finder',
    icon: <span className="text-4xl">📁</span>,
  },

  {
    type: 'app',
    id: 'graphicdesignerai',
    appId: 'graphicdesignerai',
    label: 'Design Studio',
    icon: <span className="text-4xl">🎨</span>,
  },
  {
    type: 'app',
    id: 'articles',
    appId: 'articles',
    label: 'Articles',
    icon: <span className="text-4xl">📰</span>,
  },
  {
    type: 'app',
    id: 'notes',
    appId: 'notes',
    label: 'Notes',
    icon: <span className="text-4xl">📝</span>,
  },
  {
    type: 'app',
    id: 'knowledgebase',
    appId: 'knowledgebase',
    label: 'Knowledge Base',
    icon: <span className="text-4xl">📚</span>,
  },
  {
    type: 'app',
    id: 'website-builder',
    appId: 'website-builder',
    label: 'Site Builder',
    icon: <span className="text-4xl">🧩</span>,
  },
  {
    type: 'app',
    id: 'chatbot',
    appId: 'chatbot',
    label: 'Chatbot',
    icon: <span className="text-4xl">🤖</span>,
  },
  {
    type: 'app',
    id: 'lead-management',
    appId: 'lead-management',
    label: 'Lead Management',
    icon: <span className="text-4xl">👥</span>,
  },
  {
    type: 'app',
    id: 'mail',
    appId: 'mail',
    label: 'Mail',
    icon: <span className="text-4xl">📫</span>,
  },

  {
    type: 'app',
    id: 'photos',
    appId: 'photos',
    label: 'Photos',
    icon: <span className="text-4xl">🖼️</span>,
  },
  {
    type: 'app',
    id: 'tasks',
    appId: 'tasks',
    label: 'Tasks',
    icon: <span className="text-4xl">✅</span>,
  },
  {
    type: 'app',
    id: 'maps',
    appId: 'maps',
    label: 'Maps',
    icon: <span className="text-4xl">🗺️</span>,
  },
];

export const DEFAULT_SHORTCUT_IDS = DEFAULT_SHORTCUTS.map((s) => s.id);

const shortcutLookup = new Map(DEFAULT_SHORTCUTS.map((s) => [s.id, s]));
export const findShortcut = (id: string) => shortcutLookup.get(id);

export const cloneShortcut = (
  shortcut: DesktopAppShortcut,
): DesktopAppShortcut => ({ ...shortcut });

export const createDefaultDesktopItems = (): DesktopItem[] => {
  const items: DesktopItem[] = [];
  const prodGroup: DesktopGroup = {
    type: 'group',
    id: 'grp-productivity',
    label: 'Productivity',
    children: [
      cloneShortcut(shortcutLookup.get('notes')!),
      cloneShortcut(shortcutLookup.get('articles')!),
    ],
  };
  const essentialsGroup: DesktopGroup = {
    type: 'group',
    id: 'grp-essentials',
    label: 'Essentials',
    children: [
      cloneShortcut(shortcutLookup.get('mail')!),
      cloneShortcut(shortcutLookup.get('tasks')!),
      cloneShortcut(shortcutLookup.get('lead-management')!),
      cloneShortcut(shortcutLookup.get('maps')!),
    ],
  };
  items.push(
    cloneShortcut(shortcutLookup.get('finder')!),
    prodGroup,
    essentialsGroup,
    cloneShortcut(shortcutLookup.get('graphicdesignerai')!),
    cloneShortcut(shortcutLookup.get('knowledgebase')!),
    cloneShortcut(shortcutLookup.get('website-builder')!),
    cloneShortcut(shortcutLookup.get('chatbot')!),
  );
  return items;
};

export const hydrateFromV1 = (ids: string[]): DesktopItem[] => {
  if (!Array.isArray(ids) || !ids.length) {
    return createDefaultDesktopItems();
  }
  const seen = new Set<string>();
  const hydrated: DesktopItem[] = [];
  ids.forEach((id) => {
    if (seen.has(id)) return;
    const shortcut = shortcutLookup.get(id);
    if (!shortcut) return;
    hydrated.push(cloneShortcut(shortcut));
    seen.add(id);
  });
  return hydrated.length ? hydrated : createDefaultDesktopItems();
};

export const hydrateDesktopItems = (
  saved: PersistedDesktopState['desktopItems'],
): DesktopItem[] => {
  if (!Array.isArray(saved) || !saved.length)
    return createDefaultDesktopItems();
  const items: DesktopItem[] = [];
  const seen = new Set<string>();
  saved.forEach((entry) => {
    if (!entry || typeof entry !== 'object') return;
    if (entry.type === 'app') {
      if (seen.has(entry.id)) return;
      const base = shortcutLookup.get(entry.id);
      if (base) {
        items.push(cloneShortcut(base));
        seen.add(entry.id);
      }
    } else if (entry.type === 'group') {
      const children: DesktopAppShortcut[] = [];
      const childSeen = new Set<string>();
      for (const cid of entry.children ?? []) {
        if (childSeen.has(cid)) continue;
        const base = shortcutLookup.get(cid);
        if (base) {
          children.push(cloneShortcut(base));
          childSeen.add(cid);
        }
      }
      if (children.length) {
        items.push({
          type: 'group',
          id: entry.id,
          label: entry.label,
          children,
        });
        seen.add(entry.id);
      }
    }
  });
  return items.length ? items : createDefaultDesktopItems();
};
