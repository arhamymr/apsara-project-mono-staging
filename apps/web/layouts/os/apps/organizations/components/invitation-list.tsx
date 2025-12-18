'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Mail, Inbox } from 'lucide-react';
import { InvitationCard } from './invitation-card';
import type { PendingInvitation, InvitationId } from '../types';

interface InvitationListProps {
  onInvitationAccepted?: (organizationId: PendingInvitation['organizationId']) => void;
}

// Note: These API references will work once `npx convex dev` regenerates the types
export function InvitationList({ onInvitationAccepted }: InvitationListProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingInvitations = useQuery((api as any).invitations.getPendingInvitations, {});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const acceptInvitationMutation = useMutation((api as any).invitations.acceptInvitation);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const declineInvitationMutation = useMutation((api as any).invitations.declineInvitation);

  const [acceptingId, setAcceptingId] = useState<InvitationId | null>(null);
  const [decliningId, setDecliningId] = useState<InvitationId | null>(null);

  const handleAccept = useCallback(
    async (invitationId: InvitationId) => {
      setAcceptingId(invitationId);
      try {
        const result = await acceptInvitationMutation({ invitationId });
        toast.success('Invitation accepted! You are now a member.');
        onInvitationAccepted?.(result.organizationId);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to accept invitation');
      } finally {
        setAcceptingId(null);
      }
    },
    [acceptInvitationMutation, onInvitationAccepted]
  );

  const handleDecline = useCallback(
    async (invitationId: InvitationId) => {
      setDecliningId(invitationId);
      try {
        await declineInvitationMutation({ invitationId });
        toast.success('Invitation declined');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to decline invitation');
      } finally {
        setDecliningId(null);
      }
    },
    [declineInvitationMutation]
  );

  if (!pendingInvitations) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading invitations...</div>
      </div>
    );
  }

  if (pendingInvitations.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Inbox className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-lg font-medium">No pending invitations</h3>
        <p className="text-muted-foreground mt-1 text-center text-sm">
          When someone invites you to join their organization, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Mail className="text-muted-foreground h-5 w-5" />
        <h2 className="font-semibold">Pending Invitations</h2>
        <span className="bg-primary text-primary-foreground ml-auto rounded-full px-2 py-0.5 text-xs font-medium">
          {pendingInvitations.length}
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-3 p-4">
          {(pendingInvitations as PendingInvitation[]).map((invitation) => (
            <InvitationCard
              key={invitation._id}
              invitation={invitation}
              isAccepting={acceptingId === invitation._id}
              isDeclining={decliningId === invitation._id}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
