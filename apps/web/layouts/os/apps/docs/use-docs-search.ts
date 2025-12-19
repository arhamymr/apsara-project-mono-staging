'use client';

import { useState, useCallback, useMemo } from 'react';
import type { SearchResult, UseDocsSearchReturn } from './types';
import { getAllDocEntries } from './docs-registry';

/**
 * Extract a snippet from content around the matching text
 * Returns a preview with context around the match
 */
function extractSnippet(content: string, query: string, maxLength: number = 150): string {
  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  const matchIndex = lowerContent.indexOf(lowerQuery);
  
  if (matchIndex === -1) {
    // No match in content, return beginning of content
    return content.slice(0, maxLength) + (content.length > maxLength ? '...' : '');
  }
  
  // Calculate start and end positions for the snippet
  const contextBefore = 40;
  const contextAfter = maxLength - query.length - contextBefore;
  
  let start = Math.max(0, matchIndex - contextBefore);
  let end = Math.min(content.length, matchIndex + query.length + contextAfter);
  
  // Adjust to word boundaries if possible
  if (start > 0) {
    const spaceIndex = content.indexOf(' ', start);
    if (spaceIndex !== -1 && spaceIndex < matchIndex) {
      start = spaceIndex + 1;
    }
  }
  
  if (end < content.length) {
    const spaceIndex = content.lastIndexOf(' ', end);
    if (spaceIndex > matchIndex + query.length) {
      end = spaceIndex;
    }
  }
  
  let snippet = content.slice(start, end);
  
  // Add ellipsis if truncated
  if (start > 0) {
    snippet = '...' + snippet;
  }
  if (end < content.length) {
    snippet = snippet + '...';
  }
  
  return snippet;
}

/**
 * Check if a string contains the query (case-insensitive)
 */
function containsQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

/**
 * Hook for documentation search functionality
 * 
 * Implements:
 * - Search query state management
 * - Search filtering logic across all documentation
 * - Returns results with app name, title, and snippet
 * 
 * Requirements: 2.1, 2.2, 2.3
 */
export function useDocsSearch(): UseDocsSearchReturn {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Get all documentation entries for searching
  const allEntries = useMemo(() => getAllDocEntries(), []);

  /**
   * Search results filtered by query
   * Matches against title, content, or category name (case-insensitive)
   * 
   * Requirements: 2.1, 2.2
   */
  const results = useMemo((): SearchResult[] => {
    if (!query.trim()) {
      return [];
    }

    setIsSearching(true);

    try {
      const searchResults: SearchResult[] = [];
      const trimmedQuery = query.trim();

      for (const entry of allEntries) {
        // Check if query matches title, content, or category name
        const matchesTitle = containsQuery(entry.entryTitle, trimmedQuery);
        const matchesContent = containsQuery(entry.content, trimmedQuery);
        const matchesCategory = containsQuery(entry.categoryName, trimmedQuery);

        if (matchesTitle || matchesContent || matchesCategory) {
          // Generate snippet from the most relevant source
          let snippet: string;
          if (matchesContent) {
            snippet = extractSnippet(entry.content, trimmedQuery);
          } else if (matchesTitle) {
            snippet = extractSnippet(entry.content, '', 150);
          } else {
            snippet = extractSnippet(entry.content, '', 150);
          }

          searchResults.push({
            appId: entry.appId,
            appName: entry.appName,
            entryId: entry.entryId,
            title: entry.entryTitle,
            snippet,
            category: entry.categoryName,
          });
        }
      }

      return searchResults;
    } finally {
      setIsSearching(false);
    }
  }, [query, allEntries]);

  /**
   * Clear the search query and results
   */
  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch,
  };
}
