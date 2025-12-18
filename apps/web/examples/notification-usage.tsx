/**
 * Example: How to use the Notification System
 * 
 * This file demonstrates various ways to create and manage notifications
 * in your application.
 */

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import NotificationBell from "@/components/NotificationBell";

// ============================================================================
// Example 1: Display the Notification Bell in your header
// ============================================================================

export function HeaderWithNotifications() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <NotificationBell />
    </header>
  );
}

// ============================================================================
// Example 2: Create a notification from a button click
// ============================================================================

export function CreateNotificationExample() {
  const { user } = useUser();
  const createNotification = useMutation(api.notifications.createNotification);

  const handleCreateNotification = async () => {
    if (!user?.id) return;

    try {
      await createNotification({
        userId: user.id as any, // Cast to Id<"users">
        type: "success",
        title: "Action Completed",
        message: "Your action was completed successfully!",
        icon: "✅",
        actionUrl: "/dashboard",
        actionText: "View Dashboard",
      });
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  };

  return (
    <button onClick={handleCreateNotification} className="px-4 py-2 bg-blue-500 text-white rounded">
      Create Notification
    </button>
  );
}

// ============================================================================
// Example 3: Create notifications from a Convex mutation
// ============================================================================

// In your convex/myFeature.ts file:
/*
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { createNotification } from "./notifications";

export const publishBlogPost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    // Publish the blog post
    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    // Notify the author
    await createNotification(ctx, {
      userId: post.authorId,
      type: "success",
      title: "Blog Published",
      message: `Your blog post "${args.title}" has been published!`,
      icon: "📝",
      actionUrl: `/blog/${post.slug}`,
      actionText: "View Post",
    });

    return post;
  },
});
*/

// ============================================================================
// Example 4: Different notification types
// ============================================================================

export function NotificationTypesExample() {
  const { user } = useUser();
  const createNotification = useMutation(api.notifications.createNotification);

  const createSuccessNotification = async () => {
    if (!user?.id) return;
    await createNotification({
      userId: user.id as any,
      type: "success",
      title: "Success!",
      message: "Operation completed successfully",
      icon: "✅",
    });
  };

  const createWarningNotification = async () => {
    if (!user?.id) return;
    await createNotification({
      userId: user.id as any,
      type: "warning",
      title: "Warning",
      message: "Please review this important information",
      icon: "⚠️",
    });
  };

  const createErrorNotification = async () => {
    if (!user?.id) return;
    await createNotification({
      userId: user.id as any,
      type: "error",
      title: "Error",
      message: "Something went wrong",
      icon: "❌",
    });
  };

  const createInfoNotification = async () => {
    if (!user?.id) return;
    await createNotification({
      userId: user.id as any,
      type: "info",
      title: "Information",
      message: "Here's some useful information",
      icon: "ℹ️",
    });
  };

  return (
    <div className="flex gap-2">
      <button onClick={createSuccessNotification} className="px-4 py-2 bg-green-500 text-white rounded">
        Success
      </button>
      <button onClick={createWarningNotification} className="px-4 py-2 bg-yellow-500 text-white rounded">
        Warning
      </button>
      <button onClick={createErrorNotification} className="px-4 py-2 bg-red-500 text-white rounded">
        Error
      </button>
      <button onClick={createInfoNotification} className="px-4 py-2 bg-blue-500 text-white rounded">
        Info
      </button>
    </div>
  );
}

// ============================================================================
// Example 5: Query notifications directly
// ============================================================================

export function NotificationsListExample() {
  const notifications = useQuery(api.notifications.getNotifications, { limit: 10 });

  if (!notifications) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <div key={notification.id} className="p-4 border rounded">
          <h3 className="font-semibold">{notification.data.title}</h3>
          <p className="text-sm text-gray-600">{notification.data.message}</p>
          <p className="text-xs text-gray-400">{notification.created_at}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Example 6: Manage notifications
// ============================================================================

export function ManageNotificationsExample() {
  const markAsRead = useMutation(api.notifications.markAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const clearAllNotifications = useMutation(api.notifications.clearAllNotifications);

  return (
    <div className="flex gap-2">
      <button onClick={() => markAllAsRead()} className="px-4 py-2 bg-blue-500 text-white rounded">
        Mark All as Read
      </button>
      <button onClick={() => clearAllNotifications()} className="px-4 py-2 bg-red-500 text-white rounded">
        Clear All
      </button>
    </div>
  );
}
