import type { EditorSlot } from '@/layouts/os/apps/website/runtime/editor-types';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';
import type * as React from 'react';

export type NodePatchHandler = (
  patch: Partial<TemplateNode>,
  options?: { silent?: boolean },
) => void;

export type NodeChangeHandler = (
  key: keyof TemplateNode,
) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

export type NodeBlurHandler = (
  key: keyof TemplateNode,
) => (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

export type NodeEditorProps = {
  node: TemplateNode;
  onPatch: NodePatchHandler;
  onClear: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  location: { slot: EditorSlot; path: number[] } | null;
};
