'use client';

import { SkipToContent } from '@/components/home/components';
import {
  Blog,
  CallToAction,
  FAQ,
  Features,
  Footer,
  Hero,
  Integrations,
  OSShowcase,
  Pricing,
  Services,
  // Testimonials,
  TopNav,
} from '@/components/home/sections';
import { Head } from '@inertiajs/react';

export default function ApsaraLandingPage() {
  return (
    <>
      <Head title="Apsara Digital - AI-Powered Web Development & Digital Solutions" />
      <div className="text-foreground relative min-h-dvh">
        <SkipToContent />
        <TopNav />
        <main id="main-content">
          <Hero />
          <Features />
          <OSShowcase />

          <Integrations />
          {/* <Testimonials /> */}
          <Pricing />
          <Services />

          <Blog />
          <CallToAction />
          <FAQ />
        </main>
        <Footer />
      </div>
    </>
  );
}
