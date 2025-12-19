'use client';

import { useMemo, useState } from 'react';
import { Bot, Code2, Image as ImageIcon, Server, Smartphone, Wrench } from 'lucide-react';

import LanguageSelector from '@/components/LanguageSelector';
import { Button } from '@workspace/ui/components/button';
import { Kbd } from '@workspace/ui/components/kbd';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { ThemeToggle } from '@/layouts/dark-mode/theme-toggle';
import { cn } from '@/lib/utils';

import { Logo } from './Logo';
import { AuthButtons } from './AuthButtons';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import { useKeyboardShortcuts } from './use-keyboard-shortcuts';
import { WHATSAPP_URL } from './constants';
import type { NavItem } from './types';

export function TopNav() {
  const s = useStrings();
  const [open, setOpen] = useState(false);

  useKeyboardShortcuts();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: s.topNav.links.services,
        children: [
          { href: '/full-stack-development', label: s.topNav.links.fullStackDevelopment, description: s.topNav.links.descriptions.fullStackDevelopment, icon: Code2 },
          { href: '/mobile-app-development', label: s.topNav.links.mobileAppDevelopment, description: s.topNav.links.descriptions.mobileAppDevelopment, icon: Smartphone },
          { href: '/api-development', label: s.topNav.links.apiDevelopment, description: s.topNav.links.descriptions.apiDevelopment, icon: Server },
          { href: '/fix-website', label: s.topNav.links.fixWebsite, description: s.topNav.links.descriptions.fixWebsite, icon: Wrench },
          { href: '/ai-integration', label: s.topNav.links.aiIntegration, description: s.topNav.links.descriptions.aiIntegration, icon: Bot },
          // { href: '/instagram-post', label: s.topNav.links.instagramPost, description: s.topNav.links.descriptions.instagramPost, icon: ImageIcon },
        ],
      },
      { href: '/templates', label: s.topNav.links.templates },
      { href: '/blog', label: s.topNav.links.blog },
      { href: '/faq', label: s.topNav.links.faq },
      { href: '/me', label: s.topNav.links.pricing },
    ],
    [s]
  );

  return (
    <header className={cn('fixed top-0 right-0 left-0 z-50 w-full border-b px-4 backdrop-blur-xl transition-all duration-300 md:px-6')}>
      <div className="mx-auto flex h-16 w-full items-center justify-between transition-all duration-300">
        <Logo />

        <div className="flex items-center gap-4">
          <DesktopNav items={navItems} />

          <div className="ml-4 flex gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="hidden md:inline-flex">
                {s.topNav.cta} <Kbd>T</Kbd>
              </Button>
            </a>
            <AuthButtons signInLabel={s.topNav.signIn} />
          </div>

          <MobileNav items={navItems} open={open} setOpen={setOpen} ctaLabel={s.topNav.cta} signInLabel={s.topNav.signIn} />
          <LanguageSelector ariaLabel="Language selector" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
