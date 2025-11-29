"use client"

import * as React from "react"
import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// These providers will be imported once their source files are migrated in Phase 3
// import { WebsiteFormProvider } from "@/hooks/use-website/provider"
// import { SiteProvider } from "@/contexts/site-context"
// import { AppLocaleProvider } from "@/i18n/LocaleContext"

const queryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions))

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {/* WebsiteFormProvider, SiteProvider, and AppLocaleProvider will be added 
            after their source files are migrated in Phase 3 (Task 3) */}
        {children}
      </NextThemesProvider>
    </QueryClientProvider>
  )
}
