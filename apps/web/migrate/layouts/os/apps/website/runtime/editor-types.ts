import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';

export type EditorSlot =
  | { kind: 'global'; slot: string }
  | { kind: 'page'; pageId: string };

export type EditorSelection = {
  nodeId: string;
  node: TemplateNode;
  slot: EditorSlot;
  path: number[];
};

export type EditorConfig = {
  mode?: 'preview' | 'editor';
  slot?: EditorSlot;
  selectedNodeId?: string;
  hoveredNodeId?: string;
  onSelect?: (payload: EditorSelection) => void;
  onHover?: (payload: EditorSelection | null) => void;
  onPatch?: (
    payload: EditorSelection,
    patch: Partial<TemplateNode>,
    options?: { silent?: boolean },
  ) => void;
};
