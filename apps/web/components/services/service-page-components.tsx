'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Check, type LucideIcon } from 'lucide-react';


// Types
export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Service {
  title: string;
  description: string;
}

export interface TechItem {
  name: string;
  category: string;
}

export interface PricingTier {
  title: string;
  price: string;
  unit: string;
  description: string;
  cta: string;
  note?: string;
}

export interface WorkflowStep {
  number: string;
  title: string;
  description: string;
}

export interface TrustBadge {
  icon: LucideIcon;
  label: string;
}

// Hero Section
interface HeroSectionProps {
  badge: string;
  badgeIcon: LucideIcon;
  title: string;
  subtitle: string;
  ctaText: string;
  whatsappMessage: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function ServiceHeroSection({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  ctaText,
  whatsappMessage,
  secondaryCtaText = 'View Features',
  secondaryCtaHref = '#features',
}: HeroSectionProps) {
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
              <BadgeIcon className="mr-2 h-4 w-4" />
              {badge}
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            className="text-foreground text-4xl leading-[1.1] font-normal tracking-tight md:text-6xl lg:text-7xl"
          >
            {title}
          </motion.h1>

          <motion.p
            {...fadeUp}
            className="text-muted-foreground mx-auto mt-8 max-w-2xl text-lg leading-relaxed md:text-xl"
          >
            {subtitle}
          </motion.p>

          <motion.div
            {...fadeUp}
            className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" asChild>
              <a
                href={`https://wa.me/6289669594959?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {ctaText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={secondaryCtaHref}>{secondaryCtaText}</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}


// Trust Badges Section
interface TrustBadgesSectionProps {
  badges: TrustBadge[];
}

export function TrustBadgesSection({ badges }: TrustBadgesSectionProps) {
  const fadeUp = useFadeUp();

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

// Features Section
interface FeaturesSectionProps {
  title: string;
  subtitle: string;
  features: Feature[];
  iconMap: Record<string, LucideIcon>;
  defaultIcon: LucideIcon;
  columns?: 2 | 3 | 4;
}

export function FeaturesSection({
  title,
  subtitle,
  features,
  iconMap,
  defaultIcon,
  columns = 4,
}: FeaturesSectionProps) {
  const fadeUp = useFadeUp();
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <Section id="features" className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">{subtitle}</p>
        </motion.div>

        <div className={cn('grid gap-6', gridCols[columns])}>
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon] || defaultIcon;
            return (
              <motion.div
                key={feature.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group border-foreground/20 hover:border-foreground/30 bg-card/50 relative rounded-xl border p-8 transition-all duration-300"
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

// Services Section
interface ServicesSectionProps {
  title: string;
  subtitle: string;
  services: Service[];
  icons: LucideIcon[];
  defaultIcon: LucideIcon;
}

export function ServicesSection({
  title,
  subtitle,
  services,
  icons,
  defaultIcon,
}: ServicesSectionProps) {
  const fadeUp = useFadeUp();

  return (
    <Section id="services" className="bg-muted/30 py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">{subtitle}</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = icons[i] || defaultIcon;
            return (
              <motion.div
                key={service.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group border-foreground/20 hover:border-foreground/30 bg-card relative rounded-xl border p-8 transition-all duration-300"
              >
                <div className="bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl">
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 text-xl font-medium">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}


// Workflow Section
interface WorkflowSectionProps {
  title?: string;
  subtitle?: string;
  steps: WorkflowStep[];
}

export function WorkflowSection({
  title = 'How It Works',
  subtitle = 'A structured approach to building your application.',
  steps,
}: WorkflowSectionProps) {
  const fadeUp = useFadeUp();

  return (
    <Section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">{subtitle}</p>
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

// Pricing Section
interface PricingSectionProps {
  title: string;
  subtitle: string;
  hourly: PricingTier;
  project: PricingTier;
  hourlyFeatures: string[];
  projectFeatures: string[];
  whatsappMessage: string;
}

export function PricingSection({
  title,
  subtitle,
  hourly,
  project,
  hourlyFeatures,
  projectFeatures,
  whatsappMessage,
}: PricingSectionProps) {
  const fadeUp = useFadeUp();

  return (
    <Section className="bg-muted/30 py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">{subtitle}</p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          {/* Hourly Rate */}
          <motion.div
            {...fadeUp}
            className="border-foreground/20 bg-card relative overflow-hidden rounded-xl border p-8 lg:p-10"
          >
            <div className="mb-8">
              <h3 className="text-muted-foreground mb-2 text-sm font-medium tracking-wider uppercase">
                {hourly.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tight">
                  {hourly.price}
                </span>
                <span className="text-muted-foreground">{hourly.unit}</span>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 text-lg">
              {hourly.description}
            </p>

            <ul className="mb-10 space-y-4">
              {hourlyFeatures.map((feature) => (
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
                href={`https://wa.me/6289669594959?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {hourly.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          {/* Project-Based */}
          <motion.div
            {...fadeUp}
            className="bg-foreground text-background relative overflow-hidden rounded-xl p-8 lg:p-10"
          >
            <Badge className="bg-primary text-primary-foreground absolute top-6 right-6">
              Popular
            </Badge>

            <div className="mb-8">
              <h3 className="text-background/60 mb-2 text-sm font-medium tracking-wider uppercase">
                {project.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tight">
                  {project.price}
                </span>
                <span className="text-background/60">{project.unit}</span>
              </div>
            </div>

            <p className="text-background/70 mb-8 text-lg">
              {project.description}
            </p>

            <ul className="mb-10 space-y-4">
              {projectFeatures.map((feature) => (
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
                href={`https://wa.me/6289669594959?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            {project.note && (
              <p className="text-background/50 mt-6 text-center text-xs">
                {project.note}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}


// Tech Stack Marquee Section
interface TechStackMarqueeProps {
  title: string;
  subtitle: string;
  techItems: TechItem[];
  techColors?: Record<string, string>;
}

const defaultTechColors: Record<string, string> = {
  React: 'bg-cyan-500/10 text-cyan-600',
  TypeScript: 'bg-blue-500/10 text-blue-600',
  JavaScript: 'bg-yellow-500/10 text-yellow-600',
  'Tailwind CSS': 'bg-teal-500/10 text-teal-600',
  'shadcn/ui': 'bg-zinc-500/10 text-zinc-600',
  Expo: 'bg-violet-500/10 text-violet-600',
  Go: 'bg-sky-500/10 text-sky-600',
  Laravel: 'bg-red-500/10 text-red-600',
  Svelte: 'bg-orange-500/10 text-orange-600',
  'Inertia.js': 'bg-purple-500/10 text-purple-600',
  Figma: 'bg-pink-500/10 text-pink-600',
  'AI Integration': 'bg-emerald-500/10 text-emerald-600',
};

export function TechStackMarquee({
  title,
  subtitle,
  techItems,
  techColors = defaultTechColors,
}: TechStackMarqueeProps) {
  const fadeUp = useFadeUp();
  const duplicatedItems = [...techItems, ...techItems];

  return (
    <Section className="overflow-hidden py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">{subtitle}</p>
        </motion.div>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: 'loop',
              duration: 25,
              ease: 'linear',
            },
          }}
        >
          {duplicatedItems.map((tech, i) => {
            const colorClass =
              techColors[tech.name] || 'bg-primary/10 text-primary';
            return (
              <div
                key={`${tech.name}-${i}`}
                className="bg-card/50 border-foreground/10 hover:border-foreground/20 flex flex-shrink-0 items-center gap-3 rounded-xl border px-5 py-3 transition-colors"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold',
                    colorClass
                  )}
                >
                  {tech.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{tech.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {tech.category}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}
