'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/use-website-store.ts
import { templates } from '@/layouts/os/apps/website/templates';
import { fetcher } from '@/lib/fetcher';
import { Monitor, Smartphone, Tablet } from 'lucide-react';
import { create } from 'zustand';
import { getDefaultContent, getDefaultProps } from './defaults';
import { ensureUnique, ensureUniquePath, slugify } from './utils';

import type {
  ComponentData,
  IPageData,
  IWebsiteData,
  ViewportSize,
} from './types';

/* ---------- helpers: normalization & safe getters ---------- */
function makeEmptyPage(id = 'home'): IPageData {
  return { id, title: id, path: id === 'home' ? '/' : `/${id}`, sections: [] };
}
function normalizePage(p?: any, idHint = 'home'): IPageData {
  if (!p || typeof p !== 'object') return makeEmptyPage(idHint);
  return {
    id: p.id ?? idHint,
    title: p.title ?? p.id ?? idHint,
    path: p.path ?? (p.id === 'home' ? '/' : `/${p.id ?? idHint}`),
    sections: Array.isArray(p.sections) ? p.sections : [],
  };
}
function normalizeWebsite(w?: any): IWebsiteData {
  const pages = w?.pages && typeof w.pages === 'object' ? w.pages : {};
  const outPages: Record<string, IPageData> = {};
  const keys = Object.keys(pages);
  if (keys.length === 0) {
    outPages.home = makeEmptyPage('home');
  } else {
    for (const k of keys) outPages[k] = normalizePage(pages[k], k);
    if (!outPages.home) outPages.home = makeEmptyPage('home');
  }
  return {
    ...(w || {}),
    pages: outPages,
    themeId: w?.themeId ?? 'light',
    typographyId: w?.typographyId ?? 'inter',
  } as IWebsiteData;
}
function getActivePageSafe(site: IWebsiteData, activeId?: string): IPageData {
  const pages = site?.pages || {};
  const id =
    activeId && pages[activeId] ? activeId : (pages.home?.id ?? 'home');
  return normalizePage(pages[id], id);
}

type State = {
  website: IWebsiteData;
  activePageId: string;
  isPreview: boolean;
  tabState: string;
  viewportSize: ViewportSize;
};


type Actions = {
  // state setters
  setWebsite: (
    next: IWebsiteData | ((prev: IWebsiteData) => IWebsiteData),
  ) => void;
  setActivePageId: (id: string) => void;
  setIsPreview: (v: boolean) => void;
  setTabState: (tab: string) => void;
  setViewportSize: (v: ViewportSize) => void;

  // component ops
  addComponent: (type: ComponentData['type']) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;

  // navigation/template
  handleCreateFromScratch: () => void;
  handleSelectTemplate: (template: IWebsiteData) => void;

  // submit
  handleSubmit: (value: any, routeKey: string) => Promise<any>;

  // set-font-family
  setFontFamily: (fontFamily: string) => void;

  // pages
  addPage: (input: {
    title: string;
    id?: string;
    path?: string;
    sections?: ComponentData[];
  }) => void;
  removePage: (pageId: string) => void;
};

/* ---------- initial safe website ---------- */
const initialWebsite = normalizeWebsite(templates?.[0]);

