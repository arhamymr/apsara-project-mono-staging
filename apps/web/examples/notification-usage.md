# Notification System Usage Guide

This guide demonstrates various ways to create and manage notifications in your application.

## 1. Display the Notification Bell in your header

```tsx
import NotificationBell from "@/components/NotificationBell";

export function HeaderWithNotifications() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <NotificationBell />
    </header>
  );
}
```

## 2. Create a notification from a button click

```tsx
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export function CreateNotificationExample() {
  const { user } = useUser();
  const createNotification = useMutation(api.notifications.createNotification);

  const handleCreateNotification = async () => {
    if (!user?.id) return;

    await createNotification({
      userId: user.id,
      type: "success",
      title: "Action Completed",
      message: "Your action was completed successfully!",
      icon: "✅",
      actionUrl: "/dashboard",
      actionText: "View Dashboard",
    });
  };

  return (
    <button onClick={handleCreateNotification}>
      Create Notification
    </button>
  );
}
```

## 3. Create notifications from a Convex mutation

```ts
// In your convex/myFeature.ts file:
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { createNotification } from "./notifications";

export const publishBlogPost = mutation({
  args: {
    postId: v.id("posts"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
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
```

## 4. Different notification types

```tsx
const createSuccessNotification = async () => {
  await createNotification({
    userId: user.id,
    type: "success",
    title: "Success!",
    message: "Operation completed successfully",
    icon: "✅",
  });
};

const createWarningNotification = async () => {
  await createNotification({
    userId: user.id,
    type: "warning",
    title: "Warning",
    message: "Please review this important information",
    icon: "⚠️",
  });
};

const createErrorNotification = async () => {
  await createNotification({
    userId: user.id,
    type: "error",
    title: "Error",
    message: "Something went wrong",
    icon: "❌",
  });
};

const createInfoNotification = async () => {
  await createNotification({
    userId: user.id,
    type: "info",
    title: "Information",
    message: "Here's some useful information",
    icon: "ℹ️",
  });
};
```

## 5. Query notifications directly

```tsx
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function NotificationsListExample() {
  const notifications = useQuery(api.notifications.getNotifications, { limit: 10 });

  if (!notifications) return <div>Loading...</div>;

  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <div key={notification.id} className="p-4 border rounded">
          <h3>{notification.data.title}</h3>
          <p>{notification.data.message}</p>
          <p>{notification.created_at}</p>
        </div>
      ))}
    </div>
  );
}
```

## 6. Manage notifications

```tsx
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function ManageNotificationsExample() {
  const markAsRead = useMutation(api.notifications.markAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const clearAllNotifications = useMutation(api.notifications.clearAllNotifications);

  return (
    <div className="flex gap-2">
      <button onClick={() => markAllAsRead()}>Mark All as Read</button>
      <button onClick={() => clearAllNotifications()}>Clear All</button>
    </div>
  );
}
```
