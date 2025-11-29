import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';
import type { EditorSlot } from '../runtime/editor-types';

export type SimpleEditorMode = 'view' | 'edit';

export type SimpleEditorConfig = {
  mode?: SimpleEditorMode;
  slot?: EditorSlot;
  onSelect?: (payload: { node: TemplateNode; path: number[] }) => void;
  onHover?: (payload: { node: TemplateNode; path: number[] } | null) => void;
  /**
   * Called when editable text content changes.
   * Receives the affected node path and the new text value.
   */
  onTextChange?: (path: number[], value: string) => void;
};
