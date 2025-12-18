'use client';

import { useOrganizations } from './use-organizations';
import { OrganizationHeader } from './components/organization-header';
import { OrganizationView } from './components/organization-view';
import { OrganizationForm } from './components/organization-form';
import { InviteMemberDialog } from './components/invite-member-dialog';

export default function OrganizationsApp() {
  const orgs = useOrganizations();

  const canManageMembers =
    orgs.organization?.userRole === 'owner' || orgs.organization?.userRole === 'admin';

  return (
    <div className="text-foreground flex h-full flex-col">
      <OrganizationHeader
        organization={orgs.organization}
        organizations={orgs.organizations}
        selectedOrgId={orgs.selectedOrgId}
        isCreatingOrg={orgs.isCreatingOrg}
        onSelectOrg={orgs.setSelectedOrgId}
        onCreateOrg={orgs.openCreateOrg}
        onEditOrg={() => orgs.organization && orgs.openEditOrg(orgs.organization)}
        onDeleteOrg={orgs.handleDeleteOrg}
        onLeaveOrg={orgs.handleLeaveOrg}
      />

      <div className="flex-1 overflow-hidden">
        <OrganizationView
          organization={orgs.organization}
          sharedResources={orgs.sharedResources}
          members={orgs.members}
          invitations={orgs.invitations}
          onOpenInviteDialog={() => orgs.setInviteDialogOpen(true)}
          canManageMembers={canManageMembers}
        />
      </div>

      <OrganizationForm
        open={orgs.orgFormOpen}
        onOpenChange={orgs.setOrgFormOpen}
        organization={orgs.editingOrg}
        mode={orgs.editingOrg ? 'edit' : 'create'}
        isCreating={orgs.isCreatingOrg}
        onCreateOrg={orgs.handleCreateOrg}
        onUpdateOrg={orgs.handleUpdateOrg}
      />

      <InviteMemberDialog
        open={orgs.inviteDialogOpen}
        onOpenChange={orgs.setInviteDialogOpen}
        isInviting={orgs.isInviting}
        onInvite={orgs.handleInvite}
      />
    </div>
  );
}
