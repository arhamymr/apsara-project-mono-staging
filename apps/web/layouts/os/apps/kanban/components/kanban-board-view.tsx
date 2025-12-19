'use client';

import { Button } from '@workspace/ui/components/button';
import { Kanban, Plus, Loader2 } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState, useRef, useCallback } from 'react';
import { KanbanColumnView } from './kanban-column';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@/lib/utils';
import { ArrowUp, Minus } from 'lucide-react';
import type { BoardId, ColumnColor, ColumnId, KanbanBoard, KanbanCard, KanbanColumn, Priority } from '../types';

// Helper to apply optimistic card move to board data
function applyOptimisticMove(
  board: KanbanBoard,
  cardId: KanbanCard['_id'],
  targetColumnId: ColumnId,
  targetPosition: number
): KanbanBoard {
  const columns = board.columns || [];
  let movedCard: KanbanCard | null = null;
  
  // Remove card from source column
  const updatedColumns = columns.map(col => {
    const cardIndex = col.cards?.findIndex(c => c._id === cardId) ?? -1;
    if (cardIndex !== -1 && col.cards) {
      movedCard = col.cards[cardIndex] ?? null;
      return {
        ...col,
        cards: col.cards.filter(c => c._id !== cardId),
      };
    }
    return col;
  });

  if (!movedCard) return board;

  // Add card to target column
  const finalColumns = updatedColumns.map(col => {
    if (col._id === targetColumnId) {
      const cards = [...(col.cards || [])];
      const updatedCard = { ...movedCard!, columnId: targetColumnId, position: targetPosition };
      cards.splice(targetPosition, 0, updatedCard);
      // Update positions
      return {
        ...col,
        cards: cards.map((c, i) => ({ ...c, position: i })),
      };
    }
    return col;
  });

  return { ...board, columns: finalColumns };
}

const priorityConfig: Record<Priority, { label: string; icon: typeof Minus; className: string; dotColor: string }> = {
  low: {
    label: 'Low',
    icon: Minus,
    className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    dotColor: 'bg-emerald-500',
  },
  medium: {
    label: 'Medium',
    icon: Minus,
    className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
    dotColor: 'bg-amber-500',
  },
  high: {
    label: 'High',
    icon: ArrowUp,
    className: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
    dotColor: 'bg-rose-500',
  },
};

