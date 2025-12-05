'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Kbd } from '@workspace/ui/components/kbd';
import { Sheet, SheetContent, SheetTrigger } from '@workspace/ui/components/sheet';
import { AuthButtons } from './AuthButtons';
import { WHATSAPP_URL } from './constants';
import type { NavItem } from './types';

type MobileNavProps = {
  items: NavItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  ctaLabel: string;
  signInLabel: string;
};

export function MobileNav({ items, open, setOpen, ctaLabel, signInLabel }: MobileNavProps) {
  const closeMenu = useCallback(() => setOpen(false), [setOpen]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="hover:bg-accent inline-flex items-center justify-center rounded-md p-2 md:hidden">
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </SheetTrigger>
      <SheetContent side="top" className="p-0">
        <div className="px-4 py-6">
          <nav className="flex flex-col space-y-3">
            {items.map((item, index) =>
              item.children ? (
                <div key={index} className="flex flex-col space-y-2">
                  <div className="text-foreground px-2 py-2 text-base font-medium">{item.label}</div>
                  <div className="ml-2 flex flex-col space-y-2 border-l pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={closeMenu}
                        className="text-muted-foreground hover:text-foreground px-2 py-1 text-sm"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={closeMenu}
                  className="text-foreground hover:bg-accent/50 rounded px-2 py-2 text-base"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
          <div className="mt-5 flex gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
              <Button className="w-full">
                {ctaLabel} <Kbd>T</Kbd>
              </Button>
            </a>
            <AuthButtons signInLabel={signInLabel} isMobile onClose={closeMenu} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
