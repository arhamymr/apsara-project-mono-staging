import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Email validation regex pattern
 * Validates standard email format: local@domain.tld
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Create a new invitation to join an organization
 * - Validates email format
 * - Checks for existing pending invitation (reject duplicates)
 * - Checks if user is already a member (reject)
 * - Defaults role to "editor" if not specified
 * - Sends notification to invited user if they have an account
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */
export const createInvitation = mutation({
  args: {
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.optional(
      v.union(v.literal("admin"), v.literal("editor"), v.literal("viewer"))
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate email format
    const trimmedEmail = args.email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error("Please enter a valid email address");
    }

    // Check if organization exists
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) throw new Error("Organization not found");

    // Check if user is owner or admin of the organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", args.organizationId).eq("userId", userId)
      )
      .unique();

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      throw new Error("You don't have permission to perform this action");
    }

    // Check for existing pending invitation (Requirement 2.3)
    const existingInvitation = await ctx.db
      .query("invitations")
      .withIndex("by_org_email", (q) =>
        q.eq("organizationId", args.organizationId).eq("email", trimmedEmail)
      )
      .filter((q) => q.eq(q.field("status"), "pending"))
      .unique();

    if (existingInvitation) {
      throw new Error("An invitation has already been sent to this email");
    }

    // Check if user is already a member (Requirement 2.4)
    // First, find if there's a user with this email
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), trimmedEmail))
      .first();

    if (existingUser) {
      // Check if this user is already a member
      const existingMembership = await ctx.db
        .query("organizationMembers")
        .withIndex("by_org_user", (q) =>
          q.eq("organizationId", args.organizationId).eq("userId", existingUser._id)
        )
        .unique();

      if (existingMembership) {
        throw new Error("This user is already a member of the organization");
      }
    }

    const now = Date.now();

    // Create the invitation (Requirement 2.1, 2.5)
    const invitationId = await ctx.db.insert("invitations", {
      organizationId: args.organizationId,
      email: trimmedEmail,
      role: args.role || "editor", // Default to editor (Requirement 2.5)
      invitedBy: userId,
      status: "pending",
      createdAt: now,
    });

    // Send notification to invited user if they have an account (Requirement 2.2)
    if (existingUser) {
      // Get inviter's name
      const inviter = await ctx.db.get(userId);
      const inviterName = inviter?.name || inviter?.email || "Someone";

      await ctx.db.insert("notifications", {
        userId: existingUser._id,
        type: "organization_invitation",
        title: "Organization Invitation",
        message: `${inviterName} invited you to join "${organization.name}"`,
        icon: "📧",
        actionUrl: "/organizations/invitations",
        actionText: "View Invitation",
        createdAt: now,
      });
    }

    return invitationId;
  },
});


/**
 * Accept an invitation to join an organization
 * - Creates membership record with assigned role
 * - Deletes invitation record
 * - Sends notification to organization owner
 * Requirements: 3.2, 3.4
 */
export const acceptInvitation = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get the invitation
    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) throw new Error("Invitation not found or has expired");

    if (invitation.status !== "pending") {
      throw new Error("Invitation not found or has expired");
    }

    // Get the current user's email
    const currentUser = await ctx.db.get(userId);
    if (!currentUser) throw new Error("User not found");

    // Verify the invitation is for this user
    const userEmail = currentUser.email?.toLowerCase();
    if (userEmail !== invitation.email) {
      throw new Error("This invitation is not for you");
    }

    // Get the organization
    const organization = await ctx.db.get(invitation.organizationId);
    if (!organization) throw new Error("Organization not found");

    const now = Date.now();

    // Create membership record with assigned role (Requirement 3.2)
    await ctx.db.insert("organizationMembers", {
      organizationId: invitation.organizationId,
      userId,
      role: invitation.role,
      joinedAt: now,
    });

    // Delete the invitation record (Requirement 3.2)
    await ctx.db.delete(args.invitationId);

    // Send notification to organization owner (Requirement 3.4)
    // Find the owner(s) of the organization
    const owners = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", invitation.organizationId)
      )
      .filter((q) => q.eq(q.field("role"), "owner"))
      .collect();

    const userName = currentUser.name || currentUser.email || "A user";

    for (const owner of owners) {
      await ctx.db.insert("notifications", {
        userId: owner.userId,
        type: "invitation_accepted",
        title: "Invitation Accepted",
        message: `${userName} has joined "${organization.name}"`,
        icon: "✅",
        createdAt: now,
      });
    }

    return { success: true, organizationId: invitation.organizationId };
  },
});

