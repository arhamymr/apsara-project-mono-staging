import { v } from "convex/values";
import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

/**
 * Resource type union for type safety
 */
const resourceTypeValidator = v.union(
  v.literal("kanbanBoard"),
  v.literal("note"),
  v.literal("chatSession"),
  v.literal("artifact"),
  v.literal("leadPipeline"),
  v.literal("blog"),
  v.literal("shop")
);

type ResourceType = "kanbanBoard" | "note" | "chatSession" | "artifact" | "leadPipeline" | "blog" | "shop";

/**
 * Access level for resources
 */
type AccessLevel = "none" | "view" | "edit" | "owner";

/**
 * Helper function to verify resource ownership
 * Returns the resource if the user owns it, null otherwise
 */
async function verifyResourceOwnership(
  ctx: QueryCtx | MutationCtx,
  resourceType: ResourceType,
  resourceId: string,
  userId: Id<"users">
): Promise<{ name: string; updatedAt: number } | null> {
  switch (resourceType) {
    case "kanbanBoard": {
      const board = await ctx.db.get(resourceId as Id<"kanbanBoards">);
      if (board && board.userId === userId) {
        return { name: board.name, updatedAt: board.updatedAt };
      }
      return null;
    }
    case "note": {
      const note = await ctx.db.get(resourceId as Id<"notes">);
      if (note && note.userId === userId) {
        return { name: note.title, updatedAt: note.updatedAt };
      }
      return null;
    }
    case "chatSession": {
      const session = await ctx.db.get(resourceId as Id<"chatSessions">);
      if (session && session.userId === userId) {
        return { name: session.title || "Untitled Session", updatedAt: session.updatedAt };
      }
      return null;
    }
    case "artifact": {
      const artifact = await ctx.db.get(resourceId as Id<"artifacts">);
      if (artifact && artifact.userId === userId) {
        return { name: artifact.name, updatedAt: artifact.updatedAt };
      }
      return null;
    }
    case "leadPipeline": {
      const pipeline = await ctx.db.get(resourceId as Id<"leadPipelines">);
      if (pipeline && pipeline.userId === userId) {
        return { name: pipeline.name, updatedAt: pipeline.updatedAt };
      }
      return null;
    }
    case "blog": {
      const blog = await ctx.db.get(resourceId as Id<"blogs">);
      if (blog && blog.authorId === userId) {
        return { name: blog.title, updatedAt: blog.updatedAt };
      }
      return null;
    }
    case "shop": {
      const shop = await ctx.db.get(resourceId as Id<"shops">);
      if (shop && shop.ownerId === userId) {
        return { name: shop.name, updatedAt: shop.updatedAt };
      }
      return null;
    }
    default:
      return null;
  }
}

/**
 * Helper function to get resource details (for any user with access)
 */
async function getResourceDetails(
  ctx: QueryCtx | MutationCtx,
  resourceType: ResourceType,
  resourceId: string
): Promise<{ name: string; updatedAt: number; ownerId: Id<"users"> } | null> {
  switch (resourceType) {
    case "kanbanBoard": {
      const board = await ctx.db.get(resourceId as Id<"kanbanBoards">);
      if (board) {
        return { name: board.name, updatedAt: board.updatedAt, ownerId: board.userId };
      }
      return null;
    }
    case "note": {
      const note = await ctx.db.get(resourceId as Id<"notes">);
      if (note) {
        return { name: note.title, updatedAt: note.updatedAt, ownerId: note.userId };
      }
      return null;
    }
    case "chatSession": {
      const session = await ctx.db.get(resourceId as Id<"chatSessions">);
      if (session) {
        return { name: session.title || "Untitled Session", updatedAt: session.updatedAt, ownerId: session.userId };
      }
      return null;
    }
    case "artifact": {
      const artifact = await ctx.db.get(resourceId as Id<"artifacts">);
      if (artifact) {
        return { name: artifact.name, updatedAt: artifact.updatedAt, ownerId: artifact.userId };
      }
      return null;
    }
    case "leadPipeline": {
      const pipeline = await ctx.db.get(resourceId as Id<"leadPipelines">);
      if (pipeline) {
        return { name: pipeline.name, updatedAt: pipeline.updatedAt, ownerId: pipeline.userId };
      }
      return null;
    }
    case "blog": {
      const blog = await ctx.db.get(resourceId as Id<"blogs">);
      if (blog) {
        return { name: blog.title, updatedAt: blog.updatedAt, ownerId: blog.authorId };
      }
      return null;
    }
    case "shop": {
      const shop = await ctx.db.get(resourceId as Id<"shops">);
      if (shop) {
        return { name: shop.name, updatedAt: shop.updatedAt, ownerId: shop.ownerId };
      }
      return null;
    }
    default:
      return null;
  }
}


