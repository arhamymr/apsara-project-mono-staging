'use client';

import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Notification = {
  id: string;
  type: string;
  data: {
    title: string;
    message: string;
    icon?: string;
    type?: string;
    action_url?: string;
    action_text?: string;
  };
  read_at: string | null;
  created_at: string;
};

type NotificationsResponse = {
  notifications: Notification[];
  unread_count: number;
};

interface NotificationBellProps {
  user?: { id: number } | null;
}

export default function NotificationBell({ user }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetcher<NotificationsResponse>('/api/notifications'),
    enabled: false, // Only fetch when dropdown is opened
  });

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unread_count ?? 0;

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) =>
      fetcher<void>(`/api/notifications/${id}/read`, { method: 'POST' }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<NotificationsResponse>(
        ['notifications'],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.map((n) =>
              n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
            ),
            unread_count: Math.max(0, old.unread_count - 1),
          };
        },
      );
    },
    onError: () => {
      toast.error('Failed to mark notification as read');
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () =>
      fetcher<void>('/api/notifications/read-all', { method: 'POST' }),
    onSuccess: () => {
      queryClient.setQueryData<NotificationsResponse>(
        ['notifications'],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.map((n) => ({
              ...n,
              read_at: new Date().toISOString(),
            })),
            unread_count: 0,
          };
        },
      );
      toast.success('All notifications marked as read');
    },
    onError: () => {
      toast.error('Failed to mark all as read');
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) =>
      fetcher<void>(`/api/notifications/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<NotificationsResponse>(
        ['notifications'],
        (old) => {
          if (!old) return old;
          const notification = old.notifications.find((n) => n.id === id);
          const wasUnread = notification && !notification.read_at;
          return {
            ...old,
            notifications: old.notifications.filter((n) => n.id !== id),
            unread_count: wasUnread
              ? Math.max(0, old.unread_count - 1)
              : old.unread_count,
          };
        },
      );
      toast.success('Notification deleted');
    },
    onError: () => {
      toast.error('Failed to delete notification');
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: () => fetcher<void>('/api/notifications', { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.setQueryData<NotificationsResponse>(['notifications'], {
        notifications: [],
        unread_count: 0,
      });
      toast.success('All notifications cleared');
    },
    onError: () => {
      toast.error('Failed to clear notifications');
    },
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  // Fetch notifications only when dropdown is opened
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && user) {
      refetch();
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="relative inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="z-[99999] w-80 p-0"
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
                  onClick={() => markAllAsReadMutation.mutate()}
                >
                  <Check className="mr-1 h-3 w-3" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => clearAllMutation.mutate()}
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
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="text-muted-foreground/50 mb-2 h-12 w-12" />
              <p className="text-muted-foreground text-sm font-medium">
                No notifications yet
              </p>
              <p className="text-muted-foreground text-xs">
                We'll notify you when something arrives
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'group hover:bg-muted/50 relative flex gap-3 p-4 transition-colors',
                    !notification.read_at &&
                      'bg-blue-50/50 dark:bg-blue-950/20',
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
                        onClick={() =>
                          deleteNotificationMutation.mutate(notification.id)
                        }
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
                        onClick={() => {
                          if (!notification.read_at) {
                            markAsReadMutation.mutate(notification.id);
                          }
                        }}
                      >
                        {notification.data.action_text || 'View'}
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
                          onClick={() =>
                            markAsReadMutation.mutate(notification.id)
                          }
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
