'use client';

import { TopNav, Footer } from '@/components/home/sections';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { useLandingStrings as useStrings } from '@/i18n/landing';

export default function FAQPage() {
  const s = useStrings();

  return (
    <div className="text-foreground relative min-h-dvh">
      <TopNav />
      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h1 className="text-3xl tracking-tight md:text-4xl lg:text-5xl">
            {s.faq.title}
          </h1>
          <p className="text-muted-foreground mt-4 text-lg">
            {s.faq.items.length} questions answered
          </p>
          
          <Accordion type="single" collapsible className="mt-10">
            {s.faq.items.map((item: { q: string; a: string }, index: number) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base md:text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed md:text-lg">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}
