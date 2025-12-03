'use client';

import { CallToAction, Footer, TopNav } from '@/components/home/sections';
import {
  ServiceHeroSection,
  TrustBadgesSection,
  FeaturesSection,
  ServicesSection,
  WorkflowSection,
  PricingSection,
  TechStackMarquee,
} from '@/components/services';
import { useLocale } from '@/i18n/LocaleContext';
import { FULL_STACK_DEVELOPMENT_STRINGS, type FullStackDevelopmentStrings } from '@/i18n/full-stack-development';
import {
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

function useStrings(): FullStackDevelopmentStrings {
  const { lang } = useLocale();
  return FULL_STACK_DEVELOPMENT_STRINGS[lang];
}

// Icon maps
const featureIconMap: Record<string, LucideIcon> = { Code2, Server, Database, Cloud };
const serviceIcons: LucideIcon[] = [Globe, Server, Database, Lock, Layers, Zap];
const trustBadgeIconMap: Record<string, LucideIcon> = { Clock, Shield, MessageCircle, Sparkles };

export default function FullStackDevelopment() {
  const s = useStrings();

  // Map trust badges from i18n with icons
  const trustBadges = s.trustBadges.map((badge) => ({
    icon: trustBadgeIconMap[badge.icon] || Clock,
    label: badge.label,
  }));

  return (
    <div className="bg-background text-foreground min-h-dvh">
      <TopNav />
      <main id="main-content">
        <ServiceHeroSection
          badge="Full-Stack Development"
          badgeIcon={Code2}
          title={s.hero.title}
          subtitle={s.hero.subtitle}
          ctaText={s.hero.cta}
          whatsappMessage={s.hero.whatsapp_message}
        />
        <TrustBadgesSection badges={trustBadges} />
        <TechStackMarquee
          title={s.techStack.title}
          subtitle={s.techStack.subtitle}
          techItems={s.techStack.list}
        />
        <FeaturesSection
          title={s.features.title}
          subtitle={s.features.subtitle}
          features={s.features.list}
          iconMap={featureIconMap}
          defaultIcon={Code2}
        />
        <ServicesSection
          title={s.services.title}
          subtitle={s.services.subtitle}
          services={s.services.list}
          icons={serviceIcons}
          defaultIcon={Code2}
        />
        <WorkflowSection steps={s.workflow.steps} />
        <PricingSection
          title={s.pricing.title}
          subtitle={s.pricing.subtitle}
          hourly={s.pricing.hourly}
          project={s.pricing.project}
          hourlyFeatures={s.pricing.hourly.features}
          projectFeatures={s.pricing.project.features}
          whatsappMessage={s.hero.whatsapp_message}
        />
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
