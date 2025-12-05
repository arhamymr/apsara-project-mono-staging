'use client';

import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { Button } from '@workspace/ui/components/button';
import { Kbd } from '@workspace/ui/components/kbd';

type AuthButtonsProps = {
  signInLabel: string;
  isMobile?: boolean;
  onClose?: () => void;
};

export function AuthButtons({ signInLabel, isMobile = false, onClose }: AuthButtonsProps) {
  const buttonClass = isMobile ? 'w-full' : 'hidden md:inline-flex';

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
        <Link href="/os" onClick={onClose}>
          <Button className={buttonClass}>
            Dashboard <Kbd className="bg-black/20 text-primary-900">G</Kbd>
          </Button>
        </Link>
      </Authenticated>
    </>
  );
}
