'use client';

import { Section } from '@/components/home/components';
import { useFadeUp } from '@/components/home/hooks/useFadeUp';
import { Badge } from '@workspace/ui/components/badge';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { PORTFOLIO_GALLERY } from '../data';

export function PortfolioGallery() {
  const fadeUp = useFadeUp();

  return (
    <Section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div {...fadeUp} className="mb-12 text-center">
          <h2 className="text-2xl tracking-tight md:text-3xl">
            Design Portfolio
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            A selection of my recent design work
          </p>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-2">
          {PORTFOLIO_GALLERY.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative aspect-[3/2] overflow-hidden rounded-xl"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <Badge variant="secondary" className="mb-2 w-fit text-xs">
                  {item.category}
                </Badge>
                <h3 className="text-sm font-medium text-white">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
