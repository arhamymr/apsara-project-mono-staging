'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Footer, TopNav } from '@/components/home/sections';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useLocale } from '@/i18n/LocaleContext';
import { TEMPLATES_STRINGS } from '@/i18n/templates';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  Code2,
  Globe,
  Layers,
  MessageCircle,
  Package,
  RefreshCw,
  Rocket,
  Settings,
  Shield,
  ShoppingBag,
  Smartphone,
  Sparkles,
} from 'lucide-react';

function useStrings() {
  const { lang } = useLocale();
  return TEMPLATES_STRINGS[lang];
}

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Globe,
  Layers,
  ShoppingBag,
  Briefcase,
  Code2,
  Smartphone,
  Settings,
  RefreshCw,
};

export default function TemplatesPage() {
  return (
    <div className="bg-background text-foreground min-h-dvh">
      <TopNav />
      <main id="main-content">
        <HeroSection />
        <TrustBadges />
        <CategoriesSection />
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
              <Package className="mr-2 h-4 w-4" />
              Templates
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            className="text-foreground text-4xl leading-[1.1] font-normal tracking-tight md:text-6xl lg:text-7xl"
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
              <a href="#categories">
                {s.hero.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
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
    { icon: Shield, label: 'Quality Guaranteed' },
    { icon: Sparkles, label: 'Modern Design' },
    { icon: Rocket, label: 'Fast Performance' },
    { icon: MessageCircle, label: 'Support Included' },
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

function CategoriesSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section id="categories" className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">
            {s.categories.title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            {s.categories.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {s.categories.list.map((category: { title: string; description: string; icon: string; count: string }, i: number) => {
            const Icon = iconMap[category.icon] || Package;
            return (
              <motion.div
                key={category.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'group border-foreground/20 hover:border-primary/50 bg-card/50 hover:bg-card relative flex h-full flex-col rounded-xl border p-8 transition-all duration-300',
                )}
              >
                <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-xl font-medium">{category.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow leading-relaxed">
                  {category.description}
                </p>
                <Badge variant="secondary" className="w-fit">
                  {category.count}
                </Badge>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function FeaturesSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section className="bg-muted/30 py-24 lg:py-32">
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
          {s.features.list.map((feature: { title: string; description: string; icon: string }, i: number) => {
            const Icon = iconMap[feature.icon] || Code2;
            return (
              <motion.div
                key={feature.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'group border-foreground/20 hover:border-foreground/30 bg-card relative rounded-xl border p-8 transition-all duration-300',
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
          })}
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
            <MessageCircle className="text-primary-foreground/80 mx-auto mb-8 h-12 w-12" />
            <h2 className="text-primary-foreground text-3xl font-normal tracking-tight md:text-5xl">
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
