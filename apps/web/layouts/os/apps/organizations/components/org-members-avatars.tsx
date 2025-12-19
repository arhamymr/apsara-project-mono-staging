'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@workspace/ui/components/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@/lib/utils';
import { Users } from 'lucide-react';
import type { OrganizationId, ResourceType } from '../types';

interface OrgMembersAvatarsProps {
  resourceType: ResourceType;
  resourceId: string;
  maxAvatars?: number;
  className?: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

interface SharedOrg {
  organizationId: OrganizationId;
  organizationName: string;
}

export function OrgMembersAvatars({
  resourceType,
  resourceId,
  maxAvatars = 3,
  className,
}: OrgMembersAvatarsProps) {
  // Get organizations this resource is shared with
  const sharedOrganizations = useQuery(
    api.sharedResources.getResourceOrganizations,
    { resourceType, resourceId }
  ) as SharedOrg[] | undefined;

  // Get the first organization's ID to fetch members
  const firstOrgId = sharedOrganizations?.[0]?.organizationId;

  // Get members of the first shared organization
  const members = useQuery(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (api as any).organizationMembers.getOrganizationMembers,
    firstOrgId ? { organizationId: firstOrgId } : 'skip'
  ) as Member[] | undefined;

  // Don't render if resource is not shared
  if (!sharedOrganizations || sharedOrganizations.length === 0) {
    return null;
  }

  if (!members || members.length === 0) {
    return null;
  }

  const visibleMembers = members.slice(0, maxAvatars);
  const remainingCount = members.length - maxAvatars;
  const orgName = sharedOrganizations[0]?.organizationName || 'Organization';

  return (
    <TooltipProvider>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-1 rounded-md px-2 py-1 hover:bg-accent transition-colors',
              className
            )}
          >
            <Users className="h-4 w-4 text-muted-foreground mr-1" />
            <div className="flex -space-x-2">
              {visibleMembers.map((member) => (
                <Tooltip key={member._id}>
                  <TooltipTrigger asChild>
                    <div className="relative h-6 w-6 rounded-full border-2 border-background bg-muted overflow-hidden">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    {member.name}
                  </TooltipContent>
                </Tooltip>
              ))}
              {remainingCount > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground">
                  +{remainingCount}
                </div>
              )}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="end">
          <div className="border-b px-3 py-2">
            <p className="text-sm font-medium">{orgName}</p>
            <p className="text-xs text-muted-foreground">
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </p>
          </div>
          <ScrollArea className="max-h-[200px]">
            <div className="p-2 space-y-1">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent"
                >
                  <div className="relative h-7 w-7 rounded-full bg-muted overflow-hidden shrink-0">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize shrink-0">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
