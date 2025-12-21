'use client';

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical, Palette, Trash2, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { COLUMN_COLORS } from '../constants';
import type { PipelineColumn } from '../types';

interface PipelineModalProps {
  columns: PipelineColumn[];
  onUpdateColumn: (id: string, updates: Partial<PipelineColumn>) => void;
  onDeleteColumn: (id: string) => void;
  onAddColumn: () => void;
  onReorderColumns: (columns: PipelineColumn[]) => void;
  onClose: () => void;
}

export function PipelineModal({
  columns,
  onUpdateColumn,
  onDeleteColumn,
  onAddColumn,
  onReorderColumns,
  onClose,
}: PipelineModalProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = columns.findIndex((c) => c.id === active.id);
    const newIndex = columns.findIndex((c) => c.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      onReorderColumns(arrayMove(columns, oldIndex, newIndex));
    }
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-background border-border relative z-10 mx-4 w-full max-w-lg rounded-lg border shadow-xl">
        <div className="border-border flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold">Customize Pipeline</h2>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          <p className="text-muted-foreground mb-4 text-sm">
            Drag to reorder stages. Double-click to rename.
          </p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={columns.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {columns.map((col) => (
                  <SortablePipelineItem
                    key={col.id}
                    column={col}
                    onUpdate={onUpdateColumn}
                    onDelete={onDeleteColumn}
                    canDelete={columns.length > 1}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <Button variant="outline" className="mt-4 w-full" onClick={onAddColumn}>
            + Add Stage
          </Button>
        </div>

        <div className="border-border flex justify-end border-t px-4 py-3">
          <Button size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

interface SortablePipelineItemProps {
  column: PipelineColumn;
  onUpdate: (id: string, updates: Partial<PipelineColumn>) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

function SortablePipelineItem({ column, onUpdate, onDelete, canDelete }: SortablePipelineItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.id,
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [title, setTitle] = React.useState(column.title);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleSave() {
    if (title.trim()) {
      onUpdate(column.id, { title: title.trim() });
    }
    setIsEditing(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn('bg-muted/50 flex items-center gap-3 rounded-lg border p-3', isDragging && 'opacity-50')}
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className={cn('h-3 w-3 rounded-full flex-shrink-0', column.dotColor)} />
      {isEditing ? (
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="h-8 flex-1"
          autoFocus
        />
      ) : (
        <span className="flex-1 text-sm font-medium cursor-pointer" onDoubleClick={() => setIsEditing(true)}>
          {column.title}
        </span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Palette className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {COLUMN_COLORS.map((c) => (
            <DropdownMenuItem
              key={c.name}
              onClick={() => onUpdate(column.id, { color: c.color, dotColor: c.dotColor })}
            >
              <div className={cn('mr-2 h-3 w-3 rounded-full', c.dotColor)} />
              {c.name}
              {column.dotColor === c.dotColor && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {canDelete && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
          onClick={() => onDelete(column.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
