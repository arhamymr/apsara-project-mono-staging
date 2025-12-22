'use client';

import type { Id } from '@/convex/_generated/dataModel';

export type OrganizationId = Id<'organizations'>;
export type MemberId = Id<'organizationMembers'>;
export type InvitationId = Id<'invitations'>;
export type SharedResourceId = Id<'sharedResources'>;
export type UserId = Id<'users'>;

export type Role = 'owner' | 'admin' | 'editor' | 'viewer';
export type InvitationRole = 'admin' | 'editor' | 'viewer';
export type ResourceType = 'kanbanBoard' | 'note' | 'chatSession' | 'artifact' | 'leadPipeline' | 'blog' | 'shop';

export interface Organization {
  _id: OrganizationId;
  name: string;
  description?: string;
  createdBy: UserId;
  createdAt: number;
  updatedAt: number;
  memberCount: number;
  userRole: Role;
  joinedAt?: number;
}

export interface Member {
  _id: MemberId;
  userId: UserId;
  role: Role;
  joinedAt: number;
  name: string;
  email: string;
  image?: string;
}

export interface Invitation {
  _id: InvitationId;
  email: string;
  role: InvitationRole;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  inviterName: string;
  createdAt: number;
  respondedAt?: number;
}

export interface PendingInvitation {
  _id: InvitationId;
  organizationId: OrganizationId;
  organizationName: string;
  inviterName: string;
  role: InvitationRole;
  createdAt: number;
}

export interface SharedResource {
  _id: SharedResourceId;
  resourceType: ResourceType;
  resourceId: string;
  name: string;
  ownerName: string;
  ownerId: UserId;
  lastModified: number;
  sharedAt: number;
  sharedBy: UserId;
}
