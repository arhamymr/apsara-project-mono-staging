import { fetcher } from '@/lib/fetcher';

export type MastraIngestType = 'text' | 'html' | 'pdf';

export type MastraIngestPayload = {
  type: MastraIngestType;
  input: string;
};

export type MastraIngestStatus = {
  status?: string;
  runId?: string;
  state?: Record<string, unknown> | null;
  [key: string]: unknown;
};

export async function startSourceIngest(
  sourceId: number | string,
  payload: MastraIngestPayload,
): Promise<MastraIngestStatus> {
  const normalizedId = encodeURIComponent(String(sourceId));

  return await fetcher<MastraIngestStatus>(
    `/api/dashboard/knowledge-bases/sources/${normalizedId}/ingest`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );
}

export async function fetchMastraIngestStatus(
  sourceId: number,
  runId: string,
  options?: { fresh?: boolean },
): Promise<MastraIngestStatus> {
  const params = new URLSearchParams();
  if (options?.fresh) {
    params.set('fresh', '1');
  }

  const query = params.toString();
  const endpoint = `/api/dashboard/knowledge-bases/sources/${sourceId}/ingest/runs/${encodeURIComponent(runId)}`;

  return await fetcher<MastraIngestStatus>(
    query ? `${endpoint}?${query}` : endpoint,
  );
}
