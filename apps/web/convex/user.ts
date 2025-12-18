import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const profile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId !== null ? ctx.db.get(userId) : null;
  },
});

export const initializeUserWithWelcome = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user already has a welcome notification
    const allNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const existingWelcome = allNotifications.find((n) => n.type === "welcome");

    if (!existingWelcome) {
      // Create welcome notification
      await ctx.db.insert("notifications", {
        userId,
        type: "welcome",
        title: "Welcome! 👋",
        message: "Thanks for joining us! Explore the app and discover what you can do.",
        icon: "👋",
        actionUrl: "/",
        actionText: "Get Started",
        createdAt: Date.now(),
      });
    }

    return ctx.db.get(userId);
  },
});