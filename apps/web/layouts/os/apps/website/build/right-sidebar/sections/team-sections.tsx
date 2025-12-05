import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { basicCard, sectionContainer } from './section-utils';

export const teamSections: SectionTemplate[] = [
  {
    id: 'team-grid',
    title: 'Team Grid',
    description:
      'Team member cards with role, description, and optional social link.',
    preview: () => (
      <div className="grid gap-2 text-xs">
        {['Amelia Chen'].map((name, idx) => (
          <div
            key={name}
            className="border-border item-center flex flex-col justify-center gap-1.5 rounded-lg border p-2 text-left"
          >
            <div className="bg-muted/60 flex size-8 items-center justify-center rounded-full text-xs font-semibold uppercase">
              {name
                .split(' ')
                .map((part) => part[0])
                .join('')}
            </div>
            <p className="text-foreground font-semibold">{name}</p>
            <p className="text-muted-foreground">
              {
                ['Product Strategy', 'Design Systems', 'Lifecycle Marketing'][
                  idx
                ]
              }
            </p>
            <p className="text-muted-foreground">
              Shipping customer-loved experiences across GTM and product teams.
            </p>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'Meet the team',
      'A small, senior team that lives at the intersection of product, design, and growth.',
      {
        type: 'view',
        class: 'grid gap-6 md:grid-cols-3 text-left',
        children: [
          basicCard(
            'Amelia Chen — Strategy',
            'Orchestrates positioning and go-to-market messaging for launch.',
          ),
          basicCard(
            'Rahul Singh — Design',
            'Builds accessible systems and product experiences that scale.',
          ),
          basicCard(
            'Nia Gonzalez — Lifecycle',
            'Designs retention programs that build trust and reduce churn.',
          ),
        ],
      },
      { background: 'bg-muted/10', centered: true },
    ),
  },
  {
    id: 'contact-panel',
    title: 'Contact Panel',
    description:
      'Regional office addresses, email, and a calendar call to action.',
    preview: () => (
      <div className="grid gap-2 text-xs">
        {[['Email', 'hello@apsara.co']].map(([label, value]) => (
          <div
            key={label}
            className="border-border flex flex-col gap-1.5 rounded-lg border p-2 text-left"
          >
            <p className="text-muted-foreground font-semibold tracking-[0.25em] uppercase">
              {label}
            </p>
            <p className="text-foreground font-semibold">{value}</p>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'Let’s connect',
      'We’d love to learn about your roadmap. Reach out or grab time directly.',
      {
        type: 'view',
        class: 'grid gap-4 md:grid-cols-3 text-left',
        children: [
          basicCard('Email', 'hello@apsara.co'),
          basicCard('San Francisco', 'Pier 70, Building 12'),
          basicCard('Singapore', '79 Robinson Road, #12-01'),
        ],
      },
    ),
  },
  {
    id: 'support-cta',
    title: 'Support CTA',
    description:
      'Support contact cards with live chat and documentation links.',
    preview: () => (
      <div className="bg-card flex flex-col gap-2 rounded-lg border text-left text-xs">
        <p className="text-foreground font-semibold">Need a hand?</p>
        <p className="text-muted-foreground">
          Live chat, documentation, and a dedicated success manager keep your
          team moving.
        </p>
      </div>
    ),
    template: sectionContainer(
      'Need a hand?',
      'Live chat, documentation, and a dedicated success manager keep your team moving.',
      {
        type: 'view',
        class: 'grid gap-4 md:grid-cols-3 text-left',
        children: [
          basicCard(
            'Live chat',
            'In-app assistance available 18 hours a day across North America and Asia.',
            'MessageCircle',
          ),
          basicCard(
            'Documentation',
            'Step-by-step guides, API references, and best practices for every workflow.',
            'BookOpen',
          ),
          basicCard(
            'Success manager',
            'Quarterly reviews and roadmap planning for customers on Growth and Enterprise.',
            'UserCheck',
          ),
        ],
      },
      { background: 'bg-muted/20' },
    ),
  },
];
