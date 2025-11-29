import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateColumn, useUpdateColumn } from '@/hooks/useKanban';
import { columnSchema, type ColumnFormData } from '@/lib/schemas/kanban';
import { type Column } from '@/types/kanban';

interface ColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  column?: Column | null;
  boardId: number;
  mode: 'create' | 'edit';
}

export function ColumnModal({
  open,
  onOpenChange,
  column,
  boardId,
  mode,
}: ColumnModalProps) {
  const createColumn = useCreateColumn();
  const updateColumn = useUpdateColumn();

  const form = useForm<ColumnFormData>({
    resolver: zodResolver(columnSchema),
    defaultValues: {
      name: '',
    },
  });

  // Reset form when column changes or modal opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && column) {
        form.reset({
          name: column.name,
        });
      } else {
        form.reset({
          name: '',
        });
      }
    }
  }, [open, mode, column, form]);

  const onSubmit = async (data: ColumnFormData) => {
    try {
      if (mode === 'create') {
        await createColumn.mutateAsync({
          board_id: boardId,
          name: data.name,
        });
      } else if (mode === 'edit' && column) {
        await updateColumn.mutateAsync({
          id: column.id,
          data: {
            name: data.name,
            board_id: boardId,
          },
        });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Failed to save column:', error);
    }
  };

  const isLoading = createColumn.isPending || updateColumn.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Column' : 'Edit Column'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new column to organize your cards.'
              : 'Update the column name.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Column Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter column name"
                      {...field}
                      disabled={isLoading}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isLoading
                  ? 'Saving...'
                  : mode === 'create'
                    ? 'Create'
                    : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
