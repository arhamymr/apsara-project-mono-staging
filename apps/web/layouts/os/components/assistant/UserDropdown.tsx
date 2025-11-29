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

type Props = {
  onOpenSettings: (appId?: string) => void;
};

export default function UserDropdown({ onOpenSettings }: Props) {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer gap-2">
          <UserInfo />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[99999999] w-52">
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-sm font-medium"
          onSelect={(e) => {
            e.preventDefault();
            onOpenSettings('settings-hub');
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
