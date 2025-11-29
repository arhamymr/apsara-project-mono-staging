import type { Board, Card, Column } from '@/types/kanban';
import {
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useRef, useState } from 'react';
import { KanbanCard } from './KanbanCard';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  board: Board;
  onMoveCard: (
    cardId: number,
    targetColumnId: number,
    targetPosition: number,
  ) => void;
  onReorderColumns: (
    columnPositions: Array<{ id: number; position: number }>,
  ) => void;
  onCreateCard: (columnId: number) => void;
  onEditCard: (card: Card) => void;
  onEditColumn: (column: Column) => void;
  onDeleteColumn: (columnId: number) => void;
}

export function KanbanBoard({
  board,
  onMoveCard,
  onReorderColumns,
  onCreateCard,
  onEditCard,
  onEditColumn,
  onDeleteColumn,
}: KanbanBoardProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
  );

  // Auto-scroll functionality
  const startAutoScroll = (direction: 'left' | 'right', speed: number) => {
    if (autoScrollIntervalRef.current) return;

    autoScrollIntervalRef.current = window.setInterval(() => {
      if (scrollContainerRef.current) {
        const scrollAmount = direction === 'left' ? -speed : speed;
        scrollContainerRef.current.scrollLeft += scrollAmount;
      }
    }, 16); // ~60fps
  };

  const stopAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => stopAutoScroll();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;

    if (data?.type === 'card') {
      setActiveCard(data.card);
    } else if (data?.type === 'column') {
      setActiveColumn(data.column);
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    if (!scrollContainerRef.current) return;

    const { activatorEvent } = event;
    if (!activatorEvent || !('clientX' in activatorEvent)) return;

    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const mouseX = activatorEvent.clientX as number;

    const edgeThreshold = 100; // pixels from edge to trigger scroll
    const maxScrollSpeed = 15;

    // Check if near left edge
    if (mouseX < containerRect.left + edgeThreshold) {
      const distance = containerRect.left + edgeThreshold - mouseX;
      const speed = Math.min(
        maxScrollSpeed,
        (distance / edgeThreshold) * maxScrollSpeed,
      );
      startAutoScroll('left', speed);
    }
    // Check if near right edge
    else if (mouseX > containerRect.right - edgeThreshold) {
      const distance = mouseX - (containerRect.right - edgeThreshold);
      const speed = Math.min(
        maxScrollSpeed,
        (distance / edgeThreshold) * maxScrollSpeed,
      );
      startAutoScroll('right', speed);
    }
    // Not near edges, stop scrolling
    else {
      stopAutoScroll();
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Only handle card movements here
    if (activeData?.type === 'card' && overData?.type === 'column') {
      const activeCard = activeData.card as Card;
      const overColumn = overData.column as Column;

      // If card is being moved to a different column, update optimistically
      if (activeCard.column_id !== overColumn.id) {
        // This will be handled by the parent component's optimistic update
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveCard(null);
    setActiveColumn(null);
    stopAutoScroll();

    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Handle card movement
    if (activeData?.type === 'card') {
      const activeCard = activeData.card as Card;
      const overColumn = overData?.column as Column;
      const overCard = overData?.card as Card;

      if (overColumn) {
        // Calculate target position
        let targetPosition = 0;
        if (overCard) {
          targetPosition = overCard.position;
        } else if (overColumn.cards && overColumn.cards.length > 0) {
          targetPosition = overColumn.cards.length;
        }

        onMoveCard(activeCard.id, overColumn.id, targetPosition);
      }
    }

    // Handle column reordering
    if (activeData?.type === 'column' && overData?.type === 'column') {
      const activeColumn = activeData.column as Column;
      const overColumn = overData.column as Column;

      if (activeColumn.id !== overColumn.id) {
        const columns = board.columns || [];
        const oldIndex = columns.findIndex((col) => col.id === activeColumn.id);
        const newIndex = columns.findIndex((col) => col.id === overColumn.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedColumns = [...columns];
          const [movedColumn] = reorderedColumns.splice(oldIndex, 1);
          if (movedColumn) {
            reorderedColumns.splice(newIndex, 0, movedColumn);
          }

          const columnPositions = reorderedColumns.map((col, index) => ({
            id: col.id,
            position: index,
          }));

          onReorderColumns(columnPositions);
        }
      }
    }
  };

  const columns = board.columns || [];
  const columnIds = columns.map((col) => `column-${col.id}`);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={scrollContainerRef}
        className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 flex h-full overflow-x-auto overflow-y-hidden scroll-smooth"
      >
        <SortableContext
          items={columnIds}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex min-h-full gap-4 p-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                cards={column.cards || []}
                onAddCard={() => onCreateCard(column.id)}
                onEditColumn={() => onEditColumn(column)}
                onDeleteColumn={() => onDeleteColumn(column.id)}
                onCardClick={onEditCard}
              />
            ))}
          </div>
        </SortableContext>
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="rotate-3 opacity-90 shadow-2xl">
            <KanbanCard card={activeCard} onClick={() => {}} isDragging />
          </div>
        )}
        {activeColumn && (
          <div className="rotate-2 opacity-90 shadow-2xl">
            <KanbanColumn
              column={activeColumn}
              cards={activeColumn.cards || []}
              onAddCard={() => {}}
              onEditColumn={() => {}}
              onDeleteColumn={() => {}}
              onCardClick={() => {}}
              isDragging
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
