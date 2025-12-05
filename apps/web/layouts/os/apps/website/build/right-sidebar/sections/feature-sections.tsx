import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { basicCard, previewCard, sectionContainer } from './section-utils';

export const featureSections: SectionTemplate[] = [
  {
    id: 'feature-checklist',
    title: 'Feature Checklist',
    description: 'Short benefit list with primary and secondary actions.',
    preview: () => (
      <div className="bg-card flex flex-col gap-2 rounded-lg border p-2 text-left text-xs">
        <h4 className="text-foreground font-semibold">Why teams choose us</h4>
        <ul className="text-muted-foreground space-y-1.5">
          <li>• Unified workflows across revenue and product teams</li>
        </ul>
      </div>
    ),
    template: sectionContainer(
      'Why teams choose us',
      'SaaS, fintech, and marketplace teams trust us to design the operating system behind their growth.',
      {
        type: 'view',
        class:
          'grid gap-4 rounded-xl border border-border bg-card p-6 md:grid-cols-2 items-center',
        children: [
          basicCard(
            'Unified workflows',
            'Revenue, product, and success teams stay aligned in one workspace.',
          ),
          {
            type: 'vstack',
            class: 'gap-3 items-start',
            children: [
              {
                type: 'button',
                text: 'Start your trial',
                class:
                  'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90',
                action: { kind: 'link', href: '#', target: '_self' },
              },
              {
                type: 'button',
                text: 'See customer stories',
                class:
                  'inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-semibold transition hover:bg-muted',
                action: { kind: 'link', href: '#', target: '_self' },
              },
            ],
          },
        ],
      },
      { centered: true, background: 'bg-muted/10' },
    ),
  },
  {
    id: 'feature-grid',
    title: 'Feature Grid',
    description:
      'Three-up feature highlights with icon, title, and supporting description.',
    preview: () => (
      <div className="grid gap-2 p-1 text-xs">
        {['Strategy'].map((label) =>
          previewCard(
            label,
            'Launch-ready artefacts and rituals tailored to your roadmap.',
          ),
        )}
      </div>
    ),
    template: sectionContainer(
      'What we can ship in a sprint',
      'From discovery to launch we orchestrate the moments that move the metrics that matter.',
      {
        type: 'view',
        class: 'grid gap-5 md:grid-cols-3 text-left',
        children: [
          basicCard(
            'Strategy',
            'Positioning, messaging, and competitive audits shaped into differentiated stories.',
            'Target',
          ),
          basicCard(
            'Design',
            'High-fidelity flows, components, and responsive specs ready for engineering.',
            'Palette',
          ),
          basicCard(
            'Delivery',
            'Activation campaigns, analytics setup, and experiment programs for go-live.',
            'Rocket',
          ),
        ],
      },
    ),
  },
  {
    id: 'integration-grid',
    title: 'Integration Grid',
    description:
      'Logo-style grid showcasing supported integrations or partners.',
    preview: () => (
      <div className="text-muted-foreground grid gap-2 text-xs">
        {['Snowflake', 'Fivetran'].map((name) => (
          <div
            key={name}
            className="border-border flex items-center justify-center rounded-md border p-2 text-xs font-semibold"
          >
            {name}
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'Works with the tools you already use',
      'Native integrations keep your go-to-market and product stack in sync from day one.',
      {
        type: 'view',
        class: 'grid gap-3 md:grid-cols-4 text-sm text-muted-foreground',
        children: [
          {
            type: 'text',
            as: 'span',
            text: 'Snowflake',
            class: 'rounded-md border border-border p-3 text-center',
          },
          {
            type: 'text',
            as: 'span',
            text: 'Fivetran',
            class: 'rounded-md border border-border p-3 text-center',
          },
          {
            type: 'text',
            as: 'span',
            text: 'Segment',
            class: 'rounded-md border border-border p-3 text-center',
          },
          {
            type: 'text',
            as: 'span',
            text: 'Salesforce',
            class: 'rounded-md border border-border p-3 text-center',
          },
          {
            type: 'text',
            as: 'span',
            text: 'Posthog',
            class: 'rounded-md border border-border p-3 text-center',
          },
          {
            type: 'text',
            as: 'span',
            text: 'Mixpanel',
            class: 'rounded-md border border-border p-3 text-center',
          },
          {
            type: 'text',
            as: 'span',
            text: 'Braze',
            class: 'rounded-md border border-border p-3 text-center',
          },
          {
            type: 'text',
            as: 'span',
            text: 'Slack',
            class: 'rounded-md border border-border p-3 text-center',
          },
        ],
      },
      { centered: true },
    ),
  },
];
