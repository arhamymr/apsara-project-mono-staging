import { Background, SkipToContent } from '@/components/home/components';
import { Footer, TopNav } from '@/components/home/sections';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Share2, User } from 'lucide-react';

export default function BlogDetail({ article }: { article: any }) {
  // Fallback if article is not provided (e.g. direct visit without backend data yet)
  const post = article || {
    title: 'The Future of AI Automation in Enterprise',
    excerpt:
      'Discover how AI agents are revolutionizing business workflows and increasing operational efficiency.',
    date: 'Nov 15, 2024',
    author: 'Sarah Chen',
    category: 'Technology',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
    content: `
      <p>Artificial Intelligence is no longer just a buzzword; it's a fundamental shift in how businesses operate. From predictive analytics to autonomous agents, the landscape of enterprise technology is evolving at an unprecedented pace.</p>
      
      <h2>The Rise of Autonomous Agents</h2>
      <p>Unlike traditional automation which follows rigid rules, AI agents can reason, adapt, and make decisions based on complex data. This capability allows them to handle tasks that previously required human intervention, such as customer support, complex data analysis, and even creative content generation.</p>
      
      <h2>Key Benefits for Enterprise</h2>
      <ul>
        <li><strong>Efficiency:</strong> Automate repetitive tasks with higher accuracy.</li>
        <li><strong>Scalability:</strong> Handle increased workloads without proportional staff increases.</li>
        <li><strong>Insight:</strong> Derive actionable intelligence from vast amounts of unstructured data.</li>
      </ul>
      
      <p>As we move into 2025, we expect to see a surge in the adoption of multi-agent systems where specialized AI agents collaborate to solve complex business problems.</p>
    `,
    readTime: '5 min read',
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
              href="/"
              className="text-muted-foreground hover:text-primary inline-flex items-center text-sm transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <header className="mb-10 text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {post.category}
              </Badge>
              <span className="text-muted-foreground flex items-center text-sm">
                <Clock className="mr-1 h-3 w-3" />
                {post.readTime}
              </span>
            </div>

            <h1 className="mb-6 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            <div className="text-muted-foreground flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                {post.date}
              </div>
            </div>
          </header>

          {post.image && (
            <div className="border-border mb-10 overflow-hidden rounded-xl border shadow-lg">
              <img
                src={post.image}
                alt={post.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-invert prose-lg mx-auto">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="border-border mt-12 border-t pt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Share this article</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
