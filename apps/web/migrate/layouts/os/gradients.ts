export type GradientVariant = {
  id: string;
  name: string;
  baseLight: string; // tailwind classes for base light bg
  baseDark: string; // tailwind classes for base dark bg
  orbLight: [string, string, string]; // tailwind bg color classes for 3 orbs (light)
  orbDark: [string, string, string]; // tailwind bg color classes for 3 orbs (dark)
};

export const GRADIENT_VARIANTS: GradientVariant[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    baseLight:
      'bg-gradient-to-br from-slate-100 via-purple-100/20 to-slate-100',
    baseDark: 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900',
    orbLight: ['bg-purple-300/30', 'bg-blue-300/30', 'bg-pink-300/20'],
    orbDark: ['bg-purple-500/20', 'bg-blue-500/20', 'bg-pink-500/15'],
  },
  {
    id: 'sunset',
    name: 'Sunset',
    baseLight: 'bg-gradient-to-br from-rose-100 via-orange-100/30 to-amber-100',
    baseDark: 'bg-gradient-to-br from-rose-900 via-orange-900/20 to-amber-900',
    orbLight: ['bg-rose-300/30', 'bg-amber-300/30', 'bg-orange-300/25'],
    orbDark: ['bg-rose-500/25', 'bg-amber-500/25', 'bg-orange-500/20'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    baseLight: 'bg-gradient-to-br from-sky-100 via-cyan-100/30 to-teal-100',
    baseDark: 'bg-gradient-to-br from-sky-900 via-cyan-900/20 to-teal-900',
    orbLight: ['bg-sky-300/30', 'bg-cyan-300/30', 'bg-teal-300/25'],
    orbDark: ['bg-sky-500/25', 'bg-cyan-500/25', 'bg-teal-500/20'],
  },
  {
    id: 'forest',
    name: 'Forest',
    baseLight:
      'bg-gradient-to-br from-emerald-100 via-green-100/30 to-lime-100',
    baseDark: 'bg-gradient-to-br from-emerald-900 via-green-900/20 to-lime-900',
    orbLight: ['bg-emerald-300/30', 'bg-green-300/30', 'bg-lime-300/25'],
    orbDark: ['bg-emerald-500/25', 'bg-green-500/25', 'bg-lime-500/20'],
  },
  {
    id: 'midnight',
    name: 'Midnight',
    baseLight:
      'bg-gradient-to-br from-indigo-100 via-violet-100/30 to-slate-100',
    baseDark:
      'bg-gradient-to-br from-indigo-950 via-violet-900/20 to-slate-950',
    orbLight: ['bg-indigo-300/30', 'bg-violet-300/30', 'bg-slate-300/20'],
    orbDark: ['bg-indigo-600/25', 'bg-violet-600/25', 'bg-slate-600/20'],
  },
];

export function getGradientById(id?: string) {
  if (!id) return GRADIENT_VARIANTS[0];
  return GRADIENT_VARIANTS.find((v) => v.id === id) ?? GRADIENT_VARIANTS[0];
}
