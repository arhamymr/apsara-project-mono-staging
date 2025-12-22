'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Kbd } from '@workspace/ui/components/kbd';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import React from 'react';
import { CoverImagePicker } from './components/upload-cover';
import { Editor } from '@/components/blocks/editor-x/editor';
import type { Id } from '@/convex/_generated/dataModel';
import { Trash2, Edit2 } from 'lucide-react';
import { ShareWithOrgButton } from '../organizations/components/share-with-org-button';
import { useEditBlogForm } from './hooks/useEditBlogForm';

type BlogStatus = 'draft' | 'published';

interface EditArticleWindowProps {
  id: Id<'blogs'>;
  onUpdated?: () => void;
  onClose?: () => void;
}

export default function EditArticleWindow({ id, onUpdated, onClose }: EditArticleWindowProps) {
  const {
    blog,
    title,
    slug,
    status,
    coverImage,
    content,
    tags,
    isSubmitting,
    editorKey,
    isEditingSlug,
    setTitle,
    setSlug,
    setStatus,
    setCoverImage,
    setContent,
    setTags,
    setIsEditingSlug,
    handleUpdate,
    handleDelete,
  } = useEditBlogForm(id, onUpdated, onClose);

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
          <ShareWithOrgButton
            resourceType="blog"
            resourceId={blog._id}
            resourceName={blog.title}
            variant="outline"
            size="sm"
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" disabled={isSubmitting}>
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="z-[99999]">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Article</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{title || 'this article'}&rdquo;? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
            <p className="text-muted-foreground text-xs">Make changes and save when ready.</p>

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
              <div className="flex gap-2">
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={!isEditingSlug}
                  placeholder="article-slug"
                />
                <Button
                  size="sm"
                  variant={isEditingSlug ? 'default' : 'outline'}
                  onClick={() => setIsEditingSlug(!isEditingSlug)}
                  className="px-2"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
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
          <div className="relative min-h-[500px] md:col-span-2">
            <Editor
              key={editorKey}
              editorSerializedState={content}
              onSerializedChange={setContent}
              lite={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
