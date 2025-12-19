'use client';

import { SkipToContent } from '@/components/home/components';
import {
  Blog,
  CallToAction,
  FAQ,
  Features,
  Footer,
  Hero,
  // Integrations,
  OSShowcase,
  // Pricing,
  TopNav,
} from '@/components/home/sections';

export default function ApsaraLandingPage() {
  return (
    <div className="text-foreground relative min-h-dvh">
      <SkipToContent />
      <div className="mx-auto max-w-[1920px]">
        <TopNav />
        <main id="main-content">
          <Hero />
          <Features />
          <OSShowcase />
          {/* <Integrations /> */}
          {/* <Pricing /> */}
          <Blog />
          <CallToAction />
          <FAQ />
        </main>
        <Footer />
      </div>
    </div>
  );
}
