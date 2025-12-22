import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper function to validate slug is URL-safe
function isValidSlug(slug: string): boolean {
  // Only lowercase letters, numbers, and hyphens
  return /^[a-z0-9-]+$/.test(slug);
}

// Create a new shop
export const create = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    whatsappNumber: v.string(),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate slug is URL-safe
    if (!isValidSlug(args.slug)) {
      throw new Error("INVALID_SLUG: Slug must contain only lowercase letters, numbers, and hyphens");
    }

    // Check if slug already exists
    const existing = await ctx.db
      .query("shops")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      throw new Error(`SLUG_EXISTS:${args.slug}`);
    }

    const now = Date.now();
    return await ctx.db.insert("shops", {
      ...args,
      ownerId: userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a shop
export const update = mutation({
  args: {
    id: v.id("shops"),
    slug: v.optional(v.string()),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    currency: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const shop = await ctx.db.get(args.id);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    // Validate slug if changing
    if (args.slug !== undefined) {
      const newSlug = args.slug;
      if (!isValidSlug(newSlug)) {
        throw new Error("INVALID_SLUG: Slug must contain only lowercase letters, numbers, and hyphens");
      }

      // Check slug uniqueness if changing
      if (newSlug !== shop.slug) {
        const existing = await ctx.db
          .query("shops")
          .withIndex("by_slug", (q) => q.eq("slug", newSlug))
          .first();
        if (existing) {
          throw new Error(`SLUG_EXISTS:${newSlug}`);
        }
      }
    }

    const { id, ...updates } = args;
    const now = Date.now();

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: now,
    });
  },
});

// Delete a shop
export const remove = mutation({
  args: { id: v.id("shops") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const shop = await ctx.db.get(args.id);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    return await ctx.db.delete(args.id);
  },
});

// Get shop by owner (requires auth)
export const getByOwner = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("shops")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .first();
  },
});

// Get shop by slug (public)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("shops")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});
