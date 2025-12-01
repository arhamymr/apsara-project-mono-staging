import { Section } from '@/components/home/components';
import { Button } from '@workspace/ui/components/button';
import { useLandingStrings as useStrings } from '@/i18n/landing';

import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Card } from '@workspace/ui/components/card';
import { motion } from 'framer-motion';
// ... imports

export function CallToAction() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section className="py-32">
      <motion.div {...fadeUp}>
        <Card className="relative overflow-hidden border px-8 py-24 text-center md:px-12">
          <div className="relative z-10 mx-auto max-w-4xl">
            <h3 className="text-3xl font-normal tracking-tight md:text-5xl lg:text-6xl">
              {s.cta.title}
            </h3>
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg md:text-xl">
              {s.cta.desc}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {s.cta.secondary && <Button size="lg">{s.cta.secondary}</Button>}
            </div>
            {s.cta.note && (
              <p className="text-muted-foreground mt-8 text-sm opacity-70">
                {s.cta.note}
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </Section>
  );
}
