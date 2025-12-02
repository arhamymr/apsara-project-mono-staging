import { Section } from '@/components/home/components';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { useLandingStrings as useStrings } from '@/i18n/landing';
import { Bot, Database, Layers, Mail, ShieldCheck } from 'lucide-react';

const INTEGRATIONS = [
  { name: 'Mastra Agents', icon: Bot },
  { name: 'Cloudflare R2', icon: Database },
  { name: 'Vectorize', icon: Layers },
  { name: 'Mailgun', icon: Mail },
  { name: 'Postmark', icon: Mail },
  { name: 'Alibaba Cloud', icon: ShieldCheck },
] as const;

import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { motion } from 'framer-motion';

// ... imports

export function Integrations() {
  const s = useStrings();
  const fadeUp = useFadeUp();

  return (
    <Section id="integrations" className="pt-2">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <h3 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
          {s.integrations.title}
        </h3>
        <p className="text-muted-foreground mt-3 text-lg md:text-xl">{s.integrations.subtitle}</p>
      </motion.div>
      <motion.div
        {...fadeUp}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {INTEGRATIONS.map(({ name, icon: Icon }) => (
          <Card key={name} className="border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
                  <Icon className="text-primary h-5 w-5" />
                </div>
                <CardTitle className="text-base">{name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {s.integrations.cardDesc}
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </Section>
  );
}
