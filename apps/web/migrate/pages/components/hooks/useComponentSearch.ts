import Fuse from 'fuse.js';
import { useMemo } from 'react';
import { componentRegistry } from '../data/component-registry';
import { ComponentMetadata } from '../types';

/**
 * Hook for searching components using fuzzy matching
 * Searches across component name, description, tags, and category
 */
export function useComponentSearch(query: string): ComponentMetadata[] {
  // Initialize Fuse.js with component registry
  const fuse = useMemo(() => {
    return new Fuse(componentRegistry, {
      keys: [
        { name: 'name', weight: 2 }, // Higher weight for name matches
        { name: 'description', weight: 1.5 },
        { name: 'tags', weight: 1 },
        { name: 'category', weight: 0.5 },
      ],
      threshold: 0.3, // Lower threshold = more strict matching
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, []);

  // Perform search and return filtered results
  const results = useMemo(() => {
    if (!query || query.trim().length === 0) {
      return componentRegistry;
    }

    const searchResults = fuse.search(query.trim());
    return searchResults.map((result) => result.item);
  }, [query, fuse]);

  return results;
}
