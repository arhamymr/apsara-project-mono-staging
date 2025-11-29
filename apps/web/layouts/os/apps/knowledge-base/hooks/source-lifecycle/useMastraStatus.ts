import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import type { Source } from '@/layouts/os/apps/knowledge-base/types';
import type { MastraIngestStatus } from '@/layouts/os/apps/knowledge-base/utils/network';
import { fetchMastraIngestStatus } from '@/layouts/os/apps/knowledge-base/utils/network';
import type { UseMastraStatusResult } from './types';

export function useMastraStatus(
  selectedSource: Source | null,
): UseMastraStatusResult {
  const statusQueryEnabled = useMemo(() => {
    if (!selectedSource?.id || !selectedSource.mastraRunId) return false;
    if (
      typeof selectedSource.statusRaw === 'string' &&
      selectedSource.statusRaw.toLowerCase() === 'complete'
    ) {
      return false;
    }
    return !Number.isNaN(Number(selectedSource.id));
  }, [selectedSource]);

  const queryFn = useCallback(async () => {
    if (!selectedSource?.id || !selectedSource.mastraRunId) {
      throw new Error('Mastra status cannot be fetched without a source.');
    }
    return await fetchMastraIngestStatus(
      Number(selectedSource.id),
      selectedSource.mastraRunId,
    );
  }, [selectedSource]);

  const {
    data: mastraStatus,
    isFetching: isFetchingMastraStatus,
    error: mastraStatusError,
    refetch: refetchMastraStatus,
  } = useQuery<MastraIngestStatus>({
    queryKey: [
      'knowledge-bases',
      selectedSource?.id,
      'mastra-status',
      selectedSource?.mastraRunId,
    ],
    queryFn,
    enabled: statusQueryEnabled,
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  });

  const mastraStatusErrorMessage = useMemo(() => {
    if (mastraStatusError instanceof Error) return mastraStatusError.message;
    if (mastraStatusError) return 'Unable to fetch ingest status.';
    return null;
  }, [mastraStatusError]);

  const refreshMastraStatus = useCallback(() => {
    if (!statusQueryEnabled) return undefined;
    return refetchMastraStatus();
  }, [refetchMastraStatus, statusQueryEnabled]);

  return {
    mastraStatus,
    isFetchingMastraStatus,
    mastraStatusErrorMessage,
    refreshMastraStatus,
    statusQueryEnabled,
  };
}