function DragOverlayCard({ card }: { card: KanbanCard }) {
  const priority = priorityConfig[card.priority];
  const PriorityIcon = priority.icon;

  return (
    <div className="w-64 rotate-3 cursor-grabbing">
      <div
        className={cn(
          'bg-card border-border relative rounded-lg border p-3',
          'shadow-2xl ring-2 ring-primary/30'
        )}
      >
        <div className={cn('absolute top-0 left-0 h-full w-1 rounded-l-lg', priority.dotColor)} />
        <h4 className="mb-1.5 line-clamp-2 pl-1 pr-6 text-sm font-medium leading-snug">
          {card.title}
        </h4>
        {card.description && (
          <p className="text-muted-foreground mb-2 line-clamp-2 pl-1 text-xs leading-relaxed">
            {card.description}
          </p>
        )}
        <div className="flex items-center justify-between gap-2 pl-1">
          <Badge variant="outline" className={cn('text-xs font-medium', priority.className)}>
            <PriorityIcon className="mr-1 h-3 w-3" />
            {priority.label}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function DragOverlayColumn({ column }: { column: KanbanColumn }) {
  return (
    <div className="w-72 rotate-2 cursor-grabbing">
      <div
        className={cn(
          'bg-muted/80 border-border rounded-xl border p-3 backdrop-blur-sm',
          'shadow-2xl ring-2 ring-primary/30'
        )}
      >
        <div className="flex items-center gap-2">
          <div className="bg-primary h-2 w-2 rounded-full" />
          <h3 className="text-sm font-semibold">{column.name}</h3>
          <span className="text-muted-foreground bg-background/80 rounded-full px-2 py-0.5 text-xs">
            {column.cards?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

interface KanbanBoardViewProps {
  board: KanbanBoard | null | undefined;
  selectedBoardId: BoardId | null;
  isCreatingBoard: boolean;
  onCreateBoard: (name: string) => void;
  onCreateCard: (columnId: ColumnId) => void;
  onEditCard: (card: KanbanCard) => void;
  onDeleteCard: (card: KanbanCard) => void;
  onArchiveCard: (card: KanbanCard) => void;
  onEditColumn: (column: KanbanColumn) => void;
  onDeleteColumn: (id: ColumnId) => void;
  onUpdateColumn: (id: ColumnId, data: { name?: string; color?: ColumnColor }) => void;
  onMoveCard: (cardId: KanbanCard['_id'], targetColumnId: ColumnId, targetPosition: number) => void;
  onReorderColumns: (positions: Array<{ id: ColumnId; position: number }>) => void;
}

export function KanbanBoardView({
  board: serverBoard,
  selectedBoardId,
  isCreatingBoard,
  onCreateBoard,
  onCreateCard,
  onEditCard,
  onDeleteCard,
  onArchiveCard,
  onEditColumn,
  onDeleteColumn,
  onUpdateColumn,
  onMoveCard,
  onReorderColumns,
}: KanbanBoardViewProps) {
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
  const [activeColumn, setActiveColumn] = useState<KanbanColumn | null>(null);
  const [overColumnId, setOverColumnId] = useState<ColumnId | null>(null);
  const [optimisticBoard, setOptimisticBoard] = useState<KanbanBoard | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use optimistic board if available, otherwise use server board
  const board = optimisticBoard ?? serverBoard;

  // Multi-input sensors for better accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    if (data?.type === 'card') setActiveCard(data.card);
    else if (data?.type === 'column') setActiveColumn(data.column);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    if (!over) {
      setOverColumnId(null);
      return;
    }
    const overData = over.data.current;
    if (overData?.type === 'column') {
      setOverColumnId(overData.column._id);
    } else if (overData?.type === 'card') {
      // Find the column containing this card
      const card = overData.card as KanbanCard;
      setOverColumnId(card.columnId);
    } else {
      setOverColumnId(null);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    setActiveColumn(null);
    setOverColumnId(null);

    if (!over || !board) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle card movement
    if (activeData?.type === 'card') {
      const card = activeData.card as KanbanCard;
      const overColumn = overData?.column as KanbanColumn | undefined;
      const overCard = overData?.card as KanbanCard | undefined;

      let targetColumnId: ColumnId | null = null;
      let targetPosition = 0;

      if (overColumn) {
        targetColumnId = overColumn._id;
        if (overCard) {
          targetPosition = overCard.position;
        } else if (overColumn.cards?.length) {
          targetPosition = overColumn.cards.length;
        }
      } else if (overCard) {
        // Dropped on a card - find its column
        const targetColumn = board.columns?.find(col => 
          col.cards?.some(c => c._id === overCard._id)
        );
        if (targetColumn) {
          targetColumnId = targetColumn._id;
          targetPosition = overCard.position;
        }
      }

      if (targetColumnId) {
        // Apply optimistic update immediately
        setOptimisticBoard(applyOptimisticMove(board, card._id, targetColumnId, targetPosition));
        // Then send to server
        onMoveCard(card._id, targetColumnId, targetPosition);
        // Clear optimistic state after a short delay to let server sync
        setTimeout(() => setOptimisticBoard(null), 500);
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
  }, [board, onMoveCard, onReorderColumns]);

  const handleDragCancel = useCallback(() => {
    setActiveCard(null);
    setActiveColumn(null);
    setOverColumnId(null);
  }, []);

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

  // Loading state - show skeleton columns
  if (board === undefined) {
    return (
      <div className="flex h-full gap-4 overflow-hidden p-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-muted/40 border-border flex w-72 flex-shrink-0 animate-pulse flex-col rounded-md border"
          >
            <div className="border-border flex items-center justify-between border-b p-3">
              <div className="flex items-center gap-2">
                <div className="bg-muted-foreground/20 h-2 w-2 rounded-full" />
                <div className="bg-muted-foreground/20 h-4 w-24 rounded" />
                <div className="bg-muted-foreground/20 h-5 w-6 rounded-full" />
              </div>
            </div>
            <div className="space-y-2 p-2">
              {[1, 2, 3].slice(0, i + 1).map((j) => (
                <div key={j} className="bg-card border-border rounded-lg border p-3">
                  <div className="bg-muted-foreground/20 mb-2 h-4 w-3/4 rounded" />
                  <div className="bg-muted-foreground/20 mb-3 h-3 w-1/2 rounded" />
                  <div className="bg-muted-foreground/20 h-5 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
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
          <p className="text-muted-foreground mt-1 text-sm">The board may have been deleted or you don&apos;t have access</p>
        </div>
      </div>
    );
  }

  const columns = board.columns || [];
  const columnIds = columns.map((col) => `column-${col._id}`);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
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
                onChangeColor={(color) => onUpdateColumn(column._id, { color })}
                onCardClick={onEditCard}
                onDeleteCard={onDeleteCard}
                onArchiveCard={onArchiveCard}
                isDropTarget={overColumnId === column._id && activeCard !== null}
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

      <DragOverlay dropAnimation={null}>
        {activeCard && <DragOverlayCard card={activeCard} />}
        {activeColumn && <DragOverlayColumn column={activeColumn} />}
      </DragOverlay>
    </DndContext>
  );
}
