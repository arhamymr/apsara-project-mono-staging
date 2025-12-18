'use client';

import { useCallback, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import type { OrganizationId, SharedResourceId } from '../types';

/**
 * Hook to get and manage shared resources for an organization
 */
export function useSharedResources(orgId: OrganizationId | null | undefined) {
  const resources = useQuery(
    api.sharedResources.getSharedResources,
    orgId ? { organizationId: orgId } : 'skip'
  );
  const unshareMutation = useMutation(api.sharedResources.unshareResource);

  const [unsharing, setUnsharing] = useState<SharedResourceId | null>(null);

  const unshareResource = useCallback(async (sharedResourceId: SharedResourceId) => {
    setUnsharing(sharedResourceId);
    try {
      await unshareMutation({ sharedResourceId });
      toast.success('Resource unshared');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to unshare resource');
    } finally {
      setUnsharing(null);
    }
  }, [unshareMutation]);

  return {
    resources: resources ?? [],
    isLoading: resources === undefined && orgId !== null && orgId !== undefined,
    isEmpty: resources !== undefined && resources.length === 0,
    unsharing,
    unshareResource,
  };
}
