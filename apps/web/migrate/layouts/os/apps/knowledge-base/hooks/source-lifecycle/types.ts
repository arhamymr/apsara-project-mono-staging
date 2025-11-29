import type { KBChunk } from '@/layouts/os/apps/knowledge-base/components/types';
import type { Source } from '@/layouts/os/apps/knowledge-base/types';
import type { MastraIngestStatus } from '@/layouts/os/apps/knowledge-base/utils/network';

// Shared types across source lifecycle hooks

export type ChunkExtractionResult =
  | { kind: 'skip'; runId?: string | null }
  | { kind: 'empty'; runId: string; message: string }
  | {
      kind: 'ready';
      runId: string;
      payload: import('@/layouts/os/apps/knowledge-base/types').ChunkUpsertInput[];
    };

export interface UseSourceLifecycleParams {
  viewMode: 'list' | 'detail';
  selectedSource: Source | null;
  refetchSources: () => Promise<unknown>;
  onSourceCleared: () => void;
  onChunksUpserted?: (sourceId: string, chunks: KBChunk[]) => void;
}

export interface UseSourceLifecycleResult {
  mastraStatus: MastraIngestStatus | undefined;
  isFetchingMastraStatus: boolean;
  mastraStatusErrorMessage: string | null;
  refreshMastraStatus: () => Promise<unknown> | undefined;
  handleDeleteSource: () => Promise<void>;
  isDeleting: boolean;
  handleTriggerIngest: () => Promise<void>;
  canIngest: boolean;
  isIngesting: boolean;
}

export interface UseSourceIngestParams {
  selectedSource: Source | null;
  refetchSources: () => Promise<unknown>;
}

export interface UseSourceIngestResult {
  selectedSourceIngestInput:
    | import('@/layouts/os/apps/knowledge-base/utils/network').MastraIngestPayload
    | null;
  canIngest: boolean;
  isIngesting: boolean;
  handleTriggerIngest: () => Promise<void>;
}

export interface UseMastraStatusResult {
  mastraStatus: MastraIngestStatus | undefined;
  isFetchingMastraStatus: boolean;
  mastraStatusErrorMessage: string | null;
  refreshMastraStatus: () => Promise<unknown> | undefined;
  statusQueryEnabled: boolean;
}
