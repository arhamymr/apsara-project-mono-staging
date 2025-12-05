'use client';

import type { CSSProperties } from 'react';
import { useCallback, useMemo } from 'react';

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Separator } from '@workspace/ui/components/separator';
import { useWebsite } from '@/hooks/use-website';
import { useWebsiteHistory } from '@/hooks/use-website/history-store';
import { useBuilderSelection } from '@/hooks/use-website/selection-store';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';
import { cn } from '@/lib/utils';
import { GripVertical, Library, Plus } from 'lucide-react';

type SectionNode = TemplateNode & {
  meta?: { label?: string; name?: string };
  title?: string;
};

type OrderableSection = {
  key: string;
  index: number;
  section: SectionNode;
};

const EMPTY_STATE_COPY = {
  title: 'No sections yet',
  description:
    'Add a section from the library, then drag to reorder once you have more than one.',
};

function getSectionLabel(section: SectionNode, fallbackIndex: number) {
  return (
    section.meta?.label ||
    section.meta?.name ||
    section.title ||
    section.id ||
    section.type ||
    `Section ${fallbackIndex + 1}`
  );
}

function useOrderableSections(sections: SectionNode[]) {
  return useMemo<OrderableSection[]>(
    () =>
      sections.map((section, index) => ({
        section,
        index,
        key: String(section.id ?? `${section.type ?? 'section'}-${index}`),
      })),
    [sections],
  );
}

function SortableRow({
  item,
  onSelect,
  isSelected,
}: {
  item: OrderableSection;
  onSelect: (item: OrderableSection) => void;
  isSelected: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.key });

  const style: CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
  };

  const label = getSectionLabel(item.section, item.index);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'group bg-background hover:bg-muted/60 relative flex cursor-pointer items-center gap-2.5 rounded-md border border-transparent px-2.5 py-1.5 transition',
        isDragging && 'ring-ring/50 shadow-sm ring-1',
        isSelected && 'border-primary bg-primary/5',
      )}
      onClick={() => onSelect(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(item);
        }
      }}
    >
      <Badge
        variant="outline"
        className="bg-muted text-muted-foreground h-5 w-5 shrink-0 items-center justify-center border-transparent p-0 text-[10px]"
      >
        {item.index + 1}
      </Badge>
      <button
        type="button"
        aria-label="Drag to reorder section"
        className="text-muted-foreground group-hover:text-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
        {...attributes}
        {...listeners}
        onClick={(event) => event.preventDefault()}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-xs leading-tight font-semibold">
          {label}
        </span>
        <span className="text-muted-foreground text-[10px]">
          {item.section.type}
        </span>
      </div>
    </li>
  );
}

export function SectionOrderer({
  onRequestLibrary,
}: {
  onRequestLibrary?: () => void;
}) {
  const { website, activePage, moveComponent } = useWebsite();
  const recordHistory = useWebsiteHistory((state) => state.record);
  const selected = useBuilderSelection((state) => state.selected);
  const setSelected = useBuilderSelection((state) => state.setSelected);

  const sections = (activePage?.sections ?? []) as SectionNode[];
  const orderable = useOrderableSections(sections);
  const items = orderable.map((item) => item.key);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleSelect = useCallback(
    (item: OrderableSection) => {
      if (!activePage) return;
      setSelected({
        slot: { kind: 'page', pageId: activePage.id },
        nodeId: item.section.id ?? item.key,
        path: [item.index],
      });
    },
    [activePage, setSelected],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const fromIndex = items.indexOf(String(active.id));
      const toIndex = items.indexOf(String(over.id));

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;

      const nextOrder = arrayMove(orderable, fromIndex, toIndex);

      recordHistory(website);
      moveComponent(fromIndex, toIndex);

      if (
        !activePage ||
        !selected ||
        selected.slot?.kind !== 'page' ||
        selected.slot?.pageId !== activePage.id ||
        !Array.isArray(selected.path) ||
        typeof selected.path[0] !== 'number'
      ) {
        return;
      }

      const selectedSection = orderable[selected.path[0]];
      if (!selectedSection) return;

      const nextIndex = nextOrder.findIndex(
        (entry) => entry.section === selectedSection.section,
      );
      if (nextIndex === -1 || nextIndex === selected.path[0]) return;

      const nextPath = [nextIndex, ...selected.path.slice(1)];

      setSelected({
        slot: selected.slot,
        nodeId: selected.nodeId,
        path: nextPath,
      });
    },
    [
      activePage,
      items,
      moveComponent,
      orderable,
      recordHistory,
      selected,
      setSelected,
      website,
    ],
  );

  if (!activePage || sections.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="space-y-3 text-center text-xs">
          <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <Library className="text-muted-foreground h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-semibold">{EMPTY_STATE_COPY.title}</h4>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {EMPTY_STATE_COPY.description}
            </p>
          </div>
          {onRequestLibrary && (
            <Button
              size="sm"
              variant="outline"
              onClick={onRequestLibrary}
              className="inline-flex items-center gap-1.5 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              Browse library
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {orderable.map((item) => (
              <SortableRow
                key={item.key}
                item={item}
                onSelect={handleSelect}
                isSelected={
                  !!selected &&
                  selected.nodeId === (item.section.id ?? item.key) &&
                  selected.slot?.kind === 'page' &&
                  selected.slot?.pageId === activePage.id
                }
              />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <Separator />
      <p className="text-muted-foreground text-[11px] leading-snug">
        Drag the handle to reorder how sections appear on the page. Selecting a
        row will focus the section in the preview so you can edit its
        properties.
      </p>
    </div>
  );
}
