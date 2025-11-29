import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/sonner';
import { StatusBanner } from '@/components/ui/status-banner';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    form.post(route('login'), {
      onFinish: () => form.reset('password'),
      onError: () => {
        toast.error('Unable to sign in. Please check your credentials.');
      },
    });
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <Head title="Sign In" />
      <StatusBanner message="This page under development" />
      {/* Left: Background media */}
      <div
        className="bg-background relative m-4 hidden overflow-hidden rounded-lg md:block"
        style={{
          backgroundImage: `url(hero-bg.png)`,
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

          <form className="space-y-5" onSubmit={submit}>
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
                  autoComplete="current-password"
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

            <div className="flex items-center justify-between">
              <label className="text-muted-foreground flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="border-muted-foreground/30 h-4 w-4 rounded"
                  checked={form.data.remember}
                  onChange={(e) => form.setData('remember', e.target.checked)}
                />
                Remember me
              </label>

              <Link
                href={route('register')}
                className="text-primary text-sm font-medium hover:underline"
              >
                Need an account?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={form.processing}>
              {form.processing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {form.processing ? 'Signing in…' : 'Sign in'}
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
