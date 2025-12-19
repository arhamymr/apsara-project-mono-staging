'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
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
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@/lib/utils';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import {
  Crown,
  Mail,
  MoreHorizontal,
  ShieldCheck,
  Eye,
  Pencil,
  UserMinus,
  Users,
} from 'lucide-react';
import type { Member, MemberId, Role, UserId } from '../types';

interface MemberListProps {
  members: Member[] | undefined;
  currentUserRole: Role | undefined;
  currentUserId?: UserId;
  onUpdateRole: (memberId: MemberId, role: Exclude<Role, 'owner'>) => void;
  onRemoveMember: (memberId: MemberId) => void;
  onTransferOwnership: (userId: UserId) => void;
  onOpenInviteDialog: () => void;
}

const roleIcons: Record<Role, React.ElementType> = {
  owner: Crown,
  admin: ShieldCheck,
  editor: Pencil,
  viewer: Eye,
};

const roleColors: Record<Role, string> = {
  owner: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  editor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
};

export function MemberList({
  members,
  currentUserRole,
  currentUserId,
  onUpdateRole,
  onRemoveMember,
  onTransferOwnership,
  onOpenInviteDialog,
}: MemberListProps) {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const portalContainer = useWindowPortalContainer();

  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin';
  const isOwner = currentUserRole === 'owner';

  const canModifyMember = (member: Member): boolean => {
    if (!canManageMembers) return false;
    if (member.userId === currentUserId) return false;
    if (currentUserRole === 'admin') {
      // Admins cannot modify owners or other admins
      return member.role !== 'owner' && member.role !== 'admin';
    }
    return true;
  };

  const handleRemoveClick = (member: Member) => {
    setSelectedMember(member);
    setRemoveDialogOpen(true);
  };

  const handleTransferClick = (member: Member) => {
    setSelectedMember(member);
    setTransferDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    if (selectedMember) {
      onRemoveMember(selectedMember._id);
    }
    setRemoveDialogOpen(false);
    setSelectedMember(null);
  };

  const handleConfirmTransfer = () => {
    if (selectedMember) {
      onTransferOwnership(selectedMember.userId);
    }
    setTransferDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="font-semibold">Team Members</h3>
          {canManageMembers && (
            <Button size="sm" onClick={onOpenInviteDialog}>
              <Mail className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4">
            {members && members.length > 0 ? (
              <div className="space-y-2">
                {members.map((member) => {
                  const RoleIcon = roleIcons[member.role];
                  const canModify = canModifyMember(member);
                  const isCurrentUser = member.userId === currentUserId;

                  return (
                    <div
                      key={member._id}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border p-3',
                        isCurrentUser && 'bg-accent/50'
                      )}
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
                        <div className="flex items-center gap-2">
                          <p className="truncate font-medium">{member.name}</p>
                          {isCurrentUser && (
                            <span className="text-muted-foreground text-xs">(you)</span>
                          )}
                        </div>
                        <p className="text-muted-foreground truncate text-xs">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium capitalize',
                            roleColors[member.role]
                          )}
                        >
                          <RoleIcon className="h-3 w-3" />
                          {member.role}
                        </span>
                        {canModify && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-[9999]">
                              {member.role !== 'owner' && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => onUpdateRole(member._id, 'admin')}
                                    disabled={member.role === 'admin'}
                                  >
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Make Admin
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onUpdateRole(member._id, 'editor')}
                                    disabled={member.role === 'editor'}
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Make Editor
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => onUpdateRole(member._id, 'viewer')}
                                    disabled={member.role === 'viewer'}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Make Viewer
                                  </DropdownMenuItem>
                                </>
                              )}
                              {isOwner && member.role !== 'owner' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleTransferClick(member)}>
                                    <Crown className="mr-2 h-4 w-4" />
                                    Transfer Ownership
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleRemoveClick(member)}
                                className="text-destructive focus:text-destructive"
                              >
                                <UserMinus className="mr-2 h-4 w-4" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-muted-foreground py-8 text-center">
                <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No members found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Remove Member Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent portalContainer={portalContainer?.current ?? undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {selectedMember?.name} from this organization?
              They will lose access to all shared resources.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRemove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transfer Ownership Dialog */}
      <AlertDialog open={transferDialogOpen} onOpenChange={setTransferDialogOpen}>
        <AlertDialogContent portalContainer={portalContainer?.current ?? undefined}>
          <AlertDialogHeader>
            <AlertDialogTitle>Transfer Ownership</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to transfer ownership to {selectedMember?.name}?
              You will become an admin and they will become the owner.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTransfer}>
              Transfer Ownership
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
