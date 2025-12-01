'use client';

import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

type UserMenuProps = {
  minimal?: boolean;
  user?: User | null;
};

export function UserMenu({ minimal = false, user }: UserMenuProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'U';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {minimal ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="rounded-full text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="flex items-center gap-3 rounded-full border px-3 py-1.5"
          >
            <UserInfo user={user} />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[99999999] w-52">
        <DropdownMenuItem className="pointer-events-none flex-col items-start">
          <p className="text-sm font-medium">
            {user?.name ?? user?.email ?? 'User'}
          </p>
          <p className="text-muted-foreground text-xs">{user?.email}</p>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive flex cursor-pointer items-center gap-2 text-sm font-medium"
          onSelect={(event) => {
            event.preventDefault();
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