/**
 * Share a resource with an organization
 * - Links resource to organization
 * - Preserves original owner's full control
 * Requirements: 5.2, 5.3
 */
export const shareResource = mutation({
  args: {
    organizationId: v.id("organizations"),
    resourceType: resourceTypeValidator,
    resourceId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if organization exists
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) throw new Error("Organization not found");

    // Check if user is a member of the organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", args.organizationId).eq("userId", userId)
      )
      .unique();

    if (!membership) {
      throw new Error("You are not a member of this organization");
    }

    // Only owners, admins, and editors can share resources
    if (membership.role === "viewer") {
      throw new Error("You don't have permission to share resources");
    }

    // Verify the user owns the resource (Requirement 5.3 - preserve owner's control)
    const resource = await verifyResourceOwnership(
      ctx,
      args.resourceType,
      args.resourceId,
      userId
    );

    if (!resource) {
      throw new Error("Resource not found or you don't own this resource");
    }

    // Check if resource is already shared with this organization
    const existingShare = await ctx.db
      .query("sharedResources")
      .withIndex("by_org_resource", (q) =>
        q
          .eq("organizationId", args.organizationId)
          .eq("resourceType", args.resourceType)
          .eq("resourceId", args.resourceId)
      )
      .unique();

    if (existingShare) {
      throw new Error("This resource is already shared with this organization");
    }

    const now = Date.now();

    // Create the shared resource record (Requirement 5.2)
    const sharedResourceId = await ctx.db.insert("sharedResources", {
      organizationId: args.organizationId,
      resourceType: args.resourceType,
      resourceId: args.resourceId,
      sharedBy: userId,
      sharedAt: now,
    });

    return sharedResourceId;
  },
});


/**
 * Unshare a resource from an organization with immediate effect
 * - Removes the resource from the organization's shared resources list
 * - Only the resource owner or organization owners/admins can unshare
 * Requirement: 6.4
 */
export const unshareResource = mutation({
  args: {
    sharedResourceId: v.id("sharedResources"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get the shared resource record
    const sharedResource = await ctx.db.get(args.sharedResourceId);
    if (!sharedResource) {
      throw new Error("Shared resource not found");
    }

    // Check if user is the resource owner (sharedBy)
    const isResourceOwner = sharedResource.sharedBy === userId;

    // Check if user is an owner/admin of the organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", sharedResource.organizationId).eq("userId", userId)
      )
      .unique();

    const isOrgAdmin = membership && (membership.role === "owner" || membership.role === "admin");

    // Only resource owner or org owners/admins can unshare
    if (!isResourceOwner && !isOrgAdmin) {
      throw new Error("You don't have permission to unshare this resource");
    }

    // Delete the shared resource record immediately (Requirement 6.4)
    await ctx.db.delete(args.sharedResourceId);

    return { success: true };
  },
});


/**
 * Get all resources shared with an organization
 * - Returns resource type, name, owner, and last modified date
 * - Only accessible to organization members
 * Requirements: 6.1, 6.2
 */
