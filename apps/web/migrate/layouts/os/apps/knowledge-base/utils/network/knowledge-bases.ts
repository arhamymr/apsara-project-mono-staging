import type {
  KnowledgeBase,
  KnowledgeBaseResponse,
} from '@/layouts/os/apps/knowledge-base/types';
import { fetcher } from '@/lib/fetcher';

import { handleFetcherError } from './errors';

export type CreateKnowledgeBasePayload = {
  title: string;
};

export async function fetchKnowledgeBases(): Promise<KnowledgeBase[]> {
  try {
    const payload = await fetcher<KnowledgeBaseResponse>(
      '/api/dashboard/knowledge-bases',
    );
    return payload.knowledgebases ?? [];
  } catch (error) {
    handleFetcherError(error, 'Failed to load knowledge bases.');
  }
}

export async function createKnowledgeBase(
  payload: CreateKnowledgeBasePayload,
): Promise<KnowledgeBase> {
  try {
    const data = await fetcher<{ knowledge_base?: KnowledgeBase }>(
      '/api/dashboard/knowledge-bases',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );
    if (!data?.knowledge_base) {
      throw new Error('Unexpected response from server.');
    }
    return data.knowledge_base;
  } catch (error) {
    handleFetcherError(error, 'Failed to create knowledge base.', {
      validationMessage: 'Please check the form and try again.',
      rethrowUnknown: true,
    });
  }
}
