// components/dashboard/website/builder/WebsiteFormProvider.tsx
import {
  WebsiteFormData,
  websiteFormSchema,
} from '@/layouts/os/apps/website/components/meta-data/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { createContext, useContext } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';

const WebsiteFormCtx = createContext<UseFormReturn<WebsiteFormData> | null>(
  null,
);

export function WebsiteFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const form = useForm<WebsiteFormData>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: {
      name: 'Simple Website',
      slug: '',
      currentSlug: '',
      structure: {},
    },
  });

  return (
    <WebsiteFormCtx.Provider value={form}>{children}</WebsiteFormCtx.Provider>
  );
}

export function useWebsiteForm() {
  const ctx = useContext(WebsiteFormCtx);
  if (!ctx)
    throw new Error('useWebsiteForm must be used within WebsiteFormProvider');
  return ctx;
}
