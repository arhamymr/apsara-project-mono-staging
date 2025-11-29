'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

export default function UnsubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const status = searchParams.get('status') || '';
  const [processing, setProcessing] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const response = await fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        router.push(`/email/unsubscribed?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
      <title>Unsubscribe</title>
      <div className="w-full max-w-md rounded-xl border p-6 shadow-sm">
        <h1 className="mb-2 text-xl font-semibold">Manage email preferences</h1>
        <p className="text-muted-foreground mb-4 text-sm">{email}</p>
        {status === 'unsubscribed' ? (
          <p className="text-sm">You are already unsubscribed.</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <p className="text-sm">
              Click below to unsubscribe from future emails.
            </p>
            <button
              type="submit"
              className="bg-destructive text-destructive-foreground inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
              disabled={processing}
            >
              Unsubscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
