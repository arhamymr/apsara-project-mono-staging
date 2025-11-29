import type { TemplateDefinition } from '../template-schema';

export const creativeStudioTemplate: TemplateDefinition = {
  id: '2',
  type: 'creative-portfolio',
  themeId: 'sakura',
  typographyId: 'poppins',
  name: 'Creative Studio Portfolio',
  preview: 'https://picsum.photos/seed/creative-studio/1024/768',
  description:
    'Vibrant one-page layout for agencies or freelancers to highlight signature projects and capabilities.',
  globals: {
    header: [
      {
        id: 'creative-navbar',
        type: 'navbar',
        navbar: {
          type: 'center-brand',
          menuAlignment: 'center',
          appearance: 'transparent',
        },
        class:
          'items-center justify-between gap-4 px-4 @md:px-6 @lg:px-10 py-4 bg-gradient-to-r from-primary/10 via-transparent to-transparent text-foreground border-b border-border/60',
        children: [
          {
            id: 'creative-brand',
            slot: 'brand',
            type: 'text',
            as: 'span',
            class: 'text-lg @md:text-xl font-black tracking-tight text-primary',
            text: 'StudioNova',
          },
          {
            id: 'creative-nav-work',
            slot: 'menu',
            type: 'link',
            text: 'Work',
            class:
              'text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground underline-offset-4',
            action: { kind: 'link', href: '/work', target: '_self' },
          },
          {
            id: 'creative-nav-services',
            slot: 'menu',
            type: 'link',
            text: 'Services',
            class:
              'text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground underline-offset-4',
            action: { kind: 'link', href: '/services', target: '_self' },
          },
          {
            id: 'creative-nav-contact',
            slot: 'menu',
            type: 'link',
            text: 'Contact',
            class:
              'text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground underline-offset-4',
            action: { kind: 'link', href: '/contact', target: '_self' },
          },
          {
            id: 'creative-cta',
            slot: 'action',
            type: 'button',
            text: 'Start a project',
            class:
              'rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 @lg:text-sm',
            action: { kind: 'link', href: '/contact', target: '_self' },
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
          id: 'creative-hero',
          type: 'section',
          class:
            'relative overflow-hidden bg-background py-20 @md:py-28 px-4 @md:px-8 text-foreground',
          children: [
            {
              type: 'vstack',
              class:
                'container mx-auto max-w-4xl items-center text-center gap-6 relative',
              children: [
                {
                  type: 'text',
                  as: 'p',
                  class: 'text-xs uppercase tracking-[0.35em] text-primary/80',
                  text: 'Brand, Web & Motion',
                },
                {
                  type: 'text',
                  as: 'h1',
                  class:
                    'text-balance text-3xl @md:text-5xl font-semibold leading-tight',
                  text: 'We tell bold stories through strategy-forward digital experiences.',
                },
                {
                  type: 'text',
                  as: 'p',
                  class: 'text-muted-foreground max-w-2xl text-sm @md:text-lg',
                  text: 'StudioNova partners with climate, culture, and community pioneers to launch stand-out products and campaigns.',
                },
                {
                  type: 'hstack',
                  class:
                    'items-center justify-center gap-3 @md:gap-4 flex-wrap',
                  children: [
                    {
                      type: 'button',
                      text: 'See recent work',
                      class:
                        'rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90',
                      action: { kind: 'link', href: '/work', target: '_self' },
                    },
                    {
                      type: 'link',
                      text: 'Download capabilities',
                      class:
                        'text-sm font-medium underline-offset-4 hover:underline text-muted-foreground',
                      action: {
                        kind: 'link',
                        href: '/capabilities.pdf',
                        target: '_blank',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'creative-case-studies',
          type: 'section',
          class: 'bg-muted/20 py-16 @md:py-20 px-4 @md:px-8 text-foreground',
          children: [
            {
              type: 'vstack',
              class: 'container mx-auto max-w-5xl gap-8',
              children: [
                {
                  type: 'text',
                  as: 'h2',
                  class: 'text-2xl @md:text-3xl font-semibold',
                  text: 'Selected projects',
                },
                {
                  type: 'view',
                  class: 'grid gap-6 @md:grid-cols-2',
                  children: [
                    {
                      type: 'vstack',
                      class:
                        'rounded-2xl border border-border bg-card p-6 gap-4',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-lg font-semibold',
                          text: 'Bloom — Digital fundraising platform',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Brand refresh, product design, and launch campaign for a climate-tech startup raising Series A.',
                        },
                        {
                          type: 'link',
                          text: 'View case study',
                          class:
                            'text-sm font-medium text-primary hover:underline inline-flex items-center gap-1',
                          action: {
                            kind: 'link',
                            href: '/work/bloom',
                            target: '_self',
                          },
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class:
                        'rounded-2xl border border-border bg-card p-6 gap-4',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-lg font-semibold',
                          text: 'Museums of Tomorrow — Immersive exhibition',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Crafted microsite, motion graphics, and interactive wayfinding for a city-wide culture festival.',
                        },
                        {
                          type: 'link',
                          text: 'View case study',
                          class:
                            'text-sm font-medium text-primary hover:underline inline-flex items-center gap-1',
                          action: {
                            kind: 'link',
                            href: '/work/museums',
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
        {
          id: 'creative-cta',
          type: 'section',
          class:
            'bg-primary text-primary-foreground py-16 @md:py-20 px-4 @md:px-8',
          children: [
            {
              type: 'vstack',
              class:
                'container mx-auto max-w-4xl items-center gap-5 text-center',
              children: [
                {
                  type: 'text',
                  as: 'h2',
                  class: 'text-2xl @md:text-3xl font-semibold',
                  text: 'Let’s co-create your next launch.',
                },
                {
                  type: 'text',
                  as: 'p',
                  class: 'text-sm @md:text-base opacity-80',
                  text: 'Share the ambition, timeline, and budget. We will assemble a sprint-ready pod within 48 hours.',
                },
                {
                  type: 'button',
                  text: 'Book chemistry call',
                  class:
                    'rounded-full bg-background px-6 py-2 text-sm font-semibold text-foreground transition hover:bg-background/90',
                  action: { kind: 'link', href: '/contact', target: '_self' },
                },
              ],
            },
          ],
        },
      ],
    },
  },
};
