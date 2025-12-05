import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { basicCard, sectionContainer } from './section-utils';

export const contentSections: SectionTemplate[] = [
  {
    id: 'posts-feed-latest',
    title: 'Posts Feed (Live)',
    description:
      'Automatically renders published articles assigned to the current website slug.',
    preview: () => (
      <div className="space-y-2 text-left text-xs">
        <p className="text-muted-foreground">
          Latest published posts will appear here once the website slug matches
          assigned articles.
        </p>
        <div className="grid gap-2">
          {['Growth'].map((label) => (
            <div
              key={label}
              className="border-border bg-card flex flex-col gap-1.5 rounded-lg border p-3"
            >
              <span className="text-primary text-[10px] font-semibold tracking-[0.35em] uppercase">
                {label}
              </span>
              <p className="text-foreground font-semibold">
                Post title placeholder
              </p>
              <p className="text-muted-foreground">
                Posts assigned to this website will be rendered automatically.
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
    template: sectionContainer(
      'Latest insights',
      'Published articles assigned to this website automatically surface here.',
      {
        id: 'posts-feed-latest-node',
        type: 'postsFeed',
        layout: 'grid',
        limit: 3,
        showExcerpt: true,
        showMeta: true,
        class: 'w-full',
        cardClass: 'bg-card',
        emptyState:
          'Publish a post and assign it to this website to populate these cards.',
      },
    ),
  },
  {
    id: 'blog-highlights',
    title: 'Blog Highlights',
    description:
      'Latest articles with category label, short excerpt, and read-more action.',
    preview: () => (
      <div className="grid gap-2 p-1 text-xs">
        {['Product'].map((label) => (
          <div
            key={label}
            className="border-border flex flex-col gap-1.5 rounded-lg border p-2 text-left"
          >
            <span className="text-primary font-semibold tracking-[0.3em] uppercase">
              {label}
            </span>
            <p className="text-foreground font-semibold">
              Designing onboarding rituals that drive retention
            </p>
            <p className="text-muted-foreground">
              Lessons from 200+ GTM experiments on reducing time-to-value and
              increasing activation.
            </p>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'Latest articles',
      'Ideas and playbooks from the team on building and growing modern products.',
      {
        type: 'view',
        class: 'grid gap-6 md:grid-cols-3 text-left',
        children: [
          basicCard(
            'Designing onboarding rituals that drive retention',
            'Signals that it is time to invest in retention and how to get the first wins.',
          ),
          basicCard(
            'The GTM experimentation playbook',
            'Frameworks that help revenue teams prioritise experiments with confidence.',
          ),
          basicCard(
            'Hiring your first lifecycle marketer',
            'How top product-led companies structure lifecycle roles and rituals.',
          ),
        ],
      },
    ),
  },
  {
    id: 'article-detail',
    title: 'Detail Article',
    description:
      'Full article view with title, metadata, featured image, rich content, tags, and share action.',
    preview: () => (
      <div className="space-y-2 p-1 text-left text-xs">
        <h4 className="text-foreground font-semibold">
          Designing onboarding rituals that drive retention
        </h4>
        <div className="bg-muted text-muted-foreground flex h-16 items-center justify-center rounded-md text-xs">
          Featured image
        </div>
        <p className="text-muted-foreground">
          A practical walkthrough of the...
        </p>
        <div className="flex flex-wrap gap-2">
          {['Onboarding', 'Retention', 'Growth'].map((tag) => (
            <span
              key={tag}
              className="bg-muted/40 text-muted-foreground rounded-md text-[11px] font-semibold tracking-wide uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    template: sectionContainer(
      'Designing onboarding rituals that drive retention',
      'A practical walkthrough of the rituals and metrics that shape onboarding success.',
      {
        type: 'vstack',
        class: 'gap-4 text-left',
        children: [
          {
            type: 'text',
            as: 'p',
            text: 'By Jane Doe • Sep 12, 2025 • 6 min read',
            class: 'text-[11px] text-muted-foreground',
          },
          {
            type: 'image',
            src: 'https://placehold.co/1024x576',
            alt: 'Featured image',
            class: 'rounded-md object-cover',
          },
          {
            type: 'text',
            as: 'p',
            text: 'Teams that invest in onboarding rituals see faster activation, improved retention, and deeper product engagement across cohorts.',
            class: 'text-sm text-muted-foreground',
          },
          {
            type: 'view',
            class: 'flex flex-wrap gap-2',
            children: [
              {
                type: 'text',
                as: 'span',
                text: 'Onboarding',
                class:
                  'rounded-md bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground',
              },
              {
                type: 'text',
                as: 'span',
                text: 'Retention',
                class:
                  'rounded-md bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground',
              },
              {
                type: 'text',
                as: 'span',
                text: 'Growth',
                class:
                  'rounded-md bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground',
              },
            ],
          },
          {
            type: 'button',
            text: 'Share',
            class:
              'inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold transition hover:bg-muted',
            action: { kind: 'link', href: '#', target: '_self' },
          },
        ],
      },
      { background: 'bg-background' },
    ),
  },
];
