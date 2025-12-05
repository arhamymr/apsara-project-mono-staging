// NodeEditor options and constants

export const CONTAINER_NODE_TYPES = new Set<string>([
  'section',
  'view',
  'container',
  'article',
  'vstack',
  'hstack',
  'stack',
]);

export type SurfaceToggle = {
  id: string;
  label: string;
  tokens: string[];
  previewClass: string;
};

export type SpacingOption = {
  id: string;
  label: string;
  tokens: string[];
  previewPadding: number;
};

export type BackgroundOption = {
  id: string;
  label: string;
  tokens: string[];
  previewClass: string;
};

export type GapOption = {
  id: string;
  label: string;
  tokens: string[];
  previewGap: number;
};

export type WidthOption = {
  id: string;
  label: string;
  tokens: string[];
  previewWidth: number;
};

export const SURFACE_TOGGLES: SurfaceToggle[] = [
  {
    id: 'rounded',
    label: 'Rounded corners',
    tokens: ['rounded-xl'],
    previewClass: 'rounded-xl border border-border',
  },
  {
    id: 'bordered',
    label: 'Border',
    tokens: ['border', 'border-border'],
    previewClass: 'rounded-sm border-2 border-border',
  },
  {
    id: 'shadow',
    label: 'Card shadow',
    tokens: ['shadow-sm'],
    previewClass: 'rounded-sm border border-border shadow-sm',
  },
];

export const SPACING_TOKEN_POOL: string[] = [
  'p-3',
  'p-4',
  'p-6',
  'p-8',
  '@md:p-6',
  '@md:p-8',
  '@md:p-10',
  'py-8',
  'py-12',
  'py-16',
  'py-20',
  '@md:py-16',
  '@md:py-20',
  'px-4',
  'px-6',
  'px-8',
  '@md:px-6',
  '@md:px-8',
  '@lg:px-12',
];

export const SPACING_OPTIONS: SpacingOption[] = [
  { id: 'none', label: 'No padding', tokens: [], previewPadding: 0 },
  {
    id: 'compact',
    label: 'Compact',
    tokens: ['p-4', '@md:p-6'],
    previewPadding: 2,
  },
  {
    id: 'comfortable',
    label: 'Comfortable',
    tokens: ['p-6', '@md:p-8'],
    previewPadding: 3,
  },
  {
    id: 'section',
    label: 'Section space',
    tokens: ['py-16', '@md:py-20', 'px-4', '@md:px-8'],
    previewPadding: 4,
  },
];

export const GAP_TOKEN_POOL: string[] = [
  'gap-2',
  'gap-3',
  'gap-4',
  'gap-6',
  'gap-8',
  'gap-10',
  'gap-12',
  '@md:gap-4',
  '@md:gap-6',
  '@md:gap-8',
  '@lg:gap-12',
];

export const GAP_OPTIONS: GapOption[] = [
  { id: 'auto', label: 'Auto gap', tokens: [], previewGap: 0 },
  {
    id: 'cozy',
    label: 'Cozy gap',
    tokens: ['gap-4', '@md:gap-6'],
    previewGap: 2,
  },
  {
    id: 'spacious',
    label: 'Spacious',
    tokens: ['gap-6', '@md:gap-8'],
    previewGap: 3,
  },
];

export const WIDTH_TOKEN_POOL: string[] = [
  'container',
  'mx-auto',
  'max-w-3xl',
  'max-w-4xl',
  'max-w-5xl',
  'max-w-6xl',
  'max-w-7xl',
];

export const WIDTH_OPTIONS: WidthOption[] = [
  {
    id: 'full',
    label: 'Full width',
    tokens: [],
    previewWidth: 100,
  },
  {
    id: 'content',
    label: 'Content (max-w-5xl)',
    tokens: ['container', 'mx-auto', 'max-w-5xl'],
    previewWidth: 70,
  },
  {
    id: 'content-narrow',
    label: 'Content (max-w-4xl)',
    tokens: ['container', 'mx-auto', 'max-w-4xl'],
    previewWidth: 55,
  },
  {
    id: 'content-wide',
    label: 'Content (max-w-6xl)',
    tokens: ['container', 'mx-auto', 'max-w-6xl'],
    previewWidth: 85,
  },
];

export const BACKGROUND_TOKEN_POOL: string[] = [
  'bg-transparent',
  'bg-background',
  'bg-muted',
  'bg-muted/10',
  'bg-muted/20',
  'bg-card',
  'bg-primary/5',
  'bg-primary/10',
  'bg-primary',
  'bg-secondary',
  'bg-secondary/10',
  'bg-foreground',
  'bg-foreground/5',
  'bg-accent',
  'bg-accent/10',
  'text-primary-foreground',
  'text-background',
];

export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  {
    id: 'transparent',
    label: 'Transparent',
    tokens: [],
    previewClass: 'bg-transparent border border-dashed border-border',
  },
  {
    id: 'base',
    label: 'Base surface',
    tokens: ['bg-background'],
    previewClass: 'bg-background border border-border',
  },
  {
    id: 'muted',
    label: 'Muted',
    tokens: ['bg-muted'],
    previewClass: 'bg-muted',
  },
  {
    id: 'muted-soft',
    label: 'Muted soft',
    tokens: ['bg-muted/20'],
    previewClass: 'bg-muted/20 border border-border',
  },
  {
    id: 'card',
    label: 'Card',
    tokens: ['bg-card'],
    previewClass: 'bg-card border border-border',
  },
  {
    id: 'primary-soft',
    label: 'Primary soft',
    tokens: ['bg-primary/10'],
    previewClass: 'bg-primary/10 border border-primary/30',
  },
  {
    id: 'primary',
    label: 'Primary solid',
    tokens: ['bg-primary', 'text-primary-foreground'],
    previewClass: 'bg-primary',
  },
  {
    id: 'inverse',
    label: 'Inverse',
    tokens: ['bg-foreground', 'text-background'],
    previewClass: 'bg-foreground',
  },
];
