import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Apsara',
    default: 'Authentication',
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
