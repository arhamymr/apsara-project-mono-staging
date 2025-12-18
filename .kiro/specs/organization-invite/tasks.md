# Implementation Plan: Organization Invite Feature

## Phase 1: Database Schema & Core Backend

- [x] 1. Add organization tables to Convex schema





  - [x] 1.1 Add `organizations` table with name, description, createdBy, timestamps, and index by creator


  - [x] 1.2 Add `organizationMembers` table with organizationId, userId, role, joinedAt, and indexes

  - [x] 1.3 Add `invitations` table with organizationId, email, role, invitedBy, status, timestamps, and indexes

  - [x] 1.4 Add `sharedResources` table with organizationId, resourceType, resourceId, sharedBy, sharedAt, and indexes

  - _Requirements: 1.4, 2.1, 2.5, 3.2, 5.2_

- [x] 2. Implement organization CRUD operations (convex/organizations.ts)





  - [x] 2.1 Create `createOrganization` mutation with name validation and owner assignment


    - Validate non-empty, non-whitespace name
    - Generate unique ID and assign creator as owner
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ]* 2.2 Write property test for organization creation
    - **Property 1: Organization Creation with Valid Name**
    - **Property 2: Empty Name Rejection**
    - **Property 3: Unique Organization Identifiers**
    - **Validates: Requirements 1.2, 1.3, 1.4**
  - [x] 2.3 Create `updateOrganization` mutation for name/description updates

  - [x] 2.4 Create `deleteOrganization` mutation with cascade logic

    - Remove all memberships and pending invitations
    - Unshare (not delete) all shared resources
    - Send notifications to members
    - _Requirements: 7.2, 7.3, 7.4_
  - [ ]* 2.5 Write property test for organization deletion cascade
    - **Property 15: Organization Deletion Cascade**
    - **Validates: Requirements 7.2, 7.3**
  - [x] 2.6 Create `getOrganization` and `listUserOrganizations` queries

    - _Requirements: 6.1_

- [x] 3. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Invitation System


- [x] 4. Implement invitation operations (convex/invitations.ts)




  - [x] 4.1 Create `createInvitation` mutation with validation


    - Validate email format
    - Check for existing pending invitation (reject duplicates)
    - Check if user is already a member (reject)
    - Default role to "editor" if not specified
    - Send notification to invited user if they have an account
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ]* 4.2 Write property tests for invitation creation
    - **Property 4: Invitation Creation for Valid Emails**
    - **Property 5: Duplicate Invitation Prevention**
    - **Property 6: Existing Member Invitation Prevention**
    - **Validates: Requirements 2.1, 2.3, 2.4, 2.5**
  - [x] 4.3 Create `acceptInvitation` mutation

    - Create membership record with assigned role
    - Delete invitation record
    - Send notification to organization owner
    - _Requirements: 3.2, 3.4_
  - [ ]* 4.4 Write property test for invitation acceptance
    - **Property 7: Invitation Acceptance State Transition**
    - **Validates: Requirements 3.2**
  - [x] 4.5 Create `declineInvitation` mutation

    - Delete invitation without creating membership
    - _Requirements: 3.3_
  - [ ]* 4.6 Write property test for invitation decline
    - **Property 8: Invitation Decline State Transition**
    - **Validates: Requirements 3.3**
  - [x] 4.7 Create `cancelInvitation` mutation for owners/admins

  - [x] 4.8 Create `getPendingInvitations` and `getOrganizationInvitations` queries

    - Return invitations with organization name, inviter name, and assigned role
    - _Requirements: 3.1_

- [x] 5. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Member Management


- [x] 6. Implement member operations (convex/organizationMembers.ts)





  - [x] 6.1 Create `updateMemberRole` mutation with permission checks


    - Only owners and admins can change roles
    - Admins cannot modify owners or other admins
    - _Requirements: 4.2_

  - [x] 6.2 Create `removeMember` mutation with owner invariant check

    - Prevent removing last owner
    - Revoke access to all organization resources
    - _Requirements: 4.3, 4.4_
  - [ ]* 6.3 Write property test for owner invariant
    - **Property 9: Owner Invariant**
    - **Validates: Requirements 4.3, 8.3**

  - [x] 6.4 Create `leaveOrganization` mutation

    - Prevent last owner from leaving without transfer/deletion
    - Unshare resources owned by leaving member
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  - [ ]* 6.5 Write property test for member removal access revocation
    - **Property 10: Member Removal Access Revocation**
    - **Validates: Requirements 4.4, 8.2**

  - [x] 6.6 Create `transferOwnership` mutation


  - [x] 6.7 Create `getOrganizationMembers` and `getMemberRole` queries

    - _Requirements: 4.1_


