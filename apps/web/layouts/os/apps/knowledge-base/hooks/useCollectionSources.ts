import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { KnowledgeBase as ApiKnowledgeBase } from '@/layouts/os/apps/knowledge-base/types';
import { fetchCollectionSources } from '@/layouts/os/apps/knowledge-base/utils/network';

import type { Source } from '@/layouts/os/apps/knowledge-base/types';

type UseCollectionSourcesResult = {
  rawSources: Source[];
  refetchSources: () => Promise<unknown>;
  isLoadingSources: boolean;
  isFetchingSources: boolean;
  sourcesError: unknown;
  sourcesErrorMessage: string | null;
  sourcesQueryEnabled: boolean;
};

export function useCollectionSources(
  selectedKbRecord: ApiKnowledgeBase | null,
  selectedCollectionId: string | null,
): UseCollectionSourcesResult {
  const normalizedKbId = selectedKbRecord ? Number(selectedKbRecord.id) : null;
  const normalizedCollectionId = selectedCollectionId
    ? Number(selectedCollectionId)
    : null;
  const sourcesQueryEnabled = Boolean(
    normalizedKbId &&
      normalizedCollectionId &&
      !Number.isNaN(normalizedCollectionId),
  );

  const {
    data: rawSources = [],
    isLoading: isLoadingSources,
    isFetching: isFetchingSources,
    error: sourcesError,
    refetch: refetchSources,
  } = useQuery({
    queryKey: [
      'knowledge-bases',
      normalizedKbId,
      'collections',
      normalizedCollectionId,
      'sources',
    ],
    queryFn: () =>
      fetchCollectionSources({
        knowledgeBaseId: normalizedKbId!,
        collectionId: normalizedCollectionId!,
      }),
    enabled: sourcesQueryEnabled,
    staleTime: 30_000,
  });

  const sourcesErrorMessage = useMemo(() => {
    if (sourcesError instanceof Error) return sourcesError.message;
    if (sourcesError) return 'Unable to load sources.';
    return null;
  }, [sourcesError]);

  return {
    rawSources,
    refetchSources,
    isLoadingSources,
    isFetchingSources,
    sourcesError,
    sourcesErrorMessage,
    sourcesQueryEnabled,
  };
}
