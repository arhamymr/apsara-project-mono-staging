import { useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Hook to initialize welcome notification for new users
 * Call this once in your main layout or app component
 */
export function useWelcomeNotification() {
  const user = useQuery(api.user.profile);
  const initializeUser = useMutation(api.user.initializeUserWithWelcome);

  useEffect(() => {
    if (user?._id) {
      // Trigger welcome notification initialization
      initializeUser().catch((error) => {
        console.error("Failed to initialize welcome notification:", error);
      });
    }
  }, [user?._id, initializeUser]);
}
