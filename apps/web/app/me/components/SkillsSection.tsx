'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { motion } from 'framer-motion';
import { SKILLS } from '../data';

export function SkillsSection() {
  const fadeUp = useFadeUp();

  return (
    <Section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <h2 className="text-2xl tracking-tight md:text-3xl">
            Skills & Technologies
          </h2>
        </motion.div>
        <motion.div
          {...fadeUp}
          className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3"
        >
          {SKILLS.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="bg-muted hover:bg-primary/10 hover:text-primary cursor-default rounded-full px-4 py-2 text-sm transition-colors"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
