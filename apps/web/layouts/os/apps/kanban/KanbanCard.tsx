import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Card } from '@/types/kanban';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowUp, Minus } from 'lucide-react';

interface KanbanCardProps {
  card: Card;
  onClick: () => void;
  isDragging?: boolean;
}

const priorityConfig = {
  low: {
    label: 'Low',
    icon: Minus,
    className:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
    dotColor: 'bg-emerald-500',
  },
  medium: {
    label: 'Medium',
    icon: Minus,
    className:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
    dotColor: 'bg-amber-500',
  },
  high: {
    label: 'High',
    icon: ArrowUp,
    className:
      'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20',
    dotColor: 'bg-rose-500',
  },
};

export function KanbanCard({
  card,
  onClick,
  isDragging = false,
}: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: `card-${card.id}`,
    data: {
      type: 'card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[card.priority];
  const PriorityIcon = priority.icon;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'group bg-card border-border relative cursor-pointer rounded-lg border p-3.5',
        'hover:border-primary/50 transition-all duration-200 hover:shadow-lg',
        'hover:scale-[1.02] active:scale-100',
        'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'active:cursor-grabbing',
        (isSortableDragging || isDragging) && 'scale-95 opacity-50',
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
      {/* Priority Indicator Bar */}
      <div
        className={cn(
          'absolute top-0 left-0 h-full w-1 rounded-l-lg transition-all',
          priority.dotColor,
          'opacity-60 group-hover:opacity-100',
        )}
      />

      {/* Card Title */}
      <h4 className="mb-2 line-clamp-2 text-sm leading-snug font-semibold">
        {card.title}
      </h4>

      {/* Card Description */}
      {card.description && (
        <p className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">
          {card.description}
        </p>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between gap-2">
        {/* Priority Badge */}
        <Badge
          variant="outline"
          className={cn(
            'text-xs font-medium transition-colors',
            priority.className,
          )}
        >
          <PriorityIcon className="mr-1 h-3 w-3" />
          {priority.label}
        </Badge>

        {/* Assignee Avatar */}
        {card.assignee && (
          <Avatar className="ring-background h-6 w-6 ring-2 transition-transform group-hover:scale-110">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getInitials(card.assignee.name)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
