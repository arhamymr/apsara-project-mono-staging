/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import type { AnyNode, Artboard, Document } from './types';

type Action =
  | { type: 'LOAD'; payload: Document }
  | { type: 'SAVE' }
  | { type: 'ADD_ARTBOARD'; payload: Partial<Artboard> }
  | { type: 'SET_ACTIVE_ARTBOARD'; payload: string }
  | { type: 'ADD_NODE'; payload: { artboardId?: string; node: AnyNode } }
  | { type: 'ADD_IMAGE'; payload: { artboardId?: string; node: AnyNode } }
  | {
      type: 'UPDATE_NODE';
      payload: { id: string; updater: (n: AnyNode) => AnyNode };
    }
  | { type: 'REMOVE_NODE'; payload: { id: string } }
  | {
      type: 'REORDER';
      payload: { id: string; dir: 'up' | 'down' | 'top' | 'bottom' };
    }
  | { type: 'TOGGLE_VISIBLE'; payload: { id: string } }
  | { type: 'TOGGLE_LOCK'; payload: { id: string } }
  | { type: 'RENAME'; payload: { id: string; name: string } };

type State = {
  doc: Document;
  selectedId: string | null;
};

const STORAGE_KEY = 'gd:doc';

function genId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function defaultDocument(): Document {
  const abId = genId('ab');
  return {
    artboards: [
      {
        id: abId,
        name: 'Artboard 1',
        x: 0,
        y: 0,
        width: 1280,
        height: 720,
        background: '#0b0f17',
      },
    ],
    activeArtboardId: abId,
    nodesByArtboard: { [abId]: [] },
  };
}

function reducer(state: State, action: Action): State {
  const abId = state.doc.activeArtboardId;
  const nodes = state.doc.nodesByArtboard[abId] || [];
  switch (action.type) {
    case 'LOAD':
      return { ...state, doc: action.payload };
    case 'SAVE':
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.doc));
      }
      return state;
    case 'ADD_ARTBOARD': {
      const id = genId('ab');
      const ab: Artboard = {
        id,
        name:
          action.payload.name || `Artboard ${state.doc.artboards.length + 1}`,
        x: action.payload.x ?? 0,
        y: action.payload.y ?? 0,
        width: action.payload.width ?? 1280,
        height: action.payload.height ?? 720,
        background: action.payload.background ?? '#0b0f17',
      };
      return {
        ...state,
        doc: {
          ...state.doc,
          artboards: [...state.doc.artboards, ab],
          activeArtboardId: ab.id,
          nodesByArtboard: { ...state.doc.nodesByArtboard, [ab.id]: [] },
        },
      };
    }
    case 'SET_ACTIVE_ARTBOARD':
      return {
        ...state,
        doc: { ...state.doc, activeArtboardId: action.payload },
      };
    case 'ADD_NODE': {
      const targetAb = action.payload.artboardId || abId;
      const list = state.doc.nodesByArtboard[targetAb] || [];
      const node = action.payload.node;
      return {
        ...state,
        doc: {
          ...state.doc,
          nodesByArtboard: {
            ...state.doc.nodesByArtboard,
            [targetAb]: [...list, node],
          },
        },
        selectedId: node.id,
      };
    }
    case 'ADD_IMAGE': {
      const targetAb = action.payload.artboardId || abId;
      const list = state.doc.nodesByArtboard[targetAb] || [];
      const node = action.payload.node;
      return {
        ...state,
        doc: {
          ...state.doc,
          nodesByArtboard: {
            ...state.doc.nodesByArtboard,
            [targetAb]: [...list, node],
          },
        },
        selectedId: node.id,
      };
    }
    case 'UPDATE_NODE': {
      const updated = nodes.map((n) =>
        n.id === action.payload.id ? action.payload.updater(n) : n,
      );
      return {
        ...state,
        doc: {
          ...state.doc,
          nodesByArtboard: { ...state.doc.nodesByArtboard, [abId]: updated },
        },
      };
    }
    case 'REMOVE_NODE': {
      const filtered = nodes.filter((n) => n.id !== action.payload.id);
      return {
        ...state,
        doc: {
          ...state.doc,
          nodesByArtboard: { ...state.doc.nodesByArtboard, [abId]: filtered },
        },
        selectedId:
          state.selectedId === action.payload.id ? null : state.selectedId,
      };
    }
    case 'REORDER': {
      const idx = nodes.findIndex((n) => n.id === action.payload.id);
      if (idx < 0) return state;
      const arr = nodes.slice();
      const [item] = arr.splice(idx, 1);
      if (!item) return state;
      if (action.payload.dir === 'up')
        arr.splice(Math.min(idx + 1, arr.length), 0, item);
      else if (action.payload.dir === 'down')
        arr.splice(Math.max(idx - 1, 0), 0, item);
      else if (action.payload.dir === 'top') arr.push(item);
      else if (action.payload.dir === 'bottom') arr.unshift(item);
      return {
        ...state,
        doc: {
          ...state.doc,
          nodesByArtboard: { ...state.doc.nodesByArtboard, [abId]: arr },
        },
      };
    }
    case 'TOGGLE_VISIBLE': {
      const updated = nodes.map((n) =>
        n.id === action.payload.id
          ? { ...n, visible: n.visible === false ? true : false }
          : n,
      );
      return {
        ...state,
        doc: {
          ...state.doc,
          nodesByArtboard: { ...state.doc.nodesByArtboard, [abId]: updated },
        },
      };
    }
    case 'TOGGLE_LOCK': {
      const updated = nodes.map((n) =>
        n.id === action.payload.id
          ? { ...n, locked: n.locked ? false : true }
          : n,
      );
      return {
        ...state,
        doc: {
          ...state.doc,
          nodesByArtboard: { ...state.doc.nodesByArtboard, [abId]: updated },
        },
      };
    }
    case 'RENAME': {
      const updated = nodes.map((n) =>
        n.id === action.payload.id ? { ...n, name: action.payload.name } : n,
      );
      return {
        ...state,
        doc: {
          ...state.doc,
          nodesByArtboard: { ...state.doc.nodesByArtboard, [abId]: updated },
        },
      };
    }
    default:
      return state;
  }
}

