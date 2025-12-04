import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Full-Stack Development | Apsara',
  description: 'End-to-end full-stack development services. From frontend to backend, we build complete web applications.',
};

export default function FullStackDevelopmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
