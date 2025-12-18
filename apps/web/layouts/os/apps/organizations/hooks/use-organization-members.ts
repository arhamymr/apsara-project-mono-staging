'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { OrganizationId } from '../types';

/**
 * Hook to get all members of an organization
 */
export function useOrganizationMembers(orgId: OrganizationId | null | undefined) {
  const members = useQuery(
    api.organizationMembers.getOrganizationMembers,
    orgId ? { organizationId: orgId } : 'skip'
  );

  return {
    members: members ?? [],
    isLoading: members === undefined && orgId !== null && orgId !== undefined,
    isEmpty: members !== undefined && members.length === 0,
  };
}
