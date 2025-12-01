'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@workspace/ui/components/accordion';
import { Input } from '@workspace/ui/components/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import * as React from 'react';
import { useMemo } from 'react';
import { useComponentSearch } from '../hooks/useComponentSearch';
import { ComponentSidebarProps } from '../types';

export function ComponentSidebar({
  categories,
  components,
  selectedComponent,
  onSelectComponent,
}: ComponentSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const filteredComponents = useComponentSearch(searchQuery);
  const resultsCount = filteredComponents.length;
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut: "/" to focus search
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Focus search on "/" key
      if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        // Only trigger if not already focused on an input
        const activeElement = document.activeElement;
        if (
          activeElement?.tagName !== 'INPUT' &&
          activeElement?.tagName !== 'TEXTAREA'
        ) {
          event.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Group components by category and calculate counts
  const categoriesWithComponents = useMemo(() => {
    return categories
      .map((category) => {
        const categoryComponents = filteredComponents.filter(
          (component) => component.category === category.id,
        );

        return {
          ...category,
          componentCount: categoryComponents.length,
          components: categoryComponents,
        };
      })
      .filter((category) => category.componentCount > 0);
  }, [categories, filteredComponents]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-6">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">
          Components
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {searchQuery
            ? `${resultsCount} result${resultsCount !== 1 ? 's' : ''} found`
            : `${components.length} components available`}
        </p>
      </div>

      <div className="border-b p-4">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search components... (Press / to focus)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="focus-visible:ring-ring pl-9 focus-visible:ring-2"
            aria-label="Search components"
            aria-describedby="search-results-count"
          />
        </div>
        <div
          id="search-results-count"
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {searchQuery
            ? `${resultsCount} result${resultsCount !== 1 ? 's' : ''} found`
            : `${components.length} components available`}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="multiple"
          defaultValue={categoriesWithComponents.map((c) => c.id)}
        >
          {categoriesWithComponents.map((category) => {
            const Icon = category.icon;

            return (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 transition-colors hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Icon className="text-muted-foreground h-4 w-4" />
                    <span className="text-foreground font-medium">
                      {category.name}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">
                      ({category.componentCount})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-2">
                  <div className="space-y-0.5" role="list">
                    {category.components.map((component) => (
                      <button
                        key={component.id}
                        onClick={() => onSelectComponent(component.id)}
                        className={cn(
                          'w-full rounded-md px-3 py-2 text-left text-sm transition-all duration-200',
                          'hover:bg-muted focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                          selectedComponent === component.id
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm'
                            : 'text-foreground hover:text-foreground',
                        )}
                        role="listitem"
                        aria-label={`View ${component.name} component`}
                        aria-current={
                          selectedComponent === component.id
                            ? 'page'
                            : undefined
                        }
                      >
                        {component.name}
                      </button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
