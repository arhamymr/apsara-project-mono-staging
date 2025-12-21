'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { LeadColumn } from './lead-column';
import type { Lead, PipelineColumn } from '../types';

interface SortableColumnProps {
  column: PipelineColumn;
  leads: Lead[];
  onAddLead: () => void;
  onEditLead: (lead: Lead) => void;
  onUpdateColumn: (id: string, updates: Partial<PipelineColumn>) => void;
  onDeleteColumn: (id: string) => void;
  canDelete: boolean;
}

export function SortableColumn({
  column,
  leads,
  onAddLead,
  onEditLead,
  onUpdateColumn,
  onDeleteColumn,
  canDelete,
}: SortableColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
    data: { type: 'column', column },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && 'opacity-50')}>
      <LeadColumn
        column={column}
        leads={leads}
        onAddLead={onAddLead}
        onEditLead={onEditLead}
        onUpdateColumn={onUpdateColumn}
        onDeleteColumn={onDeleteColumn}
        canDelete={canDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
