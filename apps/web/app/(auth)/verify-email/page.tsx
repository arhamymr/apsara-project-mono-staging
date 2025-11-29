'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2, Mail, RefreshCw } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FormEventHandler, useState } from 'react';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const [processing, setProcessing] = useState(false);

  const handleResendVerification: FormEventHandler = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const response = await fetch('/api/auth/verification/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      // Redirect with status to show success message
      window.location.href = '/verify-email?status=verification-link-sent';
    } catch {
      // Handle error silently or show toast
    } finally {
      setProcessing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      window.location.href = '/';
    } catch {
      // Handle error silently
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-base">
            Thanks for signing up! Before getting started, could you verify
            your email address by clicking on the link we just emailed to you?
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'verification-link-sent' && (
            <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                A new verification link has been sent to your email address.
              </p>
            </div>
          )}

          <form onSubmit={handleResendVerification} className="space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={processing}
              variant="default"
            >
              {processing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 text-center">
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Log Out
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
