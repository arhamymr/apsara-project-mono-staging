import type { TemplateDefinition } from '../template-schema';

export const editorialBlogTemplate: TemplateDefinition = {
  id: '3',
  type: 'editorial-blog',
  themeId: 'forest',
  typographyId: 'inter',
  name: 'Editorial Blog',
  preview: 'https://picsum.photos/seed/editorial-blog/1024/768',
  description:
    'Content-heavy layout for publishers and knowledge bases, featuring category navigation and article feeds.',
  globals: {
    header: [
      {
        id: 'editorial-navbar',
        type: 'navbar',
        navbar: {
          type: 'justified',
          menuAlignment: 'space-between',
          appearance: 'muted',
        },
        class:
          'items-center justify-between gap-4 px-4 @md:px-8 py-4 bg-background/90 backdrop-blur text-foreground border-b border-border',
        children: [
          {
            id: 'editorial-brand',
            slot: 'brand',
            type: 'text',
            as: 'span',
            class: 'text-xl font-bold tracking-tight text-foreground',
            text: 'Insightly',
          },
          {
            id: 'editorial-menu-articles',
            slot: 'menu',
            type: 'link',
            text: 'Articles',
            class:
              'text-sm font-medium text-muted-foreground transition hover:text-foreground',
            action: { kind: 'link', href: '/articles', target: '_self' },
          },
          {
            id: 'editorial-menu-guides',
            slot: 'menu',
            type: 'link',
            text: 'Guides',
            class:
              'text-sm font-medium text-muted-foreground transition hover:text-foreground',
            action: { kind: 'link', href: '/guides', target: '_self' },
          },
          {
            id: 'editorial-menu-newsletter',
            slot: 'menu',
            type: 'link',
            text: 'Newsletter',
            class:
              'text-sm font-medium text-muted-foreground transition hover:text-foreground',
            action: { kind: 'link', href: '/newsletter', target: '_self' },
          },
          {
            id: 'editorial-cta',
            slot: 'action',
            type: 'button',
            text: 'Subscribe',
            class:
              'rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90',
            action: { kind: 'link', href: '/newsletter', target: '_self' },
          },
        ],
      },
    ],
  },
  pages: {
    home: {
      id: 'home',
      title: 'Home',
      path: '/',
      sections: [
        {
          id: 'blog-hero',
          type: 'section',
          class: 'bg-muted/30 py-16 @md:py-20 px-4 @md:px-8 text-foreground',
          children: [
            {
              type: 'vstack',
              class: 'container mx-auto max-w-4xl gap-5 text-center',
              children: [
                {
                  type: 'text',
                  as: 'p',
                  class: 'text-xs uppercase tracking-[0.4em] text-primary',
                  text: 'Research-backed stories',
                },
                {
                  type: 'text',
                  as: 'h1',
                  class: 'text-balance text-3xl @md:text-4xl font-semibold',
                  text: 'Ideas, frameworks, and lessons for modern product teams.',
                },
                {
                  type: 'text',
                  as: 'p',
                  class: 'text-muted-foreground text-sm @md:text-base',
                  text: 'Join 15K+ readers exploring strategy, design systems, and growth mechanics delivered weekly.',
                },
                {
                  type: 'hstack',
                  class:
                    'mx-auto flex items-center justify-center gap-3 flex-wrap',
                  children: [
                    {
                      type: 'button',
                      text: 'Subscribe via email',
                      class:
                        'rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90',
                      action: {
                        kind: 'link',
                        href: '/newsletter',
                        target: '_self',
                      },
                    },
                    {
                      type: 'link',
                      text: 'Read latest issue',
                      class:
                        'text-sm font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline',
                      action: {
                        kind: 'link',
                        href: '/newsletter/latest',
                        target: '_self',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'blog-featured',
          type: 'section',
          class: 'bg-background py-14 @md:py-18 px-4 @md:px-8 text-foreground',
          children: [
            {
              type: 'vstack',
              class: 'container mx-auto max-w-5xl gap-6',
              children: [
                {
                  type: 'text',
                  as: 'h2',
                  class: 'text-xl @md:text-2xl font-semibold',
                  text: 'Latest posts',
                },
                {
                  id: 'blog-featured-feed',
                  type: 'postsFeed',
                  layout: 'grid',
                  limit: 6,
                  showExcerpt: true,
                  showMeta: true,
                  showLink: true,
                  class: 'grid gap-6 @md:grid-cols-2',
                },
              ],
            },
          ],
        },
        {
          id: 'blog-categories',
          type: 'section',
          class: 'bg-muted/10 py-14 @md:py-18 px-4 @md:px-8 text-foreground',
          children: [
            {
              type: 'vstack',
              class: 'container mx-auto max-w-5xl gap-6',
              children: [
                {
                  type: 'text',
                  as: 'h2',
                  class: 'text-xl @md:text-2xl font-semibold',
                  text: 'Browse by theme',
                },
                {
                  type: 'view',
                  class: 'grid gap-4 @md:grid-cols-3',
                  children: [
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-5 gap-2',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-base font-semibold',
                          text: 'Product Strategy',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Discover roadmapping, pricing, and positioning lessons.',
                        },
                        {
                          type: 'link',
                          text: 'View category',
                          class:
                            'text-sm font-medium text-primary hover:underline',
                          action: {
                            kind: 'link',
                            href: '/articles?category=product',
                            target: '_self',
                          },
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-5 gap-2',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-base font-semibold',
                          text: 'Design Systems',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Patterns and processes for scalable product design.',
                        },
                        {
                          type: 'link',
                          text: 'View category',
                          class:
                            'text-sm font-medium text-primary hover:underline',
                          action: {
                            kind: 'link',
                            href: '/articles?category=design',
                            target: '_self',
                          },
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-5 gap-2',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-base font-semibold',
                          text: 'Growth Experiments',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Acquisition playbooks and retention experiments from SaaS leaders.',
                        },
                        {
                          type: 'link',
                          text: 'View category',
                          class:
                            'text-sm font-medium text-primary hover:underline',
                          action: {
                            kind: 'link',
                            href: '/articles?category=growth',
                            target: '_self',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
