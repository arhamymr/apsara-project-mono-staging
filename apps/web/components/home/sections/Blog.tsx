'use client';

import { Section } from '@/components/home/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';

import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { motion } from 'framer-motion';

export function Blog() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section id="blog" className="py-20">
      <motion.div {...fadeUp} className="mb-12 text-center">
        <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
          {s.blog.title}
        </h2>
        <p className="text-muted-foreground mt-3">{s.blog.subtitle}</p>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {s.blog.articles.map((article: any, index: number) => (
          <Card
            key={index}
            className="border-border bg-card/50 hover:border-foreground/30 flex flex-col overflow-hidden transition-all"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {article.category}
                </Badge>
                <div className="text-muted-foreground flex items-center text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  {article.date}
                </div>
              </div>
              <CardTitle className="line-clamp-2 text-xl leading-tight font-semibold">
                <Link
                  href={`/blog/${article.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {article.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 px-6 pb-6">
              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                {article.excerpt}
              </p>
            </CardContent>
            <CardFooter className="border-border border-t px-6 py-4">
              <div className="flex w-full items-center justify-between">
                <div className="text-muted-foreground flex items-center text-xs">
                  <User className="mr-1 h-3 w-3" />
                  {article.author}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 h-8 p-0 hover:bg-transparent"
                  asChild
                >
                  <Link href={`/blog/${article.slug}`}>
                    {s.blog.readMore} <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </motion.div>
    </Section>
  );
}
