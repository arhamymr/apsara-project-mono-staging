import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { basicCard, sectionContainer } from './section-utils';

export const testimonialSections: SectionTemplate[] = [
  {
    id: 'testimonial-stack',
    title: 'Testimonials Stack',
    description: 'Two stacked quotes with attribution and company names.',
    preview: () => (
      <div className="space-y-2 text-xs">
        {[
          ['"Retention jumped 29% post-launch."', 'Lila Hart — COO, Nova'],
          [
            '"Velocity doubled without sacrificing quality."',
            'Jon Reyes — VP Product, Arclight',
          ],
        ].map(([quote, author]) => (
          <div
            key={quote}
            className="border-border bg-card flex flex-col gap-1.5 rounded-lg border text-left"
          >
            <p className="text-foreground font-semibold">{quote}</p>
            <p className="text-muted-foreground">{author}</p>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'Teams that grow with Apsara',
      'We embed with product-led companies to ship high-impact experiences fast.',
      {
        type: 'vstack',
        class: 'gap-4',
        children: [
          basicCard(
            '"Retention jumped 29% post-launch."',
            'Lila Hart — COO, Nova',
          ),
          basicCard(
            '"Velocity doubled without sacrificing quality."',
            'Jon Reyes — VP Product, Arclight',
          ),
        ],
      },
      { background: 'bg-muted/20' },
    ),
  },
  {
    id: 'testimonial-band',
    title: 'Testimonial Band',
    description:
      'Quote wall with attribution and supporting context to build social proof.',
    preview: () => (
      <div className="bg-muted/30 flex flex-col gap-2 rounded-lg text-left text-xs">
        <p className="text-muted-foreground font-semibold tracking-[0.25em] uppercase">
          Client story
        </p>
        <p className="text-foreground font-semibold">
          "Apsara shipped our new marketing site in five weeks and conversions
          jumped 32%."
        </p>
        <p className="text-muted-foreground">
          Maya Setiawan — VP Marketing, Nimbus Labs
        </p>
      </div>
    ),
    template: sectionContainer(
      'Loved by product-led teams',
      'We plug into your roadmap, workflows, and culture to deliver outcomes your customers feel.',
      {
        type: 'vstack',
        class: 'gap-3 rounded-xl border border-border bg-card p-6 text-left',
        children: [
          {
            type: 'text',
            as: 'blockquote',
            text: '"Apsara shipped our new marketing site in five weeks and conversions jumped 32%."',
            class: 'text-lg font-medium text-foreground',
          },
          {
            type: 'text',
            as: 'p',
            text: 'Maya Setiawan — VP Marketing, Nimbus Labs',
            class: 'text-xs text-muted-foreground',
          },
        ],
      },
      { centered: true, background: 'bg-muted/20' },
    ),
  },
];
