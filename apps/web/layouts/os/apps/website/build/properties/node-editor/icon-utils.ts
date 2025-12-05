import type { IconNode } from 'lucide-react';
import {
  Circle as CircleIcon,
  createLucideIcon,
  icons as lucideIcons,
} from 'lucide-react';
import * as React from 'react';

export type IconProps = React.SVGProps<SVGSVGElement>;

export type IconComponent = React.ComponentType<IconProps>;

export function isPascalCase(name: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

/**
 * Resolve a Lucide icon component by name using the package's icons map.
 * Falls back to Circle when the name is missing or not found.
 */
export function getLucideIconComponent(name?: string): IconComponent {
  const safeName =
    typeof name === 'string' && name.trim().length ? name.trim() : 'Circle';
  const node = (lucideIcons as unknown as Record<string, IconNode>)[safeName];
  if (node) {
    // createLucideIcon returns a React component for the given IconNode
    return createLucideIcon(safeName, node) as IconComponent;
  }
  return CircleIcon as IconComponent;
}

/**
 * Enumerate available Lucide icon names (PascalCase) from the icons map.
 * Sorted alphabetically for predictable display in pickers.
 */
export function getLucideIconNames(): string[] {
  const names = Object.keys(lucideIcons as Record<string, unknown>).filter(
    (key) => isPascalCase(key),
  );
  names.sort((a, b) => a.localeCompare(b));
  return names;
}

/**
 * Ensure an icon name resolves to a valid display value.
 * Returns 'Circle' when the input is empty or invalid.
 */
export function ensureIconName(name?: string): string {
  const safe = typeof name === 'string' ? name.trim() : '';
  return safe.length ? safe : 'Circle';
}
