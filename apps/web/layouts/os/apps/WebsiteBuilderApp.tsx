/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar';
import { EditableProvider } from '@/contexts/editable-context';
import { useWebsite } from '@/hooks/use-website';
import {
  fetchWebsiteBySlug,
  fetchWebsites,
} from '@/layouts/os/apps/website/api';
import { ComponentBuilder } from '@/layouts/os/apps/website/create';
import { OnboardingScreen } from '@/layouts/os/apps/website/onboarding';
import type { TemplateDefinition } from '@/layouts/os/apps/website/template-schema';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';

export default function WebsiteBuilderApp() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard-websites'],
    queryFn: fetchWebsites,
  });

  const {
    handleCreateFromScratch,
    handleSelectTemplate,
    setWebsite,
    setTabState,
    form,
  } = useWebsite();

  const { openSubWindow, activeId, windows } = useWindowContext();

  const parentWindowId = useMemo(() => {
    if (activeId) return activeId;
    const parent = windows.find(
      (win) => win.appId === 'website-builder' && !win.sub,
    );
    return parent?.id ?? null;
  }, [activeId, windows]);

  const errorMessage =
    isError && error instanceof Error
      ? error.message
      : isError
        ? 'Unable to load websites.'
        : undefined;

  const openBuilderWindow = useCallback(
    (title: string) => {
      if (!parentWindowId) return null;
      return openSubWindow(parentWindowId, {
        title,
        width: 1180,
        height: 760,
        content: <BuilderWindowContent />,
      });
    },
    [openSubWindow, parentWindowId],
  );

  const prepareFormForCreate = useCallback(
    (site: any, nameHint?: string) => {
      setTabState('general');
      form.reset({
        name: nameHint ?? 'Simple Website',
        slug: '',
        currentSlug: '',
        structure: site ?? {},
      });
      form.clearErrors();
      form.trigger();
    },
    [form, setTabState],
  );

  const handleCreate = useCallback(() => {
    const site = handleCreateFromScratch();
    prepareFormForCreate(site, 'Simple Website');
    openBuilderWindow('Create Website');
  }, [handleCreateFromScratch, openBuilderWindow, prepareFormForCreate]);

  const handleTemplateSelection = useCallback(
    (template: TemplateDefinition) => {
      // Cast template to any since normalizeWebsite in store handles the conversion
      const site = handleSelectTemplate(template as unknown as Parameters<typeof handleSelectTemplate>[0]);
      prepareFormForCreate(site, template.name ?? 'Simple Website');
      openBuilderWindow(`Template: ${template.name}`);
    },
    [handleSelectTemplate, openBuilderWindow, prepareFormForCreate],
  );

  const handleOpenExisting = useCallback(
    async (site: any) => {
      const slug = site?.slug;
      if (!slug) return;
      try {
        const result = await fetchWebsiteBySlug(slug);
        const website = result?.website;
        if (!website) {
          throw new Error('Website not found.');
        }
        setTabState('general');
        setWebsite(website.structure ?? {});
        form.reset({
          name: website.name ?? '',
          slug: website.slug ?? '',
          currentSlug: website.slug ?? '',
          structure: website.structure ?? {},
        });
        form.clearErrors();
        form.trigger();
        openBuilderWindow(`Edit: ${website.name ?? website.slug ?? 'Website'}`);
      } catch (err: any) {
        toast.error(err?.message ?? 'Failed to open website.');
      }
    },
    [form, openBuilderWindow, setTabState, setWebsite],
  );

  return (
    <div className="bg-background text-foreground flex h-full w-full flex-col overflow-hidden">
      <OnboardingScreen
        websites={data?.websites ?? []}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onRetry={refetch}
        onSelectTemplate={handleTemplateSelection}
        onCreateNew={handleCreate}
        onOpenWebsite={handleOpenExisting}
      />
    </div>
  );
}

function BuilderWindowContent() {
  return (
    <EditableProvider>
      <SidebarProvider
        defaultOpen={false}
        className="h-full w-full"
        style={{ minHeight: '100%', height: '100%' }}
      >
        <div className="bg-background text-foreground flex h-full w-full flex-col overflow-hidden">
          <SidebarInset className="flex-1 overflow-auto p-4">
            <ComponentBuilder />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </EditableProvider>
  );
}
