'use client';
import type {
  EditorSelection,
  EditorSlot,
} from '@/layouts/os/apps/website/runtime/editor-types';
import { create } from 'zustand';

export type SelectionTarget = {
  slot: EditorSlot;
  nodeId: string;
  path: number[];
};

type SelectionState = {
  hovered: SelectionTarget | null;
  selected: SelectionTarget | null;
  setHovered: (target: EditorSelection | SelectionTarget | null) => void;
  setSelected: (target: EditorSelection | SelectionTarget | null) => void;
  clearSelection: () => void;
};

function toSelectionTarget(
  payload: EditorSelection | SelectionTarget | null,
): SelectionTarget | null {
  if (!payload) return null;
  return {
    slot: payload.slot,
    nodeId: payload.nodeId,
    path: payload.path,
  };
}

export const useBuilderSelection = create<SelectionState>((set) => ({
  hovered: null,
  selected: null,
  setHovered: (target) => set({ hovered: toSelectionTarget(target) }),
  setSelected: (target) => set({ selected: toSelectionTarget(target) }),
  clearSelection: () => set({ selected: null, hovered: null }),
}));
