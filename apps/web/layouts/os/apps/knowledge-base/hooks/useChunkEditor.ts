import { useCallback, useMemo, useState } from 'react';

import type { KBChunk } from '@/layouts/os/apps/knowledge-base/components/types';

type UseChunkEditorResult = {
  chunkSheetOpen: boolean;
  setChunkSheetOpen: (open: boolean) => void;
  chunkEditing: KBChunk | null;
  activeChunks: KBChunk[];
  handleEditChunk: (chunk: KBChunk) => void;
  handleChunkTextChange: (text: string) => void;
  handleUpsertChunk: () => void;
  handleCreateChunkFromSource: () => void;
  setChunksForSource: (sourceId: string, chunks: KBChunk[]) => void;
};

export function useChunkEditor(
  selectedSourceId: string | null,
): UseChunkEditorResult {
  const [chunkSheetOpen, setChunkSheetOpen] = useState(false);
  const [chunkEditing, setChunkEditing] = useState<KBChunk | null>(null);
  const [chunksBySource, setChunksBySource] = useState<
    Record<string, KBChunk[]>
  >({});

  const activeChunks = useMemo(() => {
    return selectedSourceId ? (chunksBySource[selectedSourceId] ?? []) : [];
  }, [chunksBySource, selectedSourceId]);

  const handleEditChunk = useCallback((chunk: KBChunk) => {
    setChunkEditing(chunk);
    setChunkSheetOpen(true);
  }, []);

  const handleChunkTextChange = useCallback(
    (text: string) => {
      if (!chunkEditing) return;
      setChunkEditing({ ...chunkEditing, text });
    },
    [chunkEditing],
  );

  const handleUpsertChunk = useCallback(() => {
    if (!chunkEditing) return;
    const list = [...(chunksBySource[chunkEditing.sourceId] ?? [])];
    const index = list.findIndex((chunk) => chunk.id === chunkEditing.id);
    const updatedChunk = {
      ...chunkEditing,
      updatedAt: new Date().toISOString(),
    };
    if (index >= 0) {
      list[index] = updatedChunk;
    } else {
      list.push(updatedChunk);
    }
    setChunksBySource((previous) => ({
      ...previous,
      [chunkEditing.sourceId]: list,
    }));
    setChunkSheetOpen(false);
  }, [chunkEditing, chunksBySource]);

  const handleCreateChunkFromSource = useCallback(() => {
    if (!selectedSourceId) return;
    const chunks = chunksBySource[selectedSourceId] ?? [];
    const nextIndex = chunks.length
      ? Math.max(...chunks.map((chunk) => chunk.index)) + 1
      : 0;
    const newChunk: KBChunk = {
      id: `temp-${Date.now()}`,
      sourceId: selectedSourceId,
      index: nextIndex,
      text: '',
    };
    setChunkEditing(newChunk);
    setChunkSheetOpen(true);
  }, [chunksBySource, selectedSourceId]);

  const setChunksForSource = useCallback(
    (sourceId: string, chunks: KBChunk[]) => {
      setChunksBySource((previous) => ({
        ...previous,
        [sourceId]: chunks,
      }));
    },
    [],
  );

  return {
    chunkSheetOpen,
    setChunkSheetOpen,
    chunkEditing,
    activeChunks,
    handleEditChunk,
    handleChunkTextChange,
    handleUpsertChunk,
    handleCreateChunkFromSource,
    setChunksForSource,
  };
}
