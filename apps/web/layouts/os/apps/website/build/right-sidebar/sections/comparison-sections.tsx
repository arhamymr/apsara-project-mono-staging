import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { basicCard, sectionContainer } from './section-utils';

export const comparisonSections: SectionTemplate[] = [
  {
    id: 'comparison-table',
    title: 'Comparison Table',
    description:
      'Simple competitor comparison with three highlighted differentiators.',
    preview: () => (
      <div className="grid gap-2 text-xs md:grid-cols-3">
        {['Apsara', 'In-house', 'Point tools'].map((column) => (
          <div
            key={column}
            className="border-border flex flex-col gap-1.5 rounded-lg border text-left"
          >
            <p className="text-foreground font-semibold">{column}</p>
            <p className="text-muted-foreground">
              Strategic alignment, automation, and experimentation under one
              roof.
            </p>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'Why teams consolidate with Apsara',
      'Compare how we stack up against in-house builds and a patchwork of point solutions.',
      {
        type: 'view',
        class: 'grid gap-4 md:grid-cols-3 text-left',
        children: [
          basicCard(
            'Apsara',
            'Unified workflows, expert team, time-to-value measured in weeks.',
          ),
          basicCard(
            'In-house builds',
            'Competing priorities, bandwidth constraints, slower time-to-value.',
          ),
          basicCard(
            'Point tools',
            'Fragmented data, inconsistent experiments, higher operational overhead.',
          ),
        ],
      },
    ),
  },
];
