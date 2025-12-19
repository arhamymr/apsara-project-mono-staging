'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { CallToAction, Footer, TopNav } from '@/components/home/sections';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useLocale } from '@/i18n/LocaleContext';
import { MOBILE_APP_DEVELOPMENT_STRINGS } from '@/i18n/mobile-app-development';
import { cn, getWhatsAppUrl } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Clock,
  Layers,
  MessageCircle,
  Palette,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Store,
  Bell,
  Wrench,
} from 'lucide-react';

function useStrings() {
  const { lang } = useLocale();
  return MOBILE_APP_DEVELOPMENT_STRINGS[lang as keyof typeof MOBILE_APP_DEVELOPMENT_STRINGS];
}

// React Native brand blue theme (#61DAFB)
const reactNativeTheme = {
  '--primary': '#61DAFB',
  '--ring': '#61DAFB',
} as React.CSSProperties;

export default function MobileAppDevelopment() {
  const s = useStrings();

  return (
    <div className="bg-background text-foreground min-h-dvh" style={reactNativeTheme}>
      <TopNav />
      <main id="main-content">
        <HeroSection />
        <TrustBadges />
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

function PhoneMockup({ className }: { className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <svg
        width="240"
        height="480"
        viewBox="0 0 240 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-[#61DAFB]"
      >
        {/* Phone frame */}
        <rect
          x="4"
          y="4"
          width="232"
          height="472"
          rx="36"
          strokeWidth="2"
          fill="none"
        />
        {/* Screen */}
        <rect
          x="16"
          y="16"
          width="208"
          height="448"
          rx="28"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Notch */}
        <rect
          x="80"
          y="24"
          width="80"
          height="24"
          rx="12"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Status bar elements */}
        <text x="28" y="62" fontSize="12" fill="#61DAFB" className="font-mono">
          9:41
        </text>
        <rect x="180" y="52" width="28" height="12" rx="3" strokeWidth="1" fill="none" />
        <rect x="210" y="55" width="2" height="6" rx="1" fill="#61DAFB" />
        {/* Header card */}
        <rect
          x="28"
          y="80"
          width="184"
          height="100"
          rx="16"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Simple decorative lines inside header */}
        <line x1="60" y1="115" x2="180" y2="115" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="60" y1="135" x2="150" y2="135" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <line x1="60" y1="155" x2="120" y2="155" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
        {/* Text lines */}
        <line x1="28" y1="200" x2="160" y2="200" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="28" y1="220" x2="120" y2="220" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        {/* Grid cards */}
        <rect x="28" y="250" width="84" height="70" rx="12" strokeWidth="1.5" fill="none" />
        <rect x="128" y="250" width="84" height="70" rx="12" strokeWidth="1.5" fill="none" />
        <rect x="28" y="336" width="84" height="70" rx="12" strokeWidth="1.5" fill="none" />
        <rect x="128" y="336" width="84" height="70" rx="12" strokeWidth="1.5" fill="none" />
        {/* Bottom nav */}
        <line x1="28" y1="430" x2="212" y2="430" strokeWidth="1" opacity="0.3" />
        <circle cx="60" cy="450" r="8" strokeWidth="1.5" fill="none" />
        <circle cx="120" cy="450" r="8" strokeWidth="1.5" fill="none" />
        <circle cx="180" cy="450" r="8" strokeWidth="1.5" fill="none" />
      </svg>
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

      {/* Phone mockups on edges - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 hidden xl:block"
      >
        <PhoneMockup className="rotate-[-8deg]" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 hidden xl:block"
      >
        <PhoneMockup className="rotate-[8deg]" />
      </motion.div>

      <div className="relative container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div {...fadeUp}>
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary mb-8 px-4 py-2 text-sm font-medium"
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Mobile App Development
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
                href={getWhatsAppUrl(s.hero.whatsapp_message)}
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

function FeaturesSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  const iconMap: Record<string, typeof Smartphone> = {
    Smartphone,
    Layers,
    Store,
  };

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
          {s.features.list.map((feature: { title: string; description: string; icon?: string }, i: number) => {
            const Icon = iconMap[feature.icon || ''] || Smartphone;
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

  const icons = [Palette, Smartphone, Layers, Server, Bell, Wrench];

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
          {s.services.list.map((service: { title: string; description: string }, i: number) => {
            const Icon = icons[i] || Smartphone;
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
        'We analyze your app requirements, target audience, and define the project scope and features.',
    },
    {
      number: '02',
      title: 'Design',
      description:
        'UI/UX design with wireframes, prototypes, and user flow optimization for mobile experience.',
    },
    {
      number: '03',
      title: 'Development',
      description:
        'Agile development with regular builds, testing on real devices, and continuous integration.',
    },
    {
      number: '04',
      title: 'Launch',
      description:
        'App store submission, launch support, and ongoing maintenance and updates.',
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
            A structured approach to building your mobile application.
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
                href={getWhatsAppUrl(s.hero.whatsapp_message)}
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
                href={getWhatsAppUrl(s.hero.whatsapp_message)}
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


