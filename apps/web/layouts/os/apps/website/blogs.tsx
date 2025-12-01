import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { useWebsite } from '@/hooks/use-website';
import { HttpError, fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Globe, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';

type FeedPost = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  published_at?: string | null;
  category?: { name?: string | null } | null;
  author?: { name?: string | null } | null;
};

type PostsResponse = {
  posts?: { data?: FeedPost[] } | FeedPost[];
};

const getPostsArray = (payload?: PostsResponse): FeedPost[] => {
  if (!payload) return [];
  const postsValue = payload.posts ?? [];
  if (Array.isArray(postsValue)) {
    return postsValue as FeedPost[];
  }
  if (Array.isArray(postsValue.data)) {
    return postsValue.data as FeedPost[];
  }
  return [];
};

export function BlogsPanel() {
  const { form } = useWebsite();
  const [watchedSlug, watchedCurrentSlug] = form.watch([
    'slug',
    'currentSlug',
  ]) as [string | undefined, string | undefined];

  const activeSlug = useMemo(() => {
    const fromSlug = typeof watchedSlug === 'string' ? watchedSlug.trim() : '';
    if (fromSlug) return fromSlug;
    const fromCurrent =
      typeof watchedCurrentSlug === 'string' ? watchedCurrentSlug.trim() : '';
    return fromCurrent || undefined;
  }, [watchedSlug, watchedCurrentSlug]);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useQuery<PostsResponse>({
      queryKey: ['website-blogs', activeSlug],
      queryFn: () =>
        fetcher(
          `/api/posts?website_slug=${encodeURIComponent(activeSlug ?? '')}&limit=12`,
        ),
      enabled: !!activeSlug,
    });

  const posts = useMemo(() => getPostsArray(data), [data]);

  if (!activeSlug) {
    return (
      <Card className="m-4 border-dashed p-6 text-sm">
        <div className="flex items-center gap-3">
          <Globe className="text-muted-foreground h-5 w-5" />
          <div>
            <p className="font-medium">Add a slug to preview blogs</p>
            <p className="text-muted-foreground text-xs">
              Set a website slug in the General tab, then assign articles to it
              from the Article Manager.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="m-4 p-6 text-sm">
        <p className="text-muted-foreground">Loading posts…</p>
      </Card>
    );
  }

  if (isError) {
    const message =
      error instanceof HttpError ? error.message : 'Unable to load posts.';
    return (
      <Card className="border-destructive/40 bg-destructive/5 m-4 space-y-3 p-6 text-sm">
        <p className="text-destructive">{message}</p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw
            className={cn('mr-2 h-4 w-4', isFetching && 'animate-spin')}
          />
          Try again
        </Button>
      </Card>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="m-4 p-6 text-sm">
        <div className="flex items-start gap-3">
          <BookOpen className="text-muted-foreground mt-0.5 h-5 w-5" />
          <div>
            <p className="font-medium">No posts assigned yet</p>
            <p className="text-muted-foreground text-xs">
              Publish an article and assign it to <strong>{activeSlug}</strong>{' '}
              from the Article Manager to see it here.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">
            Posts assigned to {activeSlug}
          </p>
          <p className="text-muted-foreground text-xs">
            Showing published articles returned by the public posts API.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Refreshing
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </>
          )}
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {posts.map((post) => (
          <Card key={post.id} className="space-y-2 p-4 text-sm">
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>{post.category?.name ?? 'Uncategorised'}</span>
              {post.published_at ? (
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
              ) : null}
            </div>
            <p className="leading-snug font-semibold">{post.title}</p>
            {post.excerpt ? (
              <p className="text-muted-foreground line-clamp-3 text-sm">
                {post.excerpt}
              </p>
            ) : null}
            <p className="text-muted-foreground text-xs">
              {post.author?.name ? `By ${post.author.name}` : 'Unknown author'}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
