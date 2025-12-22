'use client';

import { Background, SkipToContent } from '@/components/home/components';
import { Footer, TopNav } from '@/components/home/sections';
import { useBlog } from '@/hooks/useBlog';
import { LexicalRenderer } from '@/components/blog/lexical-renderer';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Skeleton } from '@workspace/ui/components/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Clock, Share2, User, Facebook, Twitter, Linkedin, Copy, Check } from 'lucide-react';
import { useState } from 'react';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface BlogDetailClientProps {
  slug: string;
}

export default function BlogDetailClient({ slug }: BlogDetailClientProps) {
  const { data: post, isLoading, error } = useBlog(slug);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || 'Check out this article';
  const shareText = post?.excerpt || post?.title || 'Read this interesting article';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const handleShareLinkedin = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank', 'width=550,height=420');
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <div className="bg-background text-foreground relative min-h-dvh">
      <SkipToContent />
      <Background />
      <TopNav />

      <main id="main-content" className="pt-32 pb-20">
        <article className="container mx-auto max-w-3xl px-4">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-primary inline-flex items-center text-sm transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blogs
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-96 w-full rounded-xl" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Failed to load blog post.</p>
              <Link href="/blog" className="text-primary hover:underline">
                Return to blog
              </Link>
            </div>
          ) : post ? (
            <>
              <header className="mb-10 text-center">
                <div className="mb-6 flex items-center justify-center gap-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {post.tags[0] || 'General'}
                  </Badge>
                  <span className="text-muted-foreground flex items-center text-sm">
                    <Clock className="mr-1 h-3 w-3" />
                    5 min read
                  </span>
                </div>

                <h1 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                  {post.title}
                </h1>

                <div className="text-muted-foreground flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    {post.authorName}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(post.publishedAt)}
                  </div>
                </div>
              </header>

              {post.coverImage && (
                <div className="border-border mb-10 overflow-hidden rounded-xl border shadow-lg">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="h-[400px] w-full object-cover"
                  />
                </div>
              )}

              {post.content && (
                <div className="mx-auto max-w-3xl">
                  <LexicalRenderer content={post.content} />
                </div>
              )}

              <div className="border-border mt-12 border-t pt-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">Share this article</h3>
                  <div className="flex flex-wrap gap-3">
                    {typeof navigator !== 'undefined' && navigator.share && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleShareNative}
                        className="gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleShareTwitter}
                      className="gap-2"
                      title="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleShareFacebook}
                      className="gap-2"
                      title="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                      Facebook
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleShareLinkedin}
                      className="gap-2"
                      title="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCopyLink}
                      className="gap-2"
                      title="Copy link to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </article>
      </main>

      <Footer />
    </div>
  );
}
