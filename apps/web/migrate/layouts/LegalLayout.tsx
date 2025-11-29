import { Footer } from '@/components/home/sections/Footer';
import { TopNav } from '@/components/home/sections/TopNav';
import { TableOfContents } from '@/components/legal/TableOfContents';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  lastUpdated?: string;
  showTableOfContents?: boolean;
}

export function LegalLayout({
  children,
  title,
  lastUpdated,
  showTableOfContents = false,
}: LegalLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      <TopNav />

      <main
        className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16"
        role="main"
        aria-label="Legal document content"
      >
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary focus:ring-primary inline-flex items-center rounded-sm text-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-label="Navigate back to home page"
          >
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Home
          </Link>
        </nav>

        <header className="mb-8 sm:mb-12">
          <h1 className="mb-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {lastUpdated && (
            <p className="text-muted-foreground text-sm sm:text-base">
              Last updated:{' '}
              <time dateTime={lastUpdated}>
                {new Date(lastUpdated).toLocaleDateString()}
              </time>
            </p>
          )}
        </header>

        <div
          className={cn(
            'grid gap-8 lg:gap-12',
            showTableOfContents &&
              'lg:grid-cols-[1fr_250px] xl:grid-cols-[1fr_280px]',
          )}
        >
          <article
            className="prose prose-slate dark:prose-invert prose-sm sm:prose-base lg:prose-lg prose-headings:scroll-mt-20 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:transition-all prose-a:focus:outline-none prose-a:focus:ring-2 prose-a:focus:ring-primary prose-a:focus:ring-offset-2 prose-a:rounded-sm max-w-none"
            role="article"
          >
            {children}
          </article>

          {showTableOfContents && (
            <aside
              className="hidden lg:block"
              role="complementary"
              aria-label="Table of contents"
            >
              <TableOfContents />
            </aside>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
