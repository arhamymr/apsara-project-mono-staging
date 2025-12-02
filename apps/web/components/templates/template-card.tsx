'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Card } from '@workspace/ui/components/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Template } from './types';

interface TemplateCardProps {
  template: Template;
  onClick: () => void;
}

export function TemplateCard({ template, onClick }: TemplateCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Set canvas dimensions to match image aspect ratio
      const aspectRatio = img.width / img.height;
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = (canvas.offsetWidth / aspectRatio) * window.devicePixelRatio;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setImageLoaded(true);
    };
    img.src = template.thumbnail;
  }, [template.thumbnail]);

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
        {/* Canvas Preview */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            aria-label={`Preview Screenshot of ${template.title}`}
            role="img"
            className={cn(
              'absolute size-full object-cover transition-transform duration-500 group-hover:scale-105',
              imageLoaded ? 'animate-in fade-in duration-300' : 'opacity-0'
            )}
            style={{ width: '100%', height: '100%' }}
          />
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/5" />
          {/* License badge */}
          <Badge
            variant={template.license === 'free' ? 'secondary' : 'default'}
            className={cn(
              'absolute top-3 right-3 text-xs capitalize z-10',
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
