import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Create a new organization
 * - Validates non-empty, non-whitespace name
 * - Generates unique ID and assigns creator as owner
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */
export const createOrganization = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate non-empty, non-whitespace name (Requirement 1.3)
    const trimmedName = args.name.trim();
    if (trimmedName.length === 0) {
      throw new Error("Organization name is required");
    }

    const now = Date.now();

    // Create the organization (Requirement 1.2, 1.4)
    const organizationId = await ctx.db.insert("organizations", {
      name: trimmedName,
      description: args.description?.trim() || undefined,
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    });

    // Assign creator as owner (Requirement 1.2)
    await ctx.db.insert("organizationMembers", {
      organizationId,
      userId,
      role: "owner",
      joinedAt: now,
    });

    return organizationId;
  },
});

/**
 * Update an organization's name and/or description
 * Only owners and admins can update
 */
export const updateOrganization = mutation({
  args: {
    id: v.id("organizations"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organization = await ctx.db.get(args.id);
    if (!organization) throw new Error("Organization not found");

    // Check if user is owner or admin
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", args.id).eq("userId", userId)
      )
      .unique();

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      throw new Error("You don't have permission to perform this action");
    }

    // Validate name if provided
    const updates: { name?: string; description?: string; updatedAt: number } = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) {
      const trimmedName = args.name.trim();
      if (trimmedName.length === 0) {
        throw new Error("Organization name is required");
      }
      updates.name = trimmedName;
    }

    if (args.description !== undefined) {
      updates.description = args.description.trim() || undefined;
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});


/**
 * Delete an organization with cascade logic
 * - Remove all memberships and pending invitations
 * - Unshare (not delete) all shared resources
 * - Send notifications to members
 * Requirements: 7.2, 7.3, 7.4
 */
export const deleteOrganization = mutation({
  args: {
    id: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organization = await ctx.db.get(args.id);
    if (!organization) throw new Error("Organization not found");

    // Check if user is owner
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", args.id).eq("userId", userId)
      )
      .unique();

    if (!membership || membership.role !== "owner") {
      throw new Error("You don't have permission to perform this action");
    }

    // Get all members for notifications (Requirement 7.4)
    const allMembers = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.id))
      .collect();

    // Send notifications to all members except the one deleting
    const now = Date.now();
    for (const member of allMembers) {
      if (member.userId !== userId) {
        await ctx.db.insert("notifications", {
          userId: member.userId,
          type: "organization_deleted",
          title: "Organization Deleted",
          message: `The organization "${organization.name}" has been deleted.`,
          icon: "🗑️",
          createdAt: now,
        });
      }
    }

    // Delete all memberships (Requirement 7.2)
    for (const member of allMembers) {
      await ctx.db.delete(member._id);
    }

    // Delete all pending invitations (Requirement 7.2)
    const invitations = await ctx.db
      .query("invitations")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.id))
      .collect();

    for (const invitation of invitations) {
      await ctx.db.delete(invitation._id);
    }

    // Unshare all shared resources (Requirement 7.3)
    // Resources are returned to their original owners by simply removing the sharing record
    const sharedResources = await ctx.db
      .query("sharedResources")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.id))
      .collect();

    for (const resource of sharedResources) {
      await ctx.db.delete(resource._id);
    }

    // Delete the organization
    await ctx.db.delete(args.id);

    return { success: true };
  },
});

/**
 * Get a single organization by ID
 * Returns organization details if user is a member
 * Requirement: 6.1
 */
export const getOrganization = query({
  args: {
    id: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const organization = await ctx.db.get(args.id);
    if (!organization) return null;

    // Check if user is a member
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", args.id).eq("userId", userId)
      )
      .unique();

    if (!membership) return null;

    // Get member count
    const members = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.id))
      .collect();

    return {
      ...organization,
      memberCount: members.length,
      userRole: membership.role,
    };
  },
});

/**
 * List all organizations the current user is a member of
 * Requirement: 6.1
 */
export const listUserOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Get all memberships for the user
    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get organization details for each membership
    const organizations = await Promise.all(
      memberships.map(async (membership) => {
        const organization = await ctx.db.get(membership.organizationId);
        if (!organization) return null;

        // Get member count
        const members = await ctx.db
          .query("organizationMembers")
          .withIndex("by_organization", (q) =>
            q.eq("organizationId", membership.organizationId)
          )
          .collect();

        return {
          ...organization,
          memberCount: members.length,
          userRole: membership.role,
          joinedAt: membership.joinedAt,
        };
      })
    );

    // Filter out null values and sort by creation date (newest first)
    return organizations
      .filter((org): org is NonNullable<typeof org> => org !== null)
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});
