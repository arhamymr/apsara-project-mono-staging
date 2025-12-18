import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Update a member's role in an organization
 * - Only owners and admins can change roles
 * - Admins cannot modify owners or other admins
 * Requirement: 4.2
 */
export const updateMemberRole = mutation({
  args: {
    memberId: v.id("organizationMembers"),
    role: v.union(
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const targetMember = await ctx.db.get(args.memberId);
    if (!targetMember) throw new Error("Member not found");
    const organization = await ctx.db.get(targetMember.organizationId);
    if (!organization) throw new Error("Organization not found");
    const currentUserMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", targetMember.organizationId).eq("userId", userId)
      )
      .unique();
    if (!currentUserMembership) {
      throw new Error("You are not a member of this organization");
    }
    if (currentUserMembership.role !== "owner" && currentUserMembership.role !== "admin") {
      throw new Error("You don't have permission to perform this action");
    }
    if (currentUserMembership.role === "admin") {
      if (targetMember.role === "owner" || targetMember.role === "admin") {
        throw new Error("You don't have permission to perform this action");
      }
    }
    if (targetMember.role === "owner") {
      throw new Error("Cannot change owner role. Use transfer ownership instead.");
    }
    await ctx.db.patch(args.memberId, { role: args.role });
    return { success: true };
  },
});

export const removeMember = mutation({
  args: { memberId: v.id("organizationMembers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const targetMember = await ctx.db.get(args.memberId);
    if (!targetMember) throw new Error("Member not found");
    const organization = await ctx.db.get(targetMember.organizationId);
    if (!organization) throw new Error("Organization not found");
    const currentUserMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", targetMember.organizationId).eq("userId", userId)
      )
      .unique();
    if (!currentUserMembership) {
      throw new Error("You are not a member of this organization");
    }
    if (currentUserMembership.role !== "owner" && currentUserMembership.role !== "admin") {
      throw new Error("You don't have permission to perform this action");
    }
    if (currentUserMembership.role === "admin") {
      if (targetMember.role === "owner" || targetMember.role === "admin") {
        throw new Error("You don't have permission to perform this action");
      }
    }
    if (targetMember.role === "owner") {
      const owners = await ctx.db
        .query("organizationMembers")
        .withIndex("by_organization", (q) => q.eq("organizationId", targetMember.organizationId))
        .filter((q) => q.eq(q.field("role"), "owner"))
        .collect();
      if (owners.length <= 1) {
        throw new Error("Cannot remove the last owner. Transfer ownership first or delete the organization");
      }
    }
    const sharedResources = await ctx.db
      .query("sharedResources")
      .withIndex("by_organization", (q) => q.eq("organizationId", targetMember.organizationId))
      .filter((q) => q.eq(q.field("sharedBy"), targetMember.userId))
      .collect();
    for (const resource of sharedResources) {
      await ctx.db.delete(resource._id);
    }
    await ctx.db.delete(args.memberId);
    const now = Date.now();
    await ctx.db.insert("notifications", {
      userId: targetMember.userId,
      type: "removed_from_organization",
      title: "Removed from Organization",
      message: `You have been removed from "${organization.name}"`,
      icon: "👋",
      createdAt: now,
    });
    return { success: true };
  },
});

export const leaveOrganization = mutation({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) throw new Error("Organization not found");
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) => q.eq("organizationId", args.organizationId).eq("userId", userId))
      .unique();
    if (!membership) {
      throw new Error("You are not a member of this organization");
    }
    if (membership.role === "owner") {
      const owners = await ctx.db
        .query("organizationMembers")
        .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
        .filter((q) => q.eq(q.field("role"), "owner"))
        .collect();
      if (owners.length <= 1) {
        throw new Error("Cannot remove the last owner. Transfer ownership first or delete the organization");
      }
    }
    const sharedResources = await ctx.db
      .query("sharedResources")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .filter((q) => q.eq(q.field("sharedBy"), userId))
      .collect();
    for (const resource of sharedResources) {
      await ctx.db.delete(resource._id);
    }
    await ctx.db.delete(membership._id);
    const now = Date.now();
    const user = await ctx.db.get(userId);
    const userName = user?.name || user?.email || "A member";
    const owners = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .filter((q) => q.eq(q.field("role"), "owner"))
      .collect();
    for (const owner of owners) {
      await ctx.db.insert("notifications", {
        userId: owner.userId,
        type: "member_left",
        title: "Member Left",
        message: `${userName} has left "${organization.name}"`,
        icon: "👋",
        createdAt: now,
      });
    }
    return { success: true };
  },
});

export const transferOwnership = mutation({
  args: { organizationId: v.id("organizations"), newOwnerId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const organization = await ctx.db.get(args.organizationId);
    if (!organization) throw new Error("Organization not found");
    const currentUserMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) => q.eq("organizationId", args.organizationId).eq("userId", userId))
      .unique();
    if (!currentUserMembership || currentUserMembership.role !== "owner") {
      throw new Error("You don't have permission to perform this action");
    }
    const targetMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) => q.eq("organizationId", args.organizationId).eq("userId", args.newOwnerId))
      .unique();
    if (!targetMembership) {
      throw new Error("Target user is not a member of this organization");
    }
    if (args.newOwnerId === userId) {
      throw new Error("You are already an owner");
    }
    await ctx.db.patch(targetMembership._id, { role: "owner" });
    await ctx.db.patch(currentUserMembership._id, { role: "admin" });
    const now = Date.now();
    const currentUser = await ctx.db.get(userId);
    const currentUserName = currentUser?.name || currentUser?.email || "Someone";
    await ctx.db.insert("notifications", {
      userId: args.newOwnerId,
      type: "ownership_transferred",
      title: "Ownership Transferred",
      message: `${currentUserName} has transferred ownership of "${organization.name}" to you`,
      icon: "👑",
      createdAt: now,
    });
    return { success: true };
  },
});

export const getOrganizationMembers = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const currentUserMembership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) => q.eq("organizationId", args.organizationId).eq("userId", userId))
      .unique();
    if (!currentUserMembership) return [];
    const members = await ctx.db
      .query("organizationMembers")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .collect();
    const enrichedMembers = await Promise.all(
      members.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          _id: member._id,
          userId: member.userId,
          role: member.role,
          joinedAt: member.joinedAt,
          name: user?.name || user?.email || "Unknown",
          email: user?.email || "",
          image: user?.image,
        };
      })
    );
    const roleOrder = { owner: 0, admin: 1, editor: 2, viewer: 3 } as const;
    return enrichedMembers.sort((a, b) => {
      const roleCompare = (roleOrder[a.role as keyof typeof roleOrder] ?? 4) - (roleOrder[b.role as keyof typeof roleOrder] ?? 4);
      if (roleCompare !== 0) return roleCompare;
      return a.name.localeCompare(b.name);
    });
  },
});

export const getMemberRole = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) => q.eq("organizationId", args.organizationId).eq("userId", userId))
      .unique();
    return membership?.role || null;
  },
});
