/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Share2,
  Tag,
} from 'lucide-react';

export type PostDetailData = {
  id: string;
  title: string;
  excerpt?: string;
  href?: string;
  image?: string;
  category?: string;
  author?: { name: string; avatar?: string };
  date?: string; // ISO
  readingTime?: string; // "5 min"
  tags?: string[];
  contentHtml?: string; // safe/escaped HTML (rendered via dangerouslySetInnerHTML)
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
};

/** ========= Your preview component (form -> PostDetail) ========= */
const ArticlePreview = ({ form }: { form: any }) => {
  const author = form.watch('author') ||
    form.watch('author_name') || { name: 'Admin', avatar: undefined };

  const title = form.watch('title') || 'Default Title';
  const descriptionHtml = form.watch('description') || '';
  const image = form.watch('image_url') || undefined;
  const categoryRaw = form.watch('category') || '';
  const category =
    typeof categoryRaw === 'string'
      ? categoryRaw
      : categoryRaw?.name || undefined;

  const tagsRaw = form.watch('tags') || [];
  const tags: string[] = Array.isArray(tagsRaw)
    ? tagsRaw.filter(Boolean)
    : String(tagsRaw || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

  const date: string = form.watch('created_at') || new Date().toISOString();
  const excerpt = form.watch('excerpt') || undefined;

  const safeHtml = sanitizeHtml(descriptionHtml);
  const readingTime = estimateReadingTime(safeHtml);

  const section: PostDetailData = {
    id: 'draft',
    title,
    excerpt,
    image,
    category,
    author: typeof author === 'string' ? { name: author } : author,
    date,
    readingTime,
    tags,
    contentHtml: safeHtml,
    href: undefined, // in preview, usually undefined
  };

  return <PostDetail section={section} onBackHref="/blog" />;
};

export default ArticlePreview;

/** =================== PostDetail (design) =================== */
export function PostDetail({
  section,
  className,
}: {
  section: PostDetailData;
  onBackHref?: string;
  className?: string;
}) {
  const initials =
    section.author?.name
      ?.split(' ')
      .map((s) => s[0])
      .join('')
      .slice(0, 2) || 'AU';

  return (
    <section
      className={cn(
        'bg-background mx-auto max-w-3xl rounded-md border px-8 py-10',
        className,
      )}
    >
      {/* Top actions */}
      <div className="mb-6 flex items-center justify-between">
        <a className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back
        </a>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => share(section)}
        >
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
        <span className="from-foreground to-foreground/80 bg-linear-to-b bg-clip-text text-transparent">
          {section.title}
        </span>
      </h1>

      {/* Excerpt */}
      {section.excerpt && (
        <p className="text-muted-foreground mt-3 text-base">
          {section.excerpt}
        </p>
      )}

      {/* Meta */}
      <div className="text-muted-foreground mt-5 flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            {section.author?.avatar && (
              <AvatarImage
                src={section.author.avatar}
                alt={section.author.name}
              />
            )}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span>{section.author?.name ?? 'Anonymous'}</span>
        </div>
        {section.category && (
          <>
            <span>•</span>
            <Badge variant="secondary">{section.category}</Badge>
          </>
        )}
        {section.date && (
          <>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(section.date)}
            </span>
          </>
        )}
        {section.readingTime && (
          <>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {section.readingTime}
            </span>
          </>
        )}
      </div>

      {/* Cover */}
      {section.image && (
        <Card className="border-border mt-6 overflow-hidden">
          <CardContent className="p-0">
            <img
              src={section.image}
              alt={section.title}
              className="h-auto w-full object-cover"
            />
          </CardContent>
        </Card>
      )}

      <Separator className="my-8" />

      {/* Content */}
      <article
        className={cn(
          'prose prose-sm prose-neutral dark:prose-invert max-w-none',
          'prose-headings:scroll-mt-20 prose-p:leading-relaxed prose-img:rounded-xl',
        )}
        // NOTE: contentHtml sudah di-sanitize di ArticlePreview
        dangerouslySetInnerHTML={
          section.contentHtml ? { __html: section.contentHtml } : undefined
        }
      />

      {/* Tags */}
      {section.tags?.length ? (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Tag className="text-muted-foreground h-4 w-4" />
          {section.tags.map((t) => (
            <Badge key={t} variant="outline">
              {t}
            </Badge>
          ))}
        </div>
      ) : null}

      <Separator className="my-8" />

      {/* Prev / Next */}
      {(section.prev || section.next) && (
        <div className="grid gap-4 md:grid-cols-2">
          <NavCard align="left" label="Previous" link={section.prev} iconLeft />
          <NavCard align="right" label="Next" link={section.next} />
        </div>
      )}
    </section>
  );
}

/* ------------- sub components ------------- */
function NavCard({
  label,
  link,
  align = 'left',
  iconLeft = false,
}: {
  label: string;
  link?: { title: string; href: string };
  align?: 'left' | 'right';
  iconLeft?: boolean;
}) {
  if (!link) return <div className="hidden md:block" />;
  return (
    <a
      href={link.href}
      className={cn(
        'group hover:bg-muted/60 flex items-center justify-between rounded-xl border p-4 transition',
        align === 'right' && 'md:justify-end md:text-right',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2',
          align === 'right' && 'order-2',
        )}
      >
        <span className="text-muted-foreground text-xs">{label}</span>
        <div className="leading-tight font-medium">{link.title}</div>
      </div>
      <div
        className={cn(
          'text-muted-foreground',
          align === 'right' ? 'order-1 mr-2' : 'ml-2',
        )}
      >
        {iconLeft ? (
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-0.5" />
        ) : (
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        )}
      </div>
    </a>
  );
}

/* ------------- utils ------------- */
function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  try {
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
}

function share(section: PostDetailData) {
  if (typeof window === 'undefined') return;
  const url = section.href || window.location.href;
  const title = section.title;
  if ((navigator as any).share) {
    (navigator as any).share({ title, url }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(url);
  }
}

/** Basic sanitizer: strips <script>, inline event handlers, and javascript: URLs */
function sanitizeHtml(html: string): string {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    // remove scripts
    doc.querySelectorAll('script,noscript').forEach((n) => n.remove());
    // remove on* attrs and javascript: urls
    doc.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value;
        if (name.startsWith('on')) el.removeAttribute(attr.name);
        if (name === 'href' || name === 'src') {
          if (/^\s*javascript:/i.test(value)) el.removeAttribute(attr.name);
        }
      });
    });
    return doc.body.innerHTML || '';
  } catch {
    return html;
  }
}

/** Rough reading-time estimate (200 wpm) from HTML textContent */
function estimateReadingTime(html: string): string {
  if (!html) return undefined as any;
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}
