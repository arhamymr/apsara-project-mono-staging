import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { sectionContainer } from './section-utils';

export const formSections: SectionTemplate[] = [
  {
    id: 'newsletter-optin',
    title: 'Newsletter Opt-in',
    description:
      'One-field signup block with privacy note and benefit statement.',
    preview: () => (
      <div className="bg-muted/20 flex flex-col gap-2 rounded-lg text-left text-xs">
        <p className="text-foreground font-semibold">
          Join 9,000+ product operators
        </p>
        <p className="text-muted-foreground">
          A monthly dose of growth frameworks, templates, and experiments.
        </p>
        <div className="bg-background text-muted-foreground flex items-center gap-2 rounded-md border p-2 text-xs">
          your@email.com
          <span className="text-primary ml-auto font-semibold">Subscribe</span>
        </div>
      </div>
    ),
    template: sectionContainer(
      'Join 9,000+ product operators',
      'A short, useful update each month. No spam, ever.',
      {
        type: 'vstack',
        class: 'gap-3 items-center',
        children: [
          {
            type: 'view',
            class:
              'bg-background flex w-full max-w-lg items-center gap-3 rounded-md border border-border px-4 py-2',
            children: [
              {
                type: 'text',
                as: 'p',
                text: 'your@email.com',
                class: 'text-sm text-muted-foreground',
              },
              {
                type: 'button',
                text: 'Subscribe',
                class:
                  'inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90',
                action: { kind: 'link', href: '#', target: '_self' },
              },
            ],
          },
          {
            type: 'text',
            as: 'p',
            text: 'No spam. Unsubscribe at any time.',
            class: 'text-xs text-muted-foreground',
          },
        ],
      },
      { centered: true, background: 'bg-muted/15' },
    ),
  },
];
