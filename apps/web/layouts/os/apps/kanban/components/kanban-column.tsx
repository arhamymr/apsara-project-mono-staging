'use client';

import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { cn } from '@/lib/utils';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, MoreVertical, Palette, Pencil, Plus, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { KanbanCardView } from './kanban-card';
import type { ColumnColor, KanbanCard, KanbanColumn } from '../types';
import { COLUMN_COLORS } from '../types';

interface KanbanColumnViewProps {
  column: KanbanColumn;
  onAddCard: () => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onChangeColor: (color: ColumnColor) => void;
  onCardClick: (card: KanbanCard) => void;
  onDeleteCard: (card: KanbanCard) => void;
  onArchiveCard: (card: KanbanCard) => void;
  isDragging?: boolean;
  isDropTarget?: boolean;
}

export const KanbanColumnView = memo(function KanbanColumnView({
  column,
  onAddCard,
  onEditColumn,
  onDeleteColumn,
  onChangeColor,
  onCardClick,
  onDeleteCard,
  onArchiveCard,
  isDragging = false,
  isDropTarget = false,
}: KanbanColumnViewProps) {
  const colorConfig = COLUMN_COLORS[column.color || 'default'];
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

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
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
        'border-border flex w-72 flex-shrink-0 flex-col rounded-md border shadow-sm',
        'transition-all duration-200',
        colorConfig.bg,
        (isSortableDragging || isDragging) && 'scale-95 opacity-50',
        !isDragging && 'hover:shadow-md',
        (isOver || isDropTarget) && 'border-primary bg-primary/5 ring-2 ring-primary/30 shadow-lg'
      )}
    >
      {/* Column Header */}
      <div
        className={cn(
          'border-border flex cursor-grab items-center justify-between border-b p-3',
          'bg-background/50 rounded-t-md backdrop-blur-sm',
          'hover:bg-background/70 transition-colors active:cursor-grabbing'
        )}
        {...attributes}
        {...listeners}
      >
        <div className="flex items-center gap-2">
          <div className={cn('h-2 w-2 rounded-full', colorConfig.dot)} />
          <h3 className="text-sm font-semibold tracking-tight">{column.name}</h3>
          <span className="text-muted-foreground bg-background/80 rounded-full px-2 py-0.5 text-xs font-medium">
            {cards.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-background/80 h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onAddCard();
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
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
            <DropdownMenuContent align="end" className="z-[9999] w-40">
              <DropdownMenuItem onClick={onEditColumn}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename Column
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="mr-2 h-4 w-4" />
                  Change Color
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="z-[10000]">
                  {(Object.keys(COLUMN_COLORS) as ColumnColor[]).map((colorKey) => (
                    <DropdownMenuItem
                      key={colorKey}
                      onClick={() => onChangeColor(colorKey)}
                      className="flex items-center gap-2"
                    >
                      <div className={cn('h-3 w-3 rounded-full', COLUMN_COLORS[colorKey].dot)} />
                      {COLUMN_COLORS[colorKey].label}
                      {(column.color || 'default') === colorKey && (
                        <Check className="ml-auto h-4 w-4" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
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
      </div>

      {/* Cards Area */}
      <div className="scrollbar-thin scrollbar-thumb-muted max-h-[calc(100vh-320px)] min-h-[150px] flex-1 space-y-2 overflow-y-auto p-2">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCardView
              key={card._id}
              card={card}
              onClick={() => onCardClick(card)}
              onDelete={() => onDeleteCard(card)}
              onArchive={() => onArchiveCard(card)}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div
            className={cn(
              'text-muted-foreground flex h-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-center transition-all duration-200',
              (isOver || isDropTarget) 
                ? 'border-primary bg-primary/10 text-primary scale-[1.02]' 
                : 'border-muted-foreground/20'
            )}
          >
            <Plus className={cn('h-4 w-4 transition-transform', (isOver || isDropTarget) && 'scale-125')} />
            <p className="text-xs font-medium">{(isOver || isDropTarget) ? 'Drop here' : 'No cards'}</p>
          </div>
        )}
      </div>

    </div>
  );
});
