'use client';

import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Plus, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { KanbanCardView } from './kanban-card';
import type { KanbanCard, KanbanColumn } from '../types';

interface KanbanColumnViewProps {
  column: KanbanColumn;
  onAddCard: () => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onCardClick: (card: KanbanCard) => void;
  isDragging?: boolean;
}

export const KanbanColumnView = memo(function KanbanColumnView({
  column,
  onAddCard,
  onEditColumn,
  onDeleteColumn,
  onCardClick,
  isDragging = false,
}: KanbanColumnViewProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: `column-${column._id}`,
    data: { type: 'column', column },
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `column-droppable-${column._id}`,
    data: { type: 'column', column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cards = column.cards || [];
  const cardIds = cards.map((card) => `card-${card._id}`);

  const setRefs = (node: HTMLDivElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  return (
    <div
      ref={setRefs}
      style={style}
      className={cn(
        'bg-muted/40 border-border flex w-72 flex-shrink-0 flex-col rounded-xl border shadow-sm',
        'transition-all duration-200',
        (isSortableDragging || isDragging) && 'scale-95 opacity-50',
        !isDragging && 'hover:shadow-md'
      )}
    >
      {/* Column Header */}
      <div
        className={cn(
          'border-border flex cursor-grab items-center justify-between border-b p-3',
          'bg-muted/50 rounded-t-xl backdrop-blur-sm',
          'hover:bg-muted/70 transition-colors active:cursor-grabbing'
        )}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2">
          <div className="bg-primary/60 h-2 w-2 rounded-full" />
          <h3 className="text-sm font-semibold tracking-tight">{column.name}</h3>
          <span className="text-muted-foreground bg-background/80 rounded-full px-2 py-0.5 text-xs font-medium">
            {cards.length}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-background/80 h-7 w-7 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEditColumn}>Edit Column</DropdownMenuItem>
            <DropdownMenuItem onClick={onDeleteColumn} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards Area */}
      <div className="scrollbar-thin scrollbar-thumb-muted max-h-[calc(100vh-320px)] min-h-[150px] flex-1 space-y-2 overflow-y-auto p-2">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCardView key={card._id} card={card} onClick={() => onCardClick(card)} />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="text-muted-foreground flex h-24 flex-col items-center justify-center gap-1 text-center">
            <Plus className="h-4 w-4 opacity-50" />
            <p className="text-xs">No cards</p>
          </div>
        )}
      </div>

      {/* Add Card Button */}
      <div className="border-border bg-muted/30 rounded-b-xl border-t p-2">
        <Button variant="ghost" size="sm" className="hover:bg-background/80 w-full justify-start" onClick={onAddCard}>
          <Plus className="mr-2 h-4 w-4" />
          Add Card
        </Button>
      </div>
    </div>
  );
});
