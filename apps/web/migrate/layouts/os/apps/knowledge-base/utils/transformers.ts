import type {
  KBCollection,
  KnowledgeBase,
} from '@/layouts/os/apps/knowledge-base/components/types';
import type { KnowledgeBase as ApiKnowledgeBase } from '@/layouts/os/apps/knowledge-base/types';

type ApiCollectionLike = Partial<{
  id: number | string;
  uuid: string | null;
  name: string | null;
  description: string | null;
  sources: unknown;
  sources_count: unknown;
}> &
  Record<string, unknown>;

function normalizeString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeId(value: unknown, fallback: string): string {
  if (typeof value === 'string' || typeof value === 'number') {
    const stringValue = String(value).trim();
    if (stringValue.length > 0) {
      return stringValue;
    }
  }
  return fallback;
}

function normalizeCount(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return 0;
}

function extractCollectionSourcesCount(collection: ApiCollectionLike): number {
  const directCount = normalizeCount(collection.sources_count);
  if (directCount > 0) {
    return directCount;
  }
  if (Array.isArray(collection.sources)) {
    return collection.sources.length;
  }
  return 0;
}

function mapCollectionsForKnowledgeBase(kb: ApiKnowledgeBase): KBCollection[] {
  const rawCollections = Array.isArray(kb.collections)
    ? (kb.collections as unknown[])
    : [];

  return rawCollections.map((rawCollection, index) => {
    const collection = rawCollection as ApiCollectionLike;
    const fallbackId = `${kb.id}-${index}`;
    const id = normalizeId(collection.id ?? collection.uuid, fallbackId);
    const name = normalizeString(collection.name) ?? 'Untitled collection';
    const description = normalizeString(collection.description);
    const sourcesCount = extractCollectionSourcesCount(collection);

    return {
      id,
      kbId: String(kb.id),
      name,
      description,
      sourcesCount,
    } satisfies KBCollection;
  });
}

export function mapKnowledgeBases(
  apiKnowledgeBases: ApiKnowledgeBase[],
): KnowledgeBase[] {
  return apiKnowledgeBases.map((kb) => {
    const description = normalizeString(
      (kb as Record<string, unknown>).description,
    );
    const collections = mapCollectionsForKnowledgeBase(kb);
    const sourcesCount = collections.reduce(
      (total, collection) => total + (collection.sourcesCount ?? 0),
      0,
    );

    return {
      id: String(kb.id),
      name: normalizeString(kb.title) ?? 'Untitled knowledge base',
      description,
      collectionsCount: collections.length,
      sourcesCount,
    } satisfies KnowledgeBase;
  });
}

export function mapCollections(
  apiKnowledgeBases: ApiKnowledgeBase[],
): KBCollection[] {
  return apiKnowledgeBases.flatMap((kb) => mapCollectionsForKnowledgeBase(kb));
}
