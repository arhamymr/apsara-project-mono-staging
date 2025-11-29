export { handleFetcherError } from './network/errors';

export {
  createKnowledgeBase,
  fetchKnowledgeBases,
} from './network/knowledge-bases';
export type { CreateKnowledgeBasePayload } from './network/knowledge-bases';

export {
  createCollection,
  deleteCollection,
  fetchCollections,
  updateCollection,
} from './network/collections';
export type {
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from './network/collections';

export {
  createSource,
  deleteSource,
  fetchCollectionSources,
  markSourceComplete,
} from './network/sources';
export type {
  CreateSourcePayload,
  FetchCollectionSourcesParams,
  MarkSourceCompletePayload,
} from './network/sources';

export { fetchMastraIngestStatus, startSourceIngest } from './network/mastra';
export type {
  MastraIngestPayload,
  MastraIngestStatus,
  MastraIngestType,
} from './network/mastra';

export { fetchSourceChunks, upsertSourceChunks } from './network/chunks';
export type {
  FetchSourceChunksParams,
  UpsertSourceChunksPayload,
} from './network/chunks';
