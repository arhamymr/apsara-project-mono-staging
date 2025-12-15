'use client';

import { Button } from '@workspace/ui/components/button';
import { Kanban, Plus, Loader2 } from 'lucide-react';
import type { KanbanBoard } from '../types';

interface KanbanHeaderProps {
  board: KanbanBoard | null | undefined;
  isCreatingColumn: boolean;
  onCreateColumn: () => void;
}

export function KanbanHeader({ board, isCreatingColumn, onCreateColumn }: KanbanHeaderProps) {
  return (
    <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
      <div className="flex items-center gap-3">
        <Kanban className="h-5 w-5" />
        <h2 className="text-base font-semibold">
          {board?.name || 'Kanban Board'}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        {board && (
          <Button size="sm" variant="outline" onClick={onCreateColumn} disabled={isCreatingColumn}>
            {isCreatingColumn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Column
          </Button>
        )}
      </div>
    </div>
  );
}
