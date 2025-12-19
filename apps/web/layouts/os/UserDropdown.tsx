'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useRouter } from 'next/navigation';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { useAuthActions } from '@convex-dev/auth/react';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function UserDropdown() {
  const user = useQuery(api.user.profile);
  const { signOut } = useAuthActions();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
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
          <UserInfo user={user ? { name: user.name, email: user.email, image: user.image } : null} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[99999999] w-52">
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-sm font-medium"
          onSelect={(e) => {
            e.preventDefault();
            openSettings('desktop-settings');
          }}
        >
          <SettingsIcon className="h-4 w-4" />
          Change Wallpaper
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
