'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginFormProps {
  redirectTo?: string;
}

export function LoginForm({ redirectTo = '/dashboard' }: LoginFormProps) {
  const { signIn } = useAuthActions();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const formData = new FormData();
      formData.set('email', data.email);
      formData.set('password', data.password);
      formData.set('flow', 'signIn');
      formData.set('redirectTo', redirectTo);

      await signIn('password', formData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      if (errorMessage.includes('Invalid credentials') || errorMessage.includes('password')) {
        setError('password', { message: 'Invalid email or password' });
      } else {
        toast.error('Unable to sign in. Please check your credentials.');
      }
      reset({ ...data, password: '' });
    }
  };


  return (
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
          <p className="text-destructive text-sm">{errors.password.message}</p>
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
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
