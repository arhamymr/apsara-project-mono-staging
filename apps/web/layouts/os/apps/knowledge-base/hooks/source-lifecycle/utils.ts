import type {
  ChunkUpsertInput,
  Source,
} from '@/layouts/os/apps/knowledge-base/types';
import type { MastraIngestStatus } from '@/layouts/os/apps/knowledge-base/utils/network';
import type { ChunkExtractionResult } from './types';

const COMPLETED_STATUSES = new Set([
  'success',
  'complete',
  'completed',
  'done',
]);
const SUCCESS_STATUSES = new Set(['success']);

function getStatusCandidates(
  status: MastraIngestStatus | undefined | null,
): string[] {
  if (!status) return [];
  const candidates: Array<unknown> = [status.status];
  if (typeof status.state === 'object' && status.state !== null) {
    candidates.push((status.state as Record<string, unknown>).status);
  }

  return candidates
    .filter((candidate): candidate is string => typeof candidate === 'string')
    .map((value) => value.toLowerCase());
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function coerceEntries(value: unknown): unknown[] | null {
  if (!value) return null;
  if (Array.isArray(value)) return value;

  const record = asRecord(value);
  if (!record) return null;

  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.chunks)) return record.chunks;
  if (Array.isArray(record.output)) return record.output;
  if (Array.isArray(record.result)) return record.result;

  const nestedKeys = ['output', 'result', 'value'] as const;
  for (const key of nestedKeys) {
    if (key in record) {
      const nested = coerceEntries(record[key]);
      if (nested?.length) return nested;
    }
  }

  return null;
}

export function resolveRunId(
  status: MastraIngestStatus,
  source: Source | null,
): string | null {
  return status.runId ?? source?.mastraRunId ?? null;
}

export function extractUpsertEntries(
  status: MastraIngestStatus,
): unknown[] | null {
  const state = asRecord(status.state);
  if (!state) return null;

  const rawSteps = state.steps;
  let upsertStep: Record<string, unknown> | null = null;

  if (Array.isArray(rawSteps)) {
    upsertStep =
      rawSteps.map(asRecord).find((step) => step?.id === 'upsert-data') ?? null;
  } else {
    const stepsRecord = asRecord(rawSteps);
    if (stepsRecord) {
      if (stepsRecord['upsert-data']) {
        upsertStep = asRecord(stepsRecord['upsert-data']);
      }
      if (!upsertStep) {
        upsertStep =
          Object.values(stepsRecord)
            .map(asRecord)
            .find((step) => step?.id === 'upsert-data') ?? null;
      }
    }
  }

  const entriesFromStep = coerceEntries(upsertStep);
  if (entriesFromStep?.length) return entriesFromStep;

  const fallbacks = [
    state.output,
    state.result,
    state.data,
    status.output,
    status.data,
  ];

  for (const candidate of fallbacks) {
    const entries = coerceEntries(candidate);
    if (entries?.length) return entries;
  }

  return null;
}

export function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return null;
}

export function buildChunkPayload(entries: unknown[]): ChunkUpsertInput[] {
  const results: (ChunkUpsertInput | null)[] = entries
    .map((entry, index) => {
      if (!entry || typeof entry !== 'object') return null;

      const record = entry as Record<string, unknown>;
      const metadata =
        record.metadata && typeof record.metadata === 'object'
          ? (record.metadata as Record<string, unknown>)
          : null;

      const textCandidate = [
        record.text,
        metadata?.text,
        metadata?.content,
        metadata?.raw_text,
      ].find(
        (value): value is string =>
          typeof value === 'string' && value.trim().length > 0,
      );

      if (!textCandidate) return null;

      const indexCandidate = [
        record.index,
        metadata?.index,
        metadata?.chunk_index,
      ]
        .map(toFiniteNumber)
        .find((value): value is number => value != null && value >= 0);

      const tokenCandidate = [
        record.token_count,
        record.tokens,
        metadata?.token_count,
        metadata?.tokens,
      ]
        .map(toFiniteNumber)
        .find((value): value is number => value != null && value >= 0);

      const vectorId =
        typeof record.vector_id === 'string' && record.vector_id.trim().length
          ? (record.vector_id as string)
          : undefined;
      const vectorDim = toFiniteNumber(record.vector_dim);

      return {
        index: indexCandidate != null ? Math.trunc(indexCandidate) : index,
        text: textCandidate,
        token_count:
          tokenCandidate != null ? Math.trunc(tokenCandidate) : undefined,
        meta: metadata ?? null,
        vector_id: vectorId,
        vector_dim: vectorDim != null ? Math.trunc(vectorDim) : undefined,
      } satisfies ChunkUpsertInput;
    });
  return results.filter((chunk): chunk is ChunkUpsertInput => chunk !== null);
}

export function prepareChunkExtraction(
  status: MastraIngestStatus,
  source: Source,
  lastProcessedRunId: string | null,
): ChunkExtractionResult {
  const runId = resolveRunId(status, source);
  if (!runId) return { kind: 'skip' };
  if (lastProcessedRunId && lastProcessedRunId === runId)
    return { kind: 'skip', runId };

  const entries = extractUpsertEntries(status);
  if (!entries?.length) {
    return {
      kind: 'empty',
      runId,
      message: 'No chunk data was returned from Mastra.',
    };
  }

  const payload = buildChunkPayload(entries);
  if (!payload.length) {
    return {
      kind: 'empty',
      runId,
      message: 'No chunk content could be extracted.',
    };
  }

  return { kind: 'ready', runId, payload };
}

export function parseSourceNumericId(source: Source): number | null {
  const numericId = Number(source.id);
  return Number.isNaN(numericId) ? null : numericId;
}

export function isMastraRunComplete(
  status: MastraIngestStatus | undefined | null,
): boolean {
  const candidates = getStatusCandidates(status);
  return candidates.some((candidate) => COMPLETED_STATUSES.has(candidate));
}

export function isMastraRunSuccessful(
  status: MastraIngestStatus | undefined | null,
): boolean {
  const candidates = getStatusCandidates(status);
  return candidates.some((candidate) => SUCCESS_STATUSES.has(candidate));
}
