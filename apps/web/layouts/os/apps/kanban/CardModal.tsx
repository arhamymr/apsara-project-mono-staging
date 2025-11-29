import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateCard, useDeleteCard, useUpdateCard } from '@/hooks/useKanban';
import { cardSchema, type CardFormData } from '@/lib/schemas/kanban';
import { type Card } from '@/types/kanban';

interface CardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card?: Card | null;
  columnId: number;
  boardId: number;
  mode: 'create' | 'edit';
}

export function CardModal({
  open,
  onOpenChange,
  card,
  columnId,
  boardId,
  mode,
}: CardModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const createCard = useCreateCard();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      assignee_id: null,
    },
  });

  // Reset form when card changes or modal opens
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && card) {
        form.reset({
          title: card.title,
          description: card.description || '',
          priority: card.priority,
          assignee_id: card.assignee_id,
        });
      } else {
        form.reset({
          title: '',
          description: '',
          priority: 'medium',
          assignee_id: null,
        });
      }
    }
  }, [open, mode, card, form]);

  const onSubmit = async (data: CardFormData) => {
    try {
      if (mode === 'create') {
        await createCard.mutateAsync({
          column_id: columnId,
          title: data.title,
          description: data.description || undefined,
          priority: data.priority,
          assignee_id: data.assignee_id || null,
          board_id: boardId,
        });
      } else if (mode === 'edit' && card) {
        await updateCard.mutateAsync({
          id: card.id,
          data: {
            title: data.title,
            description: data.description || undefined,
            priority: data.priority,
            assignee_id: data.assignee_id || null,
            board_id: boardId,
          },
        });
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Failed to save card:', error);
    }
  };

  const handleDelete = async () => {
    if (!card) return;

    try {
      await deleteCard.mutateAsync({
        id: card.id,
        boardId,
      });
      setShowDeleteConfirm(false);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  };

  const isLoading =
    createCard.isPending || updateCard.isPending || deleteCard.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Create Card' : 'Edit Card'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Add a new task card to this column.'
                : 'Update the card details.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter card title"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter card description (optional)"
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ''}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2">
                {mode === 'edit' && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isLoading}
                    className="mr-auto"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
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

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this card? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
