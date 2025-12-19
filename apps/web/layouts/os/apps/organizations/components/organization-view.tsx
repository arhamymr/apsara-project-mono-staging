'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { cn } from '@/lib/utils';
import {
  FileText,
  FolderKanban,
  MessageSquare,
  Package,
  Users,
  Mail,
  Clock,
  RefreshCw,
} from 'lucide-react';
import type { Organization, SharedResource, Member, Invitation, InvitationId } from '../types';

interface OrganizationViewProps {
  organization: Organization | null | undefined;
  sharedResources: SharedResource[] | undefined;
  members: Member[] | undefined;
  invitations: Invitation[] | undefined;
  onOpenInviteDialog: () => void;
  canManageMembers: boolean;
}

const resourceTypeIcons: Record<string, React.ElementType> = {
  kanbanBoard: FolderKanban,
  note: FileText,
  chatSession: MessageSquare,
  artifact: Package,
};

const resourceTypeLabels: Record<string, string> = {
  kanbanBoard: 'Kanban Board',
  note: 'Note',
  chatSession: 'Chat Session',
  artifact: 'Artifact',
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(timestamp);
}

export function OrganizationView({
  organization,
  sharedResources,
  members,
  invitations,
  onOpenInviteDialog,
  canManageMembers,
}: OrganizationViewProps) {
  const [resendingId, setResendingId] = useState<InvitationId | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resendInvitationMutation = useMutation((api as any).invitations.resendInvitation);

  const handleResendInvitation = async (invitationId: InvitationId) => {
    setResendingId(invitationId);
    try {
      await resendInvitationMutation({ invitationId });
      toast.success('Invitation reminder sent!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resend invitation');
    } finally {
      setResendingId(null);
    }
  };

  if (!organization) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground text-center">
          <p className="text-lg font-medium">No organization selected</p>
          <p className="text-sm">Select or create an organization to get started</p>
        </div>
      </div>
    );
  }

  const pendingInvitations = invitations?.filter((inv) => inv.status === 'pending') || [];

  return (
    <div className="flex h-full flex-col">
      {/* Organization Info */}
      <div className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">{organization.name}</h2>
        {organization.description && (
          <p className="text-muted-foreground text-sm">{organization.description}</p>
        )}
        <div className="text-muted-foreground mt-1 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {organization.memberCount} {organization.memberCount === 1 ? 'member' : 'members'}
          </span>
          <span className="capitalize">Your role: {organization.userRole}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resources" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="mx-4 mt-2 w-fit">
          <TabsTrigger value="resources" className="gap-1.5">
            <Package className="h-4 w-4" />
            Resources
            {sharedResources && sharedResources.length > 0 && (
              <span className="bg-muted text-muted-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
                {sharedResources.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="members" className="gap-1.5">
            <Users className="h-4 w-4" />
            Members
          </TabsTrigger>
          {canManageMembers && pendingInvitations.length > 0 && (
            <TabsTrigger value="invitations" className="gap-1.5">
              <Mail className="h-4 w-4" />
              Invitations
              <span className="bg-primary text-primary-foreground ml-1 rounded-full px-1.5 py-0.5 text-xs">
                {pendingInvitations.length}
              </span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Resources Tab */}
        <TabsContent value="resources" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              {sharedResources && sharedResources.length > 0 ? (
                <div className="space-y-2">
                  {sharedResources.map((resource) => {
                    const Icon = resourceTypeIcons[resource.resourceType] || Package;
                    return (
                      <div
                        key={resource._id}
                        className="hover:bg-accent flex items-center gap-3 rounded-lg border p-3 transition-colors"
                      >
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                          <Icon className="text-muted-foreground h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{resource.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {resourceTypeLabels[resource.resourceType]} • Shared by {resource.ownerName}
                          </p>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(resource.lastModified)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <Package className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No shared resources yet</p>
                  <p className="text-xs">Share resources from your apps to collaborate</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium">Team Members</h3>
                {canManageMembers && (
                  <Button size="sm" onClick={onOpenInviteDialog}>
                    <Mail className="mr-2 h-4 w-4" />
                    Invite
                  </Button>
                )}
              </div>
              {members && members.length > 0 ? (
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full overflow-hidden">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-muted-foreground text-sm font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{member.name}</p>
                        <p className="text-muted-foreground truncate text-xs">{member.email}</p>
                      </div>
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs font-medium capitalize',
                          member.role === 'owner' && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
                          member.role === 'admin' && 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
                          member.role === 'editor' && 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
                          member.role === 'viewer' && 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        )}
                      >
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No members found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Invitations Tab */}
        {canManageMembers && (
          <TabsContent value="invitations" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-medium">Pending Invitations</h3>
                  <Button size="sm" onClick={onOpenInviteDialog}>
                    <Mail className="mr-2 h-4 w-4" />
                    Invite
                  </Button>
                </div>
                {pendingInvitations.length > 0 ? (
                  <div className="space-y-2">
                    {pendingInvitations.map((invitation) => (
                      <div
                        key={invitation._id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                          <Mail className="text-muted-foreground h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{invitation.email}</p>
                          <p className="text-muted-foreground text-xs">
                            Invited by {invitation.inviterName} • {formatRelativeTime(invitation.createdAt)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleResendInvitation(invitation._id)}
                          disabled={resendingId === invitation._id}
                          title="Resend invitation notification"
                        >
                          <RefreshCw
                            className={cn(
                              'h-4 w-4',
                              resendingId === invitation._id && 'animate-spin'
                            )}
                          />
                        </Button>
                        <span className="bg-muted text-muted-foreground rounded-full px-2 py-1 text-xs font-medium capitalize">
                          {invitation.role}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground py-8 text-center">
                    <Mail className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>No pending invitations</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
