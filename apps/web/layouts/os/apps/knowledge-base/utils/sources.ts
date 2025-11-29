// utilities for Sources

import type { Source, SourceApi } from '@/layouts/os/apps/knowledge-base/types';

export const toUiStatus = (s?: string | null): Source['status'] => {
  const normalized = typeof s === 'string' ? s.toLowerCase() : null;
  if (normalized === 'ready' || normalized === 'complete') return 'synced';
  if (normalized === 'error') return 'error';
  if (normalized === 'draft' || normalized === 'processing') return 'syncing';
  return 'stale';
};

const num = (v: number | string | null | undefined): number =>
  typeof v === 'number' ? v : typeof v === 'string' ? Number(v) || 0 : 0;

export const mapApiToSource = (item: SourceApi): Source => {
  const rawStatus = typeof item.status === 'string' ? item.status : null;
  const rawRunId =
    typeof item.mastra_run_id === 'string' && item.mastra_run_id.trim().length
      ? item.mastra_run_id.trim()
      : null;
  return {
    id: String(item.id),
    title: item.title ?? 'Untitled',
    kind: item.source_type === 'url' ? 'web' : 'md',
    tags: [],
    chunks: num(item.chunks_count ?? item.chunks ?? 0),
    tokens: num(item.tokens ?? 0),
    visibility: 'org',
    status: toUiStatus(rawStatus),
    updatedAt: item.updated_at
      ? new Date(item.updated_at).toLocaleString()
      : '—',
    statusRaw: rawStatus,
    sourceUri:
      typeof item.source_uri === 'string'
        ? item.source_uri.trim() || null
        : null,
    publicUrl:
      typeof item.public_url === 'string'
        ? item.public_url.trim() || null
        : null,
    mime:
      typeof item.mime === 'string' && item.mime.trim().length
        ? item.mime.trim()
        : null,
    bytes: typeof item.bytes === 'number' ? item.bytes : null,
    mastraRunId: rawRunId,
  };
};

export const mapApiListToSources = (items?: SourceApi[] | null): Source[] => {
  if (!Array.isArray(items)) return [];
  return items.map(mapApiToSource);
};
