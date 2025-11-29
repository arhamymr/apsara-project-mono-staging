import { fetchWebsites } from '@/layouts/os/apps/website/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  assignArticleWebsite,
  createArticle,
  createCategory,
  deleteArticle,
  deleteCategory,
  fetchAdminArticles,
  fetchAdminCategories,
  fetchArticleBySlug,
  updateArticle,
  type AdminArticlesParams,
} from './api';

export const qk = {
  articles: ['admin-articles'] as const,
  categories: ['admin-article-categories'] as const,
  article: (slug: string) => ['admin-article', slug] as const,
  websites: ['dashboard-websites'] as const,
};

export function useArticles(params: AdminArticlesParams = {}) {
  return useQuery({
    queryKey: [...qk.articles, params],
    queryFn: () => fetchAdminArticles(params),
    keepPreviousData: true,
  });
}

export function useCategories() {
  return useQuery({ queryKey: qk.categories, queryFn: fetchAdminCategories });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: qk.article(slug),
    queryFn: () => fetchArticleBySlug(slug),
  });
}

export function useCreateArticle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createArticle,
    onSuccess: (post) => {
      qc.invalidateQueries({ queryKey: qk.articles });
      if (post?.slug) qc.invalidateQueries({ queryKey: qk.article(post.slug) });
    },
  });
}

export function useUpdateArticle(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      updateArticle(slug, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.articles });
      qc.invalidateQueries({ queryKey: qk.article(slug) });
    },
  });
}

export function useDeleteArticle(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => deleteArticle(slug),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.articles });
      qc.removeQueries({ queryKey: qk.article(slug) });
    },
  });
}

export function useDeleteArticleAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deleteArticle(slug),
    onSuccess: (_data, slug) => {
      qc.invalidateQueries({ queryKey: qk.articles });
      if (slug) {
        qc.removeQueries({ queryKey: qk.article(slug) });
      }
    },
  });
}

export function useDashboardWebsites() {
  return useQuery({ queryKey: qk.websites, queryFn: fetchWebsites });
}

export function useAssignArticleWebsite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      slug,
      websiteSlug,
    }: {
      slug: string;
      websiteSlug: string;
    }) => assignArticleWebsite(slug, websiteSlug),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: qk.articles });
      const updatedSlug = result?.post?.slug;
      if (updatedSlug) {
        qc.invalidateQueries({ queryKey: qk.article(updatedSlug) });
      }
      qc.invalidateQueries({ queryKey: qk.websites });
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.categories });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deleteCategory(slug),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.categories });
    },
  });
}
