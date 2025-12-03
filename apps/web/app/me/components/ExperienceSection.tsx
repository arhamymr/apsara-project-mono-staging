'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Badge } from '@workspace/ui/components/badge';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { EXPERIENCE } from '../data';

export function ExperienceSection() {
  const fadeUp = useFadeUp();

  return (
    <Section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <h2 className="text-2xl tracking-tight md:text-3xl">
            Work Experience
          </h2>
        </motion.div>
        <div className="mx-auto max-w-3xl space-y-8">
          {EXPERIENCE.map((exp, i) => (
            <motion.div
              key={exp.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-background border-border hover:border-foreground/30 rounded-xl border p-6 transition-colors"
            >
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-medium">{exp.company}</h3>
                  {exp.contract && (
                    <p className="text-muted-foreground text-xs">
                      {exp.contract}
                    </p>
                  )}
                </div>
                <Badge variant="secondary">{exp.role}</Badge>
              </div>
              <div className="text-muted-foreground mb-4 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {exp.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {exp.location}
                </span>
              </div>
              <ul className="text-muted-foreground space-y-2 text-sm">
                {exp.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
