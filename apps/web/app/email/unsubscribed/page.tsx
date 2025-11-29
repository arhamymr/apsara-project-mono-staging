'use client';

import { useSearchParams } from 'next/navigation';

export default function UnsubscribedPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
      <title>Unsubscribed</title>
      <div className="w-full max-w-md rounded-xl border p-6 text-center shadow-sm">
        <h1 className="mb-2 text-xl font-semibold">You're unsubscribed</h1>
        <p className="text-muted-foreground text-sm">{email}</p>
        <p className="mt-4 text-sm">You won't receive future emails from us.</p>
      </div>
    </div>
  );
}
