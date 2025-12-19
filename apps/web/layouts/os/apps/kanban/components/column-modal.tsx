'use client';

import { useEffect, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Loader2 } from 'lucide-react';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import type { ColumnColor, ColumnId, KanbanColumn } from '../types';

interface ColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  column: KanbanColumn | null;
  mode: 'create' | 'edit';
  isCreating: boolean;
  onCreateColumn: (name: string) => void;
  onUpdateColumn: (id: ColumnId, data: { name?: string; color?: ColumnColor }) => void;
}

export function ColumnModal({
  open,
  onOpenChange,
  column,
  mode,
  isCreating,
  onCreateColumn,
  onUpdateColumn,
}: ColumnModalProps) {
  const [name, setName] = useState('');
  const portalContainer = useWindowPortalContainer();

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && column) {
        setName(column.name);
      } else {
        setName('');
      }
    }
  }, [open, mode, column]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (mode === 'create') {
      onCreateColumn(name.trim());
    } else if (mode === 'edit' && column) {
      onUpdateColumn(column._id, { name: name.trim() });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[350px]" portalContainer={portalContainer?.current ?? undefined}>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Column' : 'Edit Column'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Add a new column to organize cards.' : 'Update the column name.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Column Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter column name"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !name.trim()}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Create' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
