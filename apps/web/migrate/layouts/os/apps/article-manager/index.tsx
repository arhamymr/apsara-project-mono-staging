'use client';

import { Button } from '@/components/ui/button';
import { Kbd } from '@/components/ui/kbd';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWindowContext } from '@/layouts/os/WindowContext';
import React from 'react';
import { toast } from 'sonner';
import { ArticleCard } from './components/card';
import CreateArticleWindow from './create';
import EditArticleWindow from './edit';
import {
  useArticles,
  useAssignArticleWebsite,
  useCategories,
  useDashboardWebsites,
  useDeleteArticleAction,
} from './hooks';
import type { PostListItem } from './types';

export default function ArticleManagerApp() {
  const { openSubWindow, activeId, closeWindow } = useWindowContext();
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<number | ''>(
    '',
  );
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError } = useArticles({
    page,
    search,
    category: selectedCategory,
  });

  // fallback to demo data if API returns error or undefined
  const posts: PostListItem[] = data?.posts ?? [];
  const meta = data?.meta;
  const { data: catsData } = useCategories();
  const categories = catsData?.categories ?? [];
  const { data: websitesData } = useDashboardWebsites();
  const websites = websitesData?.websites ?? [];

  const deleteArticleMutation = useDeleteArticleAction();
  const assignWebsiteMutation = useAssignArticleWebsite();

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

  const openDetail = (slug: string, title?: string) => {
    if (!activeId) return;
    openSubWindow(activeId, {
      title: title ? `Edit: ${title}` : 'Article',
      content: <EditArticleWindow slug={slug} onUpdated={() => {}} />,
      width: 820,
      height: 600,
    });
  };

  const handleDeleteArticle = async (slug: string, title?: string) => {
    if (!slug) return;
    const ok = window.confirm(
      `Delete the article${title ? ` “${title}”` : ''}? This cannot be undone.`,
    );
    if (!ok) return;
    try {
      await deleteArticleMutation.mutateAsync(slug);
      toast.success('Article deleted.');
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to delete article.');
    }
  };

  const handleAssignWebsite = async (slug: string, websiteSlug: string) => {
    try {
      const result = await assignWebsiteMutation.mutateAsync({
        slug,
        websiteSlug,
      });
      const attached = result?.attached ?? false;
      toast.success(
        result?.message ??
          (attached
            ? 'Article added to website.'
            : 'Article removed from website.'),
      );
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to update website assignment.');
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
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

          {/* Compact category select */}
          <div className="hidden items-center gap-2 @md:flex">
            <Select
              onValueChange={(value) => {
                const val = value === '' ? '' : Number(value);
                setSelectedCategory(val as number | '');
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="z-[99999]">
                <SelectGroup>
                  <SelectLabel>Select Category</SelectLabel>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {' '}
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 @md:w-[130px]">
          <div className="flex w-full items-center gap-2">
            <Button size="sm" onClick={openCreate} className="w-full">
              New Article <Kbd className="text-primary-900 bg-black/20">N</Kbd>
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        {/* Category Tabs */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            className={`rounded-sm border px-3 py-1 text-xs ${selectedCategory === '' ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
            onClick={() => {
              setSelectedCategory('');
              setPage(1);
            }}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`rounded-sm border px-3 py-1 text-xs ${selectedCategory === c.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
              onClick={() => {
                setSelectedCategory(c.id);
                setPage(1);
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : isError ? (
          <div className="text-destructive text-sm">
            Failed to load. Showing demo data.
          </div>
        ) : posts.length === 0 ? (
          <div className="text-muted-foreground text-sm">No articles yet.</div>
        ) : (
          <div
            className={'grid grid-cols-1 gap-4 @lg:grid-cols-3 @xl:grid-cols-5'}
          >
            {posts.map((p) => (
              <ArticleCard
                key={p.id}
                post={p}
                onSelect={() => openDetail(p.slug, p.title)}
                onEdit={() => openDetail(p.slug, p.title)}
                onDelete={() => handleDeleteArticle(p.slug, p.title)}
                onAssignWebsite={(websiteSlug) =>
                  handleAssignWebsite(p.slug, websiteSlug)
                }
                websites={websites}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 mb-8 flex items-center justify-between text-xs">
          <div className="text-muted-foreground">
            {meta ? `Page ${meta.currentPage} of ${meta.lastPage}` : null}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!meta || meta.currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!meta || meta.currentPage >= meta.lastPage}
              onClick={() =>
                setPage((p) => (meta ? Math.min(meta.lastPage, p + 1) : p + 1))
              }
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
