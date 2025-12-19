import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getNotifications = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_created", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit || 50);

    return notifications.map((n) => ({
      id: n._id,
      type: n.type,
      data: {
        title: n.title,
        message: n.message,
        icon: n.icon,
        action_url: n.actionUrl,
        action_text: n.actionText,
        metadata: n.metadata,
      },
      read_at: n.readAt ? new Date(n.readAt).toISOString() : null,
      created_at: new Date(n.createdAt).toISOString(),
    }));
  },
});

export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found");
    }

    await ctx.db.patch(args.notificationId, {
      readAt: Date.now(),
    });
  },
});

export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_read", (q) =>
        q.eq("userId", userId).eq("readAt", undefined)
      )
      .collect();

    for (const notification of unreadNotifications) {
      await ctx.db.patch(notification._id, {
        readAt: Date.now(),
      });
    }
  },
});

export const deleteNotification = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const notification = await ctx.db.get(args.notificationId);
    if (!notification || notification.userId !== userId) {
      throw new Error("Notification not found");
    }

    await ctx.db.delete(args.notificationId);
  },
});

export const clearAllNotifications = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const allNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const notification of allNotifications) {
      await ctx.db.delete(notification._id);
    }
  },
});

export const createNotification = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    message: v.string(),
    icon: v.optional(v.string()),
    actionUrl: v.optional(v.string()),
    actionText: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      message: args.message,
      icon: args.icon,
      actionUrl: args.actionUrl,
      actionText: args.actionText,
      createdAt: Date.now(),
    });
  },
});

export const createWelcomeNotification = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if user already has a welcome notification
    const allNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const existingWelcome = allNotifications.find((n) => n.type === "welcome");

    if (existingWelcome) {
      return existingWelcome._id;
    }

    // Create welcome notification
    return await ctx.db.insert("notifications", {
      userId: args.userId,
      type: "welcome",
      title: "Welcome! 👋",
      message: "Thanks for joining us! Explore the app and discover what you can do.",
      icon: "👋",
      actionUrl: "/",
      actionText: "Get Started",
      createdAt: Date.now(),
    });
  },
});
