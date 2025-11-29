'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/website/builder/use-website.ts
import { useWebsiteForm } from './provider';
import { getViewportIcon, getViewportStyles, useWebsiteStore } from './store';

import { useMemo } from 'react';

export function useWebsite() {
  const form = useWebsiteForm();

  const website = useWebsiteStore((s) => s.website);
  const activePageId = useWebsiteStore((s) => s.activePageId);
  const tabState = useWebsiteStore((s) => s.tabState);
  const viewportSize = useWebsiteStore((s) => s.viewportSize);

  // actions
  const setWebsite = useWebsiteStore((s) => s.setWebsite);
  const setActivePageId = useWebsiteStore((s) => s.setActivePageId);
  const addComponent = useWebsiteStore((s) => s.addComponent);
  const removeComponent = useWebsiteStore((s) => s.removeComponent);
  const updateComponent = useWebsiteStore((s) => s.updateComponent);
  const moveComponent = useWebsiteStore((s) => s.moveComponent);
  const handleCreateFromScratch = useWebsiteStore(
    (s) => s.handleCreateFromScratch,
  );
  const handleSelectTemplate = useWebsiteStore((s) => s.handleSelectTemplate);
  const handleSubmit = useWebsiteStore((s) => s.handleSubmit);
  const setViewportSize = useWebsiteStore((s) => s.setViewportSize);
  const addPage = useWebsiteStore((s) => s.addPage);
  const removePage = useWebsiteStore((s) => s.removePage);
  const setTabState = useWebsiteStore((s) => s.setTabState);

  // derive activePage
  const activePage = useMemo(
    () => website?.pages[activePageId],
    [website.pages, activePageId],
  );

  // keep the old setter signature (accept IPageData)
  const setActivePage = (page: { id: string }) => setActivePageId(page.id);

  return {
    // ---- legacy shape preserved ----
    form,
    website,
    activePage,

    setWebsite,
    setActivePage,
    addComponent,
    removeComponent,
    updateComponent,
    moveComponent,
    handleCreateFromScratch,
    handleSelectTemplate,

    handleSubmit,

    viewportSize,
    setViewportSize,
    getViewportStyles: (size: any) => getViewportStyles(size),
    getViewportIcon: (size: any) => getViewportIcon(size),
    addPage,
    removePage,

    tabState,
    setTabState,
  };
}
