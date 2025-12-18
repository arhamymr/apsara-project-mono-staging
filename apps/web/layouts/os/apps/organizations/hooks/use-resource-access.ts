'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { ResourceType } from '../types';

type AccessLevel = 'none' | 'view' | 'edit' | 'owner';

/**
 * Hook to check if the current user can access a resource and at what level
 * Returns access level: "owner", "edit", "view", or "none"
 */
export function useResourceAccess(
  resourceType: ResourceType | null | undefined,
  resourceId: string | null | undefined
) {
  const accessLevel = useQuery(
    api.sharedResources.canAccessResource,
    resourceType && resourceId ? { resourceType, resourceId } : 'skip'
  );

  const canView = accessLevel === 'view' || accessLevel === 'edit' || accessLevel === 'owner';
  const canEdit = accessLevel === 'edit' || accessLevel === 'owner';
  const isOwner = accessLevel === 'owner';

  return {
    accessLevel: (accessLevel ?? 'none') as AccessLevel,
    isLoading: accessLevel === undefined && resourceType !== null && resourceId !== null,
    canView,
    canEdit,
    isOwner,
  };
}