export const useWebsiteStore = create<State & Actions>()((set, get) => ({
  website: initialWebsite,
  activePageId: initialWebsite?.pages?.home?.id ?? 'home',
  isPreview: false,
  tabState: 'general',
  viewportSize: 'desktop',

  /* ---------- setters ---------- */
  setWebsite: (next) =>
    set((state) => {
      const prev = state.website ?? normalizeWebsite();
      const resolved = typeof next === 'function' ? (next as any)(prev) : next;
      const normalized = normalizeWebsite(resolved);
      // pick active page if exists, else fallback to home
      const active = normalized.pages[state.activePageId]
        ? state.activePageId
        : (normalized.pages.home?.id ?? 'home');
      return { website: normalized, activePageId: active };
    }),

  setActivePageId: (id) =>
    set((state) => {
      const site = state.website ?? normalizeWebsite();
      const exists = !!site.pages?.[id];
      return { activePageId: exists ? id : (site.pages.home?.id ?? 'home') };
    }),

  setIsPreview: (v) => set(() => ({ isPreview: v })),
  setTabState: (tab) => set(() => ({ tabState: tab })),
  setViewportSize: (v) => set(() => ({ viewportSize: v })),

  setFontFamily: (fontFamily) =>
    set((state) => {
      const site = normalizeWebsite(state.website);
      return { website: { ...site, fontFamily } as IWebsiteData };
    }),

  /* ---------- component ops (defensive) ---------- */
  addComponent: (type) => {
    const { website, activePageId } = get();
    const site = normalizeWebsite(website);
    const page = getActivePageSafe(site, activePageId);
    const newComponent: ComponentData = {
      id: `${type}-${Date.now()}`,
      type,
      props: getDefaultProps(type),
      content: getDefaultContent(type),
    };
    const nextPage: IPageData = {
      ...page,
      sections: [...page.sections, newComponent],
    };
    set({
      website: {
        ...site,
        pages: { ...site.pages, [page.id]: nextPage },
      },
      activePageId: page.id,
    });
  },

  removeComponent: (id) => {
    const { website, activePageId } = get();
    const site = normalizeWebsite(website);
    const page = getActivePageSafe(site, activePageId);
    const nextPage: IPageData = {
      ...page,
      sections: page.sections.filter((c) => c?.id !== id),
    };
    set({
      website: {
        ...site,
        pages: { ...site.pages, [page.id]: nextPage },
      },
      activePageId: page.id,
    });
  },

  updateComponent: (id, updates) => {
    const { website, activePageId } = get();
    const site = normalizeWebsite(website);
    const page = getActivePageSafe(site, activePageId);
    const nextPage: IPageData = {
      ...page,
      sections: page.sections.map((c) =>
        c?.id === id ? { ...c, ...updates } : c,
      ),
    };
    set({
      website: {
        ...site,
        pages: { ...site.pages, [page.id]: nextPage },
      },
      activePageId: page.id,
    });
  },

  moveComponent: (fromIndex, toIndex) => {
    const { website, activePageId } = get();
    const site = normalizeWebsite(website);
    const page = getActivePageSafe(site, activePageId);

    const next = [...page.sections];
    if (
      fromIndex < 0 ||
      fromIndex >= next.length ||
      toIndex < 0 ||
      toIndex >= next.length
    ) {
      return; // out of bounds → no-op
    }
    const [moved] = next.splice(fromIndex, 1);
    if (moved) {
      next.splice(toIndex, 0, moved);
    }

    const nextPage: IPageData = { ...page, sections: next };
    set({
      website: {
        ...site,
        pages: { ...site.pages, [page.id]: nextPage },
      },
      activePageId: page.id,
    });
  },

  /* ---------- navigation/template ---------- */
  handleCreateFromScratch: () => {
    const base = normalizeWebsite(templates?.[0]);
    set({
      tabState: 'general',
      website: base,
      activePageId: base?.pages?.home?.id ?? 'home',
    });
    return base;
  },

  handleSelectTemplate: (template) => {
    const site = normalizeWebsite(template);
    set({
      tabState: 'general',
      website: site,
      activePageId: site?.pages?.home?.id ?? 'home',
    });
    return site;
  },


  /* ---------- submit ---------- */
  handleSubmit: async (value, routeKey) => {
    const site = normalizeWebsite(get().website);
    const payload = {
      ...value,
      structure: site,
      status: value?.status ?? 'activated',
      plan: value?.plan ?? 'free',
    };

    const isEdit = typeof routeKey === 'string' && routeKey.includes('edit');
    const shouldNavigate =
      typeof routeKey === 'string' && routeKey.startsWith('dashboard/');
    const targetSlug = isEdit
      ? value?.currentSlug || value?.slug || payload.slug
      : null;
    const endpoint = isEdit
      ? `/api/dashboard/websites/${encodeURIComponent(
          String(targetSlug ?? payload.slug),
        )}`
      : '/api/dashboard/websites';

    try {
      const data = await fetcher<{ website?: { slug?: string } }>(endpoint, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!isEdit && shouldNavigate && data && typeof data === 'object') {
        const createdSlug = data.website?.slug;
        if (createdSlug && typeof window !== 'undefined') {
          // Use Next.js navigation instead of Inertia router
          window.location.href = `/dashboard/website/edit/${createdSlug}`;
        }
      }

      return data;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save website', err);
      throw err;
    }
  },

  /* ---------- pages ---------- */
  addPage: (input) => {
    const site = normalizeWebsite(get().website);
    const pages = { ...site.pages };
    const baseId = input.id ?? slugify(input.title || 'page');
    const uniqueId = ensureUnique(baseId, new Set(Object.keys(pages)));
    const basePath = input.path ?? `/${slugify(input.title || uniqueId)}`;
    const uniquePath = ensureUniquePath(basePath || `/${uniqueId}`, pages);

    const newPage: IPageData = normalizePage(
      {
        id: uniqueId,
        title: input.title || 'Untitled',
        path: uniquePath,
        sections: Array.isArray(input.sections) ? input.sections : [],
      },
      uniqueId,
    );

    const nextWebsite: IWebsiteData = {
      ...site,
      pages: { ...pages, [uniqueId]: newPage },
    };

    set({ website: nextWebsite, activePageId: uniqueId });
  },

  removePage: (pageId) => {
    const site = normalizeWebsite(get().website);
    if (pageId === 'home') return; // keep home
    const ids = Object.keys(site.pages || {});
    if (ids.length <= 1) return;

    const nextPages = { ...site.pages };
    delete nextPages[pageId];

    const nextActive =
      get().activePageId === pageId
        ? (nextPages['home']?.id ?? Object.keys(nextPages)[0])
        : get().activePageId;

    set({
      website: { ...site, pages: nextPages },
      activePageId: nextActive,
    });
  },
}));

/* ---------- viewport helpers (unchanged) ---------- */
export function getViewportStyles(size: ViewportSize) {
  switch (size) {
    case 'mobile':
      return { minWidth: '375px', minHeight: '667px' };
    case 'tablet':
      return { minWidth: '768px', minHeight: '1024px' };
    case 'desktop':
    default:
      return { width: '100%' };
  }
}

export function getViewportIcon(size: ViewportSize) {
  switch (size) {
    case 'mobile':
      return <Smartphone className="h-4 w-4" />;
    case 'tablet':
      return <Tablet className="h-4 w-4" />;
    case 'desktop':
    default:
      return <Monitor className="h-4 w-4" />;
  }
}
