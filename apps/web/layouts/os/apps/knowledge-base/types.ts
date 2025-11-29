export type SourceKind = 'pdf' | 'docx' | 'web' | 'md' | 'sheet' | 'faq';

export type SourceStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'synced' | 'syncing' | 'stale' | 'error';

export type Source = {
  id: string;
  status: SourceStatus;
  title: string;
  kind: SourceKind;
  tags: string[];
  chunks: number;
  tokens: number;
  visibility: 'private' | 'org' | 'public';
  updatedAt: string;
  statusRaw?: string | null;
  sourceUri?: string | null;
  publicUrl?: string | null;
  mime?: string | null;
  bytes?: number | null;
  mastraRunId?: string | null;
};

export type Collection = {
  id: string;
  name: string;
  description?: string;
  visibility: 'private' | 'org' | 'public';
  sources: number;
  chunks: number;
  updatedAt: string;
};

export type SyncRun = {
  id: string;
  status: 'queued' | 'running' | 'success' | 'failed';
  items: number;
  progress: number;
  started: string;
  finished?: string;
  error?: string;
};

export type SourceApi = {
  id: number | string;
  uuid?: string | null;
  knowledge_base_id?: number | null;
  collection_id?: number | null;
  title?: string | null;
  source_type?: string | null;
  source_uri?: string | null;
  storage_disk?: string | null;
  storage_path?: string | null;
  public_url?: string | null;
  visibility?: 'private' | 'public' | null;
  mime?: string | null;
  bytes?: number | null;
  chunks_count?: number | null;
  chunks?: number | null;
  tokens?: number | null;
  status?: string | null;
  meta?: Record<string, unknown> | null;
  chunk_options?: Record<string, unknown> | null;
  vector_options?: Record<string, unknown> | null;
  embed_model?: string | null;
  mastra_run_id?: string | null;
  synced_at?: string | null;
  error?: string | null;
  updated_at?: string | null;
};

export type KnowledgeBase = {
  id: number;
  title: string;
  collections?: Array<{
    id: number;
    name: string;
    description?: string | null;
    sources?: Array<unknown>;
  }>;
  [key: string]: unknown;
};

export type KnowledgeBaseResponse = {
  knowledgebases: KnowledgeBase[];
};

export type KnowledgeBaseCollection = {
  id: number;
  name: string;
  description?: string | null;
  sources_count?: number;
  sources?: unknown[];
  created_at?: string;
  updated_at?: string;
};

export type ChunkApi = {
  id: number | string;
  knowledge_base_id: number;
  source_id: number;
  index: number;
  text: string;
  token_count?: number | null;
  meta?: Record<string, unknown> | null;
  vector_id?: string | null;
  vector_dim?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type ChunkUpsertInput = {
  index: number;
  text: string;
  token_count?: number | null;
  meta?: Record<string, unknown> | null;
  vector_id?: string | null;
  vector_dim?: number | null;
};
