import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { Card, Column } from '@/types/kanban';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreVertical, Plus, Trash2 } from 'lucide-react';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  onAddCard: () => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onCardClick: (card: Card) => void;
  isDragging?: boolean;
}

export function KanbanColumn({
  column,
  cards,
  onAddCard,
  onEditColumn,
  onDeleteColumn,
  onCardClick,
  isDragging = false,
}: KanbanColumnProps) {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: `column-${column.id}`,
    data: {
      type: 'column',
      column,
    },
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `column-droppable-${column.id}`,
    data: {
      type: 'column',
      column,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardIds = cards.map((card) => `card-${card.id}`);

  // Combine refs
  const setRefs = (node: HTMLDivElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  return (
    <div
      ref={setRefs}
      style={style}
      className={cn(
        'bg-muted/40 border-border flex w-80 flex-shrink-0 flex-col rounded-xl border shadow-sm',
        'transition-all duration-200',
        (isSortableDragging || isDragging) && 'scale-95 opacity-50',
        !isDragging && 'hover:shadow-md',
      )}
    >
      {/* Column Header */}
      <div
        className={cn(
          'border-border flex cursor-grab items-center justify-between border-b p-3.5',
          'bg-muted/50 rounded-t-xl backdrop-blur-sm',
          'hover:bg-muted/70 transition-colors active:cursor-grabbing',
        )}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/60 flex h-2 w-2 rounded-full" />
          <h3 className="text-sm font-semibold tracking-tight">
            {column.name}
          </h3>
          <span className="text-muted-foreground bg-background/80 rounded-full px-2.5 py-0.5 text-xs font-medium">
            {cards.length}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-background/80 h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Column options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onEditColumn}>
              Edit Column
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDeleteColumn}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards Area */}
      <div className="scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent max-h-[calc(100vh-300px)] min-h-[200px] flex-1 space-y-2.5 overflow-y-auto p-3">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="text-muted-foreground flex h-32 flex-col items-center justify-center gap-2 text-center">
            <div className="bg-muted/50 rounded-full p-3">
              <Plus className="h-5 w-5 opacity-50" />
            </div>
            <p className="text-xs">No cards yet</p>
          </div>
        )}
      </div>

      {/* Add Card Button */}
      <div className="border-border bg-muted/30 rounded-b-xl border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-background/80 w-full justify-start transition-colors"
          onClick={onAddCard}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Card
        </Button>
      </div>
    </div>
  );
}
