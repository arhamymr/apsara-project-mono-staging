/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CategorySelector } from './components/category-selector';
import { CoverImagePicker } from './components/upload-cover';
import {
  useCategories,
  useCreateArticle,
  useCreateCategory,
  useDeleteCategory,
} from './hooks';
import type { Category } from './types';

export default function CreateArticleWindow({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [title, setTitle] = React.useState('');
  const [status, setStatus] = React.useState<'draft' | 'publish'>('draft');
  const [imageUrl, setImageUrl] = React.useState<string | undefined>(undefined);
  const [content, setContent] = React.useState([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<number | ''>(
    '',
  );
  const [busy, setBusy] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');

  const { data: catsData } = useCategories();
  React.useEffect(() => {
    setCategories(catsData?.categories ?? []);
  }, [catsData]);

  const createMut = useCreateArticle();
  const createCategoryMut = useCreateCategory();
  const deleteCategoryMut = useDeleteCategory();

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const cat = await createCategoryMut.mutateAsync(newCategory.trim());
      setNewCategory('');
      setSelectedCategory(cat.id);
      toast.success('Category added');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      // optimistic UI update
      setCategories((prev) => prev.filter((c) => c.id !== id));
      await deleteCategoryMut.mutateAsync(String(id));
      if (selectedCategory === id) setSelectedCategory('');
      toast.success('Category removed');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to remove category');
    }
  };

  const save = async () => {
    setBusy(true);
    try {
      if (!title.trim() || !selectedCategory) {
        throw new Error('Please fill all required fields.');
      }
      await createMut.mutateAsync({
        title,
        category: selectedCategory,
        status,
        content,
        image_url: imageUrl,
      });
      onCreated?.();
      toast.success('Article created');
    } catch (e: any) {
      toast.error(e?.message || 'Failed to create post');
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
            <div>
              <h2 className="text-base font-semibold">Create Article</h2>
              <p className="text-muted-foreground text-xs">
                Fill in the details to publish a new article.
              </p>
            </div>

            <label className="text-xs">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />

            <CategorySelector
              categories={categories}
              selectedCategory={selectedCategory}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              setSelectedCategory={setSelectedCategory}
              addCategory={addCategory}
              handleDeleteCategory={handleDeleteCategory}
            />
          </div>

          <CoverImagePicker setImageUrl={setImageUrl} imageUrl={imageUrl} />

          <div className="flex items-center gap-2">
            <Select
              onValueChange={(value) => {
                setStatus(value as 'draft' | 'publish');
              }}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="Draft" />
              </SelectTrigger>
              <SelectContent className="z-[99999]">
                <SelectGroup>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="publish">Publish</SelectItem>
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