export const getSharedResources = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Check if user is a member of the organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", args.organizationId).eq("userId", userId)
      )
      .unique();

    if (!membership) {
      return [];
    }

    // Get all shared resources for this organization
    const sharedResources = await ctx.db
      .query("sharedResources")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();

    // Enrich with resource details (Requirement 6.2)
    const enrichedResources = await Promise.all(
      sharedResources.map(async (sharedResource) => {
        const resourceDetails = await getResourceDetails(
          ctx,
          sharedResource.resourceType,
          sharedResource.resourceId
        );

        if (!resourceDetails) {
          // Resource may have been deleted
          return null;
        }

        // Get owner details
        const owner = await ctx.db.get(resourceDetails.ownerId);
        const ownerName = owner?.name || owner?.email || "Unknown";

        return {
          _id: sharedResource._id,
          resourceType: sharedResource.resourceType,
          resourceId: sharedResource.resourceId,
          name: resourceDetails.name,
          ownerName,
          ownerId: resourceDetails.ownerId,
          lastModified: resourceDetails.updatedAt,
          sharedAt: sharedResource.sharedAt,
          sharedBy: sharedResource.sharedBy,
        };
      })
    );

    // Filter out null values (deleted resources) and sort by last modified (newest first)
    return enrichedResources
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.lastModified - a.lastModified);
  },
});


/**
 * Check if the current user can access a resource and at what level
 * - Returns access level: "owner", "edit", "view", or "none"
 * - Editors and above can edit
 * - Viewers can only read
 * Requirements: 5.4, 5.5
 */
export const canAccessResource = query({
  args: {
    resourceType: resourceTypeValidator,
    resourceId: v.string(),
  },
  handler: async (ctx, args): Promise<AccessLevel> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return "none";

    // First check if user is the resource owner (Requirement 5.3 - owner has full control)
    const resourceDetails = await getResourceDetails(
      ctx,
      args.resourceType,
      args.resourceId
    );

    if (!resourceDetails) {
      return "none"; // Resource doesn't exist
    }

    if (resourceDetails.ownerId === userId) {
      return "owner"; // Owner has full control
    }

    // Check if resource is shared with any organization the user is a member of
    const sharedResources = await ctx.db
      .query("sharedResources")
      .withIndex("by_resource", (q) =>
        q.eq("resourceType", args.resourceType).eq("resourceId", args.resourceId)
      )
      .collect();

    if (sharedResources.length === 0) {
      return "none"; // Not shared with any organization
    }

    // Check user's membership in each organization the resource is shared with
    let highestAccess: AccessLevel = "none";

    for (const sharedResource of sharedResources) {
      const membership = await ctx.db
        .query("organizationMembers")
        .withIndex("by_org_user", (q) =>
          q.eq("organizationId", sharedResource.organizationId).eq("userId", userId)
        )
        .unique();

      if (membership) {
        // Determine access level based on role (Requirements 5.4, 5.5)
        if (membership.role === "owner" || membership.role === "admin" || membership.role === "editor") {
          // Editors and above can edit (Requirement 5.4)
          highestAccess = "edit";
          break; // Edit is the highest non-owner access, no need to check further
        } else if (membership.role === "viewer") {
          // Viewers can only read (Requirement 5.5)
          if (highestAccess === "none") {
            highestAccess = "view";
          }
        }
      }
    }

    return highestAccess;
  },
});


/**
 * Get all organizations a resource is shared with
 * - Only accessible to the resource owner
 * - Returns organization details for each share
 */
export const getResourceOrganizations = query({
  args: {
    resourceType: resourceTypeValidator,
    resourceId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Verify user owns the resource
    const resource = await verifyResourceOwnership(
      ctx,
      args.resourceType,
      args.resourceId,
      userId
    );

    if (!resource) {
      return []; // User doesn't own this resource
    }

    // Get all organizations this resource is shared with
    const sharedResources = await ctx.db
      .query("sharedResources")
      .withIndex("by_resource", (q) =>
        q.eq("resourceType", args.resourceType).eq("resourceId", args.resourceId)
      )
      .collect();

    // Enrich with organization details
    const organizations = await Promise.all(
      sharedResources.map(async (sharedResource) => {
        const organization = await ctx.db.get(sharedResource.organizationId);
        if (!organization) return null;

        return {
          sharedResourceId: sharedResource._id,
          organizationId: sharedResource.organizationId,
          organizationName: organization.name,
          sharedAt: sharedResource.sharedAt,
        };
      })
    );

    // Filter out null values and sort by shared date (newest first)
    return organizations
      .filter((o): o is NonNullable<typeof o> => o !== null)
      .sort((a, b) => b.sharedAt - a.sharedAt);
  },
});
