import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { sectionContainer } from './section-utils';

export const heroSections: SectionTemplate[] = [
  {
    id: 'hero-callout',
    title: 'Hero Callout',
    description:
      'Centered hero with eyebrow, headline, supporting copy, and primary call-to-action.',
    preview: () => (
      <div className="space-y-2 text-center text-xs">
        <p className="text-primary font-semibold tracking-[0.35em] uppercase">
          Featured launch
        </p>
        <h4 className="text-foreground font-semibold">
          Ship new experiences in weeks, not months.
        </h4>
        <p className="text-muted-foreground">
          Strategy, design, and engineering in a single sprint-ready pod.
        </p>
        <div className="flex justify-center">
          <span className="bg-primary text-primary-foreground inline-flex h-7 items-center rounded-md px-3 text-xs font-semibold">
            Book a discovery call
          </span>
        </div>
      </div>
    ),
    template: sectionContainer(
      'Ship new experiences in weeks, not months.',
      'Strategy, design, and engineering unified in a single sprint-ready pod.',
      {
        type: 'vstack',
        class: 'gap-4 text-center',
        children: [
          {
            type: 'text',
            as: 'p',
            text: 'Featured Launch',
            class: 'text-xs uppercase tracking-[0.35em] text-primary',
          },
          {
            type: 'button',
            text: 'Book a discovery call',
            class:
              'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90',
            action: { kind: 'link', href: '#', target: '_self' },
          },
        ],
      },
      { centered: true, background: 'bg-muted/20' },
    ),
  },
  {
    id: 'value-prop-split',
    title: 'Value Proposition Split',
    description:
      'Two-column hero with value list and supporting metric for B2B offerings.',
    preview: () => (
      <div className="grid gap-3 text-xs md:grid-cols-2">
        <div className="space-y-2 text-left">
          <p className="text-primary font-semibold tracking-[0.3em] uppercase">
            Platform
          </p>
          <h4 className="text-foreground font-semibold">Operate smarter...</h4>
          <ul className="text-muted-foreground space-y-1.5">
            <li>• Cohort health...</li>
          </ul>
        </div>
        <div className="bg-primary/10 text-primary flex items-center justify-center rounded-md text-xs">
          <div className="space-y-1.5 p-1 text-center">
            <p className="text-primary font-semibold">42%</p>
            <p className="text-muted-foreground">Faster speed-to-insight</p>
          </div>
        </div>
      </div>
    ),
    template: sectionContainer(
      'Operate smarter with unified customer data',
      'Automate onboarding, activation, and retention with a single source of truth for your customer journeys.',
      {
        type: 'view',
        class: 'grid gap-6 md:grid-cols-2 text-left items-start',
        children: [
          {
            type: 'vstack',
            class: 'gap-3',
            children: [
              {
                type: 'text',
                as: 'p',
                text: '• Cohort health dashboards in minutes',
                class: 'text-sm text-muted-foreground',
              },
              {
                type: 'text',
                as: 'p',
                text: '• Integrates with 40+ analytics, CDP, and CRM platforms',
                class: 'text-sm text-muted-foreground',
              },
              {
                type: 'text',
                as: 'p',
                text: '• SOC2, GDPR, and HIPAA compliant out of the box',
                class: 'text-sm text-muted-foreground',
              },
            ],
          },
          {
            type: 'vstack',
            class:
              'gap-2 rounded-xl border border-primary/30 bg-primary/10 p-6 text-center',
            children: [
              {
                type: 'text',
                as: 'p',
                text: '42% faster insights',
                class: 'text-xl font-semibold text-primary',
              },
              {
                type: 'text',
                as: 'p',
                text: 'Teams unlock revenue experiments faster with unified data.',
                class: 'text-sm text-muted-foreground',
              },
            ],
          },
        ],
      },
    ),
  },
  {
    id: 'cta-band',
    title: 'Call-to-Action Band',
    description:
      'High-contrast strip with supporting copy and a single conversion action.',
    preview: () => (
      <div className="flex flex-col gap-2 rounded-lg border border-dashed p-1 text-center text-xs">
        <h4 className="font-semibold">
          Ready to ship something great together?
        </h4>
        <p>Share your goals and we will.</p>
        <div className="font-semibold">Schedule introduction →</div>
      </div>
    ),
    template: sectionContainer(
      'Ready to ship something great together?',
      'Share your goals and we will draft a tailored roadmap covering scope, timeline, and investment.',
      {
        type: 'button',
        text: 'Schedule introduction',
        class:
          'inline-flex items-center justify-center rounded-md bg-background px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-background/90',
        action: { kind: 'link', href: '/contact', target: '_self' },
      },
      { centered: true, background: 'bg-primary text-primary-foreground' },
    ),
  },
];
