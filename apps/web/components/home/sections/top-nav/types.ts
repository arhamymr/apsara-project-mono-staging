import type { LucideIcon } from 'lucide-react';

export type NavChild = {
  href: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

export type NavItem = {
  href?: string;
  label: string;
  children?: NavChild[];
};
