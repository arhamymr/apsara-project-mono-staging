'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Building2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrganizationId } from '../types';

interface OrganizationPickerProps {
  value?: OrganizationId | null;
  onValueChange: (value: OrganizationId) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showMemberCount?: boolean;
  excludeIds?: OrganizationId[];
  size?: 'sm' | 'default';
}

/**
 * OrganizationPicker - Dropdown component to select an organization
 * Used for sharing resources and other organization selection needs
 */
export function OrganizationPicker({
  value,
  onValueChange,
  placeholder = 'Select organization',
  disabled = false,
  className,
  showMemberCount = false,
  excludeIds = [],
  size = 'default',
}: OrganizationPickerProps) {
  const organizations = useQuery(api.organizations.listUserOrganizations, {});

  // Filter out excluded organizations
  const availableOrganizations = organizations?.filter(
    (org) => !excludeIds.includes(org._id)
  );

  // Find selected organization for display
  const selectedOrg = organizations?.find((org) => org._id === value);

  if (!organizations) {
    return (
      <Select disabled>
        <SelectTrigger className={cn('w-full', className)} size={size}>
          <SelectValue placeholder="Loading..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (organizations.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className={cn('w-full', className)} size={size}>
          <SelectValue placeholder="No organizations" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select
      value={value ?? undefined}
      onValueChange={onValueChange}
      disabled={disabled || availableOrganizations?.length === 0}
    >
      <SelectTrigger className={cn('w-full', className)} size={size}>
        <SelectValue placeholder={placeholder}>
          {selectedOrg && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{selectedOrg.name}</span>
              {showMemberCount && (
                <span className="text-muted-foreground text-xs">
                  ({selectedOrg.memberCount})
                </span>
              )}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableOrganizations && availableOrganizations.length > 0 ? (
          availableOrganizations.map((org) => (
            <SelectItem key={org._id} value={org._id}>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{org.name}</span>
                {showMemberCount && (
                  <span className="flex items-center gap-1 text-muted-foreground text-xs ml-auto">
                    <Users className="h-3 w-3" />
                    {org.memberCount}
                  </span>
                )}
              </div>
            </SelectItem>
          ))
        ) : (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            No organizations available
          </div>
        )}
      </SelectContent>
    </Select>
  );
}

/**
 * Standalone hook to get organizations for custom implementations
 */
export function useOrganizationsList() {
  const organizations = useQuery(api.organizations.listUserOrganizations, {});
  return {
    organizations,
    isLoading: organizations === undefined,
    isEmpty: organizations?.length === 0,
  };
}
