'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Badge } from '@workspace/ui/components/badge';
import { motion } from 'framer-motion';
import { BookOpen, Mail, MapPin, Phone } from 'lucide-react';
import { CONTACT_INFO, SOCIALS } from '../data';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

const iconMap = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  blog: BookOpen,
  mail: Mail,
} as const;

export function HeroSection() {
  const fadeUp = useFadeUp();

  return (
    <Section className="flex min-h-[80vh] items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          {...fadeUp}
          className="flex flex-col items-center text-center"
        >
          <Badge variant="outline" className="mb-4">
            Designer & Developer
          </Badge>
          <h1 className="mb-2 text-2xl tracking-tight md:text-4xl">
            Muhammad Arham
          </h1>

          <div className="text-muted-foreground mb-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {CONTACT_INFO.location}
            </span>
            <a
              href={CONTACT_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary flex items-center gap-1 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {CONTACT_INFO.phone}
            </a>
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {CONTACT_INFO.email}
            </span>
          </div>
          <p className="text-muted-foreground max-w-2xl text-lg md:text-xl">
            Designer and developer with 5+ years of experience. I can support
            your project from UI/UX design all the way to code implementation,
            including AI integration.
          </p>
          <div className="mt-8 flex gap-4">
            {SOCIALS.map((social) => {
              const Icon = iconMap[social.icon as keyof typeof iconMap];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted hover:bg-primary/10 hover:text-primary rounded-full p-3 transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
