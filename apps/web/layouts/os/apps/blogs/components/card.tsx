import { Badge } from '@workspace/ui/components/badge';
import { Card } from '@workspace/ui/components/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@workspace/ui/components/context-menu';
import { cn } from '@/lib/utils';
import parse from 'html-react-parser';
import { Check } from 'lucide-react';
import React from 'react';
import type { PostListItem } from '../types';

type ArticleCardProps = {
  post: PostListItem;
  onSelect: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAssignWebsite?: (websiteSlug: string) => void;
  websites?: Array<{ id?: number; slug: string; name?: string }>;
};

const STATUS_STYLES: Record<string, string> = {
  publish: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/40',
  draft: 'bg-amber-500/15 text-amber-600 border-amber-500/40',
};

export function ArticleCard({
  post,
  onSelect,
  onEdit,
  onDelete,
  onAssignWebsite,
  websites = [],
}: ArticleCardProps) {
  const statusClass = STATUS_STYLES[post.status] ?? 'bg-muted text-foreground';
  const statusLabel =
    post.status === 'publish'
      ? 'Published'
      : post.status === 'draft'
        ? 'Draft'
        : post.status;
  const emoji = React.useMemo(() => {
    const category = post.category?.name?.toLowerCase() ?? '';
    if (post.status === 'publish') return '📰';
    if (post.status === 'draft') return '✏️';
    if (category.includes('guide') || category.includes('how')) return '📘';
    if (category.includes('news') || category.includes('announce')) return '📢';
    if (category.includes('design')) return '🎨';
    if (category.includes('product')) return '🛠️';
    return '📄';
  }, [post.category?.name, post.status]);

  const assignedWebsiteSlugs = React.useMemo(
    () => new Set((post.websites ?? []).map((site) => site.slug)),
    [post.websites],
  );

  const renderWebsites = () => {
    if (!websites.length) {
      return <ContextMenuItem disabled>No websites available</ContextMenuItem>;
    }
    return websites.map((site) => (
      <ContextMenuItem
        key={site.slug}
        onSelect={(event) => {
          event.preventDefault();
          onAssignWebsite?.(site.slug);
        }}
        className="flex items-center gap-2"
      >
        <span>{site.name ?? site.slug}</span>
        {assignedWebsiteSlugs.has(site.slug) ? (
          <Check className="ml-auto h-3.5 w-3.5" />
        ) : null}
      </ContextMenuItem>
    ));
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button type="button" onClick={onSelect} className="w-full text-left">
          <Card className="hover:border-primary group flex flex-col items-center gap-4 rounded-lg border p-3 transition-colors">
            {post.image_url ? (
              <img
                src={post.image_url}
                alt=""
                className="h-30 w-full shrink-0 rounded-sm object-cover"
              />
            ) : (
              <div className="bg-muted text-muted-foreground group-hover:text-primary grid size-12 shrink-0 place-items-center rounded-lg text-xl">
                {emoji}
              </div>
            )}

            <div className="w-full flex-1 space-y-1">
              <div className="flex flex-col gap-2">
                <div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'border text-xs tracking-wide uppercase',
                      statusClass,
                    )}
                  >
                    {statusLabel}
                  </Badge>
                </div>
                <div>
                  {post.category?.name ? (
                    <Badge variant="outline" className="text-xs uppercase">
                      {post.category.name}
                    </Badge>
                  ) : null}
                </div>
              </div>
              <p className="text-foreground w-full truncate text-sm font-semibold">
                {post.title}
              </p>
              <p className="text-muted-foreground truncate font-mono text-sm">
                {post?.excerpt ? parse(post.excerpt) : null}
              </p>
            </div>
          </Card>
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem
          onSelect={(event) => {
            event.preventDefault();
            (onEdit ?? onSelect)?.();
          }}
        >
          Edit Article
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onDelete?.();
          }}
        >
          Delete Article
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Add to Website</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-56">
            {renderWebsites()}
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
