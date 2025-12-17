'use client';

import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowUp, Minus } from 'lucide-react';
import { memo } from 'react';
import type { KanbanCard, Priority } from '../types';

interface KanbanCardViewProps {
  card: KanbanCard;
  onClick: () => void;
  isDragging?: boolean;
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

export const KanbanCardView = memo(function KanbanCardView({ card, onClick, isDragging = false }: KanbanCardViewProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: `card-${card._id}`,
    data: { type: 'card', card },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[card.priority];
  const PriorityIcon = priority.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'group bg-card border-border relative cursor-pointer rounded-lg border p-3',
        'hover:border-primary/50 transition-all duration-200 hover:shadow-md',
        'hover:scale-[1.01] active:scale-100 active:cursor-grabbing',
        (isSortableDragging || isDragging) && 'scale-95 opacity-50'
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Priority Indicator */}
      <div className={cn('absolute top-0 left-0 h-full w-1 rounded-l-lg', priority.dotColor, 'opacity-60 group-hover:opacity-100')} />

      {/* Title */}
      <h4 className="mb-1.5 line-clamp-2 pl-1 text-sm font-medium leading-snug">{card.title}</h4>

      {/* Description */}
      {card.description && (
        <p className="text-muted-foreground mb-2 line-clamp-2 pl-1 text-xs leading-relaxed">{card.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pl-1">
        <Badge variant="outline" className={cn('text-xs font-medium', priority.className)}>
          <PriorityIcon className="mr-1 h-3 w-3" />
          {priority.label}
        </Badge>
      </div>
    </div>
  );
});
