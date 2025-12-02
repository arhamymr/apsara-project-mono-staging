'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { CallToAction, Footer, TopNav } from '@/components/home/sections';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useLocale } from '@/i18n/LocaleContext';
import { FULL_STACK_DEVELOPMENT_STRINGS } from '@/i18n/full-stack-development';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Clock,
  Cloud,
  Code2,
  Database,
  Globe,
  Layers,
  Lock,
  MessageCircle,
  Server,
  Shield,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react';

// Types
interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Service {
  title: string;
  description: string;
}

interface TechItem {
  name: string;
  category: string;
}

interface PricingTier {
  title: string;
  price: string;
  unit: string;
  description: string;
  cta: string;
  note?: string;
}

interface Strings {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    whatsapp_message: string;
  };
  features: {
    title: string;
    subtitle: string;
    list: Feature[];
  };
  services: {
    title: string;
    subtitle: string;
    list: Service[];
  };
  pricing: {
    title: string;
    subtitle: string;
    hourly: PricingTier;
    project: PricingTier;
  };
  techStack: {
    title: string;
    subtitle: string;
    list: TechItem[];
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
}

function useStrings(): Strings {
  const { lang } = useLocale();
  return FULL_STACK_DEVELOPMENT_STRINGS[lang] as Strings;
}

// Icon maps
const featureIconMap: Record<string, LucideIcon> = {
  Code2,
  Server,
  Database,
  Cloud,
};

const serviceIcons: LucideIcon[] = [Globe, Server, Database, Lock, Layers, Zap];

// Tech stack icons as simple text badges with colors
const techColors: Record<string, string> = {
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

export default function FullStackDevelopment() {
  const s = useStrings();

  return (
    <div className="bg-background text-foreground min-h-dvh">
      <TopNav />
      <main id="main-content">
        <HeroSection />
        <TrustBadges />
        <TechStackMarquee />
        <FeaturesSection />
        <ServicesSection />
        <WorkflowSection />
        <PricingSection />
        <CallToAction
          title={s.cta.title}
          subtitle={s.cta.subtitle}
          buttonText={s.cta.button}
          whatsappMessage={s.hero.whatsapp_message}
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
              <Code2 className="mr-2 h-4 w-4" />
              Full-Stack Development
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
              <a href="#features">View Features</a>
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
    { icon: Clock, label: '24-48h Response' },
    { icon: Shield, label: 'Secure Development' },
    { icon: MessageCircle, label: 'Free Consultation' },
    { icon: Sparkles, label: 'Modern Tech Stack' },
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

function TechStackMarquee() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  const techItems = s.techStack.list;
  const duplicatedItems = [...techItems, ...techItems];

  return (
    <Section className="py-16 lg:py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-normal tracking-tight md:text-3xl">
            {s.techStack.title}
          </h2>
          <p className="text-muted-foreground mt-4 text-base">
            {s.techStack.subtitle}
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="from-background via-transparent to-background pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r" />
        <div className="from-background via-transparent to-background pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l" />

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
            const colorClass = techColors[tech.name] || 'bg-primary/10 text-primary';
            return (
              <div
                key={`${tech.name}-${i}`}
                className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl border border-foreground/10 bg-card/50 hover:border-foreground/20 transition-colors"
              >
                <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center font-bold text-lg', colorClass)}>
                  {tech.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm">{tech.name}</p>
                  <p className="text-muted-foreground text-xs">{tech.category}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </Section>
  );
}


function FeaturesSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section id="features" className="py-24 lg:py-32">
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
          {s.features.list.map((feature, i) => {
            const Icon = featureIconMap[feature.icon] || Code2;
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
          })}
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {s.services.list.map((service, i) => {
            const Icon = serviceIcons[i] || Code2;
            return (
              <motion.div
                key={service.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'group border-foreground/20 hover:border-foreground/30 bg-card relative rounded-xl border p-8 transition-all duration-300',
                )}
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

function WorkflowSection() {
  const fadeUp = useFadeUp();
  const steps = [
    {
      number: '01',
      title: 'Discovery',
      description:
        'We analyze your requirements, define project scope, and create a detailed technical roadmap.',
    },
    {
      number: '02',
      title: 'Design',
      description:
        'Architecture planning, database design, and UI/UX wireframes for your application.',
    },
    {
      number: '03',
      title: 'Development',
      description:
        'Agile development with regular updates, code reviews, and continuous integration.',
    },
    {
      number: '04',
      title: 'Deployment',
      description:
        'Launch to production with monitoring, documentation, and ongoing support.',
    },
  ];

  return (
    <Section className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">
            How It Works
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            A structured approach to building your application.
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

  const hourlyFeatures = [
    'Flexible scheduling',
    'Direct communication',
    'Detailed time tracking',
    'No minimum hours',
  ];

  const projectFeatures = [
    'Fixed project scope',
    'Milestone payments',
    'Priority support',
    'Revision rounds included',
  ];

  return (
    <Section className="bg-muted/30 py-24 lg:py-32">
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
          {/* Hourly Rate */}
          <motion.div
            {...fadeUp}
            className="border-foreground/20 bg-card relative overflow-hidden rounded-xl border p-8 lg:p-10"
          >
            <div className="mb-8">
              <h3 className="text-muted-foreground mb-2 text-sm font-medium tracking-wider uppercase">
                {s.pricing.hourly.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tight">
                  {s.pricing.hourly.price}
                </span>
                <span className="text-muted-foreground">
                  {s.pricing.hourly.unit}
                </span>
              </div>
            </div>

            <p className="text-muted-foreground mb-8 text-lg">
              {s.pricing.hourly.description}
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
                href={`https://wa.me/6289669594959?text=${encodeURIComponent(s.hero.whatsapp_message)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.pricing.hourly.cta}
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
                {s.pricing.project.title}
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-tight">
                  {s.pricing.project.price}
                </span>
                <span className="text-background/60">
                  {s.pricing.project.unit}
                </span>
              </div>
            </div>

            <p className="text-background/70 mb-8 text-lg">
              {s.pricing.project.description}
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
                href={`https://wa.me/6289669594959?text=${encodeURIComponent(s.hero.whatsapp_message)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.pricing.project.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            {s.pricing.project.note && (
              <p className="text-background/50 mt-6 text-center text-xs">
                {s.pricing.project.note}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
