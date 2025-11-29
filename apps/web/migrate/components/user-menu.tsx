import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useForm, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

type UserMenuProps = {
  minimal?: boolean;
};

export function UserMenu({ minimal = false }: UserMenuProps) {
  const { props } = usePage<{
    auth: { user: { id: number; name: string; email: string } | null };
  }>();
  const logout = useForm({});

  const user = props.auth?.user;
  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'U';

  const handleLogout = () => {
    logout.post(route('logout'));
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
            <UserInfo />
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
          {logout.processing ? 'Signing out…' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
