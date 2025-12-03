'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { CallToAction, Footer, TopNav } from '@/components/home/sections';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useLocale } from '@/i18n/LocaleContext';
import { INSTAGRAM_POST_STRINGS } from '@/i18n/instagram-post';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Clock,
  Image,
  Palette,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';

function useStrings() {
  const { lang } = useLocale();
  return INSTAGRAM_POST_STRINGS[lang as keyof typeof INSTAGRAM_POST_STRINGS];
}

// Instagram purple/gradient theme
const instagramTheme = {
  '--primary': '#C13584',
  '--ring': '#C13584',
} as React.CSSProperties;

export default function InstagramPost() {
  const s = useStrings();

  return (
    <div className="bg-background text-foreground min-h-dvh" style={instagramTheme}>
      <TopNav />
      <main id="main-content">
        <HeroSection />
        <TrustBadges />
        <FeaturesSection />
        <ServicesSection />
        <PricingSection />
        <CallToAction
          title={s.cta.title}
          subtitle={s.cta.subtitle}
          buttonText={s.cta.button}
          whatsappMessage={s.hero.whatsapp_message}
          icon={Sparkles}
        />
      </main>
      <Footer />
    </div>
  );
}

function HeroSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="from-primary/5 via-background to-background pointer-events-none absolute inset-0 bg-gradient-to-b" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-8 px-4 py-2 text-sm font-medium"
            >
              <Image className="mr-2 h-4 w-4" />
              Instagram Post Design
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            className="text-foreground text-4xl leading-[1.1] font-medium tracking-tight md:text-6xl lg:text-7xl"
          >
            {s.hero.title}
          </motion.h1>

          <motion.p
            {...fadeUp}
            className="text-muted-foreground mx-auto mt-8 max-w-2xl text-lg leading-relaxed md:text-xl"
          >
            {s.hero.subtitle}
          </motion.p>

          <motion.div
            {...fadeUp}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" asChild>
              <a
                href={`https://wa.me/6289669594959?text=${encodeURIComponent(s.hero.whatsapp_message)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.hero.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#services">View Services</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

function TrustBadges() {
  const fadeUp = useFadeUp();
  const badges = [
    { icon: Zap, label: 'Fast Turnaround' },
    { icon: Shield, label: 'Unlimited Revisions' },
    { icon: Clock, label: '24-48h Delivery' },
    { icon: Sparkles, label: 'Custom Designs' },
  ];

  return (
    <Section className="border-border border-y py-8">
      <div className="container mx-auto px-4">
        <motion.div
          {...fadeUp}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {badges.map((badge) => (
            <div
              key={badge.label}
              className="text-muted-foreground flex items-center gap-3"
            >
              <badge.icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-sm font-medium">{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

function FeaturesSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">
            {s.features.title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            {s.features.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {s.features.list.map(
            (feature: { title: string; description: string }, i: number) => (
              <motion.div
                key={feature.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group border-border hover:border-foreground/30 bg-card/50 relative rounded-xl border p-8 transition-all duration-300"
              >
                <div className="bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                  <Palette className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-xl font-medium">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ),
          )}
        </div>
      </div>
    </Section>
  );
}

function ServicesSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section id="services" className="bg-muted/30 py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">
            {s.services.title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            {s.services.subtitle}
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {s.services.list.map(
              (service: { title: string; description: string }, i: number) => (
                <motion.div
                  key={service.title}
                  {...fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className="border-border bg-card hover:border-foreground/30 group rounded-xl border p-8 transition-all duration-300"
                >
                  <div className="bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                    <Image className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-3 text-lg font-medium">{service.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}


function PricingSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  const basicFeatures = s.pricing.basic.features as string[];
  const premiumFeatures = s.pricing.premium.features as string[];

  return (
    <Section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">
            {s.pricing.title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            {s.pricing.subtitle}
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          {/* Basic */}
          <motion.div
            {...fadeUp}
            className="border-border bg-card relative overflow-hidden rounded-xl border p-8 lg:p-10"
          >
            <div className="mb-8">
              <h3 className="text-muted-foreground mb-2 text-sm font-medium tracking-wider uppercase">
                {s.pricing.basic.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tight">
                  {s.pricing.basic.price}
                </span>
                <span className="text-muted-foreground">
                  {s.pricing.basic.unit}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 text-lg">
              {s.pricing.basic.description}
            </p>

            <ul className="mb-10 space-y-4">
              {basicFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="bg-primary/10 flex h-6 w-6 items-center justify-center rounded-full">
                    <Check className="text-primary h-4 w-4" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" className="w-full" asChild>
              <a
                href={`https://wa.me/6289669594959?text=${encodeURIComponent(s.hero.whatsapp_message)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.pricing.basic.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          {/* Premium */}
          <motion.div
            {...fadeUp}
            className="bg-foreground text-background relative overflow-hidden rounded-xl p-8 lg:p-10"
          >
            <Badge className="bg-primary text-primary-foreground absolute top-6 right-6">
              Best Value
            </Badge>

            <div className="mb-8">
              <h3 className="text-background/60 mb-2 text-sm font-medium tracking-wider uppercase">
                {s.pricing.premium.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tight">
                  {s.pricing.premium.price}
                </span>
                <span className="text-background/60">
                  {s.pricing.premium.unit}
                </span>
              </div>
            </div>

            <p className="text-background/70 mb-8 text-lg">
              {s.pricing.premium.description}
            </p>

            <ul className="mb-10 space-y-4">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="bg-background/10 flex h-6 w-6 items-center justify-center rounded-full">
                    <Check className="text-background h-4 w-4" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button size="lg" variant="secondary" className="w-full" asChild>
              <a
                href={`https://wa.me/6289669594959?text=${encodeURIComponent(s.hero.whatsapp_message)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.pricing.premium.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}


