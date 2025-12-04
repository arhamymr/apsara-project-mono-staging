'use client';

import { Background } from '@/components/home/components';
import Image from 'next/image';
import {
  ContactSection,
  ExperienceSection,
  FloatingBar,
  FreelanceSection,
  HeroSection,
  PortfolioGallery,
  SkillsSection,
} from './components';
import { useFloatingBar } from './hooks/useFloatingBar';
import { useTheme } from './hooks/useTheme';

export default function PortfolioPage() {
  const { isDark, toggleTheme } = useTheme();
  const { showFloatingBar, contactRef } = useFloatingBar();

  return (
    <div className="bg-background text-foreground relative min-h-dvh overflow-hidden">
        <Background />

        <FloatingBar
          show={showFloatingBar}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        <main className="relative z-10 mx-auto max-w-2xl px-4 py-8">
          <div className="border-border relative overflow-hidden rounded-2xl border">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={512}
              height={512}
              className="pointer-events-none absolute -top-[250px] -right-[200px] size-128 w-auto animate-spin opacity-50 [animation-duration:30s]"
              priority
            />
            <HeroSection />
            <SkillsSection />
            <PortfolioGallery />
            <ExperienceSection />
            <FreelanceSection />
            <div ref={contactRef}>
              <ContactSection />
            </div>
          </div>
        </main>
      </div>
  );
}
