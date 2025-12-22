'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { ArticleCard } from '@workspace/ui/components/article-card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  authorName: string;
  publishedAt: string;
  tags: string[];
}

interface BlogApiResponse {
  data: BlogPost[];
  pagination: {
    hasMore: boolean;
    page: number;
    perPage: number;
    total: number;
  };
}

async function fetchBlogs(page = 1, limit = 10): Promise<BlogApiResponse> {
  const response = await fetch(`/api/blogs?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }

  return response.json();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function Blog() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => fetchBlogs(),
  });

  const blogs = data?.data ?? [];

  // Hide section if no data and not loading
  if (!isLoading && (error || blogs.length === 0)) {
    return null;
  }

  return (
    <Section id="blog" className="py-20">
      <motion.div {...fadeUp} className="mb-12 text-center">
        <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
          {s.blog.title}
        </h2>
        <p className="text-muted-foreground mt-3 text-lg md:text-xl">{s.blog.subtitle}</p>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : (
          blogs.map((blog) => (
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
          ))
        )}
      </motion.div>
    </Section>
  );
}
