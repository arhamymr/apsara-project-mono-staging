'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { OrganizationId } from '../types';

/**
 * Hook to get a single organization by ID
 * Returns organization details if user is a member
 */
export function useOrganization(orgId: OrganizationId | null | undefined) {
  const organization = useQuery(
    api.organizations.getOrganization,
    orgId ? { id: orgId } : 'skip'
  );

  return {
    organization,
    isLoading: organization === undefined && orgId !== null && orgId !== undefined,
  };
}
