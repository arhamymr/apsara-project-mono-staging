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
import React from 'react';
import { toast } from 'sonner';
import { CoverImagePicker } from './components/upload-cover';
import { useCreateBlog } from './hooks';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CreateArticleWindow({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [title, setTitle] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [status, setStatus] = React.useState<'draft' | 'published'>('draft');
  const [coverImage, setCoverImage] = React.useState<string | undefined>(undefined);
  const [content, setContent] = React.useState<unknown[]>([]);
  const [tags, setTags] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const createBlog = useCreateBlog();

  // Auto-generate slug from title
  React.useEffect(() => {
    if (!slug || slug === slugify(title.slice(0, -1))) {
      setSlug(slugify(title));
    }
  }, [title, slug]);

  const save = async () => {
    setBusy(true);
    try {
      if (!title.trim()) {
        throw new Error('Title is required.');
      }
      if (!slug.trim()) {
        throw new Error('Slug is required.');
      }

      const contentString = JSON.stringify(content);
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

      await createBlog({
        title: title.trim(),
        slug: slug.trim(),
        content: contentString,
        excerpt: contentString.slice(0, 200),
        coverImage,
        status,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      onCreated?.();
      toast.success('Article created');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to create post';
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4 p-4 text-sm">
      {/* Form grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <aside className="space-y-3">
          <div>
            <h2 className="text-base font-semibold">Create Article</h2>
            <p className="text-muted-foreground text-xs">
              Fill in the details to publish a new article.
            </p>
          </div>

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

          <div className="flex items-center gap-2">
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as 'draft' | 'published')}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Draft" />
              </SelectTrigger>
              <SelectContent className="z-[99999]">
                <SelectGroup>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button onClick={save} disabled={busy}>
              {busy ? 'Creating...' : 'Create Article'}
              <Kbd className="text-primary-900 bg-black/20">C</Kbd>
            </Button>
          </div>
        </aside>

        <div className="relative max-h-[calc(100vh-64px)] space-y-3 overflow-hidden rounded-md border md:col-span-2">
          <ScrollArea className="h-full w-full">
            <PlateEditor value={content} onChange={setContent} />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
