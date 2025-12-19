'use client';

import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { AlertCircle, ChevronLeft, ChevronRight, FileQuestion, RefreshCw } from 'lucide-react';
import { useCallback } from 'react';
import { MarkdownRenderer } from './markdown-renderer';
import type { DocsContentProps } from '../types';

/**
 * DocsContent Component
 * 
 * Displays the main documentation content area with:
 * - Markdown content rendering
 * - Loading skeleton while loading
 * - Error message with retry on failure
 * - Placeholder for apps without documentation
 * - Previous/next navigation buttons
 * 
 * Requirements: 1.2, 1.3, 1.4, 5.1, 5.4, 6.1, 6.2
 */
export function DocsContent({
  appId,
  content,
  isLoading,
  error,
  onNavigate,
  canNavigatePrev,
  canNavigateNext,
  onRetry,
}: DocsContentProps & { onRetry?: () => void }) {
  // Handle code copy - must be before any early returns
  const handleCopyCode = useCallback((code: string) => {
    // Optional: Could add toast notification here
    console.log('Code copied:', code.substring(0, 50) + '...');
  }, []);

  // Loading state - show skeleton
  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="pt-4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="pt-4" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  // Error state - show error message with retry
  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Failed to load documentation</h3>
            <p className="text-sm text-muted-foreground max-w-md">{error}</p>
          </div>
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // No app selected state
  if (!appId) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Select an app</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Choose an app from the sidebar to view its documentation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No documentation available for selected app
  if (!content) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <FileQuestion className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No documentation available</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Documentation for this app is not yet available. Check back later!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Content available - render markdown
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6">
          {/* Category badge */}
          <div className="mb-4">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {content.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-6">{content.title}</h1>

          {/* Markdown content using MarkdownRenderer */}
          <MarkdownRenderer
            content={content.markdown}
            onCopyCode={handleCopyCode}
          />
        </div>
      </ScrollArea>

      {/* Navigation buttons */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('prev')}
            disabled={!canNavigatePrev}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('next')}
            disabled={!canNavigateNext}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
