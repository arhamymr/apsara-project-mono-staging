import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import type {
  KnowledgeBase,
  KnowledgeBaseCollection,
} from '@/layouts/os/apps/knowledge-base/types';
import {
  createSource,
  fetchCollections,
  fetchKnowledgeBases,
} from '@/layouts/os/apps/knowledge-base/utils/network';

import type { StorageEntry } from './queries';

type CollectionStatus = {
  isLoading: boolean;
  isError: boolean;
};

type CollectionsByKnowledgeBase = Record<number, KnowledgeBaseCollection[]>;

export function useFinderKnowledgeBase(details: StorageEntry | null) {
  const queryClient = useQueryClient();
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<
    number | null
  >(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    number | null
  >(null);

  const knowledgeBasesQuery = useQuery<KnowledgeBase[]>({
    queryKey: ['dashboard', 'knowledgebases', 'os-app'],
    queryFn: fetchKnowledgeBases,
    staleTime: 60_000,
  });

  const knowledgeBases = useMemo(
    () => knowledgeBasesQuery.data ?? [],
    [knowledgeBasesQuery.data],
  );

  const collectionQueries = useQueries({
    queries: knowledgeBases.map((kb) => ({
      queryKey: ['dashboard', 'knowledgebases', kb.id, 'collections'],
      queryFn: () => fetchCollections(kb.id),
      staleTime: 45_000,
    })),
  });

  const collectionsByKnowledgeBase: CollectionsByKnowledgeBase = useMemo(() => {
    const map: CollectionsByKnowledgeBase = {};
    knowledgeBases.forEach((kb, index) => {
      const data = collectionQueries[index]?.data as
        | KnowledgeBaseCollection[]
        | undefined;
      if (data) {
        map[kb.id] = data;
      }
    });
    return map;
  }, [collectionQueries, knowledgeBases]);

  const collectionStatusByKnowledgeBase = useMemo(() => {
    const status: Record<number, CollectionStatus> = {};
    knowledgeBases.forEach((kb, index) => {
      const query = collectionQueries[index];
      status[kb.id] = {
        isLoading: query?.isLoading ?? false,
        isError: query?.isError ?? false,
      };
    });
    return status;
  }, [collectionQueries, knowledgeBases]);

  const collectionsQuery = useQuery<KnowledgeBaseCollection[]>({
    queryKey: [
      'dashboard',
      'knowledgebases',
      selectedKnowledgeBaseId,
      'collections',
    ],
    queryFn: () => fetchCollections(selectedKnowledgeBaseId!),
    enabled:
      !!details &&
      !details.is_folder &&
      typeof selectedKnowledgeBaseId === 'number',
    staleTime: 45_000,
  });

  const collections = useMemo(
    () => collectionsQuery.data ?? [],
    [collectionsQuery.data],
  );

  useEffect(() => {
    if (!details || details.is_folder) {
      setSelectedKnowledgeBaseId(null);
      setSelectedCollectionId(null);
      return;
    }

    if (knowledgeBases.length === 0) {
      setSelectedKnowledgeBaseId(null);
      setSelectedCollectionId(null);
      return;
    }

    setSelectedKnowledgeBaseId((prev) => {
      if (prev && knowledgeBases.some((kb) => kb.id === prev)) {
        return prev;
      }
      return knowledgeBases[0]?.id ?? null;
    });
  }, [details, knowledgeBases]);

  useEffect(() => {
    setSelectedCollectionId(null);
  }, [selectedKnowledgeBaseId]);

  useEffect(() => {
    if (!collections.length) {
      setSelectedCollectionId(null);
      return;
    }
    if (
      selectedCollectionId &&
      !collections.some((collection) => collection.id === selectedCollectionId)
    ) {
      setSelectedCollectionId(null);
    }
  }, [collections, selectedCollectionId]);

  const addSourceMutation = useMutation({
    mutationFn: createSource,
    onSuccess: async (_source, variables) => {
      toast.success('Source added', {
        description: 'The file has been queued for ingestion.',
      });

      const kbId = variables.knowledge_base_id;
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['dashboard', 'knowledgebases'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['dashboard', 'knowledgebases', 'os-app'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['dashboard', 'knowledgebases', kbId, 'sources-summary'],
        }),
        queryClient.invalidateQueries({ queryKey: ['kb', 'sources', kbId] }),
      ]);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to add the source to the knowledge base.';
      toast.error('Unable to add source', {
        description: message,
      });
    },
  });

  const queueAddToKnowledgeBase = useCallback(
    (
      entry: StorageEntry,
      knowledgeBaseId: number,
      collectionId: number | null,
    ) => {
      if (!entry || entry.is_folder) {
        return;
      }

      const normalizedKbId = Number(knowledgeBaseId);
      if (!Number.isInteger(normalizedKbId) || normalizedKbId <= 0) {
        toast.error('Invalid knowledge base selection.');
        return;
      }

      let normalizedCollectionId: number | null = null;
      if (collectionId !== null && collectionId !== undefined) {
        const parsedCollection = Number(collectionId);
        if (!Number.isInteger(parsedCollection) || parsedCollection <= 0) {
          toast.error('Invalid collection selection.');
          return;
        }
        normalizedCollectionId = parsedCollection;
      }

      const relativeKey = entry.relativePath ?? entry.key;
      const sourceUri =
        entry.visibility === 'public' && entry.public_url
          ? entry.public_url
          : `storage://${relativeKey}`;

      const meta: Record<string, unknown> = {
        finder_added_at: new Date().toISOString(),
        relative_path: relativeKey,
      };

      if (entry.sizeLabel) {
        meta.size_label = entry.sizeLabel;
      }
      if (entry.previewCategory) {
        meta.preview_category = entry.previewCategory;
      }
      if (typeof entry.isPreviewable === 'boolean') {
        meta.is_previewable = entry.isPreviewable;
      }
      if (typeof entry.isTextLike === 'boolean') {
        meta.is_text_like = entry.isTextLike;
      }
      if (entry.sourceKindHint) {
        meta.source_kind_hint = entry.sourceKindHint;
      }

      addSourceMutation.mutate({
        knowledge_base_id: normalizedKbId,
        collection_id: normalizedCollectionId,
        title: entry.name,
        source_uri: sourceUri,
        visibility: entry.visibility ?? 'private',
        mime: entry.mime ?? entry.type ?? null,
        size: typeof entry.size === 'number' ? entry.size : null,
        public_url: entry.public_url ?? null,
        directory: entry.directory ?? null,
        storage_key: relativeKey,
        meta,
      });
    },
    [addSourceMutation],
  );

  const handleAddToKnowledgeBase = useCallback(() => {
    if (!details || details.is_folder || !selectedKnowledgeBaseId) {
      return;
    }

    queueAddToKnowledgeBase(
      details,
      selectedKnowledgeBaseId,
      selectedCollectionId ?? null,
    );
  }, [
    details,
    queueAddToKnowledgeBase,
    selectedCollectionId,
    selectedKnowledgeBaseId,
  ]);

  const addSourceDisabled =
    !details ||
    details.is_folder ||
    !selectedKnowledgeBaseId ||
    knowledgeBases.length === 0 ||
    knowledgeBasesQuery.isLoading ||
    knowledgeBasesQuery.isError ||
    addSourceMutation.isPending;

  return {
    knowledgeBases,
    knowledgeBasesStatus: {
      isLoading: knowledgeBasesQuery.isLoading,
      isError: knowledgeBasesQuery.isError,
    },
    collectionsByKnowledgeBase,
    collectionStatusByKnowledgeBase,
    selectedKnowledgeBaseId,
    setSelectedKnowledgeBaseId,
    selectedCollectionId,
    setSelectedCollectionId,
    collections,
    collectionsStatus: {
      isLoading: collectionsQuery.isLoading,
      isError: collectionsQuery.isError,
    },
    handleAddToKnowledgeBase,
    queueAddToKnowledgeBase,
    addSourceDisabled,
    isAddingToKnowledgeBase: addSourceMutation.isPending,
  };
}
