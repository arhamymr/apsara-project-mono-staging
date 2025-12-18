"use client";

import { useWelcomeNotification } from "@/hooks/useWelcomeNotification";

/**
 * Component that initializes the welcome notification for authenticated users
 * Place this in your layout to automatically show welcome notification on first login
 */
export function WelcomeNotificationInitializer() {
  useWelcomeNotification();
  return null;
}
