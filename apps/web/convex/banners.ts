import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new banner
export const create = mutation({
  args: {
    shopId: v.id("shops"),
    title: v.string(),
    subtitle: v.optional(v.string()),
    imageUrl: v.string(),
    linkUrl: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    position: v.number(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify shop ownership
    const shop = await ctx.db.get(args.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    // Validate title length (max 100 characters)
    if (args.title.length > 100) {
      throw new Error("TITLE_TOO_LONG: Banner title must be 100 characters or less");
    }

    // Validate subtitle length (max 200 characters)
    if (args.subtitle !== undefined && args.subtitle.length > 200) {
      throw new Error("SUBTITLE_TOO_LONG: Banner subtitle must be 200 characters or less");
    }

    // Check banner count limit (max 10 per shop)
    const existingBanners = await ctx.db
      .query("banners")
      .withIndex("by_shop", (q) => q.eq("shopId", args.shopId))
      .collect();

    if (existingBanners.length >= 10) {
      throw new Error("BANNER_LIMIT_REACHED: Maximum 10 banners per shop");
    }

    const now = Date.now();
    return await ctx.db.insert("banners", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a banner
export const update = mutation({
  args: {
    id: v.id("banners"),
    title: v.optional(v.string()),
    subtitle: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    position: v.optional(v.number()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const banner = await ctx.db.get(args.id);
    if (!banner) throw new Error("Banner not found");

    // Verify shop ownership
    const shop = await ctx.db.get(banner.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    // Validate title length if changing
    if (args.title !== undefined && args.title.length > 100) {
      throw new Error("TITLE_TOO_LONG: Banner title must be 100 characters or less");
    }

    // Validate subtitle length if changing
    if (args.subtitle !== undefined && args.subtitle.length > 200) {
      throw new Error("SUBTITLE_TOO_LONG: Banner subtitle must be 200 characters or less");
    }

    const { id, ...updates } = args;
    const now = Date.now();

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: now,
    });
  },
});

// Delete a banner
export const remove = mutation({
  args: { id: v.id("banners") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const banner = await ctx.db.get(args.id);
    if (!banner) throw new Error("Banner not found");

    // Verify shop ownership
    const shop = await ctx.db.get(banner.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    return await ctx.db.delete(args.id);
  },
});

// List all banners by shop (requires auth)
export const listByShop = query({
  args: { shopId: v.id("shops") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify shop ownership
    const shop = await ctx.db.get(args.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    return await ctx.db
      .query("banners")
      .withIndex("by_shop", (q) => q.eq("shopId", args.shopId))
      .collect();
  },
});

// List active banners by shop (public)
export const listActiveByShop = query({
  args: { shopId: v.id("shops") },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get all active banners for the shop
    const banners = await ctx.db
      .query("banners")
      .withIndex("by_shop_status", (q) => q.eq("shopId", args.shopId).eq("status", "active"))
      .collect();

    // Filter by date range (if startDate/endDate are set)
    const activeBanners = banners.filter((banner) => {
      // If startDate is set and hasn't been reached yet, exclude
      if (banner.startDate !== undefined && banner.startDate > now) {
        return false;
      }

      // If endDate is set and has passed, exclude
      if (banner.endDate !== undefined && banner.endDate < now) {
        return false;
      }

      return true;
    });

    // Sort by position
    return activeBanners.sort((a, b) => a.position - b.position);
  },
});

// Auto-deactivate expired banners
export const deactivateExpired = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Find all active banners (we need to get all banners and filter)
    const allBanners = await ctx.db
      .query("banners")
      .collect();

    const expiredBanners = allBanners.filter(
      (banner) => 
        banner.status === "active" &&
        banner.endDate !== undefined && 
        banner.endDate < now
    );

    // Deactivate each expired banner
    const results = [];
    for (const banner of expiredBanners) {
      await ctx.db.patch(banner._id, {
        status: "inactive",
        updatedAt: now,
      });
      results.push(banner._id);
    }

    return {
      deactivatedCount: results.length,
      deactivatedIds: results,
    };
  },
});
