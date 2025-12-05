'use client';

import { Command, CommandInput } from '@workspace/ui/components/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@/lib/utils';
import type { IconNode } from 'lucide-react';
import {
  Circle as CircleIcon,
  createLucideIcon,
  icons as lucideIcons,
} from 'lucide-react';
import * as React from 'react';

export type IconPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedName?: string;
  onSelect: (name: string) => void;
};

type IconComponent = React.ComponentType<{ className?: string }>;

function useLucideIconNames(): string[] {
  return React.useMemo(() => {
    const names = Object.keys(lucideIcons as Record<string, unknown>).filter(
      (key) => /^[A-Z]/.test(key),
    );
    names.sort((a, b) => a.localeCompare(b));
    return names;
  }, []);
}

function getIconComponent(name: string): IconComponent {
  const node = (lucideIcons as unknown as Record<string, IconNode>)[name];
  if (node) {
    return createLucideIcon(name, node);
  }
  return CircleIcon;
}

export function IconPicker({
  open,
  onOpenChange,
  selectedName,
  onSelect,
}: IconPickerProps) {
  const allNames = useLucideIconNames();
  const [query, setQuery] = React.useState('');
  const [internalOpen, setInternalOpen] = React.useState(open);

  React.useEffect(() => setInternalOpen(open), [open]);

  const handleOpenChange = (next: boolean) => {
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredNames = React.useMemo(() => {
    if (!normalizedQuery) {
      // Initial cap to first N icons for perf
      return allNames.slice(0, 200);
    }
    return allNames.filter((n) => n.toLowerCase().includes(normalizedQuery));
  }, [allNames, normalizedQuery]);

  const selected =
    typeof selectedName === 'string' && selectedName.trim().length
      ? selectedName.trim()
      : '';

  const handleSelect = (name: string) => {
    onSelect(name);
    handleOpenChange(false);
  };

  return (
    <Dialog open={internalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>Select an icon</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Command className="border-border rounded-lg border">
            <div className="p-2">
              <CommandInput
                placeholder="Search icons…"
                value={query}
                onValueChange={(value) => setQuery(value)}
                className="text-sm"
              />
            </div>
          </Command>

          <ScrollArea className="border-border h-[360px] w-full rounded-md border p-2">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {filteredNames.map((name) => {
                const IconComp = getIconComponent(name);
                const isSelected = selected === name;
                return (
                  <button
                    key={name}
                    type="button"
                    aria-label={`Select ${name}`}
                    onClick={() => handleSelect(name)}
                    className={cn(
                      'border-border bg-background hover:bg-muted/20 group flex h-20 flex-col items-center justify-center rounded-md border px-2 py-2 transition focus-visible:outline-none',
                      isSelected && 'border-primary/40 bg-primary/5',
                    )}
                  >
                    <IconComp
                      className={cn(
                        'text-muted-foreground group-hover:text-foreground mb-1 h-6 w-6 transition',
                        isSelected && 'text-primary',
                      )}
                    />
                    <span
                      className={cn(
                        'text-muted-foreground line-clamp-1 w-full text-center text-[11px]',
                        isSelected && 'text-foreground font-medium',
                      )}
                      title={name}
                    >
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredNames.length === 0 ? (
              <div className="text-muted-foreground flex h-[320px] w-full items-center justify-center text-xs">
                No icons match “{query}”
              </div>
            ) : null}
          </ScrollArea>

          <div className="text-muted-foreground flex items-center justify-between text-[11px]">
            <span>
              {normalizedQuery
                ? `Showing ${filteredNames.length} of ${allNames.length} icons`
                : `Showing ${filteredNames.length} popular icons`}
            </span>
            <span>
              Tip: names are case-sensitive (e.g., Zap, Grid3x3, MousePointer).
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
