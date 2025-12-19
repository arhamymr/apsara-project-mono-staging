'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Organization, OrganizationId, MemberId, InvitationId, Role, InvitationRole, Member } from './types';

export function useOrganizations() {
  const organizations = useQuery(api.organizations.listUserOrganizations, {});
  const [selectedOrgId, setSelectedOrgId] = useState<OrganizationId | null>(null);
  const organization = useQuery(
    api.organizations.getOrganization,
    selectedOrgId ? { id: selectedOrgId } : 'skip'
  );
  const members = useQuery(
    api.organizationMembers.getOrganizationMembers,
    selectedOrgId ? { organizationId: selectedOrgId } : 'skip'
  );
  const invitations = useQuery(
    api.invitations.getOrganizationInvitations,
    selectedOrgId ? { organizationId: selectedOrgId } : 'skip'
  );
  const sharedResources = useQuery(
    api.sharedResources.getSharedResources,
    selectedOrgId ? { organizationId: selectedOrgId } : 'skip'
  );

  // Auto-select first organization when loaded
  useEffect(() => {
    if (organizations && organizations.length > 0 && !selectedOrgId) {
      const firstOrg = organizations[0];
      if (firstOrg) {
        setSelectedOrgId(firstOrg._id);
      }
    }
  }, [organizations, selectedOrgId]);

  // Mutations
  const createOrgMutation = useMutation(api.organizations.createOrganization);
  const updateOrgMutation = useMutation(api.organizations.updateOrganization);
  const deleteOrgMutation = useMutation(api.organizations.deleteOrganization);
  const createInvitationMutation = useMutation(api.invitations.createInvitation);
  const cancelInvitationMutation = useMutation(api.invitations.cancelInvitation);
  const updateMemberRoleMutation = useMutation(api.organizationMembers.updateMemberRole);
  const removeMemberMutation = useMutation(api.organizationMembers.removeMember);
  const leaveOrgMutation = useMutation(api.organizationMembers.leaveOrganization);
  const transferOwnershipMutation = useMutation(api.organizationMembers.transferOwnership);

  // Loading states
  const [isCreatingOrg, setIsCreatingOrg] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // Modal states
  const [orgFormOpen, setOrgFormOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  // Organization actions
  const handleCreateOrg = useCallback(async (name: string, description?: string) => {
    if (isCreatingOrg) return;
    setIsCreatingOrg(true);
    try {
      const id = await createOrgMutation({ name, description });
      setSelectedOrgId(id);
      setOrgFormOpen(false);
      toast.success('Organization created');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create organization');
    } finally {
      setIsCreatingOrg(false);
    }
  }, [createOrgMutation, isCreatingOrg]);

  const handleUpdateOrg = useCallback(async (id: OrganizationId, name: string, description?: string) => {
    try {
      await updateOrgMutation({ id, name, description });
      setOrgFormOpen(false);
      setEditingOrg(null);
      toast.success('Organization updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update organization');
    }
  }, [updateOrgMutation]);

  const handleDeleteOrg = useCallback(async (id: OrganizationId) => {
    try {
      await deleteOrgMutation({ id });
      if (selectedOrgId === id) setSelectedOrgId(null);
      toast.success('Organization deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete organization');
    }
  }, [deleteOrgMutation, selectedOrgId]);

  // Invitation actions
  const handleInvite = useCallback(async (email: string, role: InvitationRole = 'editor') => {
    if (!selectedOrgId || isInviting) return;
    setIsInviting(true);
    try {
      await createInvitationMutation({ organizationId: selectedOrgId, email, role });
      setInviteDialogOpen(false);
      toast.success('Invitation sent');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  }, [createInvitationMutation, selectedOrgId, isInviting]);

  const handleCancelInvitation = useCallback(async (invitationId: InvitationId) => {
    try {
      await cancelInvitationMutation({ invitationId });
      toast.success('Invitation cancelled');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to cancel invitation');
    }
  }, [cancelInvitationMutation]);

  // Member actions
  const handleUpdateMemberRole = useCallback(async (memberId: MemberId, role: Exclude<Role, 'owner'>) => {
    try {
      await updateMemberRoleMutation({ memberId, role });
      toast.success('Role updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update role');
    }
  }, [updateMemberRoleMutation]);

  const handleRemoveMember = useCallback(async (memberId: MemberId) => {
    try {
      await removeMemberMutation({ memberId });
      toast.success('Member removed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove member');
    }
  }, [removeMemberMutation]);

  const handleLeaveOrg = useCallback(async () => {
    if (!selectedOrgId) return;
    try {
      await leaveOrgMutation({ organizationId: selectedOrgId });
      setSelectedOrgId(null);
      toast.success('Left organization');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to leave organization');
    }
  }, [leaveOrgMutation, selectedOrgId]);

  const handleTransferOwnership = useCallback(async (newOwnerId: Member['userId']) => {
    if (!selectedOrgId) return;
    try {
      await transferOwnershipMutation({ organizationId: selectedOrgId, newOwnerId });
      toast.success('Ownership transferred');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to transfer ownership');
    }
  }, [transferOwnershipMutation, selectedOrgId]);

  // Modal helpers
  const openCreateOrg = () => {
    setEditingOrg(null);
    setOrgFormOpen(true);
  };

  const openEditOrg = (org: Organization) => {
    setEditingOrg(org);
    setOrgFormOpen(true);
  };

  return {
    // Data
    organizations,
    organization,
    members,
    invitations,
    sharedResources,
    selectedOrgId,
    // Loading states
    isCreatingOrg,
    isInviting,
    // Modal states
    orgFormOpen,
    inviteDialogOpen,
    editingOrg,
    // Setters
    setSelectedOrgId,
    setOrgFormOpen,
    setInviteDialogOpen,
    // Organization actions
    handleCreateOrg,
    handleUpdateOrg,
    handleDeleteOrg,
    // Invitation actions
    handleInvite,
    handleCancelInvitation,
    // Member actions
    handleUpdateMemberRole,
    handleRemoveMember,
    handleLeaveOrg,
    handleTransferOwnership,
    // Modal helpers
    openCreateOrg,
    openEditOrg,
  };
}
