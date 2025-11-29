import { useLocale } from '../LocaleContext';
import type { Lang } from '../types';

import { BLOG_STRINGS } from './blog';
import { CTA_STRINGS } from './cta';
import { FAQ_STRINGS } from './faq';
import { FEATURES_STRINGS } from './features';
import { FOOTER_STRINGS } from './footer';
import { HERO_STRINGS } from './hero';
import { INTEGRATIONS_STRINGS } from './integrations';
import { PREVIEW_STRINGS } from './preview';
import { PRICING_STRINGS } from './pricing';
import { TESTIMONIALS_STRINGS } from './testimonials';
import { TOP_NAV_STRINGS } from './topNav';

export * from './blog';
export * from './cta';
export * from './faq';
export * from './features';
export * from './footer';
export * from './hero';
export * from './integrations';
export * from './preview';
export * from './pricing';
export * from './testimonials';
export * from './topNav';

export const LANDING_STRINGS: Record<Lang, any> = {
  en: {
    topNav: TOP_NAV_STRINGS.en,
    hero: HERO_STRINGS.en,
    features: FEATURES_STRINGS.en,
    preview: PREVIEW_STRINGS.en,
    integrations: INTEGRATIONS_STRINGS.en,
    testimonials: TESTIMONIALS_STRINGS.en,
    pricing: PRICING_STRINGS.en,
    faq: FAQ_STRINGS.en,
    cta: CTA_STRINGS.en,
    footer: FOOTER_STRINGS.en,
    blog: BLOG_STRINGS.en,
  },
  id: {
    topNav: TOP_NAV_STRINGS.id,
    hero: HERO_STRINGS.id,
    features: FEATURES_STRINGS.id,
    preview: PREVIEW_STRINGS.id,
    integrations: INTEGRATIONS_STRINGS.id,
    testimonials: TESTIMONIALS_STRINGS.id,
    pricing: PRICING_STRINGS.id,
    faq: FAQ_STRINGS.id,
    cta: CTA_STRINGS.id,
    footer: FOOTER_STRINGS.id,
    blog: BLOG_STRINGS.id,
  },
};

export function useLandingStrings() {
  const { lang } = useLocale();
  return LANDING_STRINGS[lang];
}
