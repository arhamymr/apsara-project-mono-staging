'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { StatusBanner } from '@/components/ui/status-banner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      router.push('/dashboard');
    } catch {
      toast.error('Unable to sign in. Please check your credentials.');
      reset({ ...data, password: '' });
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <StatusBanner message="This page under development" />
      {/* Left: Background media */}
      <div
        className="bg-background relative m-4 hidden overflow-hidden rounded-lg md:block"
        style={{
          backgroundImage: `url(/hero-bg.png)`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {/* Overlay + branding (optional) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/20 to-transparent" />
        <div className="absolute right-8 bottom-8 left-8 text-white">
          <img
            src="https://assets.apsaradigital.com/logo.png"
            alt="logo"
            className="mb-4 block w-[130px] dark:hidden"
          />
          <img
            src="https://assets.apsaradigital.com/logo-white.png"
            alt="logo"
            className="mb-4 hidden w-[130px] dark:block"
          />
          <p className="text-md mt-2 max-w-md opacity-90">
            Build, automate, and manage your workspace—beautifully.
          </p>
        </div>
      </div>

      {/* Right: Auth card */}
      <div className="flex items-center justify-center px-4 py-8 md:py-0">
        <div className="bg-muted/10 w-full max-w-md rounded-xl border p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-muted-oreground mt-1 text-sm">
              Sign in to manage your workspace.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', { required: 'Password is required' })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="text-muted-foreground flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="border-muted-foreground/30 h-4 w-4 rounded"
                  {...register('remember')}
                />
                Remember me
              </label>

              <Link
                href="/register"
                className="text-primary text-sm font-medium hover:underline"
              >
                Need an account?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>

            <Button variant="ghost" className="w-full" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </form>

          <Toaster />
        </div>
      </div>
    </div>
  );
}
