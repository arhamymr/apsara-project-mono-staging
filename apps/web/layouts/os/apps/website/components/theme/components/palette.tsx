/* ThemePalette.tsx */
import { Card } from '@workspace/ui/components/card';
import { useWebsite } from '@/hooks/use-website';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import * as React from 'react';

type ThemePaletteProps = {
  value: string; // current themeId
  onSelect: (themeId: string) => void;
  className?: string;
  themes?: string[]; // daftar tema
};

const DEFAULT_THEMES = [
  'light',
  'dark',
  'sakura',
  'sakura-dark',
  'ocean',
  'ocean-dark',
  'amber',
  'amber-dark',
  'apsara',
  'apsara-dark',
] as const;

const isDarkName = (name: string) => name === 'dark' || name.endsWith('-dark');
const toLightName = (name: string) => {
  if (name === 'dark') return 'light';
  if (name.endsWith('-dark')) return name.replace(/-dark$/, '');
  return name;
};

export function ThemePalette({
  value,
  onSelect,
  className,
  themes = DEFAULT_THEMES as unknown as string[],
}: ThemePaletteProps) {
  // only light themes (exclude any *-dark or 'dark')
  const lightThemes = React.useMemo(
    () => themes.filter((t) => !isDarkName(t)),
    [themes],
  );

  // If current value is dark, highlight its light counterpart for visual consistency
  const effectiveSelected = toLightName(value);

  return (
    <div className={cn('space-y-4', className)}>
      <ThemeGrid
        items={lightThemes}
        value={effectiveSelected}
        onSelect={onSelect}
      />
    </div>
  );
}

function ThemeGrid({
  items,
  value,
  onSelect,
}: {
  items: string[];
  value: string;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="text-muted-foreground grid place-items-center rounded-md border border-dashed py-10 text-sm">
        No light themes
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="light theme picker"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((id) => (
        <ThemeOption
          key={id}
          id={id}
          selected={id === value}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function ThemeOption({
  id,
  selected,
  onSelect,
}: {
  id: string;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const { website, setWebsite } = useWebsite();
  // scope tiap kartu ke tema-nya (light only)
  return (
    <div data-theme={id}>
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={() => {
          onSelect(id);
          setWebsite({
            ...website,
            themeId: id,
          });
        }}
        className={cn(
          'group relative w-full text-left outline-none',
          'focus-visible:ring-ring rounded-md border transition hover:shadow-md focus-visible:ring-1',
        )}
      >
        <Card
          className={cn(
            'border-border bg-card text-card-foreground overflow-hidden rounded-md shadow-none',
            selected && 'ring-primary ring-2',
          )}
        >
          <div className="flex items-center justify-between px-3 py-2">
            <div className="text-sm font-medium capitalize">
              {id.replace(/-/g, ' ')}
            </div>
            <div
              className={cn(
                'grid h-5 w-5 place-items-center rounded-full border',
                selected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {selected && <Check className="h-3.5 w-3.5" />}
            </div>
          </div>

          {/* Swatches pakai utility Tailwind biar resolve dari @theme inline */}
          <div className="grid grid-cols-4 gap-2 p-3">
            <Swatch label="Primary" className="bg-primary" />
            <Swatch label="Bg" className="bg-background" />
            <Swatch label="Secondary" className="bg-secondary" />
            <Swatch label="Accent" className="bg-accent" />
          </div>
        </Card>
      </button>
    </div>
  );
}

function Swatch({ className, label }: { className: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('h-10 w-full rounded-md border', className)} />
      <span className="text-muted-foreground text-[10px] leading-none">
        {label}
      </span>
    </div>
  );
}
