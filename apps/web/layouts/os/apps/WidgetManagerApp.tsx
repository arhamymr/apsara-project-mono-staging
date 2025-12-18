'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  useWidgets,
  type WidgetType,
} from '@/layouts/os/widgets/WidgetsContext';
import { cn } from '@/lib/utils';
import * as React from 'react';

type CatalogItem = {
  type: WidgetType;
  label: string;
  description: string;
  emoji: string;
  tags?: string[];
};

const CATALOG: CatalogItem[] = [
  {
    type: 'clock',
    label: 'Clock',
    description: 'A minimal clock widget showing the current time.',
    emoji: '🕒',
    tags: ['time', 'utility'],
  },
  {
    type: 'note',
    label: 'Note',
    description: 'Quick notes with inline editing. Great for todos and ideas.',
    emoji: '📝',
    tags: ['notes', 'productivity'],
  },
];

type TagFilter =
  | 'all'
  | 'utility'
  | 'time'
  | 'notes'
  | 'productivity';

export default function WidgetManagerApp() {
  const { addWidget } = useWidgets();

  const [query, setQuery] = React.useState('');
  const [tag, setTag] = React.useState<TagFilter>('all');

  const add = (type: WidgetType) => () => addWidget(type);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return CATALOG.filter((item) => {
      const matchesQuery =
        !q ||
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.tags ?? []).some((t) => t.toLowerCase().includes(q));
      const matchesTag = tag === 'all' || (item.tags ?? []).includes(tag);
      return matchesQuery && matchesTag;
    });
  }, [query, tag]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Available Widgets</h2>
          <Badge variant="secondary" className="text-[10px]">
            {CATALOG.length}
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 border-b p-4">
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search widgets…"
            aria-label="Search widgets"
            className="rounded-lg py-5 pr-3 pl-9 text-sm"
          />
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm opacity-60 select-none">
            🔎
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          <TagChips value={tag} onChange={setTag} />
        </div>
      </div>

      {/* Catalog */}
      <ScrollArea className="flex-1 p-4">
        {filtered.length === 0 ? (
          <div className="grid h-full place-items-center py-12 text-center">
            <div>
              <div className="text-base font-medium">
                No widgets match your search
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Try a different keyword or clear filters.
              </p>
              <div className="mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setQuery('');
                    setTag('all');
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className={cn(
              "grid gap-4",
              filtered.length === 1 && "grid-cols-1",
              filtered.length === 2 && "grid-cols-1 sm:grid-cols-2",
              filtered.length === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
              filtered.length >= 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            )}
          >
            {filtered.map((item) => (
              <CatalogCard key={item.type} item={item} onAdd={add(item.type)} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function TagChips({
  value,
  onChange,
}: {
  value: TagFilter;
  onChange: (v: TagFilter) => void;
}) {
  const base = 'h-8 rounded-md border px-3 text-xs transition-colors';
  const active = 'border-primary/30 bg-primary/10 text-primary';
  const idle =
    'border-transparent bg-muted/50 text-muted-foreground hover:bg-muted';

  const tags: TagFilter[] = [
    'all',
    'utility',
    'time',
    'notes',
    'productivity',
  ];

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={cn(base, value === t ? active : idle)}
          aria-pressed={value === t}
        >
          {t[0]?.toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}

function CatalogCard({
  item,
  onAdd,
}: {
  item: CatalogItem;
  onAdd: () => void;
}) {
  return (
    <Card className="group flex flex-col justify-between border p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className="bg-muted grid size-12 place-items-center rounded-lg border">
          <span className="text-2xl"> {item.emoji} </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{item.label}</h3>
            {(item.tags ?? []).slice(0, 2).map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="h-5 px-1.5 text-[10px]"
              >
                {t}
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground mt-2 line-clamp-2 text-xs">
            {item.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-muted-foreground text-[10px] tracking-wider uppercase">
          {item.type}
        </div>
        <Button size="sm" onClick={onAdd} className="h-8 gap-1.5 text-xs">
          <span>+</span>
          Add Widget
        </Button>
      </div>
    </Card>
  );
}
