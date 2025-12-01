/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DndContext } from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import * as React from 'react';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import { useWebsite } from '@/hooks/use-website';
import { cn } from '@/lib/utils';
import { GripVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import { usePageManager } from './use-page-manager';

export function PageOrderer({ className }: { className?: string }) {
  const { website, activePage, setWebsite, addPage, removePage } = useWebsite();

  const {
    order,
    editingId,
    draftName,
    draftPath,
    setDraftName,
    setDraftPath,
    sensors,
    onDragStart,
    onDragEnd,
    startEdit,
    cancelEdit,
    saveEdits,
  } = usePageManager({ website, setWebsite });

  return (
    <Card
      className={cn('overflow-hidden rounded-md border shadow-none', className)}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="text-sm font-medium">Pages</div>
        <div className="flex items-center gap-2">
          {/* Sort A–Z removed */}
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              addPage?.({
                title: 'New Page',
                sections: [],
              });
            }}
          >
            <Plus className="h-4 w-4" />
            Page
          </Button>
        </div>
      </div>
      <Separator />

      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <ul className="divide-y">
            {order?.map((id) => {
              const page = website.pages[id];
              if (!page) return null;

              const isHome = id === 'home';
              const isActive = activePage?.id === id;
              const isEditing = editingId === id;

              return (
                <SortableRow
                  key={id}
                  id={id}
                  page={page}
                  isHome={isHome}
                  isActive={isActive}
                  isEditing={isEditing}
                  draftName={draftName}
                  draftPath={draftPath}
                  setDraftName={setDraftName}
                  setDraftPath={setDraftPath}
                  onEditStart={() => startEdit(id, page, isHome)}
                  onEditSave={() => saveEdits(id, draftName, draftPath)}
                  onEditCancel={cancelEdit}
                  onRemove={() => removePage?.(id)}
                />
              );
            })}
          </ul>
        </SortableContext>
      </DndContext>
    </Card>
  );
}

function SortableRow({
  id,
  page,
  isHome,
  isActive,
  isEditing,
  draftName,
  draftPath,
  setDraftName,
  setDraftPath,
  onEditStart,
  onEditSave,
  onEditCancel,
  onRemove,
}: {
  id: string;
  page: { id: string; title: string; path: string };
  isHome: boolean;
  isActive: boolean;
  isEditing: boolean;
  draftName: string;
  draftPath: string;
  setDraftName: (v: string) => void;
  setDraftPath: (v: string) => void;
  onEditStart: () => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0)`
      : undefined,
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'group bg-background hover:bg-muted/40 flex items-center gap-3 px-3 py-2 transition',
        isDragging && 'opacity-50',
      )}
    >
      {/* drag handle */}
      <button
        className="text-muted-foreground group-hover:text-foreground cursor-grab"
        aria-label="Drag to reorder"
        {...listeners}
        type="button"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* view / edit */}
      <div className="flex min-w-0 flex-1 flex-col">
        {isEditing ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-2">
              {/* Name (object key) — title stores RAW value */}
              <Input
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="h-8 max-w-[220px]"
                placeholder="name (object key)"
                autoFocus
                disabled={isHome} // extra guard
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    onEditSave();
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    onEditCancel();
                  }
                }}
              />
              {/* Slug (path) */}
              <Input
                value={draftPath}
                onChange={(e) => setDraftPath(e.target.value)}
                className="h-8 max-w-[260px]"
                placeholder="/slug-or/:param"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    onEditSave();
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    onEditCancel();
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditSave();
                }}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditCancel();
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-medium">{page.title}</span>
              {isHome && <Badge variant="secondary">home</Badge>}
              {isActive && <Badge variant="outline">active</Badge>}
            </div>
            <span className="text-muted-foreground truncate text-xs">
              {page.path}
            </span>
          </>
        )}
      </div>

      {/* actions */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          title={isHome ? 'Home is not editable' : 'Rename key / Edit slug'}
          onClick={onEditStart}
          disabled={isHome}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          title={isHome ? 'Cannot remove home' : 'Remove page'}
          disabled={isHome}
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}
