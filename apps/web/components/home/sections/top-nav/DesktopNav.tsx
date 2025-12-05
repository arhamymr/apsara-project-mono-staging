'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import type { NavItem, NavChild } from './types';

function NavDropdownItem({ child }: { child: NavChild }) {
  const Icon = child.icon;
  return (
    <DropdownMenuItem asChild>
      <Link
        href={child.href}
        className="hover:bg-accent group flex w-full cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors"
      >
        {Icon && (
          <div className="bg-primary/10 text-primary shrink-0 rounded-lg p-2.5">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{child.label}</span>
          {child.description && (
            <span className="text-muted-foreground line-clamp-2 text-xs leading-snug">
              {child.description}
            </span>
          )}
        </div>
      </Link>
    </DropdownMenuItem>
  );
}

export function DesktopNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="hidden items-center gap-6 md:flex">
      {items.map((item, index) =>
        item.children ? (
          <DropdownMenu key={index} modal={false}>
            <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm outline-none transition-colors">
              {item.label}
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-[580px] p-4">
              <div className="grid grid-cols-2 gap-2">
                {item.children.map((child) => (
                  <NavDropdownItem key={child.href} child={child} />
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link
            key={item.href}
            href={item.href!}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}
