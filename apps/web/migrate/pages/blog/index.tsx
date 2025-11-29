import { Background, SkipToContent } from '@/components/home/components';
import { Footer, TopNav } from '@/components/home/sections';
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
import { Link } from '@inertiajs/react';
import { ArrowRight, Calendar, User } from 'lucide-react';

export default function BlogIndex() {
  const s = useStrings();
  const articles = s.blog.articles; // In a real app, this would come from props

  return (
    <div className="bg-background text-foreground relative min-h-dvh">
      <SkipToContent />
      <Background />
      <TopNav />

      <main id="main-content" className="pt-32 pb-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              {s.blog.title}
            </h1>
            <p className="text-muted-foreground mt-4 text-xl">
              {s.blog.subtitle}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: any, index: number) => (
              <Card
                key={index}
                className="border-border bg-card/50 hover:border-foreground/30 flex flex-col overflow-hidden transition-all hover:shadow-lg"
              >
                {article.image && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
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
                        {s.blog.readMore}{' '}
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
