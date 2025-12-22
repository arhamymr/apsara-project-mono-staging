import { useState, useEffect, useCallback } from 'react';
import type { SerializedEditorState } from 'lexical';
import type { Id } from '@/convex/_generated/dataModel';
import { useBlog, useUpdateBlog, useDeleteBlog } from '../hooks';
import { toast } from 'sonner';
import { extractTextFromLexical, titleToSlug, initialEditorState } from '../utils/blog-utils';

type BlogStatus = 'draft' | 'published';

export function useEditBlogForm(id: Id<'blogs'>, onUpdated?: () => void, onClose?: () => void) {
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
  const [isEditingSlug, setIsEditingSlug] = useState(false);

  // Initialize form from blog data
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
        setEditorKey((k) => k + 1);
      } catch {
        setContent(initialEditorState);
      }
    }
  }, [blog]);

  // Auto-generate slug from title when editing is enabled
  useEffect(() => {
    if (isEditingSlug && title) {
      setSlug(titleToSlug(title));
    }
  }, [title, isEditingSlug]);

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
        slug: slug.trim() || undefined,
      });

      toast.success('Article updated');
      onUpdated?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update';

      // Handle slug already exists error
      if (errorMessage.includes('SLUG_EXISTS:')) {
        const existingSlug = errorMessage.split('SLUG_EXISTS:')[1];
        toast.error(`Slug "${existingSlug}" is already in use by another article.`, {
          duration: 5000,
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, tags, coverImage, status, slug, isSubmitting, blog, updateBlog, onUpdated]);

  const handleDelete = useCallback(async () => {
    if (!blog) return;

    setIsSubmitting(true);
    try {
      await deleteBlog({ id: blog._id });
      toast.success('Article deleted');
      onUpdated?.();
      onClose?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [blog, deleteBlog, onUpdated, onClose]);

  return {
    // State
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
    // Setters
    setTitle,
    setSlug,
    setStatus,
    setCoverImage,
    setContent,
    setTags,
    setIsEditingSlug,
    // Handlers
    handleUpdate,
    handleDelete,
  };
}
