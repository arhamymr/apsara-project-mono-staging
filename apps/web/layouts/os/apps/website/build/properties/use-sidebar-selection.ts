import * as React from 'react';

import { useWebsiteHistory } from '@/hooks/use-website/history-store';
import {
  useBuilderSelection,
  type SelectionTarget,
} from '@/hooks/use-website/selection-store';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';

import type { EditorSlot } from '../../runtime/editor-types';
import {
  duplicateWebsiteNode,
  getNodeFromWebsite,
  patchWebsiteNode,
  removeWebsiteNode,
} from '../../runtime/node-ops';

export type SidebarSelectionResult = {
  selectedNode: TemplateNode | null;
  selectedTarget: SelectionTarget | null;
  hasSelection: boolean;
  applyPatch: (
    patch: Partial<TemplateNode>,
    options?: { silent?: boolean },
  ) => void;
  clearSelection: () => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
};

const makeSelectionKey = (slot: EditorSlot, path: number[]) => {
  const slotKey =
    slot.kind === 'global' ? `g:${slot.slot}` : `p:${slot.pageId}`;
  return `${slotKey}:${path.join('.')}`;
};

export function useSidebarSelection(
  website: any,
  setWebsite: (updater: (prev: any) => any) => void,
): SidebarSelectionResult {
  const selected = useBuilderSelection((s) => s.selected);
  const setSelected = useBuilderSelection((s) => s.setSelected);
  const setHovered = useBuilderSelection((s) => s.setHovered);
  const clearSelectionStore = useBuilderSelection((s) => s.clearSelection);
  const recordHistory = useWebsiteHistory((state) => state.record);

  const editSessionRef = React.useRef<{
    key: string | null;
    snapshot: any | null;
  }>({ key: null, snapshot: null });

  const beginEditSession = React.useCallback(
    (slot: EditorSlot, path: number[]) => {
      const key = makeSelectionKey(slot, path);
      if (editSessionRef.current.key === key) return;
      editSessionRef.current = {
        key,
        snapshot:
          typeof structuredClone === 'function'
            ? structuredClone(website)
            : JSON.parse(JSON.stringify(website)),
      };
    },
    [website],
  );

  const commitEditSession = React.useCallback(() => {
    if (editSessionRef.current.snapshot) {
      recordHistory(editSessionRef.current.snapshot);
    }
    editSessionRef.current = { key: null, snapshot: null };
  }, [recordHistory]);

  React.useEffect(() => {
    if (!selected) {
      editSessionRef.current = { key: null, snapshot: null };
      return;
    }
    const nextKey = makeSelectionKey(selected.slot, selected.path);
    if (
      editSessionRef.current.key &&
      editSessionRef.current.key !== nextKey &&
      editSessionRef.current.snapshot
    ) {
      recordHistory(editSessionRef.current.snapshot);
      editSessionRef.current = { key: null, snapshot: null };
    }
  }, [recordHistory, selected]);

  const selectedNode = React.useMemo(
    () => (selected ? getNodeFromWebsite(website as any, selected) : null),
    [selected, website],
  );

  const applyPatch = React.useCallback(
    (patch: Partial<TemplateNode>, options?: { silent?: boolean }) => {
      if (!selected) return;
      beginEditSession(selected.slot, selected.path);
      if (!options?.silent && editSessionRef.current.snapshot) {
        commitEditSession();
      }
      setWebsite((prev: any) => patchWebsiteNode(prev, selected, patch));
      if (!options?.silent) {
        editSessionRef.current = { key: null, snapshot: null };
      }
    },
    [beginEditSession, commitEditSession, selected, setWebsite],
  );

  const clearSelection = React.useCallback(() => {
    if (editSessionRef.current.snapshot) {
      recordHistory(editSessionRef.current.snapshot);
    }
    clearSelectionStore();
    setHovered(null);
    editSessionRef.current = { key: null, snapshot: null };
  }, [clearSelectionStore, recordHistory, setHovered]);

  const deleteSelected = React.useCallback(() => {
    if (!selected) return;
    recordHistory(website);
    setWebsite((prev: any) => removeWebsiteNode(prev, selected));
    clearSelection();
  }, [clearSelection, recordHistory, selected, setWebsite, website]);

  const duplicateSelected = React.useCallback(() => {
    if (!selected) return;
    recordHistory(website);
    let nextSelection: SelectionTarget | null = null;
    setWebsite((prev: any) => {
      const result = duplicateWebsiteNode(prev, selected);
      if (result.node) {
        nextSelection = {
          slot: selected.slot,
          nodeId: result.node.id ?? 'node',
          path: [...result.path],
        };
      }
      return result.node ? result.website : prev;
    });
    editSessionRef.current = { key: null, snapshot: null };
    if (nextSelection) {
      setSelected(nextSelection);
    }
  }, [recordHistory, selected, setSelected, setWebsite, website]);

  return {
    selectedNode,
    selectedTarget: selected,
    hasSelection: Boolean(selectedNode),
    applyPatch,
    clearSelection,
    deleteSelected,
    duplicateSelected,
  };
}
