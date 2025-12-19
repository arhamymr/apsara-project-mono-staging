'use client';

import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { cn } from '@/lib/utils';
import { Building2, ChevronDown, Loader2, Plus, Trash2, Users } from 'lucide-react';
import type { Organization, OrganizationId } from '../types';

interface OrganizationListProps {
  organizations: Organization[] | undefined;
  selectedOrgId: OrganizationId | null;
  isCreatingOrg: boolean;
  onSelectOrg: (id: OrganizationId) => void;
  onCreateOrg: () => void;
  onDeleteOrg: (id: OrganizationId) => void;
}

export function OrganizationList({
  organizations,
  selectedOrgId,
  isCreatingOrg,
  onSelectOrg,
  onCreateOrg,
  onDeleteOrg,
}: OrganizationListProps) {
  const selectedOrg = organizations?.find((org) => org._id === selectedOrgId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-3 hover:bg-accent">
          <span className="max-w-[200px] truncate text-base">
            {selectedOrg?.name || 'Select Organization'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="z-[9999] w-72">
        {organizations && organizations.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto">
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org._id}
                onClick={() => onSelectOrg(org._id)}
                className={cn(
                  'group flex cursor-pointer items-center justify-between gap-2 px-2 py-2.5',
                  selectedOrgId === org._id && 'bg-accent'
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div
                    className={cn(
                      'h-2 w-2 shrink-0 rounded-full',
                      selectedOrgId === org._id ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                  />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{org.name}</span>
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Users className="h-3 w-3" />
                      {org.memberCount} {org.memberCount === 1 ? 'member' : 'members'}
                      <span className="mx-1">•</span>
                      <span className="capitalize">{org.userRole}</span>
                    </span>
                  </div>
                </div>
                {org.userRole === 'owner' && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteOrg(org._id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground px-2 py-4 text-center text-sm">
            No organizations yet
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onCreateOrg}
          disabled={isCreatingOrg}
          className="text-primary focus:text-primary cursor-pointer"
        >
          {isCreatingOrg ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Create New Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
