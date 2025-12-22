'use client';

import { useCallback } from 'react';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  FileText,
  FolderKanban,
  MessageSquare,
  Package,
  Clock,
  ExternalLink,
  User,
  Newspaper,
  GitBranch,
} from 'lucide-react';
import type { SharedResource, ResourceType } from '../types';

interface SharedResourcesListProps {
  resources: SharedResource[] | undefined;
  onOpenResource?: (resourceType: ResourceType, resourceId: string) => void;
  emptyMessage?: string;
  showOwner?: boolean;
  className?: string;
}

const resourceTypeIcons: Record<ResourceType, React.ElementType> = {
  kanbanBoard: FolderKanban,
  note: FileText,
  chatSession: MessageSquare,
  artifact: Package,
  leadPipeline: GitBranch,
  blog: Newspaper,
};

const resourceTypeLabels: Record<ResourceType, string> = {
  kanbanBoard: 'Kanban Board',
  note: 'Note',
  chatSession: 'Chat Session',
  artifact: 'Artifact',
  leadPipeline: 'Lead Pipeline',
  blog: 'Blog',
};

const resourceTypeColors: Record<ResourceType, string> = {
  kanbanBoard: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  note: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  chatSession: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  artifact: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  leadPipeline: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  blog: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * SharedResourcesList - Display shared resources with type, name, owner, and last modified date
 * Opens resource with appropriate permission level on click
 * Requirements: 6.2, 6.3
 */
export function SharedResourcesList({
  resources,
  onOpenResource,
  emptyMessage = 'No shared resources yet',
  showOwner = true,
  className,
}: SharedResourcesListProps) {
  const handleResourceClick = useCallback(
    (resource: SharedResource) => {
      if (onOpenResource) {
        onOpenResource(resource.resourceType, resource.resourceId);
      }
    },
    [onOpenResource]
  );

  if (!resources || resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-muted-foreground text-sm">{emptyMessage}</p>
        <p className="text-muted-foreground/70 text-xs mt-1">
          Share resources from your apps to collaborate
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className={className}>
      <div className="space-y-2 p-1">
        {resources.map((resource) => {
          const Icon = resourceTypeIcons[resource.resourceType];
          const typeLabel = resourceTypeLabels[resource.resourceType];
          const typeColor = resourceTypeColors[resource.resourceType];

          return (
            <div
              key={resource._id}
              className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent cursor-pointer"
              onClick={() => handleResourceClick(resource)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleResourceClick(resource);
                }
              }}
            >
              {/* Resource Type Icon */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${typeColor}`}>
                <Icon className="h-5 w-5" />
              </div>

              {/* Resource Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium">{resource.name}</p>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    {typeLabel}
                  </span>
                  {showOwner && (
                    <>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {resource.ownerName}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Last Modified */}
              <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatRelativeTime(resource.lastModified)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
