/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebsiteFormProvider } from '@/hooks/use-website/provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { SiteProvider } from './context/site-context';
import { AppLocaleProvider } from './i18n/LocaleContext';
import { ThemeProvider } from './layouts/dark-mode/theme-provider';

const queryClientOptions = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
};

export default function Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      <WebsiteFormProvider>
        <SiteProvider>
          <AppLocaleProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AppLocaleProvider>
        </SiteProvider>
      </WebsiteFormProvider>
    </QueryClientProvider>
  );
}
