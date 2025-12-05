import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { basicCard, sectionContainer } from './section-utils';

export const processSections: SectionTemplate[] = [
  {
    id: 'process-steps',
    title: 'Process Steps',
    description: 'Three-step timeline that explains the delivery approach.',
    preview: () => (
      <div className="grid gap-2 text-xs">
        {['Discover'].map((step, idx) => (
          <div
            key={step}
            className="border-border flex flex-col gap-1.5 rounded-lg border p-2 text-left"
          >
            <span className="bg-primary/10 text-primary inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold">
              {idx + 1}
            </span>
            <p className="text-foreground font-semibold">{step}</p>
            <p className="text-muted-foreground">
              Align on outcomes, iterate quickly, and deliver measurable wins.
            </p>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'How we work together',
      'A repeatable playbook refined across hundreds of product and go-to-market engagements.',
      {
        type: 'view',
        class: 'grid gap-6 md:grid-cols-3 text-left',
        children: [
          basicCard(
            'Discover',
            'Align on success metrics, audience insights, and desired business outcomes.',
          ),
          basicCard(
            'Design',
            'Prototype solutions, validate with stakeholders, and iterate quickly pre-build.',
          ),
          basicCard(
            'Launch',
            'Instrument, roll-out, and enable teams with repeatable experimentation frameworks.',
          ),
        ],
      },
    ),
  },
  {
    id: 'timeline-milestones',
    title: 'Timeline Milestones',
    description: 'Vertical timeline for key milestones or roadmap phases.',
    preview: () => (
      <div className="bg-card flex flex-col gap-2 rounded-lg border text-left text-xs">
        {['Kickoff'].map((phase) => (
          <div key={phase} className="flex items-start gap-2 p-2">
            <span className="bg-primary/10 text-primary mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full p-2 text-[10px] font-semibold">
              ●
            </span>
            <div>
              <p className="text-foreground font-semibold">{phase}</p>
              <p className="text-muted-foreground">
                Align success metrics, validate solutions, and roll-out with
                enablement.
              </p>
            </div>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'From kickoff to go-live',
      'We keep a tight pace and transparent milestone communication throughout the engagement.',
      {
        type: 'vstack',
        class: 'gap-4',
        children: [
          basicCard(
            'Kickoff',
            'Align on stakeholders, goals, and ways of working.',
          ),
          basicCard(
            'Prototype',
            'Test ideas quickly with product, design, and customer teams.',
          ),
          basicCard(
            'Launch',
            'Instrument, launch, and train teams with detailed playbooks.',
          ),
        ],
      },
    ),
  },
  {
    id: 'roadmap-preview',
    title: 'Roadmap Preview',
    description: 'Upcoming initiatives with status tags and timelines.',
    preview: () => (
      <div className="space-y-2 text-left text-xs">
        {[
          ['Q1 • Live', 'Lifecycle orchestration'],
          ['Q2 • In progress', 'Experiment automation beta'],
        ].map(([meta, item]) => (
          <div
            key={item}
            className="border-border flex items-center justify-between gap-2 rounded-md border p-2 text-xs"
          >
            <span className="text-muted-foreground">{meta}</span>
            <span className="text-foreground font-semibold">{item}</span>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'What’s coming next',
      'A transparent look at the investments shipping over the next three quarters.',
      {
        type: 'vstack',
        class: 'gap-3',
        children: [
          basicCard(
            'Q1 • Live',
            'Lifecycle orchestration templates for onboarding, activation, and retention.',
          ),
          basicCard(
            'Q2 • In progress',
            'Experiment automation beta with guardrails and auto-reporting.',
          ),
          basicCard(
            'Q3 • Planned',
            'Advanced reporting overlays with executive-level summaries.',
          ),
        ],
      },
      { background: 'bg-muted/10' },
    ),
  },
];
