'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Authenticated, Unauthenticated, AuthLoading, useConvexAuth } from 'convex/react';
import { Button } from '@workspace/ui/components/button';
import { Kbd } from '@workspace/ui/components/kbd';

type AuthButtonsProps = {
  signInLabel: string;
  isMobile?: boolean;
  onClose?: () => void;
};

export function AuthButtons({ signInLabel, isMobile = false, onClose }: AuthButtonsProps) {
  const buttonClass = isMobile ? 'w-full' : 'hidden md:inline-flex';
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

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
          <Button className={buttonClass}>
            Dashboard <Kbd className="bg-black/20 text-primary-900">G</Kbd>
          </Button>
        </Link>
      </Authenticated>
    </>
  );
}
