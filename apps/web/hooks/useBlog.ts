import { useQuery } from '@tanstack/react-query';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  authorName: string;
  publishedAt: string;
  tags: string[];
  content?: string;
}

export interface BlogApiResponse {
  data: BlogPost[];
  pagination: {
    hasMore: boolean;
    page: number;
    perPage: number;
    total: number;
  };
}

async function fetchBlogs(page = 1, limit = 10): Promise<BlogApiResponse> {
  const response = await fetch(`/api/blogs?page=${page}&limit=${limit}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Blog fetch error:', errorData);
    throw new Error(errorData.details || 'Failed to fetch blogs');
  }

  return response.json();
}

async function fetchBlogBySlug(slug: string): Promise<BlogPost> {
  const response = await fetch(`/api/blogs/${slug}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Blog fetch error:', errorData);
    throw new Error(errorData.details || 'Failed to fetch blog post');
  }

  return response.json();
}

export function useBlogs(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['blogs', page, limit],
    queryFn: () => fetchBlogs(page, limit),
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useBlog(slug: string) {
  return useQuery({
    queryKey: ['blog', slug],
    queryFn: () => fetchBlogBySlug(slug),
    enabled: !!slug,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
