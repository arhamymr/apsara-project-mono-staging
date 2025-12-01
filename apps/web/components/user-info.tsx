'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface UserInfoProps {
  user?: User | string | null;
}

export function UserInfo({ user }: UserInfoProps) {
  // Handle both string and object user props
  const userData = typeof user === 'string' 
    ? { name: user, email: null, image: null } 
    : user;

  const initials =
    userData?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'U';
  const displayName = userData?.name ?? userData?.email ?? 'User';

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-7 w-7 overflow-hidden rounded-md">
        {userData?.image && (
          <AvatarImage src={userData.image} alt={displayName} />
        )}
        <AvatarFallback className="rounded-lg bg-neutral-200 text-sm text-black dark:bg-neutral-700 dark:text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate text-xs">{displayName}</span>
        {userData?.email && (
          <span className="text-muted-foreground truncate text-xs">
            {userData.email}
          </span>
        )}
      </div>
    </div>
  );
}
