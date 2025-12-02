'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Card } from '@workspace/ui/components/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Template } from './types';

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={cn(
          'group cursor-pointer overflow-hidden transition-all duration-300',
          'hover:shadow-lg hover:shadow-primary/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'border-border/50 hover:border-primary/30'
        )}
        aria-label={`View ${template.title} template`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={template.thumbnail}
            alt={template.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/5" />
          {/* License badge */}
          <Badge
            variant={template.license === 'free' ? 'secondary' : 'default'}
            className={cn(
              'absolute top-3 right-3 text-xs capitalize',
              template.license === 'premium' && 'bg-amber-500 hover:bg-amber-600',
              template.license === 'commercial' && 'bg-purple-500 hover:bg-purple-600'
            )}
          >
            {template.license}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {template.title}
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs px-2 py-0.5 font-normal text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
