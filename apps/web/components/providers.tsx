"use client";

import * as React from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AppLocaleProvider } from "@/i18n/LocaleContext";
import {ConvexClientProvider} from "@/provider/convex";
import { WelcomeNotificationInitializer } from "./WelcomeNotificationInitializer";

const queryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <AppLocaleProvider>
          <ConvexClientProvider>
            <WelcomeNotificationInitializer />
            {children}
          </ConvexClientProvider>
        </AppLocaleProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
