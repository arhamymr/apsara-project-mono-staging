'use client';

import { useState, useCallback, useMemo } from 'react';
import type {
  DocContent,
  UseDocsReturn,
} from './types';
import {
  getAllAppsWithDocStatus,
  getDocContent,
  getFirstDocEntry,
  getNavigationInfo,
} from './docs-registry';

/**
 * Main hook for documentation state management
 * 
 * Implements:
 * - App selection state management
 * - Category and entry navigation
 * - Previous/next navigation logic
 * 
 * Requirements: 1.2, 5.2, 5.3
 */
export function useDocs(): UseDocsReturn {
  // Get all apps with documentation status
  const apps = useMemo(() => getAllAppsWithDocStatus(), []);

  // State for current selection
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the currently selected app
  const selectedApp = useMemo(() => {
    if (!selectedAppId) return null;
    return apps.find((app) => app.id === selectedAppId) ?? null;
  }, [apps, selectedAppId]);

  // Get the current documentation content
  const content = useMemo((): DocContent | null => {
    if (!selectedAppId || !selectedCategoryId || !selectedEntryId) {
      return null;
    }
    return getDocContent(selectedAppId, selectedCategoryId, selectedEntryId);
  }, [selectedAppId, selectedCategoryId, selectedEntryId]);

  // Get navigation info for current entry
  const navigationInfo = useMemo(() => {
    if (!selectedAppId || !selectedCategoryId || !selectedEntryId) {
      return { prev: null, next: null };
    }
    return getNavigationInfo(selectedAppId, selectedCategoryId, selectedEntryId);
  }, [selectedAppId, selectedCategoryId, selectedEntryId]);

  // Navigation availability
  const canNavigatePrev = navigationInfo.prev !== null;
  const canNavigateNext = navigationInfo.next !== null;

  /**
   * Select an app by ID
   * Automatically selects the first entry if the app has documentation
   * 
   * Requirements: 1.2
   */
  const selectApp = useCallback((appId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const app = apps.find((a) => a.id === appId);
      if (!app) {
        setError('App not found');
        setIsLoading(false);
        return;
      }

      setSelectedAppId(appId);

      // If app has documentation, select the first entry
      if (app.hasDocumentation) {
        const firstEntry = getFirstDocEntry(appId);
        if (firstEntry) {
          setSelectedCategoryId(firstEntry.categoryId);
          setSelectedEntryId(firstEntry.entryId);
        } else {
          setSelectedCategoryId(null);
          setSelectedEntryId(null);
        }
      } else {
        setSelectedCategoryId(null);
        setSelectedEntryId(null);
      }
    } catch {
      setError('Failed to load documentation');
    } finally {
      setIsLoading(false);
    }
  }, [apps]);

  /**
   * Select a category by ID
   * Automatically selects the first entry in the category
   */
  const selectCategory = useCallback((categoryId: string) => {
    if (!selectedApp) return;

    const category = selectedApp.categories.find((c) => c.id === categoryId);
    if (!category || category.entries.length === 0) return;

    const firstEntry = category.entries[0];
    if (!firstEntry) return;

    setSelectedCategoryId(categoryId);
    setSelectedEntryId(firstEntry.id);
  }, [selectedApp]);

  /**
   * Select a specific entry by ID
   * Finds the entry across all categories and updates selection
   */
  const selectEntry = useCallback((entryId: string) => {
    if (!selectedApp) return;

    // Find the category containing this entry
    for (const category of selectedApp.categories) {
      const entry = category.entries.find((e) => e.id === entryId);
      if (entry) {
        setSelectedCategoryId(category.id);
        setSelectedEntryId(entryId);
        return;
      }
    }
  }, [selectedApp]);

  /**
   * Navigate to previous or next entry
   * 
   * Requirements: 5.2, 5.3
   */
  const navigate = useCallback((direction: 'prev' | 'next') => {
    const target = direction === 'prev' ? navigationInfo.prev : navigationInfo.next;
    if (!target) return;

    setSelectedCategoryId(target.categoryId);
    setSelectedEntryId(target.entryId);
  }, [navigationInfo]);

  return {
    apps,
    selectedAppId,
    selectedApp,
    content,
    isLoading,
    error,
    selectApp,
    selectCategory,
    selectEntry,
    navigate,
    canNavigatePrev,
    canNavigateNext,
  };
}
