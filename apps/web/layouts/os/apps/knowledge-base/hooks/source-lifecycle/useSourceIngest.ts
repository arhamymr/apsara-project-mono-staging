import { useMutation } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

import type { MastraIngestType } from '@/layouts/os/apps/knowledge-base/utils/network';
import { startSourceIngest } from '@/layouts/os/apps/knowledge-base/utils/network';
import { resolveMastraInputFromSource } from '@/layouts/os/apps/knowledge-base/utils/sourceTransforms';
import type { UseSourceIngestParams, UseSourceIngestResult } from './types';

export function useSourceIngest({
  selectedSource,
  refetchSources,
}: UseSourceIngestParams): UseSourceIngestResult {
  const selectedSourceIngestInput = useMemo(() => {
    return resolveMastraInputFromSource(selectedSource);
  }, [selectedSource]);

  const ingestSourceMutation = useMutation({
    mutationFn: async ({
      sourceId,
      type,
      input,
    }: {
      sourceId: number;
      type: MastraIngestType;
      input: string;
    }) => {
      return await startSourceIngest(sourceId, { type, input });
    },
  });

  const handleTriggerIngest = useCallback(async () => {
    if (!selectedSource) {
      toast('Unable to ingest source.', {
        description: 'Select a source before triggering ingest.',
      });
      return;
    }

    if (!selectedSourceIngestInput) {
      toast('Ingest unavailable for this source.', {
        description:
          'Provide a public URL or supported MIME type before triggering ingest.',
      });
      return;
    }

    const numericId = Number(selectedSource.id);
    if (Number.isNaN(numericId)) {
      toast('Unable to ingest source.', {
        description: 'The selected source identifier is invalid.',
      });
      return;
    }

    try {
      const response = await ingestSourceMutation.mutateAsync({
        sourceId: numericId,
        type: selectedSourceIngestInput.type,
        input: selectedSourceIngestInput.input,
      });

      if (response?.status === 'skipped') {
        toast('Mastra ingest skipped.', {
          description:
            typeof response.message === 'string'
              ? response.message
              : 'Configure the Mastra service to enable ingestion.',
        });
      } else {
        toast('Ingest triggered.');
      }

      await refetchSources();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to trigger ingest.';
      toast(message);
    }
  }, [
    ingestSourceMutation,
    refetchSources,
    selectedSource,
    selectedSourceIngestInput,
  ]);

  return {
    selectedSourceIngestInput,
    // Hide/disable ingest when DB status is complete
    canIngest: Boolean(
      selectedSource &&
        selectedSourceIngestInput &&
        selectedSource.statusRaw !== 'complete',
    ),
    isIngesting: ingestSourceMutation.isPending,
    handleTriggerIngest,
  };
}
