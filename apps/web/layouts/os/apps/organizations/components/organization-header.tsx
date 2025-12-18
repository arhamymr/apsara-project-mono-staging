'use client';

import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import { Building2, Loader2, LogOut, Pencil, Plus, Trash2 } from 'lucide-react';
import { OrganizationList } from './organization-list';
import type { Organization, OrganizationId } from '../types';

interface OrganizationHeaderProps {
  organization: Organization | null | undefined;
  organizations: Organization[] | undefined;
  selectedOrgId: OrganizationId | null;
  isCreatingOrg: boolean;
  onSelectOrg: (id: OrganizationId) => void;
  onCreateOrg: () => void;
  onEditOrg: () => void;
  onDeleteOrg: (id: OrganizationId) => void;
  onLeaveOrg: () => void;
}

export function OrganizationHeader({
  organization,
  organizations,
  selectedOrgId,
  isCreatingOrg,
  onSelectOrg,
  onCreateOrg,
  onEditOrg,
  onDeleteOrg,
  onLeaveOrg,
}: OrganizationHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const portalContainer = useWindowPortalContainer();

  const isOwner = organization?.userRole === 'owner';
  const isAdmin = organization?.userRole === 'admin';
  const canEdit = isOwner || isAdmin;

  const handleConfirmDelete = () => {
    if (organization) {
      onDeleteOrg(organization._id);
    }
    setDeleteDialogOpen(false);
  };

  const handleConfirmLeave = () => {
    onLeaveOrg();
    setLeaveDialogOpen(false);
  };

  return (
    <>
      <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-sm border p-2">
            <Building2 className="h-5 w-5" />
          </div>

          <OrganizationList
            organizations={organizations}
            selectedOrgId={selectedOrgId}
            isCreatingOrg={isCreatingOrg}
            onSelectOrg={onSelectOrg}
            onCreateOrg={onCreateOrg}
            onDeleteOrg={(id) => {
              if (id === selectedOrgId) {
                setDeleteDialogOpen(true);
              } else {
                onDeleteOrg(id);
              }
            }}
          />

          {canEdit && organization && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onEditOrg}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onCreateOrg}
            disabled={isCreatingOrg}
          >
            {isCreatingOrg ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            New Organization
          </Button>

          {organization && !isOwner && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setLeaveDialogOpen(true)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Leave
            </Button>
          )}

          {organization && isOwner && (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Delete Organization Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent portalContainer={portalContainer?.current ?? undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{organization?.name}&rdquo;?
              This will remove all members and pending invitations.
              Shared resources will be returned to their original owners.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Organization
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Leave Organization Dialog */}
      <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
        <AlertDialogContent portalContainer={portalContainer?.current ?? undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Organization</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave &ldquo;{organization?.name}&rdquo;?
              You will lose access to all shared resources.
              Any resources you shared will be unshared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmLeave}>
              Leave Organization
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
