import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { basicCard, previewCard, sectionContainer } from './section-utils';

export const pricingSections: SectionTemplate[] = [
  {
    id: 'pricing-simple',
    title: 'Pricing Simple',
    description:
      'Three-column pricing grid with highlighted plan and key features.',
    preview: () => (
      <div className="grid gap-2 text-xs">
        {['Starter'].map((plan, idx) =>
          previewCard(
            plan,
            idx === 2
              ? "Let's talk custom scope and SLAs."
              : 'Everything you need to get results.',
          ),
        )}
      </div>
    ),
    template: sectionContainer(
      'Simple, predictable pricing',
      'Choose the plan that fits your stage. Upgrade or downgrade at any time.',
      {
        type: 'view',
        class: 'grid gap-5 md:grid-cols-3 text-left',
        children: [
          {
            type: 'vstack',
            class:
              'gap-3 rounded-xl border border-border bg-card p-6 shadow-sm',
            children: [
              {
                type: 'text',
                as: 'p',
                text: 'Starter',
                class:
                  'text-xs uppercase tracking-[0.3em] text-muted-foreground',
              },
              {
                type: 'text',
                as: 'p',
                text: '$49',
                class: 'text-3xl font-semibold',
              },
              basicCard(
                'Included',
                'Unlimited workspaces, email support, basic analytics.',
              ),
              {
                type: 'button',
                text: 'Choose plan',
                class:
                  'inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold transition hover:bg-muted',
                action: { kind: 'link', href: '#', target: '_self' },
              },
            ],
          },
          {
            type: 'vstack',
            class:
              'gap-3 rounded-xl border border-primary/40 bg-primary/5 p-6 shadow-md',
            children: [
              {
                type: 'text',
                as: 'p',
                text: 'Growth',
                class: 'text-xs uppercase tracking-[0.3em] text-primary',
              },
              {
                type: 'text',
                as: 'p',
                text: '$149',
                class: 'text-3xl font-semibold',
              },
              basicCard(
                'Included',
                'Everything in Starter plus workflow automation and success manager.',
              ),
              {
                type: 'button',
                text: 'Start trial',
                class:
                  'inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90',
                action: { kind: 'link', href: '#', target: '_self' },
              },
            ],
          },
          {
            type: 'vstack',
            class:
              'gap-3 rounded-xl border border-border bg-card p-6 shadow-sm',
            children: [
              {
                type: 'text',
                as: 'p',
                text: 'Enterprise',
                class:
                  'text-xs uppercase tracking-[0.3em] text-muted-foreground',
              },
              {
                type: 'text',
                as: 'p',
                text: "Let's talk",
                class: 'text-3xl font-semibold',
              },
              basicCard(
                'Tailored',
                'Advanced permissions, dedicated support SLA, custom integrations.',
              ),
              {
                type: 'button',
                text: 'Talk to sales',
                class:
                  'inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold transition hover:bg-muted',
                action: { kind: 'link', href: '#', target: '_self' },
              },
            ],
          },
        ],
      },
      { centered: true },
    ),
  },
];
