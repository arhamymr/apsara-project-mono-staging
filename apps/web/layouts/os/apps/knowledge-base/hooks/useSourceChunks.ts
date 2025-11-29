import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { KBChunk } from '@/layouts/os/apps/knowledge-base/components/types';
import type { Source } from '@/layouts/os/apps/knowledge-base/types';
import { mapChunkApiToKBChunk } from '@/layouts/os/apps/knowledge-base/utils/chunks';
import { fetchSourceChunks } from '@/layouts/os/apps/knowledge-base/utils/network';

type UseSourceChunksResult = {
  chunks: KBChunk[];
  isLoadingChunks: boolean;
  isFetchingChunks: boolean;
  chunksError: unknown;
  chunksErrorMessage: string | null;
  refetchChunks: () => Promise<unknown>;
  chunksQueryEnabled: boolean;
};

export function useSourceChunks(source: Source | null): UseSourceChunksResult {
  const sourceKey = source?.id ?? null;
  const chunksQueryEnabled = Boolean(sourceKey);

  const {
    data: chunks = [],
    isLoading,
    isInitialLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['knowledge-bases', 'sources', sourceKey, 'chunks'],
    queryFn: async () => {
      if (!sourceKey) return [];
      const apiChunks = await fetchSourceChunks({
        sourceId: sourceKey,
        perPage: 200,
      });
      return apiChunks.map(mapChunkApiToKBChunk);
    },
    enabled: chunksQueryEnabled,
    staleTime: 30_000,
  });

  const chunksErrorMessage = useMemo(() => {
    if (!chunksQueryEnabled) return null;
    if (error instanceof Error) return error.message;
    if (error) return 'Unable to load chunks.';
    return null;
  }, [chunksQueryEnabled, error]);

  return {
    chunks,
    isLoadingChunks: chunksQueryEnabled && (isLoading || isInitialLoading),
    isFetchingChunks: chunksQueryEnabled && isFetching,
    chunksError: error,
    chunksErrorMessage,
    refetchChunks: refetch,
    chunksQueryEnabled,
  };
}
