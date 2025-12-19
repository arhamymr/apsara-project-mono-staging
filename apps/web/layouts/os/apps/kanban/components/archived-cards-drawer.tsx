'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@workspace/ui/components/sheet';
import { cn } from '@/lib/utils';
import { Archive, RotateCcw, Trash2 } from 'lucide-react';
import type { CardId, Priority } from '../types';
import { formatWhen } from '../types';

interface ArchivedCard {
  _id: CardId;
  title: string;
  description?: string;
  priority: Priority;
  columnName: string;
  assignee?: { name?: string; email?: string; image?: string };
  archivedAt?: number;
  createdAt: number;
}

interface ArchivedCardsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: ArchivedCard[] | undefined;
  onRestore: (id: CardId) => void;
  onDelete: (id: CardId) => void;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  high: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
};

function getInitials(name?: string, email?: string): string {
  if (name) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }
  if (email) return email[0]?.toUpperCase() || '?';
  return '?';
}

export function ArchivedCardsDrawer({
  open,
  onOpenChange,
  cards,
  onRestore,
  onDelete,
}: ArchivedCardsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archived Cards
          </SheetTitle>
          <SheetDescription>
            {cards?.length || 0} archived card{cards?.length !== 1 ? 's' : ''}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3 overflow-y-auto max-h-[calc(100vh-180px)]">
          {(!cards || cards.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Archive className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground text-sm">No archived cards</p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Archived cards will appear here
              </p>
            </div>
          ) : (
            cards.map((card) => (
              <div
                key={card._id}
                className="group bg-card border rounded-lg p-3 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2">{card.title}</h4>
                    {card.description && (
                      <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                        {card.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="outline" className={cn('text-xs', priorityColors[card.priority])}>
                        {card.priority}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        from {card.columnName}
                      </span>
                      {card.archivedAt && (
                        <span className="text-muted-foreground/60 text-xs">
                          • {formatWhen(card.archivedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  {card.assignee && (
                    <Avatar className="h-6 w-6 border flex-shrink-0">
                      <AvatarImage src={card.assignee.image} />
                      <AvatarFallback className="text-[10px]">
                        {getInitials(card.assignee.name, card.assignee.email)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8"
                    onClick={() => onRestore(card._id)}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Restore
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(card._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
