import { useMemo } from 'react';

import type { Source } from '@/layouts/os/apps/knowledge-base/types';

type UseSourcesStateParams = {
  rawSources: Source[];
  selectedSourceId: string | null;
  sourcesQueryEnabled: boolean;
};

type UseSourcesStateResult = {
  sources: Source[];
  selectedSource: Source | null;
};

export function useSourcesState({
  rawSources,
  selectedSourceId,
  sourcesQueryEnabled,
}: UseSourcesStateParams): UseSourcesStateResult {
  const sources = useMemo<Source[]>(() => {
    if (!sourcesQueryEnabled) return [];
    return rawSources;
  }, [rawSources, sourcesQueryEnabled]);

  const selectedSource = useMemo(() => {
    if (!selectedSourceId) return null;
    return sources.find((source) => source.id === selectedSourceId) ?? null;
  }, [selectedSourceId, sources]);

  return {
    sources,
    selectedSource,
  };
}
