'use client';

import { Background, SkipToContent } from '@/components/home/components';
import { Footer, TopNav } from '@/components/home/sections';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { ArticleCard } from '@workspace/ui/components/article-card';
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

export default function BlogIndex() {
  const s = useStrings();
  const articles = s.blog.articles as Article[];

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

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
