'use client';

import { Input } from '@workspace/ui/components/input';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Search, Check, FileQuestion } from 'lucide-react';
import type { DocsSidebarProps } from '../types';

/**
 * DocsSidebar Component
 * 
 * Displays the sidebar for the Documentation App with:
 * - Search input field
 * - List of all apps with icons
 * - Documentation availability indicator (checkmark/dimmed)
 * - App selection handling
 * 
 * Requirements: 1.1, 4.1, 4.2, 4.3
 */
export function DocsSidebar({
  apps,
  selectedAppId,
  onSelectApp,
  searchQuery,
  onSearchChange,
}: DocsSidebarProps) {
  // Filter apps based on search query
  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden border-r bg-card/50">
      {/* Search Input */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search apps..."
            className="pl-9 h-9"
          />
        </div>
      </div>

      {/* Apps List */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-1">
          {filteredApps.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              No apps found
            </div>
          ) : (
            filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => onSelectApp(app.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                  selectedAppId === app.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                } ${!app.hasDocumentation ? 'opacity-60' : ''}`}
              >
                {/* App Icon */}
                <span className="text-lg flex-shrink-0">{app.icon}</span>
                
                {/* App Name */}
                <span className="flex-1 text-sm font-medium truncate">
                  {app.name}
                </span>
                
                {/* Documentation Status Indicator */}
                {app.hasDocumentation ? (
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <FileQuestion className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer with stats */}
      <div className="p-3 border-t text-xs text-muted-foreground">
        {apps.filter((a) => a.hasDocumentation).length} of {apps.length} apps documented
      </div>
    </aside>
  );
}
