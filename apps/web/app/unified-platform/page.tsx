'use client';

import { Background, Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Footer, TopNav } from '@/components/home/sections';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MagicCard } from '@/components/ui/magic-card';
import { useLocale } from '@/i18n/LocaleContext';
import { UNIFIED_PLATFORM_STRINGS } from '@/i18n/unified-platform';
import { motion } from 'framer-motion';
import { Code, CreditCard, LayoutDashboard, Users, Zap } from 'lucide-react';

function useStrings() {
  const { lang } = useLocale();
  return UNIFIED_PLATFORM_STRINGS[lang];
}

export default function UnifiedPlatform() {
  return (
    <div className="bg-background text-foreground relative min-h-dvh">
      <Background />
      <TopNav />
      <main id="main-content" className="pt-20">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section className="relative overflow-hidden pt-20 pb-32">
      <div className="container mx-auto px-4">
        <motion.div
          {...fadeUp}
          className="flex flex-col items-center text-center"
        >
          <Badge
            variant="outline"
            className="border-primary/50 text-primary mb-6 px-4 py-1.5 text-sm"
          >
            Unified Platform
          </Badge>
          <h1 className="text-foreground max-w-4xl text-center text-4xl tracking-tight text-balance md:text-7xl">
            {s.hero.title}
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-center text-lg leading-relaxed md:text-xl">
            {s.hero.subtitle}
          </p>
          <div className="mt-10">
            <Button size="lg" className="h-12 px-8 text-base" asChild>
              <a
                href={`https://wa.me/6289669594959?text=${encodeURIComponent(
                  s.hero.whatsapp_message,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.hero.cta}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function FeaturesSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  const icons = {
    LayoutDashboard,
    Users,
    CreditCard,
    Code,
  };

  return (
    <Section className="bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mb-16 text-center">
          <h2 className="text-3xl tracking-tight md:text-5xl">
            {s.features.title}
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            {s.features.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {s.features.list.map(
            (
              feature: { title: string; description: string; icon: string },
              i: number,
            ) => {
              const Icon = icons[feature.icon as keyof typeof icons] || Zap;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <MagicCard
                    className="flex h-full flex-col items-center p-6 text-center"
                    gradientColor="hsl(var(--primary) / 0.15)"
                  >
                    <div className="bg-primary/10 text-primary mb-6 flex h-12 w-12 items-center justify-center rounded-full">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-3 text-xl">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </MagicCard>
                </motion.div>
              );
            },
          )}
        </div>
      </div>
    </Section>
  );
}

function CTASection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          {...fadeUp}
          className="bg-primary text-primary-foreground relative overflow-hidden rounded-3xl px-6 py-20 text-center sm:px-12 lg:px-16"
        >
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="text-3xl tracking-tight md:text-4xl">
              {s.cta.title}
            </h2>
            <p className="text-primary-foreground/80 mt-4 text-lg">
              {s.cta.subtitle}
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 px-8 text-base"
                asChild
              >
                <a
                  href={`https://wa.me/6289669594959?text=${encodeURIComponent(
                    s.hero.whatsapp_message,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.cta.button}
                </a>
              </Button>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute top-0 left-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        </motion.div>
      </div>
    </Section>
  );
}
