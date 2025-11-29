import { ReactNode } from 'react';

export const metadata = {
  title: 'Legal - Vibe',
  description: 'Legal information, privacy policy, terms of service, and cookie policy',
};

interface LegalLayoutProps {
  children: ReactNode;
}

export default function LegalRouteLayout({ children }: LegalLayoutProps) {
  return <>{children}</>;
}
