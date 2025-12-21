'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Check, GripVertical, MoreVertical, Palette, Pencil, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
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
import { SortableLeadCard } from './SortableLeadCard';
import { COLUMN_COLORS } from '../constants';
import type { Lead, PipelineColumn } from '../types';

interface LeadColumnProps {
  column: PipelineColumn;
  leads: Lead[];
  onAddLead: () => void;
  onEditLead: (lead: Lead) => void;
  onUpdateColumn: (id: string, updates: Partial<PipelineColumn>) => void;
  onDeleteColumn: (id: string) => void;
  canDelete: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function LeadColumn({
  column,
  leads,
  onAddLead,
  onEditLead,
  onUpdateColumn,
  onDeleteColumn,
  canDelete,
  dragHandleProps,
}: LeadColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(column.title);

  function handleSaveTitle() {
    if (editTitle.trim()) {
      onUpdateColumn(column.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  }

  return (
    <div
      className={cn(
        'border-border flex w-72 flex-shrink-0 flex-col rounded-md border shadow-sm transition-all duration-200',
        column.color,
        isOver && 'border-primary ring-primary/30 ring-2 shadow-lg'
      )}
    >
      {/* Column Header */}
      <div className="bg-background/50 border-border flex items-center justify-between rounded-t-md border-b p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className={cn('h-2 w-2 rounded-full flex-shrink-0', column.dotColor)} />
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              className="h-6 text-sm font-semibold"
              autoFocus
            />
          ) : (
            <h3
              className="text-sm font-semibold tracking-tight truncate cursor-pointer"
              onDoubleClick={() => setIsEditing(true)}
            >
              {column.title}
            </h3>
          )}
          <span className="text-muted-foreground bg-background/80 rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0">
            {leads.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="hover:bg-background/80 h-7 w-7 p-0" onClick={onAddLead}>
            <Plus className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-background/80 h-7 w-7 p-0 ">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 z-[99999]">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="mr-2 h-4 w-4" />
                  Color
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {COLUMN_COLORS.map((c) => (
                    <DropdownMenuItem
                      key={c.name}
                      onClick={() => onUpdateColumn(column.id, { color: c.color, dotColor: c.dotColor })}
                    >
                      <div className={cn('mr-2 h-3 w-3 rounded-full', c.dotColor)} />
                      {c.name}
                      {column.dotColor === c.dotColor && <Check className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDeleteColumn(column.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Cards Area */}
      <div
        ref={setNodeRef}
        className="scrollbar-thin scrollbar-thumb-muted max-h-[calc(100vh-280px)] min-h-[150px] flex-1 space-y-2 overflow-y-auto p-2"
      >
        <SortableContext items={leads.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <SortableLeadCard key={lead.id} lead={lead} onClick={() => onEditLead(lead)} />
          ))}
        </SortableContext>

        {leads.length === 0 && (
          <div
            className={cn(
              'text-muted-foreground flex h-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed text-center transition-all',
              isOver ? 'border-primary bg-primary/10 text-primary' : 'border-muted-foreground/20'
            )}
          >
            <Plus className={cn('h-4 w-4', isOver && 'scale-125')} />
            <p className="text-xs font-medium">{isOver ? 'Drop here' : 'No leads'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function ColumnOverlay({ column }: { column: PipelineColumn }) {
  return (
    <div className={cn('w-72 rounded-md border shadow-2xl ring-2 ring-primary/30 rotate-2', column.color)}>
      <div className="bg-background/50 border-b p-3 rounded-t-md">
        <div className="flex items-center gap-2">
          <div className={cn('h-2 w-2 rounded-full', column.dotColor)} />
          <h3 className="text-sm font-semibold">{column.title}</h3>
        </div>
      </div>
    </div>
  );
}
