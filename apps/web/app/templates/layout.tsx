import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Templates | Apsara',
  description: 'Browse our collection of professionally designed templates for websites, landing pages, and more.',
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
