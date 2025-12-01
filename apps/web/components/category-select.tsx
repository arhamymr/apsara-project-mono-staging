'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@workspace/ui/components/command';
import { Input } from '@workspace/ui/components/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormDescription, FormItem } from './ui/form';

interface Category {
  id: string | number;
  name: string;
  slug: string;
}

interface CategorySelectProps {
  name: string;
  placeholder?: string;
  categories?: Category[];
}

export function CategorySelect({
  name,
  placeholder = 'Select category',
  categories: initialCategories = [],
}: CategorySelectProps) {
  const router = useRouter();
  const { setValue, watch } = useFormContext();
  const selectedCategory = watch(name);

  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [currentCategory, setCurrentCategory] = useState<Category[]>(initialCategories);

  useEffect(() => {
    setCurrentCategory(initialCategories);
  }, [initialCategories]);

  const handleAddCategory = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const payload = {
      name: target.value,
    };
    
    try {
      const response = await fetch('/api/dashboard/categories/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        setNewCategory('');
        router.refresh();
      } else {
        console.error('Error adding category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    // Filter out the category to be deleted
    const updatedCategories = currentCategory.filter(
      (item) => item.id !== category.id,
    );

    // Update the categories in the local state
    setCurrentCategory(updatedCategories);
    
    try {
      await fetch(`/api/dashboard/categories/delete/${category.slug}`, {
        method: 'DELETE',
      });
      router.refresh();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategory?.name ? selectedCategory?.name : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {currentCategory.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={String(category.id)}
                    onSelect={() => {
                      setValue(name, category, {
                        shouldValidate: true,
                      });
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedCategory?.name === category?.name
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {category.name}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="gap-2 border-t p-2">
            <FormItem>
              <Input
                placeholder="Add new category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 p-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory(e);
                  }
                }}
              />
              <FormDescription>
                Press <Badge variant="outline"> Enter </Badge> to insert new
                category
              </FormDescription>
            </FormItem>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
