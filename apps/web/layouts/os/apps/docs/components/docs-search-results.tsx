'use client';

import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Loader2, Search, FileText } from 'lucide-react';
import type { DocsSearchResultsProps, SearchResult } from '../types';

/**
 * DocsSearchResults Component
 * 
 * Displays search results across all documentation with:
 * - App name, title, and snippet for each result
 * - Result selection to navigate to documentation
 * - "No results" message when empty
 * - Loading state while searching
 * 
 * Requirements: 2.2, 2.3, 2.4
 */
export function DocsSearchResults({
  results,
  onSelectResult,
  isSearching,
}: DocsSearchResultsProps) {
  // Loading state
  if (isSearching) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Searching...</p>
      </div>
    );
  }

  // No results state
  if (results.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Search className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No results found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Try searching with different keywords or check the spelling.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Results list
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      {/* Results header */}
      <div className="border-b px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Results list */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-1">
          {results.map((result) => (
            <SearchResultItem
              key={`${result.appId}-${result.entryId}`}
              result={result}
              onSelect={onSelectResult}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * Individual search result item
 */
interface SearchResultItemProps {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
}

function SearchResultItem({ result, onSelect }: SearchResultItemProps) {
  return (
    <button
      onClick={() => onSelect(result)}
      className="w-full flex flex-col gap-1 p-3 rounded-md text-left transition-colors hover:bg-accent/50 focus:bg-accent/50 focus:outline-none"
    >
      {/* App name and category */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <FileText className="h-3 w-3" />
        <span>{result.appName}</span>
        <span>•</span>
        <span>{result.category}</span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-foreground">
        {result.title}
      </h4>

      {/* Snippet */}
      <p className="text-xs text-muted-foreground line-clamp-2">
        {result.snippet}
      </p>
    </button>
  );
}
