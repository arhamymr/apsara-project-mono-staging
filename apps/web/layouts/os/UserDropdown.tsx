'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useRouter } from 'next/navigation';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { useCallback } from 'react';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function UserDropdown() {

  const user = useQuery(api.auth.currentUser);

  console.log(user, "use")
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/logout', { method: 'POST' });
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

   const { apps, openApp } = useWindowContext();

  const openSettings = useCallback(
    (appId?: string) => {
      const settings = appId
        ? apps.find((a) => a.id === appId)
        : apps.find((a) => a.id === 'settings-hub') ||
          apps.find((a) => a.id === 'desktop-settings') ||
          apps.find((a) => /settings/i.test(a.name));
      if (settings) openApp(settings);
    },
    [apps, openApp],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer gap-2">
          <UserInfo user={user?.name || ""} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[99999999] w-52">
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-sm font-medium"
          onSelect={(e) => {
            e.preventDefault();
            openSettings('settings-hub');
          }}
        >
          <SettingsIcon className="h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive flex cursor-pointer items-center gap-2 text-sm font-medium"
          onSelect={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? 'Signing out…' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
