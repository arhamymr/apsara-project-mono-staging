'use client';

import { AssetPicker } from '@/components/asset-picker';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import React from 'react';
import { toast } from 'sonner';
import { useBlog, useUpdateBlog, useDeleteBlog } from './hooks';
import type { Id } from '@/convex/_generated/dataModel';

export default function EditArticleWindow({
  id,
  onUpdated,
}: {
  id: Id<"blogs">;
  onUpdated?: () => void;
}) {
  const blog = useBlog(id);
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [coverImage, setCoverImage] = React.useState<string | undefined>();
  const [status, setStatus] = React.useState<'draft' | 'published'>('draft');
  const [busy, setBusy] = React.useState(false);
  const [isPickerOpen, setPickerOpen] = React.useState(false);

  // Sync state when blog loads
  React.useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setCoverImage(blog.coverImage);
      setStatus(blog.status);
    }
  }, [blog]);

  const handleUpdate = async () => {
    if (!blog) return;
    setBusy(true);
    try {
      await updateBlog({
        id: blog._id,
        title,
        content,
        coverImage,
        status,
      });
      onUpdated?.();
      toast.success('Article updated');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update';
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!blog) return;
    const ok = window.confirm('Delete this article? This cannot be undone.');
    if (!ok) return;
    
    setBusy(true);
    try {
      await deleteBlog({ id: blog._id });
      onUpdated?.();
      toast.success('Article deleted');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to delete';
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  if (blog === undefined) return <div className="p-4 text-sm">Loading…</div>;
  if (blog === null) return <div className="p-4 text-sm">Not found</div>;

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
            value={status}
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <Button size="sm" onClick={handleUpdate} disabled={busy}>
            {busy ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-3 md:col-span-2">
          <label className="text-xs">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="text-xs">Content</label>
          <textarea
            className="border-border bg-background h-60 w-full rounded-md border p-2 text-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              disabled={busy}
            >
              Delete
            </Button>
            <div className="text-muted-foreground flex-1 text-xs">
              Last updated: {new Date(blog.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>

        <aside className="space-y-3">
          <div>
            <label className="text-xs">Cover Image</label>
            <div className="mt-2">
              {coverImage ? (
                <div className="flex items-start gap-3">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="h-24 w-24 rounded-md object-cover"
                  />
                  <div className="flex-1">
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
                        onClick={() => setCoverImage(undefined)}
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
                {title || 'Title preview'}
              </div>
              <div className="text-muted-foreground mt-1 line-clamp-3 text-xs">
                {content.replace(/<[^>]+>/g, '').slice(0, 200) || 'Content preview...'}
              </div>
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">Tags</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {blog.tags?.map((tag) => (
                <span key={tag} className="bg-muted rounded px-2 py-0.5 text-xs">
                  {tag}
                </span>
              )) ?? <span className="text-muted-foreground text-xs">No tags</span>}
            </div>
          </div>
        </aside>
      </div>

      <AssetPicker
        open={isPickerOpen}
        onOpenChange={setPickerOpen}
        kindFilter="image"
        onSelect={(path) => {
          setCoverImage(path);
          setPickerOpen(false);
        }}
        onSelectUnsplash={(photo) => {
          const url = photo.urls.regular ?? photo.urls.full;
          setCoverImage(url);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
