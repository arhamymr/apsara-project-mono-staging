/**
 * Helper to create notifications from the client side
 * Usage: Use the useMutation hook with api.notifications.createNotification
 * 
 * Example:
 * const createNotif = useMutation(api.notifications.createNotification);
 * await createNotif({
 *   userId: currentUserId,
 *   type: "success",
 *   title: "Success!",
 *   message: "Your action was completed",
 * });
 */

export const notificationTypes = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

export type NotificationType = typeof notificationTypes[keyof typeof notificationTypes];
