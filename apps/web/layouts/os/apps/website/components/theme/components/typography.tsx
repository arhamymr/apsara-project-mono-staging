/* eslint-disable @typescript-eslint/no-explicit-any */
/* ThemePalette.tsx */
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWebsite } from '@/hooks/use-website';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import * as React from 'react';

function isIn(list: string[], v: string) {
  return list.includes(v);
}

/* =========================
   Typography Picker (opsional)
   ========================= */

export type TypographyPreset =
  | 'sans'
  | 'serif'
  | 'mono'
  | 'inter'
  | 'roboto'
  | 'poppins'
  | 'lato'
  | 'montserrat'
  | 'open-sans'
  | 'raleway'
  | 'nunito'
  | 'merriweather'
  | 'playfair'
  | 'fira-code'
  | 'source-code'
  | 'work-sans'
  | 'rubik'
  | 'manrope'
  | 'ubuntu'
  | 'josefin';

export const FONT_OPTIONS: Record<TypographyPreset, string> = {
  sans: 'ui-sans-serif, system-ui, sans-serif',
  serif: "ui-serif, Georgia, Cambria, 'Times New Roman', serif",
  mono: "ui-monospace, Menlo, Monaco, 'Courier New', monospace",
  inter: "'Inter', sans-serif",
  roboto: "'Roboto', sans-serif",
  poppins: "'Poppins', sans-serif",
  lato: "'Lato', sans-serif",
  montserrat: "'Montserrat', sans-serif",
  'open-sans': "'Open Sans', sans-serif",
  raleway: "'Raleway', sans-serif",
  nunito: "'Nunito', sans-serif",
  merriweather: "'Merriweather', serif",
  playfair: "'Playfair Display', serif",
  'fira-code': "'Fira Code', monospace",
  'source-code': "'Source Code Pro', monospace",
  'work-sans': "'Work Sans', sans-serif",
  rubik: "'Rubik', sans-serif",
  manrope: "'Manrope', sans-serif",
  ubuntu: "'Ubuntu', sans-serif",
  josefin: "'Josefin Sans', sans-serif",
};

type TypographyPickerProps = {
  value: TypographyPreset;
  onSelect: (typo: TypographyPreset) => void;
  favorites?: TypographyPreset[]; // tampil sebagai 6 kartu
  maxCards?: number; // default 6
  className?: string;
  label?: string;
};

export function TypographyPicker({
  value,
  onSelect,
  favorites = [
    'inter',
    'poppins',
    'manrope',
    'work-sans',
    'roboto',
    'montserrat',
  ],
  maxCards = 6,
  className,
}: TypographyPickerProps) {
  const { website, setWebsite } = useWebsite();

  const allKeys = Object.keys(FONT_OPTIONS) as TypographyPreset[];
  const favs = favorites.slice(0, maxCards);
  const rest = allKeys.filter((k) => !favs.includes(k));

  return (
    <div className={cn('space-y-3', className)}>
      {/* 6 cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {favs.map((k) => (
          <TypographyCard
            key={k}
            id={k}
            selected={k === value}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* More … (dropdown) */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-xs">More typography</span>
        <Select
          value={isIn(rest as any, value as any) ? value : undefined}
          onValueChange={(v) => {
            onSelect(v as TypographyPreset);
            setWebsite({
              ...website,
              typographyId: v,
            });
          }}
        >
          <SelectTrigger className="h-8 w-56">
            <SelectValue placeholder="Select typography…" />
          </SelectTrigger>
          <SelectContent>
            {rest.map((k) => (
              <SelectItem key={k} value={k}>
                {prettyName(k)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function TypographyCard({
  id,
  selected,
  onSelect,
}: {
  id: TypographyPreset;
  selected: boolean;
  onSelect: (id: TypographyPreset) => void;
}) {
  const { website, setWebsite } = useWebsite();
  // Preview langsung: override --font-sans untuk scope card ini
  const style: React.CSSProperties = {
    ['--font-sans' as any]: FONT_OPTIONS[id],
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => {
        onSelect(id);
        setWebsite({
          ...website,
          typographyId: id,
        });
      }}
      className={cn(
        'group relative w-full text-left outline-none',
        'focus-visible:ring-ring rounded-md border transition hover:ring focus-visible:ring-1',
      )}
    >
      <Card
        style={style}
        className={cn(
          'border-border bg-card text-card-foreground overflow-hidden rounded-md shadow-none',
          selected && 'ring-primary ring-2',
        )}
      >
        <div className="flex items-center justify-between px-3 py-2">
          <div className="text-sm font-medium">{prettyName(id)}</div>
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

        {/* preview text menggunakan font-sans yang di-override */}
        <div className="px-3 pb-3">
          <p className="font-sans text-sm leading-5">
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </Card>
    </button>
  );
}

function prettyName(k: string) {
  return k.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}
