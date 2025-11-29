'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getCategoryById } from '../data/categories';
import { ComponentGridProps } from '../types';

export function ComponentGrid({
  components,
  onSelectComponent,
}: ComponentGridProps) {
  // Show empty state if no components
  if (components.length === 0) {
    return (
      <div className="bg-muted/30 dark:bg-muted/10 flex min-h-[400px] items-center justify-center rounded-lg border border-dashed p-12">
        <div className="text-center">
          <div className="text-muted-foreground mb-4 text-5xl">🔍</div>
          <h3 className="text-foreground mb-2 text-lg font-semibold tracking-tight">
            No components found
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Try adjusting your search query or browse all components
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      role="list"
      aria-label="Component catalog"
    >
      {components.map((component) => {
        const category = getCategoryById(component.category);

        return (
          <Card
            key={component.id}
            className={cn(
              'cursor-pointer transition-all duration-200',
              'hover:border-primary/50 dark:hover:shadow-primary/5 hover:scale-[1.02] hover:shadow-lg',
              'active:scale-[0.98]',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              'bg-card dark:bg-card/50',
            )}
            onClick={() => onSelectComponent(component.id)}
            role="listitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectComponent(component.id);
              }
            }}
            aria-label={`View ${component.name} component - ${component.description}`}
          >
            <CardHeader className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-foreground text-lg font-semibold tracking-tight">
                  {component.name}
                </CardTitle>
                {category && (
                  <Badge
                    variant="secondary"
                    className="shrink-0 text-xs font-medium"
                    aria-label={`Category: ${category.name}`}
                  >
                    {category.name}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                {component.description}
              </CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