- [x] 7. Checkpoint - Ensure all tests pass




  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Resource Sharing


- [x] 8. Implement resource sharing operations (convex/sharedResources.ts) ✓




  - [x] 8.1 Create `shareResource` mutation


    - Link resource to organization
    - Preserve original owner's full control
    - _Requirements: 5.2, 5.3_
  - [ ]* 8.2 Write property test for resource owner control preservation
    - **Property 12: Resource Owner Control Preservation**
    - **Validates: Requirements 5.3**
  - [x] 8.3 Create `unshareResource` mutation with immediate effect


    - _Requirements: 6.4_
  - [ ]* 8.4 Write property test for unshare immediate effect
    - **Property 14: Unshare Immediate Effect**
    - **Validates: Requirements 6.4**


  - [x] 8.5 Create `getSharedResources` query
    - Return resource type, name, owner, and last modified date
    - _Requirements: 6.1, 6.2_
  - [ ]* 8.6 Write property test for shared resources listing
    - **Property 13: Shared Resources Listing Completeness**
    - **Validates: Requirements 6.1, 6.2**
  - [x] 8.7 Create `canAccessResource` query with role-based access control
    - Editors and above can edit
    - Viewers can only read
    - _Requirements: 5.4, 5.5_
  - [ ]* 8.8 Write property test for role-based access control
    - **Property 11: Role-Based Access Control**


    - **Validates: Requirements 5.4, 5.5**
  - [x] 8.9 Create `getResourceOrganizations` query










- [x] 9. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.






## Phase 5: Frontend - Organization Management

- [x] 10. Create organization management UI components
  - [x] 10.1 Create `OrganizationList` component displaying user's organizations with create button
    - _Requirements: 1.1_
  - [x] 10.2 Create `OrganizationForm` component for create/edit with validation
    - Display form requesting organization name and optional description
    - Show validation error for empty names
    - _Requirements: 1.1, 1.3_
  - [x] 10.3 Create `OrganizationView` component as main organization dashboard
    - Display shared resources list
    - _Requirements: 6.1, 6.2_
  - [x] 10.4 Create `MemberList` component with role management
    - Display all members with current roles
    - Allow role changes for owners/admins
    - _Requirements: 4.1, 4.2_
  - [x] 10.5 Create `InviteMemberDialog` component
    - Email input with validation
    - Role selection (default to editor)
    - _Requirements: 2.1, 2.5_

- [x] 11. Create invitation management UI components
  - [x] 11.1 Create `InvitationList` component for pending invitations
    - Display organization name, inviter name, and assigned role
    - _Requirements: 3.1_
  - [x] 11.2 Create `InvitationCard` component with accept/decline actions
    - _Requirements: 3.2, 3.3_

- [x] 12. Create resource sharing UI components










  - [x] 12.1 Create `ShareWithOrgButton` component




    - Display "Share with Organization" option on owned resources
    - _Requirements: 5.1_
  - [x] 12.2 Create `SharedResourcesList` component




    - Show resource type, name, owner, last modified date
    - Open resource with appropriate permission level on click
    - _Requirements: 6.2, 6.3_


  - [x] 12.3 Create `OrganizationPicker` dropdown component





## Phase 6: Frontend - Hooks & Integration

- [x] 13. Create custom React hooks for organization features



  - [x] 13.1 Create `useOrganization(orgId)` hook







  - [x] 13.2 Create `useUserOrganizations()` hook
  - [x] 13.3 Create `useOrganizationMembers(orgId)` hook
  - [x] 13.4 Create `usePendingInvitations()` hook
  - [x] 13.5 Create `useSharedResources(orgId)` hook
  - [x] 13.6 Create `useResourceAccess(resourceType, resourceId)` hook



- [-] 14. Integrate organization features with existing apps



  - [ ] 14.1 Add share button to Kanban board header
    - _Requirements: 5.1_
  - [x] 14.2 Add share button to Notes app


    - _Requirements: 5.1_
  - [-] 14.3 Add share button to Vibe Coding sessions

    - _Requirements: 5.1_
  - [ ] 14.4 Update resource access checks in existing apps
    - Check organization membership and role for shared resources
    - _Requirements: 5.4, 5.5, 6.3_

- [ ] 15. Create Organization app entry point

  - [ ] 15.1 Create `OrganizationApp.tsx` main component
  - [ ] 15.2 Add organization app to app-definitions.tsx
  - [ ] 15.3 Add organization icon to dock/launcher

- [ ] 16. Final Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.
