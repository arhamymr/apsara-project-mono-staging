import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights, tutorials, and updates on AI automation, web development, and digital solutions.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
