import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.post(route('register'), {
      onSuccess: () => {
        toast.success('Account created successfully');
      },
      onError: () => {
        toast.error('Unable to create account. Please review the form.');
      },
    });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <Head title="Create Account" />

      {/* Left: Full-bleed image (hidden on mobile) */}
      <div className="relative hidden md:block">
        <img
          src="hero-bg.png"
          alt="Workspace"
          className="absolute inset-0 h-full w-full object-cover"
        />
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
          <p className="mt-2 max-w-md text-sm opacity-90">
            Create your account and start building.
          </p>
        </div>
      </div>

      {/* Right: Signup card */}
      <div className="bg-muted/30 flex items-center justify-center px-4 py-8 md:py-0">
        <div className="bg-background w-full max-w-md rounded-xl border p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Start building with Apsara.
            </p>
          </div>

          <form className="space-y-5" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
                required
              />
              {form.errors.name && (
                <p className="text-destructive text-sm">{form.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={form.data.email}
                onChange={(e) => form.setData('email', e.target.value)}
                required
              />
              {form.errors.email && (
                <p className="text-destructive text-sm">{form.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.data.password}
                  onChange={(e) => form.setData('password', e.target.value)}
                  required
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
              {form.errors.password && (
                <p className="text-destructive text-sm">
                  {form.errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.data.password_confirmation}
                  onChange={(e) =>
                    form.setData('password_confirmation', e.target.value)
                  }
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {form.errors.password_confirmation && (
                <p className="text-destructive text-sm">
                  {form.errors.password_confirmation}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={form.processing}>
              {form.processing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {form.processing ? 'Creating account…' : 'Create account'}
            </Button>
          </form>

          <Toaster />

          <p className="text-muted-foreground mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link
              href={route('login')}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
