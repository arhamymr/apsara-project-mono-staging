'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { LeadCard } from './lead-card';
import type { Lead } from '../types';

interface SortableLeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function SortableLeadCard({ lead, onClick }: SortableLeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && 'opacity-50')}
      {...attributes}
      {...listeners}
    >
      <LeadCard lead={lead} onClick={onClick} />
    </div>
  );
}
