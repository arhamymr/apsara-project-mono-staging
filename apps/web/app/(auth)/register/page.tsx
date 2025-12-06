"use client";

import {
  AuthBrandingPanel,
  AuthSeparator,
  GoogleSignInButton,
  RegisterForm,
} from "@/components/auth";
import { Button } from "@workspace/ui/components/button";
import { Toaster } from "@workspace/ui/components/sonner";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <AuthBrandingPanel tagline="Create your account and start building." />

      <div className="flex items-center justify-center px-4 py-8 md:py-0">
        <div className="bg-muted/10 w-full max-w-md rounded-xl border p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Create your account</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Start building with Apsara.
            </p>
          </div>
          <GoogleSignInButton />
          <AuthSeparator />
          <RegisterForm />

          <Button variant="ghost" className="mt-4 w-full" asChild>
            <Link href="/">Back to home</Link>
          </Button>

          <Toaster />
        </div>
      </div>
    </div>
  );
}
