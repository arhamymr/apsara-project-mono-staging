import type { KnowledgeBase, KnowledgeBaseCollection } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${res.status}`);
  }
  return res.json();
}

type KnowledgeBaseListResponse = {
  knowledgebases?: KnowledgeBase[];
};

export async function fetchKnowledgeBases(): Promise<KnowledgeBase[]> {
  const data = await fetcher<KnowledgeBaseListResponse>('/knowledge-bases');
  if (!data || !Array.isArray(data.knowledgebases)) {
    return [];
  }
  return data.knowledgebases;
}

export async function createKnowledgeBase(
  title: string,
): Promise<KnowledgeBase> {
  if (!title.trim()) {
    throw new Error('Title is required.');
  }

  const payload = await fetcher<{ knowledge_base?: KnowledgeBase }>(
    '/knowledge-bases',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    },
  );

  if (!payload?.knowledge_base) {
    throw new Error('Failed to create knowledge base.');
  }

  return payload.knowledge_base;
}

export async function deleteKnowledgeBase(id: number): Promise<void> {
  await fetcher(`/knowledge-bases/${id}`, {
    method: 'DELETE',
  });
}

export type CreateCollectionInput = {
  knowledgeBaseId: number;
  name: string;
  description?: string | null;
};

export async function createCollection(
  input: CreateCollectionInput,
): Promise<KnowledgeBaseCollection> {
  const trimmedName = input.name.trim();
  if (!trimmedName) {
    throw new Error('Name is required.');
  }

  const payload = await fetcher<{ collection?: KnowledgeBaseCollection }>(
    '/knowledge-bases/collections',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        knowledge_base_id: input.knowledgeBaseId,
        name: trimmedName,
        description:
          typeof input.description === 'string'
            ? input.description.trim() || null
            : (input.description ?? null),
      }),
    },
  );

  if (!payload?.collection) {
    throw new Error('Failed to create collection.');
  }

  return payload.collection;
}
