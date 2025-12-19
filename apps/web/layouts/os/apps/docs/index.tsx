'use client';

import { useState, useCallback } from 'react';
import { useDocs } from './use-docs';
import { useDocsSearch } from './use-docs-search';
import { DocsHeader } from './components/docs-header';
import { DocsSidebar } from './components/docs-sidebar';
import { DocsContent } from './components/docs-content';
import { DocsTableOfContents } from './components/docs-table-of-contents';
import { DocsSearchResults } from './components/docs-search-results';
import type { SearchResult } from './types';

/**
 * DocsApp - Documentation Application
 * 
 * A desktop-style application that provides a centralized documentation viewer
 * for all apps in the system. Features include:
 * - Sidebar with all apps and documentation status indicators
 * - Main content area with markdown rendering
 * - Table of contents for navigation within documentation
 * - Search functionality across all documentation
 * 
 * Requirements: 1.1, 1.2
 */
export default function DocsApp() {
  // Main documentation state
  const {
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
  } = useDocs();

  // Search state
  const {
    query: searchQuery,
    setQuery: setSearchQuery,
    results: searchResults,
    isSearching,
    clearSearch,
  } = useDocsSearch();

  // UI state for search mode
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Handle search trigger from header
  const handleSearchTrigger = useCallback(() => {
    setIsSearchMode(true);
  }, []);

  // Handle search result selection
  const handleSelectSearchResult = useCallback((result: SearchResult) => {
    // Select the app first
    selectApp(result.appId);
    // Then select the specific entry
    selectEntry(result.entryId);
    // Exit search mode
    setIsSearchMode(false);
    clearSearch();
  }, [selectApp, selectEntry, clearSearch]);

  // Handle app selection from sidebar
  const handleSelectApp = useCallback((appId: string) => {
    selectApp(appId);
    // Exit search mode when selecting an app
    if (isSearchMode) {
      setIsSearchMode(false);
      clearSearch();
    }
  }, [selectApp, isSearchMode, clearSearch]);

  // Handle search query change
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    // Enter search mode when typing
    if (query.trim() && !isSearchMode) {
      setIsSearchMode(true);
    }
    // Exit search mode when clearing search
    if (!query.trim() && isSearchMode) {
      setIsSearchMode(false);
    }
  }, [setSearchQuery, isSearchMode]);

  // Get active category from content
  const activeCategory = content?.category 
    ? selectedApp?.categories.find(c => c.name === content.category)?.id ?? null
    : null;

  // Determine if we should show search results
  const showSearchResults = isSearchMode && searchQuery.trim().length > 0;

  return (
    <div className="text-foreground flex h-full min-h-0 flex-col overflow-hidden">
      {/* Header */}
      <DocsHeader
        selectedApp={selectedApp}
        onSearch={handleSearchTrigger}
      />

      {/* Main content area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid h-full grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
          {/* Sidebar - App list */}
          <div className="md:col-span-1 h-full min-h-0 overflow-hidden">
            <DocsSidebar
              apps={apps}
              selectedAppId={selectedAppId}
              onSelectApp={handleSelectApp}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Main content area */}
          <div className="md:col-span-2 lg:col-span-3 h-full min-h-0 overflow-hidden border-r">
            {showSearchResults ? (
              <DocsSearchResults
                results={searchResults}
                onSelectResult={handleSelectSearchResult}
                isSearching={isSearching}
              />
            ) : (
              <DocsContent
                appId={selectedAppId}
                content={content}
                isLoading={isLoading}
                error={error}
                onNavigate={navigate}
                canNavigatePrev={canNavigatePrev}
                canNavigateNext={canNavigateNext}
                onRetry={() => selectedAppId && selectApp(selectedAppId)}
              />
            )}
          </div>

          {/* Table of Contents - only show when viewing documentation */}
          {!showSearchResults && selectedApp && selectedApp.hasDocumentation && (
            <div className="hidden lg:block lg:col-span-1 h-full min-h-0 overflow-hidden">
              <DocsTableOfContents
                categories={selectedApp.categories}
                activeCategory={activeCategory}
                onSelectCategory={selectCategory}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
