import type { Source, SourceApi } from '@/layouts/os/apps/knowledge-base/types';
import { fetcher } from '@/lib/fetcher';

import { mapApiListToSources } from '../sources';
import { handleFetcherError } from './errors';
import type { MastraIngestPayload, MastraIngestType } from './mastra';
import { startSourceIngest } from './mastra';

type PaginatedResponse<T> = {
  data: T[];
  meta?: unknown;
};

export type CreateSourcePayload = {
  knowledge_base_id: number;
  collection_id?: number | null;
  title: string;
  source_uri: string;
  lang?: string | null;
  visibility?: 'public' | 'private';
  mime?: string | null;
  size?: number | null;
  public_url?: string | null;
  directory?: string | null;
  storage_key?: string | null;
  storage_disk?: string | null;
  meta?: Record<string, unknown>;
};

export type FetchCollectionSourcesParams = {
  knowledgeBaseId: number;
  collectionId: number;
  page?: number;
  perPage?: number;
};

export type MarkSourceCompletePayload = {
  status: string;
  tokens?: number | null;
  chunks?: number | null;
  meta?: Record<string, unknown> | null;
};

export async function createSource(
  payload: CreateSourcePayload,
): Promise<SourceApi> {
  try {
    const data = await fetcher<{ source?: SourceApi | null }>(
      '/api/dashboard/knowledge-bases/sources',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!data.source || typeof data.source !== 'object') {
      throw new Error('Unexpected response from server.');
    }

    const source = data.source;

    try {
      const ingestPayload = resolveMastraInput(payload, source);
      if (ingestPayload && source?.id != null) {
        const ingestResponse = await startSourceIngest(
          source.id,
          ingestPayload,
        );
        if (ingestResponse?.runId) {
          source.mastra_run_id = ingestResponse.runId;
        }
      }
    } catch (ingestError) {
      console.error('Failed to trigger Mastra ingest:', ingestError);
    }

    return source;
  } catch (error) {
    handleFetcherError(error, 'Failed to add source to knowledge base.', {
      validationMessage:
        'Unable to create source. Please check the file and try again.',
      rethrowUnknown: true,
    });
  }
}

export async function fetchCollectionSources({
  knowledgeBaseId,
  collectionId,
  page = 1,
  perPage = 50,
}: FetchCollectionSourcesParams): Promise<Source[]> {
  const params = new URLSearchParams();
  params.set('kb_id', String(knowledgeBaseId));
  params.set('collection_id', String(collectionId));
  params.set('page', String(page));
  params.set('per_page', String(perPage));

  try {
    const payload = await fetcher<PaginatedResponse<SourceApi>>(
      `/api/dashboard/knowledge-bases/sources?${params.toString()}`,
    );
    return mapApiListToSources(payload.data ?? []);
  } catch (error) {
    handleFetcherError(error, 'Failed to load collection sources.');
  }
}

export async function deleteSource(sourceId: number): Promise<void> {
  try {
    await fetcher(`/api/dashboard/knowledge-bases/sources/${sourceId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    handleFetcherError(error, 'Failed to delete source.');
  }
}

export async function markSourceComplete(
  sourceId: number | string,
  payload: MarkSourceCompletePayload,
): Promise<SourceApi | null> {
  const normalizedId = encodeURIComponent(String(sourceId));

  const response = await fetcher<{ source?: SourceApi | null }>(
    `/api/dashboard/knowledge-bases/sources/${normalizedId}/complete`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  return response?.source ?? null;
}

function resolveMastraInput(
  payload: CreateSourcePayload,
  source: SourceApi,
): MastraIngestPayload | null {
  const inputCandidate =
    payload.public_url?.trim() ||
    payload.source_uri?.trim() ||
    (typeof source.public_url === 'string' ? source.public_url.trim() : '') ||
    (typeof source.source_uri === 'string' ? source.source_uri.trim() : '');

  if (!inputCandidate || inputCandidate.startsWith('storage://')) {
    return null;
  }

  const mime = (payload.mime ?? source.mime ?? '').toLowerCase();
  const loweredInput = inputCandidate.toLowerCase();

  let type: MastraIngestType = 'text';
  if (mime.includes('pdf') || loweredInput.endsWith('.pdf')) {
    type = 'pdf';
  } else if (mime.includes('html') || loweredInput.endsWith('.html')) {
    type = 'html';
  }

  return { type, input: inputCandidate };
}
