'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { CallToAction, Footer, TopNav } from '@/components/home/sections';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { useLocale } from '@/i18n/LocaleContext';
import { SERVICES_STRINGS } from '@/i18n/services';
import { cn, getWhatsAppUrl } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Code2,
  Globe,
  Image,
  Layers,
  MessageCircle,
  Package,
  Rocket,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';

function useStrings() {
  const { lang } = useLocale();
  return SERVICES_STRINGS[lang];
}

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Code2,
  Smartphone,
  Server,
  Globe,
  Wrench,
  Bot,
  Image,
  Package,
};

export default function ServicesPage() {
  const s = useStrings();

  return (
    <div className="bg-background text-foreground min-h-dvh">
      <TopNav />
      <main id="main-content">
        <HeroSection />
        <TrustBadges />
        <ServiceCardsSection />
        <CallToAction
          title={s.cta.title}
          subtitle={s.cta.subtitle}
          buttonText={s.cta.button}
          whatsappMessage={s.hero.whatsapp_message}
          icon={MessageCircle}
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
              <Layers className="mr-2 h-4 w-4" />
              Services
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
              <a href="#services">View All Services</a>
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
    { icon: MessageCircle, label: 'Free Consultation' },
    { icon: Sparkles, label: 'Modern Solutions' },
    { icon: Rocket, label: 'Fast Delivery' },
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


function ServiceCardsSection() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section id="services" className="py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto mb-20 max-w-2xl text-center">
          <h2 className="text-3xl font-normal tracking-tight md:text-5xl">
            {s.overview.title}
          </h2>
          <p className="text-muted-foreground mt-6 text-lg">
            {s.overview.subtitle}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {s.serviceCards.map((service: { title: string; description: string; href: string; icon: string }, i: number) => {
            const Icon = iconMap[service.icon] || Code2;
            return (
              <motion.div
                key={service.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={service.href}
                  className={cn(
                    'group border-foreground/20 hover:border-primary/50 bg-card/50 hover:bg-card relative flex h-full flex-col rounded-xl border p-8 transition-all duration-300',
                  )}
                >
                  <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-3 text-xl font-medium">{service.title}</h3>
                  <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">
                    {service.description}
                  </p>
                  <div className="text-primary flex items-center text-sm font-medium">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}


