'use client';

import { AssetPicker } from '@/components/asset-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { toast } from 'sonner';
import { useArticle, useDeleteArticle, useUpdateArticle } from './hooks';
import type { Category } from './types';

export default function EditArticleWindow({
  slug,
  onUpdated,
}: {
  slug: string;
  onUpdated?: () => void;
}) {
  const [post, setPost] = React.useState<any>(null);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [isPickerOpen, setPickerOpen] = React.useState(false);
  const [coverAttribution, setCoverAttribution] = React.useState<{
    label: string;
    url?: string;
  } | null>(null);

  const { data, isLoading } = useArticle(slug);
  React.useEffect(() => {
    if (data) {
      setPost(data.post);
      setCategories(data.categories);
      if (data.post?.cover_credit) {
        setCoverAttribution({ label: data.post.cover_credit });
      }
    }
  }, [data]);

  const updateMut = useUpdateArticle(slug);
  const update = async () => {
    if (!post) return;
    setBusy(true);
    try {
      await updateMut.mutateAsync({
        title: post.title,
        category: post.category?.id ?? post.category_id,
        description: post.content ?? post.description ?? '',
        status: post.status,
        image_url: post.image_url,
      });
      onUpdated?.();
      toast.success('Article updated');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to update');
    } finally {
      setBusy(false);
    }
  };

  const deleteMut = useDeleteArticle(slug);
  const del = async () => {
    setBusy(true);
    try {
      await deleteMut.mutateAsync();
      onUpdated?.();
      toast.success('Article deleted');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete');
    } finally {
      setBusy(false);
    }
  };

  if (isLoading) return <div className="p-4 text-sm">Loading…</div>;
  if (!post) return <div className="p-4 text-sm">Not found</div>;

  return (
    <div className="space-y-4 p-4 text-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Edit Article</h2>
          <p className="text-muted-foreground text-xs">
            Make changes and save when ready.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-background border-border rounded-md border px-2 py-1 text-xs"
            value={post.status}
            onChange={(e) => setPost({ ...post, status: e.target.value })}
          >
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
          </select>
          <Button size="sm" onClick={update} disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-3 md:col-span-2">
          <label className="text-xs">Title</label>
          <Input
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />

          <label className="text-xs">Content</label>
          <div className="border-border h-60 overflow-hidden rounded-md border">
            
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={del}
              disabled={busy}
            >
              Delete
            </Button>
            <div className="text-muted-foreground flex-1 text-xs">
              Last updated: {post.updated_at ?? post.updatedAt ?? '—'}
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div>
            <label className="text-xs">Category</label>
            <select
              className="bg-background border-border w-full rounded-md border px-2 py-2 text-sm"
              value={post.category?.id ?? post.category_id ?? ''}
              onChange={(e) => {
                const value = e.target.value;
                setPost((prev: any) => {
                  if (!prev) return prev;
                  const nextCategoryId =
                    value === '' ? undefined : Number(value);
                  const matched =
                    nextCategoryId == null
                      ? null
                      : (categories.find((c) => c.id === nextCategoryId) ??
                        prev.category);
                  return {
                    ...prev,
                    category_id: nextCategoryId,
                    category: matched ?? null,
                  };
                });
              }}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs">Cover Image</label>
            <div className="mt-2">
              {post.image_url ? (
                <div className="flex items-start gap-3">
                  <img
                    src={post.image_url}
                    alt="Cover preview"
                    className="h-24 w-24 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    {coverAttribution ? (
                      <a
                        href={coverAttribution.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground text-xs underline"
                      >
                        {coverAttribution.label}
                      </a>
                    ) : null}
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPickerOpen(true)}
                      >
                        Change
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setPost((prev: any) =>
                            prev ? { ...prev, image_url: undefined } : prev,
                          );
                          setCoverAttribution(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setPickerOpen(true)}
                >
                  Select cover image
                </Button>
              )}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">Preview</div>
            <div className="border-border mt-2 h-28 overflow-hidden rounded-md border p-2 text-xs">
              <div className="line-clamp-2 font-semibold">
                {post.title || 'Title preview'}
              </div>
              <div className="text-muted-foreground mt-1 line-clamp-3 text-xs">
                {(post.content ?? post.description ?? '')
                  .replace(/<[^>]+>/g, '')
                  .slice(0, 200) || 'Content preview...'}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <AssetPicker
        open={isPickerOpen}
        onOpenChange={setPickerOpen}
        kindFilter="image"
        onSelect={(path) => {
          setPost((prev: any) => (prev ? { ...prev, image_url: path } : prev));
          setCoverAttribution(null);
          setPickerOpen(false);
        }}
        onSelectUnsplash={(photo) => {
          const url = photo.urls.regular ?? photo.urls.full;
          setPost((prev: any) => (prev ? { ...prev, image_url: url } : prev));
          setCoverAttribution({
            label: `Photo by ${photo.user?.name ?? 'Unsplash'}`,
            url: photo.links?.html,
          });
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
