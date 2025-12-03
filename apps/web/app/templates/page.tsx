'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Footer, TopNav } from '@/components/home/sections';
import { TemplatesGrid } from '@/components/templates';
import { Button } from '@workspace/ui/components/button';
import { useLocale } from '@/i18n/LocaleContext';
import { TEMPLATES_STRINGS } from '@/i18n/templates';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
        <Section className="py-16 lg:py-24">
          <TemplatesGrid strings={s} />
        </Section>
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

function CTASection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section className="relative overflow-hidden py-20 lg:py-28">
      <div className="from-primary/5 via-primary/10 to-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-r" />
      <div className="relative container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            {...fadeUp}
            className="text-foreground text-3xl tracking-tight md:text-4xl lg:text-5xl"
          >
            {s.cta.title}
          </motion.h2>

          <motion.p
            {...fadeUp}
            className="text-muted-foreground mx-auto mt-4 max-w-xl text-lg"
          >
            {s.cta.subtitle}
          </motion.p>

          <motion.div
            {...fadeUp}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="gap-2">
              <Link href="/register">
                {s.cta.primaryButton}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">{s.cta.secondaryButton}</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
