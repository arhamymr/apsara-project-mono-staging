import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instagram Post Design | Apsara',
  description: 'Professional Instagram post design services. Eye-catching social media graphics that boost engagement.',
};

export default function InstagramPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
