'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

/**
 * Hook to get all organizations the current user is a member of
 */
export function useUserOrganizations() {
  const organizations = useQuery(api.organizations.listUserOrganizations, {});

  return {
    organizations: organizations ?? [],
    isLoading: organizations === undefined,
    isEmpty: organizations !== undefined && organizations.length === 0,
  };
}