type Ctx = {
  state: State;
  dispatch: React.Dispatch<Action>;
  activeArtboard: Artboard | null;
  nodes: AnyNode[];
};

const StoreCtx = createContext<Ctx | null>(null);

export function CanvasStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    try {
      const raw =
        typeof window !== 'undefined'
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      if (raw)
        return { doc: JSON.parse(raw) as Document, selectedId: null } as State;
    } catch {
      // Ignore localStorage errors
    }
    return { doc: defaultDocument(), selectedId: null } as State;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.doc));
    } catch {
      // Ignore localStorage errors
    }
  }, [state.doc]);

  const activeArtboard = useMemo(
    () =>
      state.doc.artboards.find((a) => a.id === state.doc.activeArtboardId) ||
      null,
    [state.doc],
  );
  const nodes = useMemo(
    () => state.doc.nodesByArtboard[state.doc.activeArtboardId] || [],
    [state.doc],
  );

  const value = useMemo<Ctx>(
    () => ({ state, dispatch, activeArtboard, nodes }),
    [state, activeArtboard, nodes],
  );
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useCanvasStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx)
    throw new Error('useCanvasStore must be used within CanvasStoreProvider');
  return ctx;
}

export function useCanvasActions() {
  const { dispatch } = useCanvasStore();
  return useMemo(
    () => ({
      addArtboard: (partial: Partial<Artboard> = {}) =>
        dispatch({ type: 'ADD_ARTBOARD', payload: partial }),
      setActiveArtboard: (id: string) =>
        dispatch({ type: 'SET_ACTIVE_ARTBOARD', payload: id }),
      addNode: (node: AnyNode, artboardId?: string) =>
        dispatch({ type: 'ADD_NODE', payload: { artboardId, node } }),
      addImageNode: (node: AnyNode, artboardId?: string) =>
        dispatch({ type: 'ADD_IMAGE', payload: { artboardId, node } }),
      updateNode: (id: string, updater: (n: AnyNode) => AnyNode) =>
        dispatch({ type: 'UPDATE_NODE', payload: { id, updater } }),
      removeNode: (id: string) =>
        dispatch({ type: 'REMOVE_NODE', payload: { id } }),
      reorder: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') =>
        dispatch({ type: 'REORDER', payload: { id, dir } }),
      toggleVisible: (id: string) =>
        dispatch({ type: 'TOGGLE_VISIBLE', payload: { id } }),
      toggleLock: (id: string) =>
        dispatch({ type: 'TOGGLE_LOCK', payload: { id } }),
      rename: (id: string, name: string) =>
        dispatch({ type: 'RENAME', payload: { id, name } }),
      save: () => dispatch({ type: 'SAVE' }),
      load: (doc: Document) => dispatch({ type: 'LOAD', payload: doc }),
    }),
    [dispatch],
  );
}
