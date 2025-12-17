'use client';

import { Button } from '@workspace/ui/components/button';
import { Kanban, Plus, Loader2 } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState, useRef } from 'react';
import { KanbanColumnView } from './kanban-column';
import type { BoardId, ColumnId, KanbanBoard, KanbanCard, KanbanColumn } from '../types';

interface KanbanBoardViewProps {
  board: KanbanBoard | null | undefined;
  selectedBoardId: BoardId | null;
  isCreatingBoard: boolean;
  onCreateBoard: (name: string) => void;
  onCreateCard: (columnId: ColumnId) => void;
  onEditCard: (card: KanbanCard) => void;
  onEditColumn: (column: KanbanColumn) => void;
  onDeleteColumn: (id: ColumnId) => void;
  onMoveCard: (cardId: KanbanCard['_id'], targetColumnId: ColumnId, targetPosition: number) => void;
  onReorderColumns: (positions: Array<{ id: ColumnId; position: number }>) => void;
}

export function KanbanBoardView({
  board,
  selectedBoardId,
  isCreatingBoard,
  onCreateBoard,
  onCreateCard,
  onEditCard,
  onEditColumn,
  onDeleteColumn,
  onMoveCard,
  onReorderColumns,
}: KanbanBoardViewProps) {
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.type === 'card') setActiveCard(data.card);
    else if (data?.type === 'column') setActiveColumn(data.column);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    setActiveColumn(null);

    if (!over || !board) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle card movement
    if (activeData?.type === 'card') {
      const card = activeData.card as KanbanCard;
      const overColumn = overData?.column as KanbanColumn | undefined;
      const overCard = overData?.card as KanbanCard | undefined;

      if (overColumn) {
        let targetPosition = 0;
        if (overCard) {
          targetPosition = overCard.position;
        } else if (overColumn.cards?.length > 0) {
          targetPosition = overColumn.cards.length;
        }
        onMoveCard(card._id, overColumn._id, targetPosition);
      }
    }

    // Handle column reordering
    if (activeData?.type === 'column' && overData?.type === 'column') {
      const activeCol = activeData.column as KanbanColumn;
      const overCol = overData.column as KanbanColumn;

      if (activeCol._id !== overCol._id) {
        const columns = board.columns || [];
        const oldIndex = columns.findIndex((c) => c._id === activeCol._id);
        const newIndex = columns.findIndex((c) => c._id === overCol._id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = [...columns];
          const [moved] = reordered.splice(oldIndex, 1);
          if (moved) reordered.splice(newIndex, 0, moved);
          onReorderColumns(reordered.map((col, i) => ({ id: col._id, position: i })));
        }
      }
    }
  };

  // Empty state - no board selected
  if (!selectedBoardId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Kanban className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <p className="text-muted-foreground text-lg">No board selected</p>
          <p className="text-muted-foreground mt-1 text-sm">Select a board or create a new one</p>
          <Button
            className="mt-4"
            onClick={() => onCreateBoard('New Board')}
            disabled={isCreatingBoard}
          >
            {isCreatingBoard ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Create Board
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (board === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Error state (board is null - not found or unauthorized)
  if (board === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Kanban className="text-muted-foreground mx-auto mb-4 h-16 w-16 opacity-50" />
          <p className="text-muted-foreground text-lg">Board not found</p>
          <p className="text-muted-foreground mt-1 text-sm">The board may have been deleted or you don't have access</p>
        </div>
      </div>
    );
  }

  const columns = board.columns || [];
  const columnIds = columns.map((col) => `column-${col._id}`);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={scrollContainerRef}
        className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent flex h-full overflow-x-auto overflow-y-hidden"
      >
        <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
          <div className="flex min-h-full gap-4 pb-4">
            {columns.map((column) => (
              <KanbanColumnView
                key={column._id}
                column={column}
                onAddCard={() => onCreateCard(column._id)}
                onEditColumn={() => onEditColumn(column)}
                onDeleteColumn={() => onDeleteColumn(column._id)}
                onCardClick={onEditCard}
              />
            ))}
            {columns.length === 0 && (
              <div className="flex h-full w-80 items-center justify-center rounded-xl border border-dashed">
                <p className="text-muted-foreground text-sm">No columns yet. Add one to get started.</p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="rotate-3 opacity-90 shadow-2xl">
            {/* Simplified ghost for better performance */}
            <div className="bg-card border-border w-72 rounded-lg border p-3">
              <div className="bg-primary/60 absolute top-0 left-0 h-full w-1 rounded-l-lg opacity-60" />
              <h4 className="line-clamp-2 pl-1 text-sm font-medium leading-snug">{activeCard.title}</h4>
              {activeCard.description && (
                <p className="text-muted-foreground mt-1 line-clamp-1 pl-1 text-xs">{activeCard.description}</p>
              )}
            </div>
          </div>
        )}
        {activeColumn && (
          <div className="rotate-2 opacity-90 shadow-2xl">
            {/* Simplified column ghost */}
            <div className="bg-muted/40 border-border w-72 rounded-xl border p-3">
              <div className="flex items-center gap-2">
                <div className="bg-primary/60 h-2 w-2 rounded-full" />
                <h3 className="text-sm font-semibold">{activeColumn.name}</h3>
                <span className="text-muted-foreground text-xs">
                  {activeColumn.cards?.length || 0}
                </span>
              </div>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
