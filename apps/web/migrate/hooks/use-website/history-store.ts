import { create } from 'zustand';

type WebsiteSnapshot = any;

type HistoryState = {
  past: WebsiteSnapshot[];
  future: WebsiteSnapshot[];
  canUndo: boolean;
  canRedo: boolean;
  record: (snapshot: WebsiteSnapshot) => void;
  undo: (current: WebsiteSnapshot) => WebsiteSnapshot | null;
  redo: (current: WebsiteSnapshot) => WebsiteSnapshot | null;
  clear: () => void;
};

const HISTORY_LIMIT = 50;

function cloneSnapshot<T>(snapshot: T): T {
  if (typeof structuredClone === 'function') return structuredClone(snapshot);
  return JSON.parse(JSON.stringify(snapshot));
}

export const useWebsiteHistory = create<HistoryState>()((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  record: (snapshot) => {
    if (!snapshot) return;
    set(({ past }) => {
      const nextPast = [...past, cloneSnapshot(snapshot)].slice(-HISTORY_LIMIT);
      return {
        past: nextPast,
        future: [],
        canUndo: nextPast.length > 0,
        canRedo: false,
      };
    });
  },

  undo: (current) => {
    let previous: WebsiteSnapshot | null = null;
    set((state) => {
      if (state.past.length === 0) return state;
      const past = [...state.past];
      previous = past.pop() ?? null;
      const future = [cloneSnapshot(current), ...state.future];
      return {
        past,
        future,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
      };
    });
    return previous ? cloneSnapshot(previous) : null;
  },

  redo: (current) => {
    let next: WebsiteSnapshot | null = null;
    set((state) => {
      if (state.future.length === 0) return state;
      const [head, ...rest] = state.future;
      next = head ?? null;
      const past = [...state.past, cloneSnapshot(current)].slice(
        -HISTORY_LIMIT,
      );
      return {
        past,
        future: rest,
        canUndo: past.length > 0,
        canRedo: rest.length > 0,
      };
    });
    return next ? cloneSnapshot(next) : null;
  },

  clear: () => set({ past: [], future: [], canUndo: false, canRedo: false }),
}));
