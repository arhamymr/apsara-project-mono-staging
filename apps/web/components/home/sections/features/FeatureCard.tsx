import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useInView } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { ReactNode, useRef } from 'react';

interface FeatureCardProps {
  icon?: LucideIcon;
  title: string;
  description: string | ReactNode;
  illustration: ReactNode;
  colSpan?: 1 | 2;
  hoverColor?: 'emerald' | 'purple' | 'blue' | 'rose' | 'primary';
}

export function FeatureCard({
  title,
  description,
  illustration,
  colSpan = 1,
}: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-20% 0px -20% 0px' });

  return (
    <Card
      ref={ref}
      className={cn(
        'group relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-xl border transition-all duration-500',
        colSpan === 2 ? 'md:col-span-2' : 'md:col-span-1',
        'hover:border-primary',
        // Activate hover state on mobile when in view
        isInView && 'max-md:border-primary max-md:[&_*]:!transition-all',
      )}
      data-in-view={isInView}
    >
      <div className="relative z-10 p-5">
        <h4 className="text-card-foreground mb-2 text-2xl font-normal">
          {title}
        </h4>
        {typeof description === 'string' ? (
          <div className="text-muted-foreground text-md max-w-md leading-relaxed md:text-lg">
            {description}
          </div>
        ) : (
          description
        )}
      </div>
      {illustration}
    </Card>
  );
}
