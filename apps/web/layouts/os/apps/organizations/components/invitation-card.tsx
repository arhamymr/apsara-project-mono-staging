'use client';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@/lib/utils';
import { Building2, Clock, Check, X } from 'lucide-react';
import type { PendingInvitation, InvitationRole } from '../types';

interface InvitationCardProps {
  invitation: PendingInvitation;
  isAccepting?: boolean;
  isDeclining?: boolean;
  onAccept: (invitationId: PendingInvitation['_id']) => void;
  onDecline: (invitationId: PendingInvitation['_id']) => void;
}

const roleColors: Record<InvitationRole, string> = {
  admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  editor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

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
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function InvitationCard({
  invitation,
  isAccepting,
  isDeclining,
  onAccept,
  onDecline,
}: InvitationCardProps) {
  const isLoading = isAccepting || isDeclining;

  return (
    <div className="hover:bg-accent/50 rounded-lg border p-4 transition-colors">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
          <Building2 className="text-primary h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-medium">{invitation.organizationName}</h4>
          <p className="text-muted-foreground text-sm">
            Invited by {invitation.inviterName}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                roleColors[invitation.role]
              )}
            >
              {invitation.role}
            </span>
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(invitation.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          onClick={() => onAccept(invitation._id)}
          disabled={isLoading}
          className="flex-1"
        >
          {isAccepting ? (
            <span className="animate-pulse">Joining...</span>
          ) : (
            <>
              <Check className="mr-1.5 h-4 w-4" />
              Accept Invitation
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDecline(invitation._id)}
          disabled={isLoading}
          className="text-muted-foreground hover:text-destructive"
        >
          {isDeclining ? (
            <span className="animate-pulse">Ignoring...</span>
          ) : (
            <>
              <X className="mr-1.5 h-4 w-4" />
              Ignore
            </>
          )}
        </Button>
      </div>
      <p className="text-muted-foreground mt-2 text-xs">
        Click Ignore if you don&apos;t want to join this organization
      </p>
    </div>
  );
}
