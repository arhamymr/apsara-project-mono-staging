'use client';

import { PlateEditor } from '@/components/editor/plate-editor';
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
import { ScrollArea } from '@radix-ui/react-scroll-area';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CoverImagePicker } from './components/upload-cover';

type BlogStatus = 'draft' | 'published';

interface CreateArticleWindowProps {
  onCreated?: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CreateArticleWindow({ onCreated }: CreateArticleWindowProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<BlogStatus>('draft');
  const [coverImage, setCoverImage] = useState<string | undefined>();
  const [content, setContent] = useState<unknown[]>([]);
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createBlog = useMutation(api.blogs.create);

  // Auto-generate slug from title
  useEffect(() => {
    const generatedSlug = slugify(title);
    if (!slug || slug === slugify(title.slice(0, -1))) {
      setSlug(generatedSlug);
    }
  }, [title, slug]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!slug.trim()) {
      toast.error('Slug is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const contentString = JSON.stringify(content);
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await createBlog({
        title: title.trim(),
        slug: slug.trim(),
        content: contentString,
        excerpt: contentString.slice(0, 200),
        coverImage,
        status,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      toast.success('Article created successfully');
      onCreated?.();

      setTitle('');
      setSlug('');
      setContent([]);
      setTags('');
      setCoverImage(undefined);
      setStatus('draft');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create article';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, slug, content, tags, coverImage, status, isSubmitting, createBlog, onCreated]);

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold">Create Article</h2>
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

        <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Article'}
          <Kbd className="text-primary-900 bg-black/20">C</Kbd>
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Sidebar */}
          <aside className="space-y-3">
            <p className="text-muted-foreground text-xs">
              Fill in the details to publish a new article.
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
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="article-slug"
              />
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
          </aside>

          {/* Editor */}
          <div className="relative max-h-[calc(100vh-150px)] space-y-3 overflow-hidden rounded-md border md:col-span-2">
            <ScrollArea className="h-full w-full">
              <PlateEditor value={content} onChange={setContent} />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
