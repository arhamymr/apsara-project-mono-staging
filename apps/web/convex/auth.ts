import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Password],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId, existingUserId }) {
      // Only create welcome notification for NEW users (not existing ones)
      if (existingUserId) {
        return; // User already exists, skip welcome notification
      }

      // Create welcome notification for new user
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
    },
  },
});