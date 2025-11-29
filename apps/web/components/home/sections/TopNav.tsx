'use client';

import Link from 'next/link';

// Stub component - will be replaced during Phase 5 Component Migration
export function TopNav() {
  return (
    <nav className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <Link href="/" className="font-semibold">
          Home
        </Link>
      </div>
    </nav>
  );
}
