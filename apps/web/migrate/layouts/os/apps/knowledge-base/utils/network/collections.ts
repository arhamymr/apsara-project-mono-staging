import type { KnowledgeBaseCollection } from '@/layouts/os/apps/knowledge-base/types';
import { fetcher } from '@/lib/fetcher';

import { handleFetcherError } from './errors';

export type CreateCollectionPayload = {
  knowledge_base_id: number;
  name: string;
  description?: string | null;
};

export type UpdateCollectionPayload = {
  id: number;
  name: string;
  description?: string | null;
};

export async function createCollection(
  payload: CreateCollectionPayload,
): Promise<KnowledgeBaseCollection> {
  try {
    const data = await fetcher<{
      collection?: KnowledgeBaseCollection | null;
    }>('/api/dashboard/knowledge-bases/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!data.collection || typeof data.collection !== 'object') {
      throw new Error('Unexpected response from server.');
    }

    return data.collection;
  } catch (error) {
    handleFetcherError(error, 'Failed to create collection.', {
      validationMessage: 'Please check the collection details and try again.',
      rethrowUnknown: true,
    });
  }
}

export async function updateCollection({
  id,
  ...payload
}: UpdateCollectionPayload): Promise<unknown> {
  try {
    return await fetcher(`/api/dashboard/knowledge-bases/collections/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    handleFetcherError(error, 'Failed to update collection.', {
      validationMessage:
        'Unable to update the collection. Please review the form.',
    });
  }
}

export async function deleteCollection(id: number): Promise<unknown> {
  try {
    return await fetcher(`/api/dashboard/knowledge-bases/collections/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    handleFetcherError(error, 'Failed to delete collection.');
  }
}

export async function fetchCollections(
  knowledgeBaseId: number,
): Promise<KnowledgeBaseCollection[]> {
  const params = new URLSearchParams();
  params.set('kb_id', String(knowledgeBaseId));

  try {
    const payload = await fetcher<{
      collections?: KnowledgeBaseCollection[];
    }>(`/api/dashboard/knowledge-bases/collections?${params.toString()}`);

    return payload.collections ?? [];
  } catch (error) {
    handleFetcherError(error, 'Failed to load collections.');
  }
}
