'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Kbd } from '@workspace/ui/components/kbd';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useBlog, useUpdateBlog, useDeleteBlog } from './hooks';
import { CoverImagePicker } from './components/upload-cover';
import { Editor } from '@/components/blocks/editor-x/editor';
import type { SerializedEditorState } from 'lexical';
import type { Id } from '@/convex/_generated/dataModel';

type BlogStatus = 'draft' | 'published';

const initialEditorState = {
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as unknown as SerializedEditorState;

// Extract plain text from Lexical editor state for excerpt
function extractTextFromLexical(state: SerializedEditorState, maxLength = 200): string {
  const texts: string[] = [];

  function traverse(node: unknown) {
    if (!node || typeof node !== 'object') return;
    const n = node as Record<string, unknown>;

    // If it's a text node, extract the text
    if (n.type === 'text' && typeof n.text === 'string') {
      texts.push(n.text);
    }

    // Recursively traverse children
    if (Array.isArray(n.children)) {
      for (const child of n.children) {
        traverse(child);
      }
    }
  }

  traverse(state.root);
  const fullText = texts.join(' ').replace(/\s+/g, ' ').trim();

  if (fullText.length <= maxLength) return fullText;
  return fullText.slice(0, maxLength).trim() + '...';
}

interface EditArticleWindowProps {
  id: Id<'blogs'>;
  onUpdated?: () => void;
}

export default function EditArticleWindow({ id, onUpdated }: EditArticleWindowProps) {
  const blog = useBlog(id);
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<BlogStatus>('draft');
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [content, setContent] = useState<SerializedEditorState>(initialEditorState);
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  // Sync state when blog loads
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setSlug(blog.slug ?? '');
      setStatus(blog.status);
      setCoverImage(blog.coverImage);
      setTags(blog.tags?.join(', ') ?? '');
      try {
        const parsed = JSON.parse(blog.content);
        setContent(parsed);
        setEditorKey((k) => k + 1); // Force editor remount with new content
      } catch {
        setContent(initialEditorState);
      }
    }
  }, [blog]);

  const handleUpdate = useCallback(async () => {
    if (isSubmitting || !blog) return;

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const contentString = JSON.stringify(content);
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await updateBlog({
        id: blog._id,
        title: title.trim(),
        content: contentString,
        excerpt: extractTextFromLexical(content),
        coverImage,
        status,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      toast.success('Article updated');
      onUpdated?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, tags, coverImage, status, isSubmitting, blog, updateBlog, onUpdated]);

  const handleDelete = useCallback(async () => {
    if (!blog) return;
    const ok = window.confirm('Delete this article? This cannot be undone.');
    if (!ok) return;

    setIsSubmitting(true);
    try {
      await deleteBlog({ id: blog._id });
      toast.success('Article deleted');
      onUpdated?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [blog, deleteBlog, onUpdated]);

  if (blog === undefined) return <div className="p-4 text-sm">Loading…</div>;
  if (blog === null) return <div className="p-4 text-sm">Not found</div>;

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold">Edit Article</h2>
          <Select value={status} onValueChange={(v) => setStatus(v as BlogStatus)}>
            <SelectTrigger className="h-8 w-[120px]">
              <SelectValue placeholder="Draft" />
            </SelectTrigger>
            <SelectContent className="z-[99999]">
              <SelectGroup>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
            Delete
          </Button>
          <Button size="sm" onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
            <Kbd className="text-primary-900 bg-black/20">S</Kbd>
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Sidebar */}
          <aside className="space-y-3">
            <p className="text-muted-foreground text-xs">
              Make changes and save when ready.
            </p>

            <div>
              <label className="text-xs">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article title"
              />
            </div>

            <div>
              <label className="text-xs">Slug</label>
              <Input value={slug} disabled placeholder="article-slug" />
            </div>

            <div>
              <label className="text-xs">Tags (comma separated)</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tech, news, tutorial"
              />
            </div>

            <CoverImagePicker setImageUrl={setCoverImage} imageUrl={coverImage} />

            <div className="text-muted-foreground pt-2 text-xs">
              Last updated: {new Date(blog.updatedAt).toLocaleString()}
            </div>
          </aside>

          {/* Editor */}
          <div className="relative max-h-[calc(100vh-150px)] overflow-hidden md:col-span-2">
            <Editor
              key={editorKey}
              editorSerializedState={content}
              onSerializedChange={setContent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
