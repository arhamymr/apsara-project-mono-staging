'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { ArticleCard } from '@workspace/ui/components/article-card';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs()
      .then((response) => {
        setBlogs(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : error ? (
          <div className="col-span-full text-center text-muted-foreground">
            Failed to load blogs. Please try again later.
          </div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground">
            No blog posts available yet.
          </div>
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
