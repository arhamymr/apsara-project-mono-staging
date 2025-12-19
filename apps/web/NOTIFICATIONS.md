# Notification System

The notification system is fully integrated with Convex and provides a complete solution for managing user notifications.

## Features

- ✅ Real-time notifications with Convex
- ✅ Mark notifications as read
- ✅ Delete individual notifications
- ✅ Mark all as read
- ✅ Clear all notifications
- ✅ Unread count badge
- ✅ Relative time formatting (e.g., "5m ago")
- ✅ Optional action links

## Components

### NotificationBell Component

Located at `apps/web/components/NotificationBell.tsx`

The main UI component that displays notifications in a dropdown menu.

```tsx
import NotificationBell from "@/components/NotificationBell";

export default function Header() {
  return (
    <div>
      <NotificationBell />
    </div>
  );
}
```

## Creating Notifications

### From Server-Side Code

Use the `createNotification` mutation directly in your Convex functions:

```tsx
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { createNotification } from "./notifications";

export const doSomething = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Do something...
    
    // Create a notification
    await createNotification(ctx, {
      userId: args.userId,
      type: "success",
      title: "Action Completed",
      message: "Your action was completed successfully",
      icon: "✅",
      actionUrl: "/dashboard",
      actionText: "View",
    });
  },
});
```

### From Client-Side Code

Use the helper function from `lib/notifications.ts`:

```tsx
import { createNotification } from "@/lib/notifications";

async function handleAction() {
  try {
    await createNotification(userId, {
      type: "info",
      title: "Welcome!",
      message: "Thanks for joining us.",
      icon: "👋",
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}
```

## Notification Options

```typescript
{
  type?: string;           // "info", "success", "warning", "error", etc.
  title: string;           // Main notification title
  message: string;         // Notification message
  icon?: string;           // Emoji or icon (e.g., "✅", "🚀")
  actionUrl?: string;      // URL to navigate to when clicking action
  actionText?: string;     // Text for the action link (default: "View")
}
```

## Database Schema

Notifications are stored in the `notifications` table with the following fields:

```typescript
{
  userId: Id<"users">;
  type: string;
  title: string;
  message: string;
  icon?: string;
  actionUrl?: string;
  actionText?: string;
  readAt?: number;         // Timestamp when marked as read
  createdAt: number;       // Creation timestamp
}
```

## Available Queries and Mutations

### Queries

- `getNotifications(limit?: number)` - Get user's notifications (default limit: 50)

### Mutations

- `markAsRead(notificationId)` - Mark a single notification as read
- `markAllAsRead()` - Mark all notifications as read
- `deleteNotification(notificationId)` - Delete a single notification
- `clearAllNotifications()` - Delete all notifications
- `createNotification(...)` - Create a new notification

## Examples

### Example 1: Blog Post Published

```tsx
await createNotification(ctx, {
  userId: authorId,
  type: "success",
  title: "Blog Published",
  message: "Your blog post 'Getting Started' has been published",
  icon: "📝",
  actionUrl: `/blog/getting-started`,
  actionText: "View Post",
});
```

### Example 2: New Comment

```tsx
await createNotification(ctx, {
  userId: postAuthorId,
  type: "info",
  title: "New Comment",
  message: `${commenterName} commented on your post`,
  icon: "💬",
  actionUrl: `/posts/${postId}#comments`,
  actionText: "View Comment",
});
```

### Example 3: System Alert

```tsx
await createNotification(ctx, {
  userId: userId,
  type: "warning",
  title: "Maintenance Scheduled",
  message: "System maintenance scheduled for tonight at 2 AM",
  icon: "⚠️",
});
```

## Styling

The notification component uses Tailwind CSS and shadcn/ui components. Customize the appearance by modifying the classes in `NotificationBell.tsx`:

- Unread notifications have a blue background: `bg-blue-50/50 dark:bg-blue-950/20`
- Hover state: `hover:bg-muted/50`
- Badge color: `bg-red-400`

## Real-Time Updates

Notifications update in real-time thanks to Convex's reactive queries. When a new notification is created, the UI automatically updates without requiring a page refresh.

## Best Practices

1. **Use appropriate types**: Use "success", "warning", "error", "info" for consistency
2. **Keep messages concise**: Notifications should be brief and actionable
3. **Include icons**: Use emojis to make notifications more visually appealing
4. **Provide actions**: When relevant, include action links to relevant pages
5. **Avoid spam**: Don't create too many notifications for the same event
6. **Clean up old notifications**: Consider archiving old notifications periodically

## Troubleshooting

### Notifications not appearing

1. Ensure the user is authenticated
2. Check that the `notifications` table exists in your Convex schema
3. Verify that `convex dev` has been run to generate the API

### Type errors

If you see type errors related to `api.notifications`, run:

```bash
npx convex dev --once
```

This regenerates the API types.
