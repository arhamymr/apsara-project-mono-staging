import type { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { basicCard, sectionContainer } from './section-utils';

export const faqSections: SectionTemplate[] = [
  {
    id: 'faq-block',
    title: 'FAQ Block',
    description:
      'Simple accordion-like layout for product FAQs without interactivity.',
    preview: () => (
      <div className="space-y-2 text-xs">
        {[
          [
            'How long does onboarding take?',
            'Most teams are live within 3 weeks with dedicated enablement.',
          ],
        ].map(([q, a]) => (
          <div key={q} className="rounded-lg border p-2 text-left">
            <p className="text-foreground font-semibold">{q}</p>
            <p className="text-muted-foreground leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    ),
    template: sectionContainer(
      'Frequently asked questions',
      'Everything you need to know about teaming up with Apsara.',
      {
        type: 'view',
        class: 'grid gap-4 text-left',
        children: [
          basicCard(
            'How long does onboarding take?',
            'Most teams are fully live within 3 weeks with dedicated enablement resources.',
          ),
          basicCard(
            'Can we connect our data warehouse?',
            'Yes, we maintain native connectors for Snowflake, BigQuery, Redshift, and Postgres.',
          ),
          basicCard(
            'Is there a pilot program?',
            'We offer a 14-day sandbox environment for pilot teams to validate workflows.',
          ),
        ],
      },
      { background: 'bg-muted/15' },
    ),
  },
];
