'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Button } from '@workspace/ui/components/button';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { CONTACT_INFO } from '../data';

export function ContactSection() {
  const fadeUp = useFadeUp();

  return (
    <Section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mx-auto max-w-md text-center">
          <Briefcase className="text-primary mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-4 text-2xl tracking-tight md:text-3xl">
            Let&apos;s Collaborate
          </h2>
          <p className="text-muted-foreground mb-4">
            Have a project in mind? I&apos;d love to discuss how we can work
            together.
          </p>

          <Button size="lg" asChild>
            <a
              href={CONTACT_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get In Touch
            </a>
          </Button>
        </motion.div>
      </div>
    </Section>
  );
}
