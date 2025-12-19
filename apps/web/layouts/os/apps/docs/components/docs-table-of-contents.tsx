'use client';

import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { ChevronRight } from 'lucide-react';
import type { DocsTableOfContentsProps } from '../types';
import { sortCategories } from '../types';

/**
 * DocsTableOfContents Component
 * 
 * Displays the table of contents for documentation with:
 * - Categories in correct order (Overview, Getting Started, Features, API Reference)
 * - Category selection handling
 * - Active category highlighting
 * 
 * Requirements: 3.1, 3.3
 */
export function DocsTableOfContents({
  categories,
  activeCategory,
  onSelectCategory,
}: DocsTableOfContentsProps) {
  // Sort categories according to predefined order
  const sortedCategories = sortCategories(categories);

  if (sortedCategories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden border-l bg-card/30">
      <div className="p-3 border-b">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Contents
        </h3>
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        <nav className="p-2 space-y-1">
          {sortedCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left text-sm transition-colors ${
                activeCategory === category.id
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              }`}
            >
              <ChevronRight 
                className={`h-4 w-4 flex-shrink-0 transition-transform ${
                  activeCategory === category.id ? 'rotate-90' : ''
                }`} 
              />
              <span className="truncate">{category.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {category.entries.length}
              </span>
            </button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
