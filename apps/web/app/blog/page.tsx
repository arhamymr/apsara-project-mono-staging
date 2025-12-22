'use client';

import { Background, SkipToContent } from '@/components/home/components';
import { Footer, TopNav } from '@/components/home/sections';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { useBlogs } from '@/hooks/useBlog';
import { ArticleCard } from '@workspace/ui/components/article-card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Button } from '@workspace/ui/components/button';
import { ArrowRight, Calendar, User, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogIndex() {
  const s = useStrings();
  const { data, isLoading, error } = useBlogs(1, 10);

  const blogs = data?.data ?? [];

  return (
    <div className="bg-background text-foreground relative min-h-dvh">
      <SkipToContent />
      <Background />
      <TopNav />

      <main id="main-content" className="pt-32 pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-normal tracking-tight sm:text-5xl md:text-6xl">
              {s.blog.title}
            </h1>
            <p className="text-muted-foreground mt-4 text-xl">
              {s.blog.subtitle}
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
              <div className="bg-muted/50 rounded-full p-6 mb-6">
                <FileText className="text-muted-foreground/60 h-16 w-16" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Unable to Load Blogs</h2>
              <p className="text-muted-foreground mb-6 max-w-sm text-center">
                We encountered an error while loading the blog posts. Please try again later.
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : blogs.length === 0 ? (
            <div className="flex h-96 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
              <div className="bg-muted/50 rounded-full p-6 mb-6">
                <FileText className="text-muted-foreground/60 h-16 w-16" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Blog Posts Yet</h2>
              <p className="text-muted-foreground mb-6 max-w-sm text-center">
                Check back soon for insightful articles, tutorials, and updates.
              </p>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <ArticleCard
                  key={blog.id}
                  title={blog.title}
                  excerpt={blog.excerpt}
                  category={blog.tags[0] || 'General'}
                  date={formatDate(blog.publishedAt)}
                  author={blog.authorName}
                  slug={blog.slug}
                  image={blog.coverImage}
                  readMoreLabel={s.blog.readMore}
                  dateIcon={<Calendar className="mr-1 h-3 w-3" />}
                  authorIcon={<User className="mr-1 h-3 w-3" />}
                  arrowIcon={<ArrowRight className="ml-1 h-3 w-3" />}
                  renderLink={({ href, children, className }) => (
                    <Link href={href} className={className}>{children}</Link>
                  )}
                  renderImage={({ src, alt, className }) => (
                    <Image src={src} alt={alt} fill className={className} />
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
