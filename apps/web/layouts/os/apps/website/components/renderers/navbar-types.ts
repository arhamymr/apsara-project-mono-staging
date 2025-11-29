export type NavbarType = 'default' | 'justified' | 'center-brand' | 'stacked';

export type NavbarAlignment = 'left' | 'center' | 'right' | 'space-between';

export type NavbarAppearance = 'default' | 'muted' | 'transparent' | 'inverted';

export type NavbarSettings = {
  type?: NavbarType;
  menuAlignment?: NavbarAlignment;
  appearance?: NavbarAppearance;
};

export const DEFAULT_NAVBAR_SETTINGS: NavbarSettings = {
  type: 'default',
  menuAlignment: 'center',
  appearance: 'default',
};

export const BRAND_FALLBACK_CLASS =
  'text-lg font-semibold tracking-tight text-foreground';

export const NAVBAR_TYPE_OPTIONS: Array<{
  id: NavbarType;
  label: string;
  description: string;
}> = [
  {
    id: 'default',
    label: 'Default',
    description: 'Brand on the left, menu centered, actions on the right.',
  },
  {
    id: 'justified',
    label: 'Justified',
    description: 'Menu stretches across the available width.',
  },
  {
    id: 'center-brand',
    label: 'Center brand',
    description: 'Brand centered with navigation beneath it.',
  },
  {
    id: 'stacked',
    label: 'Stacked',
    description: 'Brand, navigation, and actions stacked vertically.',
  },
];

export const NAVBAR_ALIGNMENT_OPTIONS: Array<{
  id: NavbarAlignment;
  label: string;
}> = [
  { id: 'left', label: 'Left' },
  { id: 'center', label: 'Center' },
  { id: 'right', label: 'Right' },
  { id: 'space-between', label: 'Space between' },
];

export const NAVBAR_APPEARANCE_OPTIONS: Array<{
  id: NavbarAppearance;
  label: string;
  description: string;
}> = [
  {
    id: 'default',
    label: 'Frosted',
    description: 'Subtle blur with a light border for sticky headers.',
  },
  {
    id: 'muted',
    label: 'Muted surface',
    description: 'Solid muted background with soft contrast.',
  },
  {
    id: 'transparent',
    label: 'Transparent',
    description: 'No background — ideal for hero overlays.',
  },
  {
    id: 'inverted',
    label: 'Inverted',
    description: 'High-contrast dark background with light text.',
  },
];
