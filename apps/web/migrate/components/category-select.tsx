/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormDescription, FormItem } from './ui/form';

interface CategorySelectProps {
  name: string;
  placeholder?: string;
}

export function CategorySelect({
  name,
  placeholder = 'Select category',
}: CategorySelectProps) {
  const { props } = usePage();
  const { categories } = props as any;

  const { setValue, watch } = useFormContext();
  const selectedCategory = watch(name);

  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [currentCategory, setCurrentCategory] = useState<any>(categories || []);

  useEffect(() => {
    setCurrentCategory(categories);
  }, [categories]);

  const handleAddCategory = async (e) => {
    const payload = {
      name: e.target.value,
    };
    router.post('/dashboard/categories/store', payload, {
      preserveScroll: true,
      replace: true,
      onSuccess: () => {
        // Clear the input field after successful submission
        setNewCategory('');
      },
      onError: (errors) => {
        console.error('Error adding category:', errors);
      },
    });
  };

  const handleDeleteCategory = (category: any) => {
    // Filter out the category to be deleted
    const updatedCategories = currentCategory.filter(
      (item: any) => item.id !== category.id,
    );

    // Update the categories in the local state
    setCurrentCategory(updatedCategories);
    router.delete(`/dashboard/categories/delete/${category.slug}`);
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
                    value={category.id}
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
