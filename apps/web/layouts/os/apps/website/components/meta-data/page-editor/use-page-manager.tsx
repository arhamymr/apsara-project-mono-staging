/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import * as React from 'react';

type PagesRecord = Record<string, any>;

/** Keep order, but swap the id at the same index. */
function replaceIdInOrder(order: string[], oldId: string, newId: string) {
  const idx = order.indexOf(oldId);
  if (idx === -1) return order;
  const next = [...order];
  next[idx] = newId;
  return next;
}

function rebuildPagesObject<T extends Record<string, any>>(
  orderedIds: string[],
  pages: T,
): T {
  const next: T = {} as T;
  orderedIds.forEach((id) => {
    if (pages[id]) (next as any)[id] = pages[id];
  });
  Object.keys(pages).forEach((id) => {
    if (!(id in next)) (next as any)[id] = pages[id];
  });
  return next;
}

/** Normalize an object key (page "name"): lowercase, spaces→- , remove slashes, keep a-z0-9-_ */
function normalizeKeyName(input: string) {
  return (input ?? '')
    .toLowerCase()
    .trim()
    .replace(/\//g, ' ')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Normalize a URL-ish slug path. Keeps route params like ':slug' intact. */
function normalizePathSlug(raw: string, { isHome }: { isHome: boolean }) {
  if (isHome) return '/';
  const s = (raw || '').trim().replace(/^\/+/, '');
  if (!s) return '/';
  const segs = s.split('/').map((seg) => {
    if (!seg) return '';
    if (seg.startsWith(':')) return seg;
    return seg
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  });
  return '/' + segs.filter(Boolean).join('/');
}

/** Ensure new key is unique inside pages; append -1, -2 as needed. */
function uniqueKey(base: string, pages: PagesRecord, currentId?: string) {
  let key = base || 'page';
  let i = 1;
  while (key in pages && key !== currentId) {
    key = `${base}-${i++}`;
  }
  return key;
}

export function usePageManager({
  website,
  setWebsite,
}: {
  website: { pages: PagesRecord };
  setWebsite: (next: any) => void;
}) {
  // derive order from object insertion order
  const ids = React.useMemo(() => Object.keys(website.pages), [website.pages]);
  const [order, setOrder] = React.useState<string[]>(ids);
  React.useEffect(() => setOrder(ids), [ids]);

  // inline edit state (edit object key as "name" and path as "slug")
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draftName, setDraftName] = React.useState(''); // object key (ex: "about", "services")
  const [draftPath, setDraftPath] = React.useState(''); // path/slug (ex: "/about")

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const [, setActiveId] = React.useState<string | null>(null);

  const persistOrder = React.useCallback(
    (next: string[]) => {
      setWebsite({
        ...website,
        pages: rebuildPagesObject(next, website.pages),
      });
    },
    [setWebsite, website],
  );

  const onDragStart = React.useCallback((e: DragStartEvent) => {
    setActiveId(String(e.active.id));
  }, []);

  const onDragEnd = React.useCallback(
    (e: DragEndEvent) => {
      const { active, over } = e;
      setActiveId(null);
      if (!over) return;
      const a = String(active.id);
      const b = String(over.id);
      if (a !== b) {
        const oldIndex = order.indexOf(a);
        const newIndex = order.indexOf(b);
        const next = arrayMove(order, oldIndex, newIndex);
        setOrder(next);
        persistOrder(next);
      }
    },
    [order, persistOrder],
  );

  /** Start edit – show current title as name; block editing for "home". */
  const startEdit = React.useCallback(
    (id: string, page: { title?: string; path?: string }, isHome: boolean) => {
      if (isHome) return; // Home is not editable
      setEditingId(id);
      setDraftName(page?.title ?? id); // edit the displayed title (raw)
      setDraftPath(page?.path || `/${id}`);
    },
    [],
  );

  const cancelEdit = React.useCallback(() => {
    setEditingId(null);
  }, []);

  /** Save new object key (name) + path (slug). Title stores RAW (unnormalized) name. */
  const saveEdits = React.useCallback(
    (oldId: string, nameInput: string, pathInput: string) => {
      const page = website.pages[oldId];
      if (!page) return;

      const isHome = oldId === 'home';
      if (isHome) {
        setEditingId(null);
        return; // Home cannot be edited
      }

      const rawTitle = (nameInput ?? '').trim(); // save raw to title
      const normalizedKey = uniqueKey(
        normalizeKeyName(rawTitle),
        website.pages,
        oldId,
      );
      const normalizedPath = normalizePathSlug(pathInput, { isHome: false });

      // If nothing changes, early exit
      if (
        normalizedKey === oldId &&
        normalizedPath === (page.path || '/') &&
        rawTitle === (page.title ?? '')
      ) {
        setEditingId(null);
        return;
      }

      // Build next pages record
      const nextPages = { ...website.pages };
      const updatedPage = { ...page, path: normalizedPath, title: rawTitle };

      if (normalizedKey !== oldId) {
        delete nextPages[oldId];
        nextPages[normalizedKey] = updatedPage;

        const nextOrder = replaceIdInOrder(order, oldId, normalizedKey);
        setOrder(nextOrder);

        setWebsite({
          ...website,
          pages: rebuildPagesObject(nextOrder, nextPages),
        });
      } else {
        nextPages[oldId] = updatedPage;
        setWebsite({
          ...website,
          pages: nextPages,
        });
      }

      setEditingId(null);
    },
    [order, setOrder, setWebsite, website],
  );

  return {
    // state
    order,
    editingId,
    draftName,
    draftPath,

    // setters
    setDraftName,
    setDraftPath,

    // dnd
    sensors,
    onDragStart,
    onDragEnd,

    // editing
    startEdit,
    cancelEdit,
    saveEdits,
  };
}
