import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePage } from '@inertiajs/react';

export function UserInfo() {
  const { props } = usePage<{
    auth: { user: { id: number; name: string; email: string } | null };
  }>();
  const user = props.auth?.user;
  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'U';
  const displayName = user?.name ?? user?.email ?? 'User';

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-7 w-7 overflow-hidden rounded-md">
        <AvatarFallback className="rounded-lg bg-neutral-200 text-sm text-black dark:bg-neutral-700 dark:text-white">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate text-xs">{displayName}</span>
        <span className="text-muted-foreground truncate text-xs">
          {user?.email}
        </span>
      </div>
    </div>
  );
}
