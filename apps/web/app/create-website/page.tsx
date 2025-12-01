'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Footer, TopNav } from '@/components/home/sections';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useLocale } from '@/i18n/LocaleContext';
import { CREATE_WEBSITE_STRINGS } from '@/i18n/create-website';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  Check,
  Clock,
  Code2,
  Globe,
  Layout,
  Palette,
  Rocket,
  Search,
  Shield,
  ShoppingCart,
  Smartphone,
  Sparkles,
  User,
  Zap,
} from 'lucide-react';

function useStrings() {
  const { lang } = useLocale();
  return CREATE_WEBSITE_STRINGS[lang];
}

export default function CreateWebsite() {
  return (
    <div className="bg-background text-foreground min-h-dvh">
      <TopNav />
      <main id="main-content">
        <HeroSection />
        <TrustBadges />
        <FeaturesSection />
        <ServicesSection />
        <WorkflowSection />
        <PricingSection />
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
              <Globe className="mr-2 h-4 w-4" />
              Website Development
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
    { icon: Zap, label: 'Fast Delivery' },
    { icon: Shield, label: 'Secure & Reliable' },
    { icon: Clock, label: 'On-Time Guarantee' },
    { icon: Sparkles, label: 'Modern Design' },
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

  const icons = {
    Palette: Palette,
    Search: Search,
    Smartphone: Smartphone,
    Zap: Zap,
  };

  return (
    <Section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
            {s.features.title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
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
                  key={feature.title}
                  {...fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'group border-foreground/20 hover:border-foreground/30 bg-card/50 relative rounded-xl border p-8 transition-all duration-300',
                  )}
                >
                  <div className="bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-3 text-xl font-medium">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            },
          )}
        </div>
      </div>
    </Section>
  );
}

function ServicesSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  const services = [
    { icon: Layout, ...s.services.list[0] },
    { icon: Briefcase, ...s.services.list[1] },
    { icon: ShoppingCart, ...s.services.list[2] },
    { icon: User, ...s.services.list[3] },
    { icon: Palette, ...s.services.list[4] },
    { icon: Code2, ...s.services.list[5] },
  ];

  return (
    <Section id="services" className="bg-muted/30 py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
            {s.services.title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            {s.services.subtitle}
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="border-border bg-card hover:border-foreground/30 group rounded-xl border p-8 transition-all duration-300"
              >
                <div className="bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                  <service.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-lg font-medium">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}


function WorkflowSection() {
  const fadeUp = useFadeUp();
  const steps = [
    {
      number: '01',
      title: 'Discovery',
      description:
        'We learn about your business, goals, and target audience to create the perfect strategy.',
    },
    {
      number: '02',
      title: 'Design',
      description:
        'Our designers create stunning mockups that align with your brand identity.',
    },
    {
      number: '03',
      title: 'Development',
      description:
        'We build your website with clean code, optimized for speed and SEO.',
    },
    {
      number: '04',
      title: 'Launch',
      description:
        'After thorough testing, we deploy your site and provide ongoing support.',
    },
  ];

  return (
    <Section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
            Our Process
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            A proven workflow that delivers results every time.
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                {...fadeUp}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="text-primary/20 mb-4 text-6xl font-bold">
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-medium">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function PricingSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  const starterFeatures = [
    'Responsive Design',
    'Basic SEO Setup',
    'Contact Form',
    '1 Week Delivery',
  ];

  const businessFeatures = [
    'Advanced Design',
    'Full SEO Optimization',
    'CMS Integration',
    'Priority Support',
  ];

  return (
    <Section className="bg-muted/30 py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-medium tracking-tight md:text-5xl">
            {s.pricing.title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            {s.pricing.subtitle}
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          {/* Starter */}
          <motion.div
            {...fadeUp}
            className="border-foreground/20 bg-card relative overflow-hidden rounded-xl border p-8 lg:p-10"
          >
            <div className="mb-8">
              <h3 className="text-muted-foreground mb-2 text-sm font-medium tracking-wider uppercase">
                {s.pricing.starter.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tight">
                  {s.pricing.starter.price}
                </span>
                <span className="text-muted-foreground">
                  {s.pricing.starter.unit}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 text-lg">
              {s.pricing.starter.description}
            </p>

            <ul className="mb-10 space-y-4">
              {starterFeatures.map((feature) => (
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
                {s.pricing.starter.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          {/* Business */}
          <motion.div
            {...fadeUp}
            className="bg-foreground text-background relative overflow-hidden rounded-xl p-8 lg:p-10"
          >
            <Badge className="bg-primary text-primary-foreground absolute top-6 right-6">
              Popular
            </Badge>

            <div className="mb-8">
              <h3 className="text-background/60 mb-2 text-sm font-medium tracking-wider uppercase">
                {s.pricing.business.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tight">
                  {s.pricing.business.price}
                </span>
                <span className="text-background/60">
                  {s.pricing.business.unit}
                </span>
              </div>
            </div>

            <p className="text-background/70 mb-8 text-lg">
              {s.pricing.business.description}
            </p>

            <ul className="mb-10 space-y-4">
              {businessFeatures.map((feature) => (
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
                {s.pricing.business.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            <p className="text-background/50 mt-6 text-center text-xs">
              {s.pricing.business.note}
            </p>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}

function CTASection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          {...fadeUp}
          className="bg-primary relative mx-auto max-w-4xl overflow-hidden rounded-xl px-8 py-16 text-center md:px-16 md:py-24"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="relative z-10">
            <Rocket className="text-primary-foreground/80 mx-auto mb-8 h-12 w-12" />
            <h2 className="text-primary-foreground text-3xl font-medium tracking-tight md:text-5xl">
              {s.cta.title}
            </h2>
            <p className="text-primary-foreground/80 mx-auto mt-6 max-w-xl text-lg">
              {s.cta.subtitle}
            </p>
            <div className="mt-10">
              <Button size="lg" variant="secondary" asChild>
                <a
                  href={`https://wa.me/6289669594959?text=${encodeURIComponent(s.hero.whatsapp_message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.cta.button}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
