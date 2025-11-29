import type {
  EditorSelection,
  EditorSlot,
} from '@/layouts/os/apps/website/runtime/editor-types';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';
import { create } from 'zustand';

export type DropTarget = {
  slot: EditorSlot;
  path: number[];
  insertIndex?: number;
};

type BuilderDndState = {
  activeTemplate: TemplateNode | null;
  setActiveTemplate: (template: TemplateNode | null) => void;
  activeSelection: EditorSelection | null;
  setActiveSelection: (selection: EditorSelection | null) => void;
  dropTarget: DropTarget | null;
  setDropTarget: (target: DropTarget | null) => void;
};

export const useBuilderDnd = create<BuilderDndState>((set) => ({
  activeTemplate: null,
  setActiveTemplate: (template) => set({ activeTemplate: template }),
  activeSelection: null,
  setActiveSelection: (selection) => set({ activeSelection: selection }),
  dropTarget: null,
  setDropTarget: (target) => set({ dropTarget: target }),
}));
