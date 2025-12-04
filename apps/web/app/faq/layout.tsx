import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Apsara',
  description: 'Frequently asked questions about Apsara and our services.',
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
