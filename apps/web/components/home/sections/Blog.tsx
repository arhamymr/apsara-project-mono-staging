'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { ArticleCard } from '@workspace/ui/components/article-card';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  slug: string;
  image?: string;
}

export function Blog() {
  const s = useStrings();
  const fadeUp = useFadeUp();
  const articles = s.blog.articles as Article[];

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
        {articles.map((article, index) => (
          <ArticleCard
            key={index}
            title={article.title}
            excerpt={article.excerpt}
            category={article.category}
            date={article.date}
            author={article.author}
            slug={article.slug}
            image={article.image}
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
      </motion.div>
    </Section>
  );
}
