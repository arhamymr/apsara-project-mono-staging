'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import { Building2, Check, Loader2, Share2, X } from 'lucide-react';
import type { OrganizationId, ResourceType, SharedResourceId } from '../types';

interface ShareWithOrgButtonProps {
  resourceType: ResourceType;
  resourceId: string;
  resourceName?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

interface SharedOrg {
  sharedResourceId: string;
  organizationId: OrganizationId;
  organizationName: string;
  sharedAt: number;
}

/**
 * ShareWithOrgButton - Display "Share with Organization" option on owned resources
 * Requirement: 5.1
 */
export function ShareWithOrgButton({
  resourceType,
  resourceId,
  resourceName,
  variant = 'outline',
  size = 'sm',
  className,
}: ShareWithOrgButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<OrganizationId | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isUnsharing, setIsUnsharing] = useState<string | null>(null);
  const portalContainer = useWindowPortalContainer();

  // Check if user owns this resource (only owners can share)
  const accessLevel = useQuery(api.sharedResources.canAccessResource, {
    resourceType,
    resourceId,
  });

  // Get user's organizations
  const organizations = useQuery(api.organizations.listUserOrganizations, {});
  
  // Get organizations this resource is already shared with (only if user is owner)
  const sharedOrganizations = useQuery(
    api.sharedResources.getResourceOrganizations,
    accessLevel === 'owner' ? { resourceType, resourceId } : 'skip'
  ) as SharedOrg[] | undefined;

  // Mutations
  const shareResourceMutation = useMutation(api.sharedResources.shareResource);
  const unshareResourceMutation = useMutation(api.sharedResources.unshareResource);

  // Filter out organizations the resource is already shared with
  // AND organizations where user is a viewer (viewers can't share resources)
  const availableOrganizations = organizations?.filter(
    (org) => 
      org.userRole !== 'viewer' &&
      !sharedOrganizations?.some((shared) => shared.organizationId === org._id)
  );

  const handleShare = useCallback(async () => {
    if (!selectedOrgId || isSharing) return;
    
    setIsSharing(true);
    try {
      await shareResourceMutation({
        organizationId: selectedOrgId,
        resourceType,
        resourceId,
      });
      toast.success('Resource shared with organization');
      setSelectedOrgId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to share resource');
    } finally {
      setIsSharing(false);
    }
  }, [shareResourceMutation, selectedOrgId, resourceType, resourceId, isSharing]);

  const handleUnshare = useCallback(async (sharedResourceId: string) => {
    if (isUnsharing) return;
    
    setIsUnsharing(sharedResourceId);
    try {
      await unshareResourceMutation({
        sharedResourceId: sharedResourceId as SharedResourceId,
      });
      toast.success('Resource unshared from organization');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to unshare resource');
    } finally {
      setIsUnsharing(null);
    }
  }, [unshareResourceMutation, isUnsharing]);

  // Don't render if user doesn't own the resource or has no organizations
  if (accessLevel !== 'owner' || !organizations || organizations.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="sm:max-w-md"
        portalContainer={portalContainer?.current ?? undefined}
      >
        <DialogHeader>
          <DialogTitle>Share with Organization</DialogTitle>
          <DialogDescription>
            {resourceName 
              ? `Share "${resourceName}" with your organizations to collaborate with team members.`
              : 'Share this resource with your organizations to collaborate with team members.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Currently shared with */}
          {sharedOrganizations && sharedOrganizations.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Currently shared with</label>
              <ScrollArea className="max-h-[120px]">
                <div className="space-y-2">
                  {sharedOrganizations.map((shared) => (
                    <div
                      key={shared.sharedResourceId}
                      className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{shared.organizationName}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => handleUnshare(shared.sharedResourceId)}
                        disabled={isUnsharing === shared.sharedResourceId}
                      >
                        {isUnsharing === shared.sharedResourceId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Share with new organization */}
          {availableOrganizations && availableOrganizations.length > 0 ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Share with organization</label>
              <div className="flex gap-2">
                <Select
                  value={selectedOrgId ?? ''}
                  onValueChange={(value) => setSelectedOrgId(value as OrganizationId)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOrganizations.map((org) => (
                      <SelectItem key={org._id} value={org._id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {org.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleShare}
                  disabled={!selectedOrgId || isSharing}
                >
                  {isSharing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ) : sharedOrganizations && sharedOrganizations.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              This resource is shared with all your organizations.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any organizations to share with.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
