'use client';

import { Section } from '@/components/home/components';
import { Button } from '@workspace/ui/components/button';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket, LucideIcon } from 'lucide-react';

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
  whatsappNumber = '6289669594959',
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
      <div className="container mx-auto px-4">
        <motion.div
          {...fadeUp}
          className="bg-foreground relative w-full overflow-hidden rounded-xl px-8 py-20 text-center md:px-16 md:py-28 lg:py-32"
        >
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
