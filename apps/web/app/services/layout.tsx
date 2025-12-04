import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Apsara',
  description: 'Professional web development, mobile app development, API development, and design services.',
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
