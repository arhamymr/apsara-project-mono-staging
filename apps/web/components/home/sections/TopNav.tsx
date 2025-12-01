'use client';

import LanguageSelector from '@/components/LanguageSelector';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Kbd } from '@workspace/ui/components/kbd';
import { Sheet, SheetContent, SheetTrigger } from '@workspace/ui/components/sheet';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { ThemeToggle } from '@/layouts/dark-mode/theme-toggle';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Bot,
  ChevronDown,
  Globe,
  Image,
  LayoutDashboard,
  Menu,
  ShoppingBag,
  Wrench,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export function TopNav() {
  const s = useStrings();
  const [open, setOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // T - Open WhatsApp
      if (e.key === 't' || e.key === 'T') {
        window.open('https://wa.me/6289669594959', '_blank');
      }

      // G - Go to Login
      if (e.key === 'g' || e.key === 'G') {
        window.location.href = '/login';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    {
      label: s.topNav.links.services,
      children: [
        {
          href: '/services/create-website',
          label: s.topNav.links.createWebsite,
          description: s.topNav.links.descriptions.createWebsite,
          icon: Globe,
        },
        {
          href: '/services/fix-website',
          label: s.topNav.links.fixWebsite,
          description: s.topNav.links.descriptions.fixWebsite,
          icon: Wrench,
        },
        {
          href: '/services/integrasi-ai',
          label: s.topNav.links.aiIntegration,
          description: s.topNav.links.descriptions.aiIntegration,
          icon: Bot,
        },
        {
          href: '/services/instagram-post',
          label: s.topNav.links.instagramPost,
          description: s.topNav.links.descriptions.instagramPost,
          icon: Image,
        },
      ],
    },
    {
      label: s.topNav.links.products,
      children: [
        {
          href: '/#unified-platform',
          label: s.topNav.links.unifiedPlatform,
          description: s.topNav.links.descriptions.unifiedPlatform,
          icon: LayoutDashboard,
        },
        {
          href: '/products/digital',
          label: s.topNav.links.digitalProducts,
          description: s.topNav.links.descriptions.digitalProducts,
          icon: ShoppingBag,
        },
      ],
    },
    { href: '/blog', label: s.topNav.links.blog },
    { href: '/me', label: s.topNav.links.pricing },
  ];

  return (
    <div
      className={cn(
        'fixed top-0 right-0 left-0 z-50 w-full border-b px-4 backdrop-blur-xl transition-all duration-300 md:px-6',
      )}
    >
      <div
        className={cn(
          'mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between transition-all duration-300',
        )}
      >
        <div className="flex items-center gap-3">
          <Link href="/">
            <img
              src="https://assets.apsaradigital.com/logo.png"
              alt="logo"
              className="block w-[120px] dark:hidden"
            />
            <img
              src="https://assets.apsaradigital.com/logo-white.png"
              alt="logo"
              className="hidden w-[120px] dark:block"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item, index) =>
              item.children ? (
                <DropdownMenu key={index} modal={false}>
                  <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors outline-none">
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[320px] p-2">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link
                          href={child.href}
                          className="hover:bg-accent flex w-full cursor-pointer items-start gap-3 rounded-md p-3"
                        >
                          {child.icon && (
                            <div className="bg-primary/10 text-primary mt-1 rounded-md p-2">
                              <child.icon className="h-5 w-5" />
                            </div>
                          )}
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="text-muted-foreground text-xs leading-snug">
                                {child.description}
                              </span>
                            )}
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
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
              ),
            )}
          </nav>

          <div className={`ml-4 flex gap-3`}>
            <a
              href="https://wa.me/6289669594959"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="hidden md:inline-flex">
                {s.topNav.cta} <Kbd>T</Kbd>
              </Button>
            </a>
            <Link href="/login">
              <Button className="hidden md:inline-flex">
                {s.topNav.signIn}{' '}
                <Kbd className="text-primary-900 bg-black/20">G</Kbd>
              </Button>
            </Link>
          </div>

          {/* Burger button + mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="hover:bg-accent inline-flex items-center justify-center rounded-md p-2 md:hidden">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </SheetTrigger>
            <SheetContent side="top" className="p-0">
              <div className="px-4 py-6">
                <nav className="flex flex-col space-y-3">
                  {navItems.map((item, index) =>
                    item.children ? (
                      <div key={index} className="flex flex-col space-y-2">
                        <div className="text-foreground px-2 py-2 text-base font-medium">
                          {item.label}
                        </div>
                        <div className="ml-2 flex flex-col space-y-2 border-l pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpen(false)}
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
                        onClick={() => setOpen(false)}
                        className="text-foreground hover:bg-accent/50 rounded px-2 py-2 text-base"
                      >
                        {item.label}
                      </Link>
                    ),
                  )}
                </nav>
                <div className="mt-5 flex gap-3">
                  <a
                    href="https://wa.me/6289669594959"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                  >
                    <Button className="w-full">
                      {s.topNav.cta} <Kbd>T</Kbd>
                    </Button>
                  </a>

                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button className="w-full">
                      {s.topNav.signIn} <Kbd>G</Kbd>
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <LanguageSelector ariaLabel="Language selector" />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
