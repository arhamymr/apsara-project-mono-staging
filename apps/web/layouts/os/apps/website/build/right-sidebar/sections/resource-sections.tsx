import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { basicCard, sectionContainer } from './section-utils';

export const resourceSections: SectionTemplate[] = [
  {
    id: 'resource-library',
    title: 'Resource Library',
    description:
      'Curated downloads or guides with descriptions and download actions.',
    preview: () => (
      <div className="grid gap-2 text-xs">
        {['Activation Playbook'].map((resource) => (
          <div
            key={resource}
            className="border-border flex flex-col gap-1.5 rounded-lg border p-2 text-left"
          >
            <p className="text-foreground font-semibold">{resource}</p>
            <p className="text-muted-foreground">
              Tactical templates to spin up high-performing growth motions
              quickly.
            </p>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'Resource library',
      'Templates and guides our customers rely on to accelerate customer activation and retention.',
      {
        type: 'view',
        class: 'grid gap-5 md:grid-cols-3 text-left',
        children: [
          basicCard(
            'Activation Playbook',
            'Step-by-step workflow for orchestrating onboarding journeys.',
          ),
          basicCard(
            'Lifecycle Checklist',
            'Ensure every new release is enabled, measured, and iterated upon.',
          ),
          basicCard(
            'Experiment Tracker',
            'A single place for hypotheses, results, and learnings.',
          ),
        ],
      },
    ),
  },
];
