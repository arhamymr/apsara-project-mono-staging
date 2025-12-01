import { Button } from '@workspace/ui/components/button';
import { HttpError, fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import * as React from 'react';
import type { TemplateNode } from '../../template-schema';

type FeedPost = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  published_at?: string | null;
  created_at?: string;
  category?: { name?: string | null } | null;
  author?: { name?: string | null } | null;
};

type PostsResponse = {
  posts?: { data?: FeedPost[] } | FeedPost[];
};

type Props = {
  node: TemplateNode;
  editable: boolean;
  onSelect?: (event: React.MouseEvent<HTMLDivElement>) => void;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  websiteSlug?: string;
};

const extractPosts = (payload?: PostsResponse): FeedPost[] => {
  if (!payload) return [];
  if (Array.isArray(payload.posts)) {
    return payload.posts as FeedPost[];
  }
  if (payload.posts && Array.isArray(payload.posts.data)) {
    return payload.posts.data as FeedPost[];
  }
  return [];
};

export function PostsFeedRenderer({
  node,
  editable,
  onSelect,
  wrapperProps,
  websiteSlug,
}: Props) {
  const limit =
    typeof node.limit === 'number' && node.limit > 0 ? node.limit : 3;
  const showExcerpt =
    typeof node.showExcerpt === 'boolean' ? node.showExcerpt : true;
  const showMeta = typeof node.showMeta === 'boolean' ? node.showMeta : true;
  const layout = typeof node.layout === 'string' ? node.layout : 'grid';
  const category = node.categoryId ?? node.category;
  const search = node.searchTerm ?? node.search;

  const effectiveWebsiteSlug =
    typeof websiteSlug === 'string' && websiteSlug.trim().length > 0
      ? websiteSlug.trim()
      : undefined;

  const queryString = React.useMemo(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', String(category));
    if (search) params.set('search', String(search));
    params.set('limit', String(limit));
    if (effectiveWebsiteSlug)
      params.set('website_slug', String(effectiveWebsiteSlug));
    return params.toString();
  }, [category, search, limit, effectiveWebsiteSlug]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useQuery<PostsResponse>({
      queryKey: ['posts-feed', effectiveWebsiteSlug, category, search, limit],
      enabled: !!effectiveWebsiteSlug,
      queryFn: () =>
        fetcher(`/api/posts?${queryString}`) as Promise<PostsResponse>,
    });

  const posts = React.useMemo(
    () => extractPosts(data).slice(0, limit),
    [data, limit],
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (editable && onSelect) {
      event.stopPropagation();
      onSelect(event);
    }
  };

  const wrapperClass = cn(
    layout === 'list'
      ? 'flex flex-col gap-6'
      : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
    node.class,
    editable && 'cursor-pointer',
  );

  const emptyStateMessage =
    node.emptyState ??
    (effectiveWebsiteSlug
      ? 'No posts available yet. Publish a post to see it here.'
      : 'Link an article to this website to display cards.');

  if (!effectiveWebsiteSlug) {
    return (
      <div className="w-full" {...wrapperProps}>
        <div className="border-destructive/40 bg-destructive/5 text-destructive rounded-md border p-4 text-sm">
          Set a website slug (Metadata tab) before showing posts.
        </div>
      </div>
    );
  }

  const errorMessage =
    error instanceof HttpError
      ? error.message
      : error?.message || 'Unable to load posts right now.';

  return (
    <div onClick={handleClick} className="w-full" {...wrapperProps}>
      {isLoading ? (
        <div className={wrapperClass}>
          {Array.from({ length: limit }).map((_, index) => (
            <div
              key={`post-skeleton-${index}`}
              className="border-border bg-muted/20 animate-pulse rounded-lg border p-4"
            >
              <div className="bg-muted mb-4 h-4 w-1/3 rounded" />
              <div className="bg-muted mb-2 h-5 w-full rounded" />
              <div className="bg-muted mb-2 h-5 w-5/6 rounded" />
              <div className="bg-muted h-4 w-2/3 rounded" />
            </div>
          ))}
        </div>
      ) : null}

      {isError ? (
        <div className="border-destructive/40 bg-destructive/5 text-destructive rounded-md border p-4 text-sm">
          {errorMessage}
          <div className="mt-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                refetch();
              }}
              disabled={isFetching}
            >
              <RefreshCw
                className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')}
              />
              Try again
            </Button>
          </div>
        </div>
      ) : null}

      {!isLoading && !isError && posts.length === 0 ? (
        <div className="border-border bg-muted/10 text-muted-foreground space-y-3 rounded-md border p-6 text-center text-sm">
          <p>{emptyStateMessage}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              refetch();
            }}
            disabled={isFetching}
          >
            <RefreshCw
              className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')}
            />
            Refresh
          </Button>
        </div>
      ) : null}

      {!isLoading && !isError && posts.length > 0 ? (
        <div className={wrapperClass}>
          {posts.map((post) => (
            <article
              key={post.id}
              className={cn(
                'group border-border bg-background flex h-full flex-col rounded-lg border p-6 shadow-sm transition hover:shadow-md',
                node.cardClass,
              )}
            >
              {showMeta && (
                <div className="text-muted-foreground mb-3 flex items-center gap-3 text-xs">
                  {post.category?.name ? (
                    <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium">
                      {post.category.name}
                    </span>
                  ) : null}
                  {post.published_at ? (
                    <span>
                      {new Date(post.published_at).toLocaleDateString()}
                    </span>
                  ) : null}
                </div>
              )}
              <h3 className="text-foreground group-hover:text-primary text-lg font-semibold tracking-tight">
                {post.title}
              </h3>
              {showExcerpt && post.excerpt ? (
                <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
                  {post.excerpt}
                </p>
              ) : null}
              {showMeta && post.author?.name ? (
                <p className="text-muted-foreground mt-4 text-xs">
                  By {post.author.name}
                </p>
              ) : null}
              {node.showLink !== false && (
                <a
                  href={`/article/detail/${post.slug}`}
                  className="text-primary mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
                >
                  Read more
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
