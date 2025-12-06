'use client';

import Image from 'next/image';
import LanguageSelector from '@/components/LanguageSelector';
import NotificationBell from '@/components/NotificationBell';
import { ThemeToggle } from '@/layouts/dark-mode/theme-toggle';
import ClockDisplay from '@/layouts/os/components/clock-display';
import UserDropdown from '@/layouts/os/UserDropdown';
import { useOSStrings } from '@/i18n/os';

interface NavbarProps {
  activeWindowTitle?: string;
}

function LangToggle() {
  const s = useOSStrings();
  return (
    <LanguageSelector
      ariaLabel={s.topbar.langLabel}
      wrapperClassName="flex items-center gap-1 rounded-md border px-1.5 py-1 text-xs"
    />
  );
}

function TitleLabel({ title }: { title: string | undefined }) {
  const s = useOSStrings();
  return (
    <p className="text-muted-foreground text-sm font-medium">
      {title || s.topbar.fallbackTitle}
    </p>
  );
}

export default function Navbar({ activeWindowTitle }: NavbarProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-[222] flex items-center justify-between border-b bg-black/20 p-2 text-xs text-white backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <Image
          src="https://assets.apsaradigital.com/logo.png"
          alt="logo"
          width={80}
          height={24}
          className="mr-1 ml-2 block dark:hidden"
        />
        <Image
          src="https://assets.apsaradigital.com/logo-white.png"
          alt="logo"
          width={80}
          height={24}
          className="mr-1 ml-2 hidden dark:block"
        />
        ✦
        <TitleLabel title={activeWindowTitle} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <LangToggle />
        <NotificationBell />
        <ClockDisplay simple />
        <ThemeToggle />
        <UserDropdown />
      </div>
    </div>
  );
}