'use client';

import { LegalLayout } from '@/layouts/LegalLayout';
import Link from 'next/link';
import { Cookie, FileText, Shield } from 'lucide-react';

interface LegalPage {
  title: string;
  description: string;
  href: string;
  icon: 'shield' | 'file-text' | 'cookie';
}

const iconMap = {
  shield: Shield,
  'file-text': FileText,
  cookie: Cookie,
};

// Static legal pages data
const legalPages: LegalPage[] = [
  {
    title: 'Privacy Policy',
    description: 'Learn how we collect, use, and protect your personal information.',
    href: '/legal/privacy',
    icon: 'shield',
  },
  {
    title: 'Terms of Service',
    description: 'Read our terms and conditions for using our services.',
    href: '/legal/terms',
    icon: 'file-text',
  },
  {
    title: 'Cookie Policy',
    description: 'Understand how we use cookies and similar technologies.',
    href: '/legal/cookies',
    icon: 'cookie',
  },
];

export default function LegalIndexPage() {
  return (
    <LegalLayout title="Legal Information">
      <div
        className="not-prose grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
        role="list"
        aria-label="Legal documents"
      >
        {legalPages.map((page) => {
          const IconComponent = iconMap[page.icon];

          return (
            <Link
              key={page.href}
              href={page.href}
              className="group border-border hover:border-primary focus:border-primary focus:ring-primary rounded-lg border p-4 transition-all hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:outline-none sm:p-6"
              role="listitem"
              aria-label={`View ${page.title}`}
            >
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <div
                  className="bg-primary/10 rounded-full p-2 sm:p-3"
                  aria-hidden="true"
                >
                  <IconComponent className="text-primary h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h2 className="group-hover:text-primary text-lg font-semibold transition-colors sm:text-xl">
                  {page.title}
                </h2>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">
                {page.description}
              </p>
            </Link>
          );
        })}
      </div>
    </LegalLayout>
  );
}
