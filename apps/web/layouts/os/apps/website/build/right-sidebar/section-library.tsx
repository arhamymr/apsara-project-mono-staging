import { SectionTemplate } from '@/layouts/os/apps/website/template-schema';
import { comparisonSections } from './sections/comparison-sections';
import { contentSections } from './sections/content-sections';
import { faqSections } from './sections/faq-sections';
import { featureSections } from './sections/feature-sections';
import { formSections } from './sections/form-sections';
import { heroSections } from './sections/hero-sections';
import { mediaSections } from './sections/media-sections';
import { pricingSections } from './sections/pricing-sections';
import { processSections } from './sections/process-sections';
import { resourceSections } from './sections/resource-sections';
import { statsSections } from './sections/stats-sections';
import { teamSections } from './sections/team-sections';
import { testimonialSections } from './sections/testimonial-sections';

// Combine all sections into a single array
export const SECTION_LIBRARY: SectionTemplate[] = [
  ...heroSections,
  ...contentSections,
  ...featureSections,
  ...teamSections,
  ...testimonialSections,
  ...pricingSections,
  ...statsSections,
  ...processSections,
  ...mediaSections,
  ...resourceSections,
  ...faqSections,
  ...comparisonSections,
  ...formSections,
];
