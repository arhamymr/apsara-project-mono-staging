'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Badge } from '@workspace/ui/components/badge';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { FREELANCE_PROJECTS } from '../data';

export function FreelanceSection() {
  const fadeUp = useFadeUp();

  return (
    <Section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <h2 className="text-2xl tracking-tight md:text-3xl">
            Freelance Projects
          </h2>
        </motion.div>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {FREELANCE_PROJECTS.map((project, i) => (
            <motion.a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-background border-border hover:border-foreground/30 group block rounded-xl border p-6 transition-colors"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{project.name}</h3>
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <Badge variant="outline" className="text-xs">
                  {project.year}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                {project.description}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </Section>
  );
}
