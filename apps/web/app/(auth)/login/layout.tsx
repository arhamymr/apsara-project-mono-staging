import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Apsara Digital',
  description: 'Sign in to your Apsara Digital account to access your workspace and manage your projects.',
  keywords: ['login', 'sign in', 'authentication', 'workspace', 'apsara digital'],
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Sign In | Apsara Digital',
    description: 'Access your Apsara Digital workspace',
    type: 'website',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}