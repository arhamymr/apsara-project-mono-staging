# Organization Sharing Feature Guide

## Overview

The organization sharing feature allows users to collaborate by sharing resources with team members through organizations. This feature is now fully implemented across all major resource types in the application.

## Supported Resource Types

The following resources can be shared with organizations:

1. **Blogs** - Share blog posts with organization members
2. **Notes** - Collaborate on notes with your team
3. **Kanban Boards** - Share project boards for team collaboration
4. **Chat Sessions** - Share AI chat conversations
5. **Artifacts** - Share generated code artifacts
6. **Lead Pipelines** - Share sales pipelines with your team
7. **E-commerce Shops** - Share online stores with organization members ✨ **NEW**

## How It Works

### 1. Creating an Organization

Users can create organizations and invite team members with different roles:
- **Owner** - Full control over the organization
- **Admin** - Can manage members and shared resources
- **Editor** - Can edit shared resources
- **Viewer** - Read-only access to shared resources

### 2. Sharing Resources

Resource owners can share their resources with organizations they belong to:

1. Open any resource (blog, shop, kanban board, etc.)
2. Click the "Share with Organization" button
3. Select the organization you want to share with
4. The resource is now accessible to all organization members

### 3. Access Levels

- **Owner** - The original creator maintains full control
- **Edit Access** - Organization members with Owner, Admin, or Editor roles can modify shared resources
- **View Access** - Organization members with Viewer role can only read shared resources
- **None** - Users not in the organization cannot access the resource

### 4. Unsharing Resources

Resource owners or organization admins can unshare resources at any time:

1. Click the "Share with Organization" button
2. Click the X button next to the organization name
3. The resource is immediately removed from the organization

## Implementation Details

### Database Schema

The feature uses four main tables:

```typescript
organizations: {
  name: string
  description?: string
  createdBy: Id<"users">
  createdAt: number
  updatedAt: number
}

organizationMembers: {
  organizationId: Id<"organizations">
  userId: Id<"users">
  role: "owner" | "admin" | "editor" | "viewer"
  joinedAt: number
}

invitations: {
  organizationId: Id<"organizations">
  email: string
  role: "admin" | "editor" | "viewer"
  invitedBy: Id<"users">
  status: "pending" | "accepted" | "declined" | "cancelled"
  createdAt: number
  respondedAt?: number
}

sharedResources: {
  organizationId: Id<"organizations">
  resourceType: "blog" | "note" | "kanbanBoard" | "chatSession" | "artifact" | "leadPipeline" | "shop"
  resourceId: string
  sharedBy: Id<"users">
  sharedAt: number
}
```

### Key Components

#### ShareWithOrgButton Component

Located at: `apps/web/layouts/os/apps/organizations/components/share-with-org-button.tsx`

This reusable component provides:
- Organization selection dropdown
- List of currently shared organizations
- Share/unshare functionality
- Badge showing number of organizations the resource is shared with

Usage example:
```tsx
<ShareWithOrgButton
  resourceType="shop"
  resourceId={shop._id}
  resourceName={shop.name}
  variant="outline"
  size="sm"
/>
```

### Convex Functions

#### organizations.ts
- `createOrganization` - Create a new organization
- `updateOrganization` - Update organization details
- `deleteOrganization` - Delete organization with cascade cleanup
- `getOrganization` - Get organization details
- `listUserOrganizations` - List all organizations for current user

#### sharedResources.ts
- `shareResource` - Share a resource with an organization
- `unshareResource` - Remove resource from organization
- `getSharedResources` - Get all resources shared with an organization
- `canAccessResource` - Check user's access level to a resource
- `getResourceOrganizations` - Get all organizations a resource is shared with

## Where to Find It

### In the UI

1. **Blog Editor** - `apps/web/layouts/os/apps/blogs/edit.tsx`
2. **Notes App** - `apps/web/layouts/os/apps/notes/components/notes-header.tsx`
3. **Kanban Board** - `apps/web/layouts/os/apps/kanban/components/kanban-header.tsx`
4. **Chat Sessions** - `apps/web/layouts/os/apps/vibe-coding/components/chat/chat-header.tsx`
5. **Lead Management** - `apps/web/layouts/os/apps/lead-management/components/lead-pipeline-header.tsx`
6. **E-commerce Shop** - `apps/web/layouts/os/apps/ecommerce/index.tsx` ✨ **NEW**

### Backend

- **Schema** - `apps/web/convex/schema.ts`
- **Organizations Logic** - `apps/web/convex/organizations.ts`
- **Sharing Logic** - `apps/web/convex/sharedResources.ts`

## Benefits

1. **Seamless Collaboration** - Team members can work together on shared resources
2. **Granular Permissions** - Control who can view vs edit resources
3. **Centralized Management** - Manage all shared resources from the organization view
4. **Instant Updates** - Changes to shared resources are immediately visible to all members
5. **Owner Control** - Original owners maintain full control and can unshare at any time

## Security Features

- Only resource owners can share their resources
- Viewers cannot share resources (only owners, admins, and editors)
- Resource owners always maintain full control
- Unsharing is immediate and removes all organization access
- When an organization is deleted, all shared resources are automatically unshared

## Next Steps

To add organization sharing to a new resource type:

1. Add the resource type to the `resourceType` union in `schema.ts`
2. Add a case for the resource in `sharedResources.ts` helper functions
3. Import and add the `ShareWithOrgButton` component to the resource's UI
4. Pass the appropriate `resourceType`, `resourceId`, and `resourceName` props

## Example: Adding to E-commerce Shop

```tsx
import { ShareWithOrgButton } from '../organizations/components/share-with-org-button';

// In your component
{hasShop && shop && (
  <ShareWithOrgButton
    resourceType="shop"
    resourceId={shop._id}
    resourceName={shop.name}
    variant="outline"
    size="sm"
  />
)}
```

This feature is now live and ready to use across all supported resource types!
