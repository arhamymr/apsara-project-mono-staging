'use client';

import MacOSLayout from '@/layouts/os';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The MacOSLayout provides the full OS desktop experience
  // Children are not rendered directly as the OS layout manages its own window system
  return <MacOSLayout />;
}
