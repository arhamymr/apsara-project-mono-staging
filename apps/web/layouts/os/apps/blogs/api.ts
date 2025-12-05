import { fetcher } from '@/lib/fetcher';
import type { Category, PostDetail, PostListItem } from './types';

export type AdminArticlesParams = {
  page?: number;
  search?: string;
  category?: number | string | null;
};

export type AdminArticlesResult = {
  posts: PostListItem[];
  categories: Category[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
};

export async function fetchAdminArticles(
  params: AdminArticlesParams = {},
): Promise<AdminArticlesResult> {
  const qp = new URLSearchParams();
  if (params.page) qp.set('page', String(params.page));
  if (params.search) qp.set('search', params.search);
  if (params.category != null && params.category !== '')
    qp.set('category', String(params.category));
  const url = qp.toString()
    ? `/api/dashboard/articles?${qp.toString()}`
    : '/api/dashboard/articles';
  const data = await fetcher<{
    posts?: {
      data?: PostListItem[];
      current_page?: number;
      last_page?: number;
      per_page?: number;
      total?: number;
    };
    categories?: Category[];
  }>(url);
  const posts: PostListItem[] = Array.isArray(data?.posts?.data)
    ? data.posts.data
    : [];
  const categories: Category[] = Array.isArray(data?.categories)
    ? data.categories
    : [];
  const meta = {
    currentPage: Number(data?.posts?.current_page ?? 1),
    lastPage: Number(data?.posts?.last_page ?? 1),
    perPage: Number(data?.posts?.per_page ?? posts.length),
    total: Number(data?.posts?.total ?? posts.length),
  };
  return { posts, categories, meta };
}

export async function fetchAdminCategories(): Promise<{
  categories: Category[];
}> {
  const data = await fetcher<{ categories?: Category[] }>(
    '/api/dashboard/categories',
  );
  const categories: Category[] = Array.isArray(data?.categories)
    ? data.categories
    : [];
  return { categories };
}

export async function createCategory(name: string): Promise<Category> {
  const data = await fetcher<{ category: Category }>(
    '/api/dashboard/categories',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    },
  );
  return data.category;
}

export async function deleteCategory(slug: string): Promise<void> {
  await fetcher<void>(`/api/dashboard/categories/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
  });
}

export async function fetchArticleBySlug(
  slug: string,
): Promise<{ post: PostDetail; categories: Category[] }> {
  const data = await fetcher<{ post?: PostDetail; categories?: Category[] }>(
    `/api/dashboard/articles/${encodeURIComponent(slug)}`,
  );
  return {
    post: data.post as PostDetail,
    categories: (data.categories ?? []) as Category[],
  };
}

export async function createArticle(
  payload: Record<string, unknown>,
): Promise<PostDetail> {
  const data = await fetcher<{ post: PostDetail }>('/api/dashboard/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return data.post;
}

export async function updateArticle(
  slug: string,
  payload: Record<string, unknown>,
): Promise<PostDetail> {
  const data = await fetcher<{ post: PostDetail }>(
    `/api/dashboard/articles/${encodeURIComponent(slug)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
  );
  return data.post;
}

export async function deleteArticle(slug: string): Promise<void> {
  await fetcher<void>(`/api/dashboard/articles/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
  });
}

export type AssignWebsiteResponse = {
  post: PostDetail;
  message?: string;
  attached?: boolean;
};

export async function assignArticleWebsite(
  slug: string,
  websiteSlug: string,
): Promise<AssignWebsiteResponse> {
  const data = await fetcher<AssignWebsiteResponse>(
    `/api/dashboard/articles/${encodeURIComponent(slug)}/assign-website`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ website_slug: websiteSlug }),
    },
  );
  return data;
}
