'use client';

import { Button } from '@workspace/ui/components/button';
import { BookOpen, Search } from 'lucide-react';
import type { DocsHeaderProps } from '../types';

/**
 * DocsHeader Component
 * 
 * Displays the header for the Documentation App with:
 * - Selected app name and icon
 * - Search trigger button
 * 
 * Requirements: 1.1
 */
export function DocsHeader({ selectedApp, onSearch }: DocsHeaderProps) {
  return (
    <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
      <div className="flex items-center gap-3">
        {selectedApp ? (
          <>
            <span className="text-xl">{selectedApp.icon}</span>
            <h2 className="text-base font-semibold">{selectedApp.name}</h2>
          </>
        ) : (
          <>
            <BookOpen className="h-5 w-5" />
            <h2 className="text-base font-semibold">Documentation</h2>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>
    </div>
  );
}
