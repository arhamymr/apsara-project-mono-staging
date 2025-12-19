import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Apsara Digital',
  description: 'Create your Apsara Digital account to start building and managing your digital workspace.',
  keywords: ['register', 'sign up', 'create account', 'join', 'apsara digital'],
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Sign Up | Apsara Digital',
    description: 'Join Apsara Digital and start your journey',
    type: 'website',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}