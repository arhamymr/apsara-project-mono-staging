import type { IngestStatus } from '@/layouts/os/apps/knowledge-base/components/types';
import type { MastraIngestType } from '@/layouts/os/apps/knowledge-base/utils/network';

const SOURCE_STATUS_MAP: Record<string, IngestStatus> = {
  processing: 'processing',
  draft: 'processing',
  ready: 'complete',
  complete: 'complete',
  error: 'error',
};

export function toDisplayStatus(status?: string | null): IngestStatus {
  const normalized = status?.toLowerCase();
  return SOURCE_STATUS_MAP[normalized ?? 'processing'];
}

export function toDisplayKind(kind?: string | null): 'document' | 'source' {
  if (!kind) return 'document';
  return kind === 'web' ? 'source' : 'document';
}

export type MastraInputCandidate = {
  sourceUri?: string | null;
  publicUrl?: string | null;
  mime?: string | null;
};

export function resolveMastraInputFromSource(
  source: MastraInputCandidate | null | undefined,
): { type: MastraIngestType; input: string } | null {
  if (!source) return null;

  const candidates = [source.publicUrl, source.sourceUri];
  let inputCandidate: string | null = null;
  for (const value of candidates) {
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed || trimmed.startsWith('storage://')) {
      continue;
    }
    inputCandidate = trimmed;
    break;
  }

  if (!inputCandidate) {
    return null;
  }

  const mime = (source.mime ?? '').toLowerCase();
  const loweredInput = inputCandidate.toLowerCase();

  let type: MastraIngestType = 'text';
  if (mime.includes('pdf') || loweredInput.endsWith('.pdf')) {
    type = 'pdf';
  } else if (
    mime.includes('html') ||
    loweredInput.endsWith('.html') ||
    loweredInput.endsWith('.htm')
  ) {
    type = 'html';
  }

  return { type, input: inputCandidate };
}
