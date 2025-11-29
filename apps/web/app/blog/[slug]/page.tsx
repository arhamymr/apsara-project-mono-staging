import type { Metadata } from 'next';
import BlogDetailClient from './blog-detail-client';

// Default article data for metadata generation
const defaultArticle = {
  title: 'The Future of AI Automation in Enterprise',
  excerpt:
    'Discover how AI agents are revolutionizing business workflows and increasing operational efficiency.',
  date: 'Nov 15, 2024',
  author: 'Sarah Chen',
  category: 'Technology',
  image:
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
};

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for blog posts
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  // In a real app, you would fetch the article based on resolvedParams.slug
  // For now, we use the default article
  const article = defaultArticle;
  
  // Use slug in the canonical URL
  const canonicalUrl = `/blog/${resolvedParams.slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      images: article.image ? [{ url: article.image }] : [],
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  return <BlogDetailClient slug={slug} />;
}
