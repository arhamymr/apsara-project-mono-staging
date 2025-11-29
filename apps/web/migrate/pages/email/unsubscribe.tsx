import { Head, useForm } from '@inertiajs/react';
import React from 'react';

type Props = { email: string; status: string };

export default function Unsubscribe({ email, status }: Props) {
  const { post, processing } = useForm({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(window.location.pathname);
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
      <Head title="Unsubscribe" />
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