/**
 * Decline an invitation to join an organization
 * - Deletes invitation without creating membership
 * Requirement: 3.3
 */
export const declineInvitation = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get the invitation
    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) throw new Error("Invitation not found or has expired");

    if (invitation.status !== "pending") {
      throw new Error("Invitation not found or has expired");
    }

    // Get the current user's email
    const currentUser = await ctx.db.get(userId);
    if (!currentUser) throw new Error("User not found");

    // Verify the invitation is for this user
    const userEmail = currentUser.email?.toLowerCase();
    if (userEmail !== invitation.email) {
      throw new Error("This invitation is not for you");
    }

    // Delete the invitation without creating membership (Requirement 3.3)
    await ctx.db.delete(args.invitationId);

    return { success: true };
  },
});

/**
 * Cancel an invitation (for owners/admins)
 * - Only owners and admins can cancel invitations
 */
export const cancelInvitation = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get the invitation
    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) throw new Error("Invitation not found");

    if (invitation.status !== "pending") {
      throw new Error("Invitation not found or has expired");
    }

    // Check if user is owner or admin of the organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", invitation.organizationId).eq("userId", userId)
      )
      .unique();

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      throw new Error("You don't have permission to perform this action");
    }

    // Delete the invitation
    await ctx.db.delete(args.invitationId);

    return { success: true };
  },
});

/**
 * Get all pending invitations for the current user
 * Returns invitations with organization name, inviter name, and assigned role
 * Requirement: 3.1
 */
export const getPendingInvitations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Get the current user's email
    const currentUser = await ctx.db.get(userId);
    if (!currentUser || !currentUser.email) return [];

    const userEmail = currentUser.email.toLowerCase();

    // Get all pending invitations for this email
    const invitations = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", userEmail))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    // Enrich with organization and inviter details
    const enrichedInvitations = await Promise.all(
      invitations.map(async (invitation) => {
        const organization = await ctx.db.get(invitation.organizationId);
        const inviter = await ctx.db.get(invitation.invitedBy);

        return {
          _id: invitation._id,
          organizationId: invitation.organizationId,
          organizationName: organization?.name || "Unknown Organization",
          inviterName: inviter?.name || inviter?.email || "Unknown",
          role: invitation.role,
          createdAt: invitation.createdAt,
        };
      })
    );

    // Sort by creation date (newest first)
    return enrichedInvitations.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get all invitations for an organization (for owners/admins)
 * Returns invitations with inviter name and status
 * Requirement: 3.1
 */
export const getOrganizationInvitations = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Check if user is owner or admin of the organization
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", args.organizationId).eq("userId", userId)
      )
      .unique();

    if (!membership || (membership.role !== "owner" && membership.role !== "admin")) {
      return [];
    }

    // Get all invitations for this organization
    const invitations = await ctx.db
      .query("invitations")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();

    // Enrich with inviter details
    const enrichedInvitations = await Promise.all(
      invitations.map(async (invitation) => {
        const inviter = await ctx.db.get(invitation.invitedBy);

        return {
          _id: invitation._id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          inviterName: inviter?.name || inviter?.email || "Unknown",
          createdAt: invitation.createdAt,
          respondedAt: invitation.respondedAt,
        };
      })
    );

    // Sort by creation date (newest first)
    return enrichedInvitations.sort((a, b) => b.createdAt - a.createdAt);
  },
});
