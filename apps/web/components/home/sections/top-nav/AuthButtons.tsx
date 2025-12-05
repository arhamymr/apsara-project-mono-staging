'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, User } from 'lucide-react';
import { Authenticated, Unauthenticated, AuthLoading, useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { Kbd } from '@workspace/ui/components/kbd';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';

type AuthButtonsProps = {
  signInLabel: string;
  isMobile?: boolean;
  onClose?: () => void;
};

export function AuthButtons({ signInLabel, isMobile = false, onClose }: AuthButtonsProps) {
  const buttonClass = isMobile ? 'w-full' : 'hidden md:inline-flex';
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.user.profile);

  // Keyboard shortcut: G to go to login/dashboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea or if modifier keys are pressed
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      if (e.key.toLowerCase() === 'g') {
        e.preventDefault();
        onClose?.();
        if (isLoading) return;
        router.push(isAuthenticated ? '/dashboard' : '/login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, isAuthenticated, isLoading, onClose]);

  return (
    <>
      <AuthLoading>
        <Button className={buttonClass} disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </AuthLoading>
      <Unauthenticated>
        <Link href="/login" onClick={onClose}>
          <Button className={buttonClass}>
            {signInLabel} <Kbd className="bg-black/20 text-primary-900">G</Kbd>
          </Button>
        </Link>
      </Unauthenticated>
      <Authenticated>
        <Link href="/dashboard" onClick={onClose}>
          <Button variant="outline" className={buttonClass}>
            <Avatar className="h-5 w-5">
              <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? 'User'} />
              <AvatarFallback className="text-xs">
                {user?.name?.charAt(0)?.toUpperCase() ?? <User className="h-3 w-3" />}
              </AvatarFallback>
            </Avatar>
            Dashboard <Kbd className="bg-black/20 text-primary-900">G</Kbd>
          </Button>
        </Link>
      </Authenticated>
    </>
  );
}
