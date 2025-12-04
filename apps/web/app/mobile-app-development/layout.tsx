import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile App Development | Apsara',
  description: 'Cross-platform mobile app development with React Native. Build beautiful, performant apps for iOS and Android.',
};

export default function MobileAppDevelopmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
