import { fetcher } from '@/lib/fetcher';

import type {
  ChunkApi,
  ChunkUpsertInput,
} from '@/layouts/os/apps/knowledge-base/types';

type UpsertChunksResponse = {
  message?: string;
  chunks?: ChunkApi[];
};

export type UpsertSourceChunksPayload = {
  chunks: ChunkUpsertInput[];
};

export async function upsertSourceChunks(
  sourceId: number | string,
  payload: UpsertSourceChunksPayload,
): Promise<ChunkApi[]> {
  const normalizedId = encodeURIComponent(String(sourceId));

  const response = await fetcher<UpsertChunksResponse>(
    `/api/dashboard/knowledge-bases/sources/${normalizedId}/chunks/batch`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  return response.chunks ?? [];
}

type ChunkListResponse = {
  data?: ChunkApi[];
  meta?: {
    current_page?: number;
    per_page?: number;
    last_page?: number;
    total?: number;
  };
};

export type FetchSourceChunksParams = {
  sourceId: number | string;
  page?: number;
  perPage?: number;
  signal?: AbortSignal;
};

export async function fetchSourceChunks({
  sourceId,
  page = 1,
  perPage = 100,
  signal,
}: FetchSourceChunksParams): Promise<ChunkApi[]> {
  const normalizedId = encodeURIComponent(String(sourceId));
  const params = new URLSearchParams();
  if (page) params.set('page', String(page));
  if (perPage) params.set('per_page', String(perPage));

  const query = params.toString();
  const response = await fetcher<ChunkListResponse>(
    `/api/dashboard/knowledge-bases/sources/${normalizedId}/chunks${
      query ? `?${query}` : ''
    }`,
    { signal },
  );
  return response.data ?? [];
}
