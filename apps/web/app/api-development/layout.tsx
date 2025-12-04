import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Development | Apsara',
  description: 'Professional API development services. Build secure, scalable, and well-documented APIs for your applications.',
};

export default function ApiDevelopmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
