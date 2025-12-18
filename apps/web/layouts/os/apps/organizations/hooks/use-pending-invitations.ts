'use client';

import { useCallback, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import type { InvitationId } from '../types';

/**
 * Hook to get and manage pending invitations for the current user
 */
export function usePendingInvitations() {
  const invitations = useQuery(api.invitations.getPendingInvitations, {});
  const acceptMutation = useMutation(api.invitations.acceptInvitation);
  const declineMutation = useMutation(api.invitations.declineInvitation);

  const [processingId, setProcessingId] = useState<InvitationId | null>(null);

  const acceptInvitation = useCallback(async (invitationId: InvitationId) => {
    setProcessingId(invitationId);
    try {
      await acceptMutation({ invitationId });
      toast.success('Invitation accepted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to accept invitation');
    } finally {
      setProcessingId(null);
    }
  }, [acceptMutation]);

  const declineInvitation = useCallback(async (invitationId: InvitationId) => {
    setProcessingId(invitationId);
    try {
      await declineMutation({ invitationId });
      toast.success('Invitation declined');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to decline invitation');
    } finally {
      setProcessingId(null);
    }
  }, [declineMutation]);

  return {
    invitations: invitations ?? [],
    isLoading: invitations === undefined,
    isEmpty: invitations !== undefined && invitations.length === 0,
    processingId,
    acceptInvitation,
    declineInvitation,
  };
}
