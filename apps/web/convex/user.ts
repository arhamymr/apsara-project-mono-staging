import { query, internalQuery } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const profile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId !== null ? ctx.db.get(userId) : null;
  },
});

// Internal query for session validation (used by HTTP endpoint)
export const getUserById = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Public query to get basic user info for display (name/email only)
export const getBasicUserInfo = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Require authentication to view user info
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) return null;

    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // Return only basic display info
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
  },
});