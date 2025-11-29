import type { TemplateDefinition } from '../template-schema';

export const businessTemplate: TemplateDefinition = {
  id: '1',
  type: 'landing-page',
  themeId: 'light',
  typographyId: 'inter',
  name: 'Business / Company Profile',
  preview:
    'https://assets.apsaradigital.com/Screenshot%202025-09-29%20135044.png',
  description:
    'This type of website is designed to introduce a company, showcase services, and build brand credibility with potential customers or partners',
  globals: {
    header: [
      {
        id: 'business-navbar',
        type: 'navbar',
        navbar: {
          type: 'default',
          menuAlignment: 'center',
          appearance: 'default',
        },
        class:
          'flex items-center justify-between bg-background px-4 @md:px-6 @lg:px-8 py-3 text-foreground border-b border-border',
        children: [
          {
            id: 'brand-logo',
            slot: 'brand',
            type: 'image',
            src: 'https://assets.apsaradigital.com/logo-icon-white.png',
            alt: 'Apsara Digital',
            class: 'h-6 @md:h-7 w-auto object-contain',
          },
          {
            id: 'nav-about',
            slot: 'menu',
            type: 'link',
            text: 'About',
            class:
              'text-sm font-medium text-muted-foreground transition hover:text-foreground',
            action: { kind: 'link', href: '/about', target: '_self' },
          },
          {
            id: 'nav-services',
            slot: 'menu',
            type: 'link',
            text: 'Services',
            class:
              'text-sm font-medium text-muted-foreground transition hover:text-foreground',
            action: { kind: 'link', href: '/services', target: '_self' },
          },
          {
            id: 'nav-contact',
            slot: 'menu',
            type: 'link',
            text: 'Contact',
            class:
              'text-sm font-medium text-muted-foreground transition hover:text-foreground',
            action: { kind: 'link', href: '/contact', target: '_self' },
          },
          {
            id: 'cta-quote',
            slot: 'action',
            type: 'button',
            text: 'Get Quote',
            class:
              'rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90',
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
        // HERO
        {
          id: 'home-hero',
          type: 'section',
          class:
            'bg-background text-foreground py-16 @md:py-24 @lg:py-32 px-4 @md:px-6 @lg:px-8',
          children: [
            {
              type: 'vstack',
              class:
                'container mx-auto max-w-3xl items-center text-center gap-6',
              children: [
                {
                  id: 'hero-eyebrow',
                  type: 'text',
                  as: 'p',
                  class:
                    'text-xs @md:text-sm font-medium uppercase tracking-wider text-muted-foreground',
                  text: 'Apsara Digital Studio',
                },
                {
                  id: 'hero-title',
                  type: 'text',
                  as: 'h1',
                  class:
                    'text-balance text-3xl @md:text-4xl @lg:text-5xl font-semibold leading-tight',
                  text: 'Design, build, and launch engaging digital experiences.',
                },
                {
                  id: 'hero-subtitle',
                  type: 'text',
                  as: 'p',
                  class:
                    'text-sm @md:text-base @lg:text-lg text-muted-foreground',
                  text: 'We partner with product and marketing teams to craft websites that convert, scale, and stay on brand.',
                },
                {
                  id: 'hero-actions',
                  type: 'hstack',
                  class:
                    'items-center justify-center flex-wrap gap-3 @md:gap-4 mt-4',
                  children: [
                    {
                      id: 'hero-contact',
                      type: 'button',
                      text: 'Book a Strategy Call',
                      action: {
                        kind: 'link',
                        href: '/contact',
                        target: '_self',
                      },
                    },
                    {
                      id: 'hero-work',
                      type: 'link',
                      text: 'View recent work',
                      class:
                        'text-sm @md:text-base font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline',
                      action: {
                        kind: 'link',
                        href: '/clients',
                        target: '_self',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // TRUSTED
        {
          id: 'home-trusted',
          type: 'section',
          class:
            'bg-background text-foreground py-12 @md:py-16 px-4 @md:px-6 @lg:px-8',
          children: [
            {
              type: 'vstack',
              class:
                'container mx-auto max-w-5xl items-center gap-6 @md:gap-8 text-center',
              children: [
                {
                  id: 'trusted-title',
                  type: 'text',
                  as: 'h2',
                  class:
                    'text-xs @md:text-sm font-semibold uppercase tracking-wide text-muted-foreground',
                  text: 'Trusted by leading brands',
                },
                {
                  id: 'trusted-grid',
                  type: 'view',
                  class:
                    'grid grid-cols-2 @md:grid-cols-3 @lg:grid-cols-5 gap-4 @md:gap-6 place-items-center',
                  children: [
                    {
                      id: 'logo-traveloka',
                      type: 'image',
                      src: 'https://assets.apsaradigital.com/traveloka.png',
                      alt: 'Traveloka',
                      class: 'h-8 @md:h-10 object-contain',
                    },
                    {
                      id: 'logo-gojek',
                      type: 'image',
                      src: 'https://assets.apsaradigital.com/gojek.png',
                      alt: 'Gojek',
                      class: 'h-8 @md:h-10 object-contain',
                    },
                    {
                      id: 'logo-bni',
                      type: 'image',
                      src: 'https://assets.apsaradigital.com/bni.png',
                      alt: 'BNI',
                      class: 'h-8 @md:h-10 object-contain',
                    },
                    {
                      id: 'logo-mandiri',
                      type: 'image',
                      src: 'https://assets.apsaradigital.com/mandiri.png',
                      alt: 'Mandiri',
                      class: 'h-8 @md:h-10 object-contain',
                    },
                    {
                      id: 'logo-grab',
                      type: 'image',
                      src: 'https://assets.apsaradigital.com/grab.png',
                      alt: 'Grab',
                      class: 'h-8 @md:h-10 object-contain',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // SERVICES
        {
          id: 'home-services',
          type: 'section',
          class:
            'bg-background text-foreground py-16 @md:py-20 px-4 @md:px-6 @lg:px-8',
          children: [
            {
              type: 'vstack',
              class:
                'container mx-auto max-w-5xl items-center gap-8 @md:gap-10 text-center',
              children: [
                {
                  id: 'services-title',
                  type: 'text',
                  as: 'h2',
                  class:
                    'text-2xl @md:text-3xl @lg:text-4xl font-semibold tracking-tight',
                  text: 'What we deliver',
                },
                {
                  id: 'services-copy',
                  type: 'text',
                  as: 'p',
                  class:
                    'text-sm @md:text-base @lg:text-lg text-muted-foreground',
                  text: 'A multidisciplinary team ready to design, build, and optimize your marketing web stack.',
                },
                {
                  id: 'services-grid',
                  type: 'view',
                  class:
                    'grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4 @md:gap-6 text-left items-stretch',
                  children: [
                    {
                      id: 'service-websites',
                      type: 'vstack',
                      class:
                        'gap-3 rounded-xl border border-border bg-background p-5 @md:p-6 items-start h-full',
                      children: [
                        {
                          id: 'service-websites-title',
                          type: 'text',
                          as: 'h3',
                          class: 'text-base @md:text-lg font-semibold',
                          text: 'Company Websites',
                        },
                        {
                          id: 'service-websites-copy',
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Responsive multi-language sites paired with scalable CMS foundations.',
                        },
                      ],
                    },
                    {
                      id: 'service-landing',
                      type: 'vstack',
                      class:
                        'gap-3 rounded-xl border border-border bg-background p-5 @md:p-6 items-start h-full',
                      children: [
                        {
                          id: 'service-landing-title',
                          type: 'text',
                          as: 'h3',
                          class: 'text-base @md:text-lg font-semibold',
                          text: 'Launch & Campaign Pages',
                        },
                        {
                          id: 'service-landing-copy',
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'High-performing landing pages with conversion copy, assets, and analytics.',
                        },
                      ],
                    },
                    {
                      id: 'service-ops',
                      type: 'vstack',
                      class:
                        'gap-3 rounded-xl border border-border bg-background p-5 @md:p-6 items-start h-full',
                      children: [
                        {
                          id: 'service-ops-title',
                          type: 'text',
                          as: 'h3',
                          class: 'text-base @md:text-lg font-semibold',
                          text: 'Web Ops & Optimization',
                        },
                        {
                          id: 'service-ops-copy',
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Continuous improvements covering performance, SEO, and experimentation.',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ARTICLES
        {
          id: 'home-posts',
          type: 'section',
          class:
            'bg-muted/10 py-16 @md:py-20 px-4 @md:px-6 @lg:px-8 text-foreground',
          children: [
            {
              type: 'vstack',
              class: 'container mx-auto max-w-5xl items-start gap-6',
              children: [
                {
                  id: 'home-posts-eyebrow',
                  type: 'text',
                  as: 'p',
                  class:
                    'text-xs font-semibold uppercase tracking-[0.35em] text-primary',
                  text: 'Insights',
                },
                {
                  id: 'home-posts-title',
                  type: 'text',
                  as: 'h2',
                  class:
                    'text-balance text-2xl @md:text-3xl @lg:text-4xl font-semibold',
                  text: 'Fresh perspectives from the team',
                },
                {
                  id: 'home-posts-subtitle',
                  type: 'text',
                  as: 'p',
                  class:
                    'text-sm @md:text-base text-muted-foreground max-w-3xl',
                  text: 'Explore recent case studies, playbooks, and learnings from across our product, design, and growth engagements.',
                },
                {
                  id: 'home-posts-feed',
                  type: 'postsFeed',
                  layout: 'grid',
                  limit: 3,
                  showExcerpt: true,
                  showMeta: true,
                  class: 'w-full',
                  cardClass: 'bg-card',
                  emptyState: 'We are preparing new articles. Check back soon.',
                },
              ],
            },
          ],
        },

        // CTA
        {
          id: 'home-cta',
          type: 'section',
          class:
            'bg-background text-foreground py-16 @md:py-20 px-4 @md:px-6 @lg:px-8',
          children: [
            {
              type: 'vstack',
              class:
                'container mx-auto max-w-3xl items-center gap-5 @md:gap-6 text-center',
              children: [
                {
                  id: 'cta-title',
                  type: 'text',
                  as: 'h2',
                  class: 'text-2xl @md:text-3xl @lg:text-4xl font-semibold',
                  text: 'Ready to ship something great together?',
                },
                {
                  id: 'cta-copy',
                  type: 'text',
                  as: 'p',
                  class:
                    'text-sm @md:text-base @lg:text-lg text-muted-foreground',
                  text: 'Share your goals and we will draft a tailored roadmap covering scope, timeline, and investment.',
                },
                {
                  id: 'cta-actions',
                  type: 'hstack',
                  class:
                    'items-center justify-center flex-wrap gap-3 @md:gap-4',
                  children: [
                    {
                      id: 'cta-book',
                      type: 'button',
                      text: 'Schedule introduction',
                      action: {
                        kind: 'link',
                        href: '/contact',
                        target: '_self',
                      },
                    },
                    {
                      id: 'cta-email',
                      type: 'link',
                      text: 'hello@apsaradigital.com',
                      class:
                        'text-sm @md:text-base font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline',
                      action: {
                        kind: 'link',
                        href: 'mailto:hello@apsaradigital.com',
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
    services: {
      id: 'services',
      title: 'Services',
      path: '/services',
      sections: [
        {
          id: 'services-hero',
          type: 'section',
          class:
            'bg-muted/40 py-16 @md:py-20 @lg:py-24 px-4 @md:px-6 @lg:px-8 text-foreground',
          children: [
            {
              type: 'vstack',
              class:
                'container mx-auto max-w-3xl items-center text-center gap-6',
              children: [
                {
                  type: 'text',
                  as: 'p',
                  class:
                    'text-xs @md:text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground',
                  text: 'Our Services',
                },
                {
                  type: 'text',
                  as: 'h1',
                  class:
                    'text-balance text-3xl @md:text-4xl @lg:text-5xl font-semibold tracking-tight',
                  text: 'Everything you need to launch and scale faster.',
                },
                {
                  type: 'text',
                  as: 'p',
                  class:
                    'text-sm @md:text-base @lg:text-lg text-muted-foreground',
                  text: 'A single partner to handle strategy, design, build, and growth so your team can stay focused on product.',
                },
              ],
            },
          ],
        },
        {
          id: 'services-grid',
          type: 'section',
          class:
            'bg-background text-foreground py-16 @md:py-24 @lg:py-28 px-4 @md:px-6 @lg:px-8',
          children: [
            {
              type: 'vstack',
              class:
                'container mx-auto max-w-5xl gap-10 @md:gap-12 text-center',
              children: [
                {
                  type: 'text',
                  as: 'h2',
                  class:
                    'text-2xl @md:text-3xl font-semibold tracking-tight text-foreground',
                  text: 'Modular services designed to flex with your roadmap',
                },
                {
                  type: 'view',
                  class:
                    'grid gap-6 @md:gap-8 @md:grid-cols-2 @lg:grid-cols-3 text-left',
                  children: [
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-6 shadow-sm gap-4',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-lg font-semibold text-foreground',
                          text: 'Brand Discovery',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Messaging, positioning, and brand essentials that align your team before a major launch.',
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-6 shadow-sm gap-4',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-lg font-semibold text-foreground',
                          text: 'UX & Interface Design',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Componentized UI systems, tailored layouts, and design assets ready for growth marketing.',
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-6 shadow-sm gap-4',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-lg font-semibold text-foreground',
                          text: 'Webflow + Next Builds',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'High-performing sites with analytics, localization, and marketing automations baked in.',
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-6 shadow-sm gap-4',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-lg font-semibold text-foreground',
                          text: 'Growth Experiments',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Landing page variations, on-site experiments, and LTV improvements tracked with shared dashboards.',
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-6 shadow-sm gap-4',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-lg font-semibold text-foreground',
                          text: 'On-Demand Support',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Design and engineering retainers with guaranteed response times and regular performance reviews.',
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-6 shadow-sm gap-4',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-lg font-semibold text-foreground',
                          text: 'Training & Handoffs',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Workshops, documentation, and playbooks to empower internal teams after launch.',
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
          id: 'services-cta',
          type: 'section',
          class:
            'bg-foreground text-background py-16 @md:py-20 px-4 @md:px-6 @lg:px-8',
          children: [
            {
              type: 'vstack',
              class:
                'container mx-auto max-w-3xl items-center gap-6 text-center',
              children: [
                {
                  type: 'text',
                  as: 'h2',
                  class: 'text-3xl @md:text-4xl font-semibold tracking-tight',
                  text: 'Need a launch partner for your next release?',
                },
                {
                  type: 'text',
                  as: 'p',
                  class: 'text-sm @md:text-base text-background/80',
                  text: 'Let’s scope a sprint together—our team can be hands-on from idea to shipped experience.',
                },
                {
                  type: 'button',
                  text: 'Schedule a Strategy Call',
                  action: { kind: 'link', href: '/contact', target: '_self' },
                },
              ],
            },
          ],
        },
      ],
    },
    about: {
      id: 'about',
      title: 'About',
      path: '/about',
      sections: [
        {
          id: 'about-hero',
          type: 'section',
          class:
            'bg-background text-foreground py-16 @md:py-20 @lg:py-24 px-4 @md:px-6 @lg:px-8',
          children: [
            {
              type: 'vstack',
              class: 'container mx-auto max-w-[720px] gap-6 text-center',
              children: [
                {
                  type: 'text',
                  as: 'p',
                  class:
                    'text-xs @md:text-sm font-semibold uppercase tracking-[0.35em] text-muted-foreground',
                  text: 'Inside Apsara',
                },
                {
                  type: 'text',
                  as: 'h1',
                  class:
                    'text-balance text-3xl @md:text-4xl @lg:text-5xl font-semibold tracking-tight',
                  text: 'We help ambitious teams make the web their competitive edge.',
                },
                {
                  type: 'text',
                  as: 'p',
                  class: 'text-sm @md:text-base text-muted-foreground',
                  text: 'With a distributed crew across Jakarta, Singapore, and Melbourne, we combine strategy, design, and build into one streamlined team.',
                },
              ],
            },
          ],
        },
        {
          id: 'about-values',
          type: 'section',
          class:
            'bg-muted/30 py-16 @md:py-20 px-4 @md:px-6 @lg:px-8 text-foreground',
          children: [
            {
              type: 'vstack',
              class: 'container mx-auto max-w-5xl gap-12 @md:gap-16',
              children: [
                {
                  type: 'hstack',
                  class: 'flex-col @md:flex-row gap-8',
                  children: [
                    {
                      type: 'vstack',
                      class: 'flex-1 gap-4',
                      children: [
                        {
                          type: 'text',
                          as: 'h2',
                          class:
                            'text-2xl @md:text-3xl font-semibold tracking-tight',
                          text: 'Our values',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'We play the long game, obsess over craft, and treat every client as a true partner.',
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class: 'grid flex-1 gap-4 @md:grid-cols-2',
                      children: [
                        {
                          type: 'vstack',
                          class:
                            'rounded-xl border border-border bg-background p-5 shadow-sm gap-2',
                          children: [
                            {
                              type: 'text',
                              as: 'h3',
                              class: 'text-base font-semibold',
                              text: 'Clarity over cleverness',
                            },
                            {
                              type: 'text',
                              as: 'p',
                              class: 'text-sm text-muted-foreground',
                              text: 'We make decisions and designs that are obvious to customers and stakeholders alike.',
                            },
                          ],
                        },
                        {
                          type: 'vstack',
                          class:
                            'rounded-xl border border-border bg-background p-5 shadow-sm gap-2',
                          children: [
                            {
                              type: 'text',
                              as: 'h3',
                              class: 'text-base font-semibold',
                              text: 'Teams win together',
                            },
                            {
                              type: 'text',
                              as: 'p',
                              class: 'text-sm text-muted-foreground',
                              text: 'Multi-disciplinary pods pair strategists, designers, and builders from day one.',
                            },
                          ],
                        },
                        {
                          type: 'vstack',
                          class:
                            'rounded-xl border border-border bg-background p-5 shadow-sm gap-2',
                          children: [
                            {
                              type: 'text',
                              as: 'h3',
                              class: 'text-base font-semibold',
                              text: 'Stay curious',
                            },
                            {
                              type: 'text',
                              as: 'p',
                              class: 'text-sm text-muted-foreground',
                              text: 'We invest heavily in R&D, from AI workflows to new interaction patterns.',
                            },
                          ],
                        },
                        {
                          type: 'vstack',
                          class:
                            'rounded-xl border border-border bg-background p-5 shadow-sm gap-2',
                          children: [
                            {
                              type: 'text',
                              as: 'h3',
                              class: 'text-base font-semibold',
                              text: 'Measurable outcomes',
                            },
                            {
                              type: 'text',
                              as: 'p',
                              class: 'text-sm text-muted-foreground',
                              text: 'Every engagement is backed by shared dashboards, baselines, and goals.',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'section',
                  class:
                    'grid gap-6 @md:grid-cols-2 items-start rounded-2xl border border-border bg-background p-8 shadow-sm',
                  children: [
                    {
                      type: 'vstack',
                      class: 'gap-4',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-xl font-semibold',
                          text: 'Our story',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Founded in 2016, we were one of the first studios in SEA to fully embrace component-driven content platforms. Today we support product, marketing, and brand teams across APAC and North America.',
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class: 'gap-4',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-xl font-semibold',
                          text: 'Where you can find us',
                        },
                        {
                          type: 'text',
                          as: 'ul',
                          class: 'space-y-2 text-sm text-muted-foreground',
                          children: [
                            {
                              type: 'text',
                              as: 'li',
                              text: 'Jakarta — delivery and account teams',
                            },
                            {
                              type: 'text',
                              as: 'li',
                              text: 'Singapore — strategy and partnerships',
                            },
                            {
                              type: 'text',
                              as: 'li',
                              text: 'Melbourne — product and design research',
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
        {
          id: 'about-team',
          type: 'section',
          class:
            'bg-background py-16 @md:py-20 @lg:py-28 px-4 @md:px-6 @lg:px-8 text-foreground',
          children: [
            {
              type: 'vstack',
              class:
                'container mx-auto max-w-5xl gap-10 @md:gap-12 text-center',
              children: [
                {
                  type: 'text',
                  as: 'h2',
                  class: 'text-2xl @md:text-3xl font-semibold tracking-tight',
                  text: 'Meet the team building alongside you',
                },
                {
                  type: 'text',
                  as: 'p',
                  class: 'text-sm @md:text-base text-muted-foreground',
                  text: 'Cross-functional strategists, designers, and engineers embedded with your roadmap.',
                },
                {
                  type: 'view',
                  class: 'grid gap-6 @md:grid-cols-2 @lg:grid-cols-3 text-left',
                  children: [
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-6 shadow-sm gap-3',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-lg font-semibold text-foreground',
                          text: 'Lestari Putri — Design Director',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Former Tokopedia & Gojek design lead guiding product launches at scale.',
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-6 shadow-sm gap-3',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-lg font-semibold text-foreground',
                          text: 'Jonathan Lee — Head of Engineering',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Architects resilient Next.js and Webflow ecosystems with observability baked in.',
                        },
                      ],
                    },
                    {
                      type: 'vstack',
                      class:
                        'rounded-xl border border-border bg-card p-6 shadow-sm gap-3',
                      children: [
                        {
                          type: 'text',
                          as: 'h3',
                          class: 'text-lg font-semibold text-foreground',
                          text: 'Rika Pradipta — Growth Strategist',
                        },
                        {
                          type: 'text',
                          as: 'p',
                          class: 'text-sm text-muted-foreground',
                          text: 'Scaled acquisition for unicorn SaaS teams across SEA and North America.',
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
          id: 'about-cta',
          type: 'section',
          class:
            'bg-foreground text-background py-16 @md:py-20 px-4 @md:px-6 @lg:px-8',
          children: [
            {
              type: 'vstack',
              class:
                'container mx-auto max-w-3xl items-center gap-6 text-center',
              children: [
                {
                  type: 'text',
                  as: 'h2',
                  class: 'text-3xl @md:text-4xl font-semibold tracking-tight',
                  text: 'Want to partner with us?',
                },
                {
                  type: 'text',
                  as: 'p',
                  class: 'text-sm @md:text-base text-background/80',
                  text: 'We open a limited number of new client slots each quarter to maintain quality.',
                },
                {
                  type: 'hstack',
                  class: 'flex-wrap justify-center gap-3',
                  children: [
                    {
                      type: 'button',
                      text: 'Start a project',
                      action: {
                        kind: 'link',
                        href: '/contact',
                        target: '_self',
                      },
                    },
                    {
                      type: 'link',
                      text: 'Download our deck',
                      class:
                        'text-sm font-medium underline-offset-4 hover:underline',
                      action: {
                        kind: 'link',
                        href: '/deck.pdf',
                        target: '_blank',
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
  },
};
