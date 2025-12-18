'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Loader2, Trash2 } from 'lucide-react';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import { Editor } from '@/components/blocks/editor-x/editor';
import type { SerializedEditorState } from 'lexical';
import type { ColumnId, KanbanCard, Priority } from '../types';

interface CardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: KanbanCard | null;
  columnId: ColumnId | null;
  mode: 'create' | 'edit';
  isCreating: boolean;
  onCreateCard: (columnId: ColumnId, title: string, priority: Priority) => void;
  onUpdateCard: (
    id: KanbanCard['_id'],
    data: { title?: string; description?: string; priority?: Priority }
  ) => void;
  onDeleteCard: (id: KanbanCard['_id']) => void;
}

// Parse description - could be JSON editor state or plain text
function parseDescription(description: string | undefined): SerializedEditorState | undefined {
  if (!description) return undefined;
  try {
    const parsed = JSON.parse(description);
    if (parsed.root) return parsed;
    return undefined;
  } catch {
    return undefined;
  }
}

export function CardModal({
  open,
  onOpenChange,
  card,
  columnId,
  mode,
  isCreating,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
}: CardModalProps) {
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState<SerializedEditorState | undefined>(undefined);
  const [editorKey, setEditorKey] = useState(0);
  const [priority, setPriority] = useState<Priority>('medium');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const portalContainer = useWindowPortalContainer();

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && card) {
        setTitle(card.title);
        setEditorState(parseDescription(card.description));
        setPriority(card.priority);
      } else {
        setTitle('');
        setEditorState(undefined);
        setPriority('medium');
      }
      setEditorKey((k) => k + 1);
    }
  }, [open, mode, card]);

  const handleEditorChange = useCallback((state: SerializedEditorState) => {
    setEditorState(state);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const descriptionJson = editorState ? JSON.stringify(editorState) : undefined;

    if (mode === 'create' && columnId) {
      onCreateCard(columnId, title.trim(), priority);
    } else if (mode === 'edit' && card) {
      onUpdateCard(card._id, {
        title: title.trim(),
        description: descriptionJson,
        priority,
      });
    }
  };

  const handleDelete = () => {
    if (card) {
      onDeleteCard(card._id);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[650px]"
          portalContainer={portalContainer?.current ?? undefined}
        >
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Create Card' : 'Edit Card'}</DialogTitle>
            <DialogDescription>
              {mode === 'create' ? 'Add a new task card.' : 'Update the card details.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-[1fr_140px] gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter card title"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <div className="h-[250px] overflow-y-auto rounded-lg border">
                <Editor
                  key={editorKey}
                  editorSerializedState={editorState}
                  onSerializedChange={handleEditorChange}
                  lite
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              {mode === 'edit' && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mr-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || !title.trim()}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Create' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent portalContainer={portalContainer?.current ?? undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
