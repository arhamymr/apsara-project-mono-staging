import type { ChunkUpsertInput } from '@/layouts/os/apps/knowledge-base/types';
import { mapChunkApiToKBChunk } from '@/layouts/os/apps/knowledge-base/utils/chunks';
import type {
  MarkSourceCompletePayload,
  MastraIngestStatus,
} from '@/layouts/os/apps/knowledge-base/utils/network';
import {
  deleteSource,
  fetchMastraIngestStatus,
  markSourceComplete,
  upsertSourceChunks,
} from '@/layouts/os/apps/knowledge-base/utils/network';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import type {
  UseSourceLifecycleParams,
  UseSourceLifecycleResult,
} from './types';
import { useMastraStatus } from './useMastraStatus';
import { useSourceIngest } from './useSourceIngest';
import {
  isMastraRunSuccessful,
  parseSourceNumericId,
  prepareChunkExtraction,
} from './utils';

export function useSourceLifecycle({
  viewMode,
  selectedSource,
  refetchSources,
  onSourceCleared,
  onChunksUpserted,
}: UseSourceLifecycleParams): UseSourceLifecycleResult {
  const lastProcessedRunIdRef = useRef<string | null>(null);
  const [manualRefreshPending, setManualRefreshPending] = useState(false);

  const {
    mastraStatus,
    isFetchingMastraStatus,
    mastraStatusErrorMessage,
    refreshMastraStatus: refetchMastraStatusQuery,
    statusQueryEnabled,
  } = useMastraStatus(selectedSource);

  const { canIngest, isIngesting, handleTriggerIngest } = useSourceIngest({
    selectedSource,
    refetchSources,
  });

  const { mutateAsync: upsertChunks, isPending: isUpsertingChunks } =
    useMutation({
      mutationFn: async ({
        sourceId,
        chunks,
      }: {
        sourceId: number;
        chunks: ChunkUpsertInput[];
      }) => {
        return await upsertSourceChunks(sourceId, { chunks });
      },
    });

  const { mutateAsync: markSourceCompleteMutation } = useMutation({
    mutationFn: async ({
      sourceId,
      payload,
    }: {
      sourceId: number;
      payload: MarkSourceCompletePayload;
    }) => {
      return await markSourceComplete(sourceId, payload);
    },
  });

  const processMastraStatus = useCallback(
    async (status: MastraIngestStatus | undefined | null) => {
      if (
        !status ||
        !selectedSource ||
        isUpsertingChunks ||
        selectedSource.statusRaw === 'complete'
      ) {
        return;
      }

      if (!isMastraRunSuccessful(status)) {
        return;
      }

      const extraction = prepareChunkExtraction(
        status,
        selectedSource,
        lastProcessedRunIdRef.current,
      );
      if (extraction.kind === 'skip') return;

      if (extraction.kind === 'empty') {
        toast('Mastra ingestion returned no chunk data.', {
          description:
            'Chunks will remain unchanged. Re-run ingest if this is unexpected.',
        });
        lastProcessedRunIdRef.current = extraction.runId;
        return;
      }

      const numericId = parseSourceNumericId(selectedSource);
      if (numericId == null) {
        lastProcessedRunIdRef.current = extraction.runId;
        return;
      }

      try {
        const apiChunks = await upsertChunks({
          sourceId: numericId,
          chunks: extraction.payload,
        });
        const mappedChunks = apiChunks.map(mapChunkApiToKBChunk);
        if (mappedChunks.length) {
          onChunksUpserted?.(String(selectedSource.id), mappedChunks);
        }
        const savedCount = mappedChunks.length;
        toast('Ingestion complete', {
          description:
            savedCount > 0
              ? `${savedCount} chunk${savedCount === 1 ? '' : 's'} saved.`
              : 'Chunks saved successfully.',
        });
        if (savedCount === 0) {
          lastProcessedRunIdRef.current = extraction.runId;
          return;
        }

        await refetchSources();

        try {
          await markSourceCompleteMutation({
            sourceId: numericId,
            payload: { status: 'success', chunks: savedCount },
          });
        } catch (error) {
          console.error('Failed to finalize source status', error);
          toast('Failed to finalize source status.', {
            description:
              error instanceof Error
                ? error.message
                : 'Unexpected error occurred.',
          });
        }
      } catch (error) {
        console.error('Failed to upsert chunks', error);
        toast('Failed to save chunks.', {
          description:
            error instanceof Error
              ? error.message
              : 'Unexpected error occurred.',
        });
      } finally {
        lastProcessedRunIdRef.current = extraction.runId;
      }
    },
    [
      isUpsertingChunks,
      markSourceCompleteMutation,
      onChunksUpserted,
      refetchSources,
      selectedSource,
      upsertChunks,
    ],
  );

  useEffect(() => {
    if (!mastraStatus) return;
    void processMastraStatus(mastraStatus);
  }, [mastraStatus, processMastraStatus]);

  const handleManualRefreshStatus = useCallback(async () => {
    if (!selectedSource) {
      toast('Select a source to refresh.');
      return;
    }

    const numericId = parseSourceNumericId(selectedSource);
    if (numericId == null || !selectedSource.mastraRunId) {
      toast('Unable to refresh status.', {
        description: 'Missing source identifier or Mastra run ID.',
      });
      return;
    }

    setManualRefreshPending(true);
    try {
      const status = await fetchMastraIngestStatus(
        numericId,
        selectedSource.mastraRunId,
        {
          fresh: true,
        },
      );
      await processMastraStatus(status);
    } catch (error) {
      console.error('Manual refresh failed', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to fetch the latest Mastra status.';
      toast(message);
    } finally {
      setManualRefreshPending(false);
    }
  }, [processMastraStatus, selectedSource]);

  useEffect(() => {
    if (
      viewMode === 'detail' &&
      statusQueryEnabled &&
      selectedSource?.statusRaw !== 'complete'
    ) {
      const result = refetchMastraStatusQuery();
      if (result) void result;
    }
  }, [
    viewMode,
    statusQueryEnabled,
    selectedSource?.statusRaw,
    refetchMastraStatusQuery,
    selectedSource?.mastraRunId,
  ]);

  const deleteSourceMutation = useMutation({
    mutationFn: async (sourceId: number) => deleteSource(sourceId),
    onSuccess: () => {
      toast('Source deleted');
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to delete source.';
      toast(message);
    },
  });

  const handleDeleteSource = useCallback(async () => {
    if (!selectedSource) return;
    const numericId = Number(selectedSource.id);
    if (Number.isNaN(numericId)) {
      toast('Unable to delete source.', {
        description: 'The selected source identifier is invalid.',
      });
      return;
    }

    try {
      await deleteSourceMutation.mutateAsync(numericId);
      onSourceCleared();
      await refetchSources();
    } catch {
      // handled via mutation onError
    }
  }, [deleteSourceMutation, onSourceCleared, refetchSources, selectedSource]);

  return {
    mastraStatus,
    isFetchingMastraStatus: isFetchingMastraStatus || manualRefreshPending,
    mastraStatusErrorMessage,
    refreshMastraStatus: handleManualRefreshStatus,
    handleDeleteSource,
    isDeleting: deleteSourceMutation.isPending,
    handleTriggerIngest,
    canIngest,
    isIngesting,
  };
}
