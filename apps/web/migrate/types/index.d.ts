/* eslint-disable @typescript-eslint/no-explicit-any */
import { LucideIcon } from 'lucide-react';
import { IconName } from 'lucide-react/dynamic';
import React, { ReactElement } from 'react';
import type { Config } from 'ziggy-js';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string | React.ReactNode;
  href: string;
}

export interface ActionButtonItem {
  variant?:
    | 'default'
    | 'link'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost';
  type?: 'submit' | 'button' | 'custom';
  label?: string;
  onClick?: any;
  icon?: IconName;
  render?: ReactElement;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: string;
  icon?: LucideIcon | null;
  isActive?: boolean;
  badge?: string;
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  ziggy: Config & { location: string };
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // This allows for additional properties...
}

// articles

export interface ArticlesItem {
  id: number;
  title: string;
  category_id: number;
  slug: string;
  excerpt: string;
  description: string;
  author_id: number;
  status: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  category: ICategories;
  author: IAuthor;
  attachments: any;
}

interface ICategories {
  id: number;
  name: string;
  slug: string;
}
