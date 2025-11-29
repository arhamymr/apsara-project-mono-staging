'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';

type Category = {
  id: number;
  name: string;
};

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: number | '' | undefined;
  newCategory: string;
  setNewCategory: (val: string) => void;
  setSelectedCategory: (val: number | '') => void;
  addCategory: () => void;
  handleDeleteCategory: (id: number) => void;
}

export function CategorySelector({
  categories,
  selectedCategory,
  newCategory,
  setNewCategory,
  setSelectedCategory,
  addCategory,
  handleDeleteCategory,
}: CategorySelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-muted-foreground text-xs font-medium">
        Category
      </label>

      {/* --- Category Select --- */}
      <Select
        onValueChange={(value) =>
          setSelectedCategory(value === '' ? '' : Number(value))
        }
        value={selectedCategory ? String(selectedCategory) : ''}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          {categories?.map((c) => (
            <SelectItem key={c.id} value={String(c?.id)}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* --- Category List as Badges --- */}
      <div className="border-border/60 bg-muted/10 flex min-h-[52px] flex-wrap gap-2 rounded-md border p-2">
        {categories.length === 0 ? (
          <div className="text-muted-foreground text-xs">
            No categories yet.
          </div>
        ) : (
          categories.map((c) => (
            <Badge
              key={c.id}
              variant="secondary"
              className="flex items-center gap-1 text-xs"
            >
              {c.name}
              <button
                onClick={() => handleDeleteCategory(c.id)}
                className="hover:bg-destructive/20 hover:text-destructive rounded-sm transition-colors"
                aria-label={`Remove ${c.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {/* --- Add New Category --- */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="New category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="text-sm"
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={addCategory}
          disabled={!newCategory.trim()}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
