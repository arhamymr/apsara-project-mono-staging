import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

/**
 * Helper function to check if user can access a note
 * Returns access level: "owner", "edit", "view", or "none"
 */
async function checkNoteAccess(
  ctx: QueryCtx,
  noteId: Id<"notes">,
  userId: Id<"users">
): Promise<"owner" | "edit" | "view" | "none"> {
  const note = await ctx.db.get(noteId);
  if (!note) return "none";

  // Check if user is the owner
  if (note.userId === userId) return "owner";

  // Check if note is shared with any organization the user is a member of
  const sharedResources = await ctx.db
    .query("sharedResources")
    .withIndex("by_resource", (q) =>
      q.eq("resourceType", "note").eq("resourceId", noteId)
    )
    .collect();

  if (sharedResources.length === 0) return "none";

  // Check user's membership in each organization
  let highestAccess: "edit" | "view" | "none" = "none";

  for (const sharedResource of sharedResources) {
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", sharedResource.organizationId).eq("userId", userId)
      )
      .unique();

    if (membership) {
      if (membership.role === "owner" || membership.role === "admin" || membership.role === "editor") {
        highestAccess = "edit";
        break;
      } else if (membership.role === "viewer" && highestAccess === "none") {
        highestAccess = "view";
      }
    }
  }

  return highestAccess;
}

/**
 * Helper function to check if user can edit a note (for mutations)
 */
async function canEditNote(
  ctx: QueryCtx,
  noteId: Id<"notes">,
  userId: Id<"users">
): Promise<boolean> {
  const accessLevel = await checkNoteAccess(ctx, noteId, userId);
  return accessLevel === "owner" || accessLevel === "edit";
}

// Create a new note
export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    return await ctx.db.insert("notes", {
      title: args.title,
      content: args.content,
      userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// List notes for current user (including shared notes)
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const limit = args.limit ?? 100;

    // Get user's own notes
    const ownNotes = await ctx.db
      .query("notes")
      .withIndex("by_user_updated", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get notes shared with user through organizations
    const userMemberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const sharedNoteIds = new Set<string>();
    const sharedNotes: typeof ownNotes = [];

    for (const membership of userMemberships) {
      const sharedResources = await ctx.db
        .query("sharedResources")
        .withIndex("by_organization", (q) => q.eq("organizationId", membership.organizationId))
        .collect();

      for (const resource of sharedResources) {
        if (resource.resourceType === "note" && !sharedNoteIds.has(resource.resourceId)) {
          sharedNoteIds.add(resource.resourceId);
          const note = await ctx.db.get(resource.resourceId as Id<"notes">);
          if (note && note.userId !== userId) {
            sharedNotes.push(note);
          }
        }
      }
    }

    // Combine and sort by updatedAt, then limit
    return [...ownNotes, ...sharedNotes]
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, limit);
  },
});

// Get a single note by ID (with shared access support)
export const getById = query({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const note = await ctx.db.get(args.id);
    if (!note) return null;

    // Check access level
    const accessLevel = await checkNoteAccess(ctx, args.id, userId);
    if (accessLevel === "none") return null;

    return { ...note, accessLevel };
  },
});

// Update a note (with shared access support)
export const update = mutation({
  args: {
    id: v.id("notes"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.id);
    if (!note) throw new Error("Note not found");

    // Check if user can edit this note
    if (!(await canEditNote(ctx, args.id, userId))) {
      throw new Error("Not authorized");
    }

    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete a note (only owner can delete)
export const remove = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.id);
    if (!note) throw new Error("Note not found");
    
    // Only owner can delete
    if (note.userId !== userId) throw new Error("Not authorized");

    return await ctx.db.delete(args.id);
  },
});

// Search notes by title or content (including shared notes)
export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const limit = args.limit ?? 50;
    const searchTerm = args.query.toLowerCase();

    // Get user's own notes
    const ownNotes = await ctx.db
      .query("notes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get notes shared with user through organizations
    const userMemberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const sharedNoteIds = new Set<string>();
    const sharedNotes: typeof ownNotes = [];

    for (const membership of userMemberships) {
      const sharedResources = await ctx.db
        .query("sharedResources")
        .withIndex("by_organization", (q) => q.eq("organizationId", membership.organizationId))
        .collect();

      for (const resource of sharedResources) {
        if (resource.resourceType === "note" && !sharedNoteIds.has(resource.resourceId)) {
          sharedNoteIds.add(resource.resourceId);
          const note = await ctx.db.get(resource.resourceId as Id<"notes">);
          if (note && note.userId !== userId) {
            sharedNotes.push(note);
          }
        }
      }
    }

    // Combine and filter by search term
    return [...ownNotes, ...sharedNotes]
      .filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm) ||
          note.content.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit);
  },
});
