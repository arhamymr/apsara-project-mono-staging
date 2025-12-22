'use client';

import { Button } from '@workspace/ui/components/button';
import { Kbd } from '@workspace/ui/components/kbd';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { FileText, Code2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { ArticleCard } from './components/card';
import { BlogApiHelperModal } from './components/BlogApiHelperModal';
import CreateArticleWindow from './create';
import EditArticleWindow from './edit';
import { useMyBlogs, useDeleteBlog, useSearchBlogs } from './hooks';
import { useSharedResources } from '../organizations/hooks/use-shared-resources';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

export default function ArticleManagerApp() {
  const { openSubWindow, activeId, closeWindow } = useWindowContext();
  const [search, setSearch] = React.useState('');
  const [showApiHelper, setShowApiHelper] = React.useState(false);

  const blogs = useMyBlogs(50);
  const searchResults = useSearchBlogs(search, 20);
  const deleteBlog = useDeleteBlog();

  // Get user's organizations to fetch shared blogs
  const userOrganizations = useQuery(api.organizations.listUserOrganizations, {});
  
  // Get shared resources - we need to handle this differently since we can't conditionally call hooks
  // For now, we'll fetch shared resources for the first org if available
  const firstOrgId = userOrganizations?.[0]?._id;
  const firstOrgSharedResources = useSharedResources(firstOrgId ?? null);
  
  // Get all shared blogs from all orgs by combining results
  const allSharedBlogs = React.useMemo(() => {
    if (!userOrganizations) return [];
    // For MVP, we're getting shared resources from first org
    // In production, you'd want to fetch from all orgs
    return (firstOrgSharedResources.resources || []).filter(r => r.resourceType === 'blog');
  }, [firstOrgSharedResources.resources, userOrganizations]);

  // Combine personal and shared blogs
  const displayBlogs = React.useMemo(() => {
    if (!blogs) return undefined;
    if (search) return searchResults; // When searching, only show search results
    
    const personalBlogIds = new Set(blogs.map(b => b._id));
    const sharedBlogs = allSharedBlogs.filter(
      r => !personalBlogIds.has(r.resourceId as Id<'blogs'>)
    );
    
    return [
      ...blogs,
      ...sharedBlogs.map(r => ({
        _id: r.resourceId as Id<'blogs'>,
        slug: r.name.toLowerCase().replace(/\s+/g, '-'),
        title: r.name,
        content: '',
        excerpt: '',
        coverImage: undefined,
        status: 'published' as const,
        createdAt: r.lastModified,
        updatedAt: r.lastModified,
        isShared: true,
      })),
    ];
  }, [blogs, searchResults, search, allSharedBlogs]);

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
    const subId = openSubWindow(activeId, {
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

  const handleShareArticle = (id: Id<"blogs">, title?: string) => {
    if (!activeId) return;
    const subId = openSubWindow(activeId, {
      title: title ? `Share: ${title}` : 'Share Article',
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

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* API Helper Modal */}
      {showApiHelper && (
        <BlogApiHelperModal onClose={() => setShowApiHelper(false)} />
      )}

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

        <div className="flex w-full items-center gap-2 @md:w-auto">
          <Button variant="outline" size="sm" onClick={() => setShowApiHelper(true)}>
            <Code2 className="mr-1.5 h-4 w-4" />
            Integrate
          </Button>
          <Button size="sm" onClick={openCreate}>
            New Article <Kbd className="text-primary-900 bg-black/20">N</Kbd>
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : !displayBlogs || displayBlogs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="bg-muted/50 rounded-full p-4">
              <FileText className="text-muted-foreground/60 h-10 w-10" />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground font-medium">No articles yet</p>
              <p className="text-muted-foreground/70 text-sm">
                Create your first article to get started
              </p>
            </div>
            <Button size="sm" onClick={openCreate} variant="outline" className="mt-2">
              Create Article
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 @lg:grid-cols-3 @xl:grid-cols-5">
            {displayBlogs.map((blog: { _id: Id<"blogs">; slug: string; title: string; content: string; excerpt?: string; coverImage?: string; status: string; createdAt: number; updatedAt: number; isShared?: boolean }) => (
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
                onShare={() => handleShareArticle(blog._id, blog.title)}
                isShared={blog.isShared}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
