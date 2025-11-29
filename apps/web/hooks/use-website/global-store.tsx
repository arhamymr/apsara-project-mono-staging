'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
// stores/use-global-store.ts
import { create } from 'zustand';
import { useWebsiteStore } from './store';

type GlobalSlot = 'header' | 'footer';

type GlobalSection = {
  id: string;
  type: string;
  props?: any;
  content?: string;
};

type GlobalStore = {
  getSections: (slot: GlobalSlot) => GlobalSection[];
  updateSection: (
    slot: GlobalSlot,
    id: string,
    patch: Partial<GlobalSection>,
  ) => void;
};

export const useGlobalStore = create<GlobalStore>(() => ({
  getSections: (slot) => {
    const { website } = useWebsiteStore.getState();
    return (website.globals?.[slot] as GlobalSection[]) ?? [];
  },

  updateSection: (slot, id, patch) => {
    const { website, setWebsite } = useWebsiteStore.getState();
    const arr = ((website.globals?.[slot] as GlobalSection[]) ?? []).map((s) =>
      s.id === id ? { ...s, ...patch } : s,
    );
    setWebsite({
      ...website,
      globals: { ...(website.globals ?? {}), [slot]: arr },
    });
  },
}));
