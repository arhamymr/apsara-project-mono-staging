/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useWebsite } from '@/hooks/use-website';
import { router } from '@inertiajs/react';
import { WebsitesGrid } from './components/onboarding/WebsitesGrid';
import type { TemplateDefinition } from './template-schema';

type OnboardingProps = {
  websites: any[];
  isLoading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onSelectTemplate?: (template: TemplateDefinition) => void;
  onCreateNew?: () => void;
  onOpenWebsite?: (site: any) => void;
};

export function OnboardingScreen({
  websites,
  isLoading = false,
  errorMessage,
  onRetry,
  onSelectTemplate,
  onCreateNew,
  onOpenWebsite,
}: OnboardingProps) {
  const { handleSelectTemplate, handleCreateFromScratch } = useWebsite();

  const createManually = () => {
    if (onCreateNew) {
      onCreateNew();
      return;
    }
    handleCreateFromScratch();
    router.visit('/dashboard/website/create');
  };

  const openWebsite = (site: any) => {
    if (!site) return;
    if (onOpenWebsite) {
      onOpenWebsite(site);
      return;
    }
    router.visit(`/dashboard/website/edit/${site.slug}`);
  };

  const selectTemplate = (template: TemplateDefinition) => {
    if (onSelectTemplate) {
      onSelectTemplate(template);
      return;
    }
    handleSelectTemplate(template);
    router.visit('/dashboard/website/create');
  };

  return (
    <WebsitesGrid
      websites={websites}
      isLoading={isLoading}
      errorMessage={errorMessage}
      isAtLimit={websites.length >= 5}
      onRetry={onRetry}
      onSelectTemplate={selectTemplate}
      onOpenWebsite={openWebsite}
      onCreateNew={createManually}
    />
  );
}
