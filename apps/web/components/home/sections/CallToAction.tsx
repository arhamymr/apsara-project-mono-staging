'use client';

import { Section } from '@/components/home/components';
import { Button } from '@workspace/ui/components/button';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { getWhatsAppNumber } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';

export interface CallToActionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  whatsappMessage?: string;
  whatsappNumber?: string;
  icon?: LucideIcon;
  note?: string;
}

export function CallToAction({
  title,
  subtitle,
  buttonText,
  whatsappMessage,
  whatsappNumber = getWhatsAppNumber(),
  note,
}: CallToActionProps = {}) {
  const s = useStrings();
  const fadeUp = useFadeUp();

  const displayTitle = title ?? s.cta.title;
  const displaySubtitle = subtitle ?? s.cta.desc;
  const displayButton = buttonText ?? s.cta.secondary;
  const displayNote = note ?? s.cta.note;

  return (
    <Section className="py-24 lg:py-32">
      <div className="container mx-auto">
        <motion.div
          {...fadeUp}
          className="bg-gradient-to-br from-foreground via-foreground to-foreground/95 relative w-full overflow-hidden rounded-xl px-8 py-20 text-center md:px-16 md:py-28 lg:py-32 shadow-2xl"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl">
            <h2 className="text-background text-4xl font-normal tracking-tight md:text-5xl lg:text-6xl">
              {displayTitle}
            </h2>
            <p className="text-background/80 mx-auto mt-6 max-w-2xl text-lg md:text-xl">
              {displaySubtitle}
            </p>
            {displayButton && (
              <div className="mt-12">
                {whatsappMessage ? (
                  <Button size="lg" asChild>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {displayButton}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <Button size="lg">
                    {displayButton}
                  </Button>
                )}
              </div>
            )}
            {displayNote && (
              <p className="text-background/60 mt-8 text-sm">{displayNote}</p>
            )}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
