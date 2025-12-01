import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { motion } from 'framer-motion';

import { Section } from '@/components/home/components';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { useLandingStrings as useStrings } from '@/i18n/landing';

export function FAQ() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section id="faq" className="pt-10">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl">
        <h3 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
          {s.faq.title}
        </h3>
        <Accordion type="single" collapsible className="mt-6">
          {s.faq.items.map((item: { q: string; a: string }) => (
            <AccordionItem key={item.q} value={item.q}>
              <AccordionTrigger className="text-left text-base md:text-lg">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed md:text-lg">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </Section>
  );
}
