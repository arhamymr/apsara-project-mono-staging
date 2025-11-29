import { create } from 'zustand';

import type {
  NodeAttrsMap,
  NodeModel,
  NodeType,
  Tool,
  Vec2,
} from '../core/model';
import {
  createCircleNode,
  createImageNode,
  createPathNode,
  createRectNode,
  createTextNode,
} from '../core/model';
import type { SelectionState } from '../core/selection';
import { clearSelection, toggleSelection } from '../core/selection';

type CanvasState = {
  nodes: NodeModel[];
  selection: SelectionState;
  activeTool: Tool;
  zoom: number;
  pan: Vec2;
  clipboard: NodeModel[];
  setTool: (tool: Tool) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNode: (id: string, attrs: Partial<NodeAttrsMap[NodeType]>) => void;
  moveNodes: (ids: string[], delta: Vec2) => void;
  selectNode: (id: string, multi: boolean) => void;
  clearSelection: () => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: Vec2) => void;
  copy: () => void;
  paste: () => void;
  setSelection: (ids: string[]) => void;
  deleteSelected: () => void;
};

const SAMPLE_NODES: NodeModel[] = [
  createRectNode({ x: 120, y: 100, width: 240, height: 140 }),
  createCircleNode({ x: 490, y: 200 }),
  createTextNode({ x: 140, y: 280, text: 'Minimal UI' }),
];

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: SAMPLE_NODES,
  selection: clearSelection(),
  activeTool: 'select',
  zoom: 1,
  pan: { x: 0, y: 0 },
  clipboard: [],
  setTool: (tool) => set({ activeTool: tool }),
  addNode: (type, position) =>
    set((state) => {
      const newNode =
        type === 'rect'
          ? createRectNode(position)
          : type === 'circle'
            ? createCircleNode(position)
            : type === 'text'
              ? createTextNode({ ...position, text: 'New text' })
              : type === 'image'
                ? createImageNode({ ...position, width: 200, height: 150 })
                : createPathNode(position);
      return {
        nodes: [...state.nodes, newNode],
        selection: { ids: [newNode.id] },
        activeTool: 'select',
      };
    }),
  updateNode: (id, attrs) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, attrs: { ...node.attrs, ...attrs } } : node,
      ),
    })),
  moveNodes: (ids, delta) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        ids.includes(node.id)
          ? {
              ...node,
              attrs: {
                ...node.attrs,
                x: node.attrs.x + delta.x,
                y: node.attrs.y + delta.y,
              },
            }
          : node,
      ),
    })),
  selectNode: (id, multi) =>
    set((state) => {
      const node = state.nodes.find((item) => item.id === id);
      if (!node || node.locked) {
        return {};
      }
      return {
        selection: toggleSelection(state.selection, id, multi),
      };
    }),
  clearSelection: () => set({ selection: clearSelection() }),
  toggleVisibility: (id) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, visible: !node.visible } : node,
      ),
    })),
  toggleLock: (id) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, locked: !node.locked } : node,
      ),
    })),
  setZoom: (zoom) => set({ zoom }),
  setPan: (pan) => set({ pan }),
  copy: () => {
    const state = get();
    const selectedNodes = state.nodes.filter((node) =>
      state.selection.ids.includes(node.id),
    );
    set({ clipboard: selectedNodes });
  },
  paste: () => {
    const state = get();
    if (state.clipboard.length === 0) return;

    const newNodes = state.clipboard.map((node) => {
      const newNode = { ...node };
      newNode.id = crypto.randomUUID();
      newNode.attrs = {
        ...newNode.attrs,
        x: newNode.attrs.x + 20,
        y: newNode.attrs.y + 20,
      };
      return newNode;
    });

    set({
      nodes: [...state.nodes, ...newNodes],
      selection: { ids: newNodes.map((n) => n.id) },
    });
  },
  setSelection: (ids) => set({ selection: { ids } }),
  deleteSelected: () =>
    set((state) => ({
      nodes: state.nodes.filter(
        (node) => !state.selection.ids.includes(node.id),
      ),
      selection: clearSelection(),
    })),
}));
