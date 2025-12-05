import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { sectionContainer } from './section-utils';

export const mediaSections: SectionTemplate[] = [
  {
    id: 'gallery-showcase',
    title: 'Gallery Showcase',
    description:
      'Three images or product screenshots with supporting captions.',
    preview: () => (
      <div className="grid gap-2 text-xs">
        {['Campaign dashboard'].map((caption) => (
          <div
            key={caption}
            className="border-border flex flex-col gap-1.5 rounded-lg border p-2 text-left"
          >
            <div className="bg-muted text-muted-foreground flex h-32 items-center justify-center rounded-md text-xs">
              Image placeholder
            </div>
            <p className="text-muted-foreground font-semibold">{caption}</p>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'Recent product work',
      'Snapshots from recent launches across SaaS, fintech, and marketplace products.',
      {
        type: 'view',
        class: 'grid gap-5 md:grid-cols-3 text-left',
        children: [
          {
            type: 'image',
            src: 'https://placehold.co/600x400',
            alt: 'Campaign dashboard',
            class: 'rounded-lg object-cover',
          },
          {
            type: 'image',
            src: 'https://placehold.co/600x400?text=Customer+Journeys',
            alt: 'Customer journeys',
            class: 'rounded-lg object-cover',
          },
          {
            type: 'image',
            src: 'https://placehold.co/600x400?text=Insights+Hub',
            alt: 'Insights hub',
            class: 'rounded-lg object-cover',
          },
        ],
      },
    ),
  },
  {
    id: 'video-spotlight',
    title: 'Video Spotlight',
    description:
      'Screenshot and supporting copy for an embedded video or demo.',
    preview: () => (
      <div className="grid gap-2 text-xs md:grid-cols-2">
        <div className="bg-muted text-muted-foreground flex h-full items-center justify-center rounded-sm text-xs">
          Thumbnail
        </div>
        <div className="text-left text-xs">
          <p className="text-foreground font-semibold">
            Inside the operating system
          </p>
          <p className="text-muted-foreground">
            Walk through campaign orchestration...
          </p>
        </div>
      </div>
    ),
    template: sectionContainer(
      'See the operating system in action',
      'A quick walkthrough of how growth, product, and success teams collaborate inside Apsara.',
      {
        type: 'view',
        class: 'grid gap-6 md:grid-cols-2 items-center',
        children: [
          {
            type: 'image',
            src: 'https://placehold.co/800x500?text=Video',
            alt: 'Product demo video placeholder',
            class: 'rounded-lg object-cover',
          },
          {
            type: 'vstack',
            class: 'gap-3 text-left',
            children: [
              {
                type: 'text',
                as: 'h3',
                text: 'Inside the operating system',
                class: 'text-base font-semibold',
              },
              {
                type: 'text',
                as: 'p',
                text: 'Walk through campaign orchestration, reporting, and experimentation flows in 6 minutes.',
                class: 'text-sm text-muted-foreground',
              },
              {
                type: 'button',
                text: 'Watch demo',
                class:
                  'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90',
                action: { kind: 'link', href: '#', target: '_self' },
              },
            ],
          },
        ],
      },
    ),
  },
];
