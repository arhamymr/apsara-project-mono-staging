'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Footer, TopNav } from '@/components/home/sections';
import { TemplatesGrid } from '@/components/templates';
import { Badge } from '@workspace/ui/components/badge';
import { useLocale } from '@/i18n/LocaleContext';
import { TEMPLATES_STRINGS } from '@/i18n/templates';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

function useStrings() {
  const { lang } = useLocale();
  return TEMPLATES_STRINGS[lang as keyof typeof TEMPLATES_STRINGS];
}

export default function TemplatesPage() {
  const s = useStrings();

  return (
    <div className="bg-background text-foreground min-h-dvh">
      <TopNav />
      <main id="main-content">
        <HeroSection />
        <Section className="py-16 lg:py-24">
          <TemplatesGrid strings={s} />
        </Section>
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section className="relative overflow-hidden pt-32 pb-16 lg:pt-40 lg:pb-20">
      <div className="from-primary/5 via-background to-background pointer-events-none absolute inset-0 bg-gradient-to-b" />
      <div className="relative container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-8 px-4 py-2 text-sm font-medium"
            >
              <Package className="mr-2 h-4 w-4" />
              Templates
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            className="text-foreground text-4xl leading-[1.1] font-normal tracking-tight md:text-5xl lg:text-6xl"
          >
            {s.hero.title}
          </motion.h1>

          <motion.p
            {...fadeUp}
            className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed"
          >
            {s.hero.subtitle}
          </motion.p>
        </div>
      </div>
    </Section>
  );
}
