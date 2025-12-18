"use client";

import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { cn } from "@/lib/utils";
import { Bell, Check, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  // Convex queries and mutations
  const notifications = useQuery(api.notifications.getNotifications, {
    limit: 50,
  }) || [];
  
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);
  const clearAllNotifications = useMutation(api.notifications.clearAllNotifications);

  const unreadCount = notifications.filter((n) => !n.read_at).length;
  const loading = notifications === undefined;

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="relative inline-flex items-center justify-center rounded-md hover:bg-white/10">
        <Button className="flex gap-1" variant={"ghost"}>
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-400 text-[10px] font-normal font-mono text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-[99999] p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <DropdownMenuLabel className="p-0 text-base font-semibold">
            Notifications
          </DropdownMenuLabel>
          {notifications.length > 0 && (
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => markAllAsRead()}
                >
                  <Check className="mr-1 h-3 w-3" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => clearAllNotifications()}
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Clear all
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <Bell className="text-muted-foreground/50 mb-3 h-12 w-12" />
              <p className="text-muted-foreground text-sm font-medium">
                No notifications yet
              </p>
              <p className="text-muted-foreground text-xs">
                We&apos;ll notify you when something arrives
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "group hover:bg-muted/50 relative flex gap-3 p-4 transition-colors",
                    !notification.read_at && "bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                >
                  {notification.data.icon && (
                    <div className="flex-shrink-0 text-2xl">
                      {notification.data.icon}
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm leading-tight font-semibold">
                        {notification.data.title}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => deleteNotification({ notificationId: notification.id as Id<"notifications"> })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {notification.data.message}
                    </p>
                    {notification.data.action_url && (
                      <a
                        href={notification.data.action_url}
                        className="text-primary inline-block text-xs font-medium hover:underline"
                      >
                        {notification.data.action_text || "View"}
                      </a>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground text-xs">
                        {formatTime(notification.created_at)}
                      </p>
                      {!notification.read_at && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => markAsRead({ notificationId: notification.id as Id<"notifications"> })}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
