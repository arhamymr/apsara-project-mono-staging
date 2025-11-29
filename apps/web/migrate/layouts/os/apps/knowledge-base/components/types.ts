export type IngestStatus = 'processing' | 'complete' | 'error';

export type KnowledgeBase = {
  id: string;
  name: string;
  description?: string;
  collectionsCount?: number;
  sourcesCount?: number;
};

export type KBCollection = {
  id: string;
  kbId: string;
  name: string;
  description?: string;
  sourcesCount?: number;
};

export type KBSource = {
  id: string;
  collectionId: string;
  title: string;
  kind: 'document' | 'source';
  status: IngestStatus;
  chunkCount?: number;
  updatedAt?: string;
  mastraRunId?: string | null;
  sourceUri?: string | null;
  publicUrl?: string | null;
  mime?: string | null;
  sizeBytes?: number | null;
  tokens?: number | null;
  statusRaw?: string | null;
};

export type KBChunk = {
  id: string;
  sourceId: string;
  index: number;
  text: string;
  updatedAt?: string;
  tokenCount?: number | null;
  meta?: Record<string, unknown> | null;
};
