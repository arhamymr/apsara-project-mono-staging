'use client';

import { Button } from '@workspace/ui/components/button';
import { Kbd } from '@workspace/ui/components/kbd';
import { useWindowContext } from '@/layouts/os/WindowContext';
import React from 'react';
import { toast } from 'sonner';
import { ArticleCard } from './components/card';
import CreateArticleWindow from './create';
import EditArticleWindow from './edit';
import { useMyBlogs, useDeleteBlog, useSearchBlogs } from './hooks';
import type { Id } from '@/convex/_generated/dataModel';

export default function ArticleManagerApp() {
  const { openSubWindow, activeId, closeWindow } = useWindowContext();
  const [search, setSearch] = React.useState('');

  const blogs = useMyBlogs(50);
  const searchResults = useSearchBlogs(search, 20);
  const deleteBlog = useDeleteBlog();

  const displayBlogs = search ? searchResults : blogs;
  const isLoading = displayBlogs === undefined;

  const openCreate = () => {
    if (!activeId) return;
    const subId = openSubWindow(activeId, {
      title: 'New Article',
      content: (
        <CreateArticleWindow
          onCreated={() => {
            if (subId) closeWindow(subId);
          }}
        />
      ),
      width: 720,
      height: 520,
    });
  };

  const openDetail = (id: Id<"blogs">, title?: string) => {
    if (!activeId) return;
    let subId: string | undefined;
    subId = openSubWindow(activeId, {
      title: title ? `Edit: ${title}` : 'Article',
      content: (
        <EditArticleWindow
          id={id}
          onUpdated={() => {}}
          onClose={() => {
            if (subId) closeWindow(subId);
          }}
        />
      ),
      width: 820,
      height: 600,
    });
  };

  const handleDeleteArticle = async (id: Id<"blogs">, title?: string) => {
    if (!id) return;
    const ok = window.confirm(
      `Delete the article${title ? ` "${title}"` : ''}? This cannot be undone.`,
    );
    if (!ok) return;
    try {
      await deleteBlog({ id });
      toast.success('Article deleted.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete article.';
      toast.error(message);
    }
  };

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 flex w-full flex-col items-center justify-between gap-2 border-b px-4 py-3 @md:flex-row">
        <div className="flex w-full flex-col items-center gap-2 @md:w-[540px] @md:flex-row">
          {/* Search */}
          <div className="relative w-full">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title..."
              className="border-border focus:ring-primary h-8 w-full rounded-md border px-3 text-sm focus:ring-1"
            />
            {search && (
              <button
                className="absolute top-1/2 right-1 -translate-y-1/2 rounded px-2 text-xs"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex w-full items-center gap-2 @md:w-[130px]">
          <Button size="sm" onClick={openCreate} className="w-full">
            New Article <Kbd className="text-primary-900 bg-black/20">N</Kbd>
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : !displayBlogs || displayBlogs.length === 0 ? (
          <div className="text-muted-foreground text-sm">No articles yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 @lg:grid-cols-3 @xl:grid-cols-5">
            {displayBlogs.map((blog: { _id: Id<"blogs">; slug: string; title: string; content: string; excerpt?: string; coverImage?: string; status: string; createdAt: number; updatedAt: number }) => (
              <ArticleCard
                key={blog._id}
                post={{
                  id: blog._id,
                  slug: blog.slug,
                  title: blog.title,
                  excerpt: blog.excerpt,
                  description: blog.excerpt,
                  image_url: blog.coverImage,
                  status: blog.status,
                  created_at: new Date(blog.createdAt).toISOString(),
                  updated_at: new Date(blog.updatedAt).toISOString(),
                }}
                onSelect={() => openDetail(blog._id, blog.title)}
                onEdit={() => openDetail(blog._id, blog.title)}
                onDelete={() => handleDeleteArticle(blog._id, blog.title)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
