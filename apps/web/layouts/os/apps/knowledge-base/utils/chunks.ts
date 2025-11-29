import type { KBChunk } from '@/layouts/os/apps/knowledge-base/components/types';
import type { ChunkApi } from '@/layouts/os/apps/knowledge-base/types';

export function mapChunkApiToKBChunk(chunk: ChunkApi): KBChunk {
  return {
    id: String(chunk.id),
    sourceId: String(chunk.source_id),
    index: chunk.index,
    text: chunk.text,
    tokenCount: chunk.token_count ?? null,
    meta: chunk.meta ?? null,
    updatedAt: chunk.updated_at ?? chunk.created_at ?? undefined,
  };
}
