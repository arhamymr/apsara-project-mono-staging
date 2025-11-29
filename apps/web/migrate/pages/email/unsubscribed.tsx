import { Head } from '@inertiajs/react';

type Props = { email: string };

export default function Unsubscribed({ email }: Props) {
  return (
    <div className="bg-background text-foreground flex min-h-screen items-center justify-center p-6">
      <Head title="Unsubscribed" />
      <div className="w-full max-w-md rounded-xl border p-6 text-center shadow-sm">
        <h1 className="mb-2 text-xl font-semibold">You're unsubscribed</h1>
        <p className="text-muted-foreground text-sm">{email}</p>
        <p className="mt-4 text-sm">You won't receive future emails from us.</p>
      </div>
    </div>
  );
}
