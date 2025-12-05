import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { basicCard, sectionContainer } from './section-utils';

export const statsSections: SectionTemplate[] = [
  {
    id: 'stats-band',
    title: 'Stats Band',
    description:
      'Horizontal stat highlights to build credibility around outcomes.',
    preview: () => (
      <div className="bg-card flex flex-wrap items-center justify-between gap-3 rounded-lg border p-2 text-xs">
        {[
          ['8.5x', 'Average ROI in first quarter'],
          ['320+', 'Onboarded GTM teams'],
        ].map(([metric, label]) => (
          <div key={metric} className="space-y-1 text-left">
            <p className="text-foreground font-semibold">{metric}</p>
            <p className="text-muted-foreground font-semibold tracking-[0.2em] uppercase">
              {label}
            </p>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'Proof it works',
      'Metrics from the teams we partner with across SaaS, fintech, and marketplaces.',
      {
        type: 'view',
        class:
          'grid gap-6 md:grid-cols-3 rounded-xl border border-border bg-card px-6 py-8',
        children: [
          basicCard(
            '8.5x ROI',
            'Average return on investment within the first quarter after launch.',
          ),
          basicCard(
            '320+ teams',
            'Revenue, product, and marketing teams onboarded across 14 timezones.',
          ),
          basicCard(
            '98% CSAT',
            'Customer satisfaction score across enablement, design, and launch engagements.',
          ),
        ],
      },
      { centered: true },
    ),
  },
];
