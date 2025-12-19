/**
 * TypeScript interfaces and types for the Documentation App
 * 
 * Requirements: 1.1, 3.3
 */

/**
 * Category order constants for consistent ordering across the app
 * Order: Overview (1), Getting Started (2), Features (3), API Reference (4), Troubleshooting (5)
 */
export const CATEGORY_ORDER = {
  'overview': 1,
  'getting-started': 2,
  'features': 3,
  'api-reference': 4,
  'troubleshooting': 5,
} as const;

export type CategoryId = keyof typeof CATEGORY_ORDER;

/**
 * A single documentation entry/page
 */
export interface DocEntry {
  /** Unique identifier for the entry */
  id: string;
  /** Display title of the entry */
  title: string;
  /** URL-friendly slug for the entry */
  slug: string;
  /** Markdown content of the entry */
  content: string;
}

/**
 * A category grouping related documentation entries
 */
export interface DocCategory {
  /** Unique identifier for the category */
  id: string;
  /** Display name of the category */
  name: string;
  /** Sort order (lower numbers appear first) */
  order: number;
  /** Documentation entries within this category */
  entries: DocEntry[];
}

/**
 * An app entry in the documentation sidebar
 */
export interface AppDocEntry {
  /** Unique identifier matching the app's id in app-definitions */
  id: string;
  /** Display name of the app */
  name: string;
  /** Emoji or icon for the app */
  icon: string;
  /** Whether this app has documentation available */
  hasDocumentation: boolean;
  /** Documentation categories for this app */
  categories: DocCategory[];
}

/**
 * Content to be displayed in the documentation viewer
 */
export interface DocContent {
  /** Title of the documentation page */
  title: string;
  /** Markdown content to render */
  markdown: string;
  /** Category this content belongs to */
  category: string;
  /** ID of the app this documentation belongs to */
  appId: string;
}

/**
 * A search result from the documentation search
 */
export interface SearchResult {
  /** ID of the app containing the result */
  appId: string;
  /** Display name of the app */
  appName: string;
  /** ID of the documentation entry */
  entryId: string;
  /** Title of the documentation entry */
  title: string;
  /** Preview snippet of the matching content */
  snippet: string;
  /** Category containing the result */
  category: string;
}

/**
 * Full documentation for an app
 */
export interface AppDocumentation {
  /** Unique identifier for the app */
  id: string;
  /** Display name of the app */
  name: string;
  /** Emoji or icon for the app */
  icon: string;
  /** Brief description of the app */
  description: string;
  /** Documentation categories */
  categories: DocCategory[];
}

/**
 * The documentation registry containing all app documentation
 */
export interface DocsRegistry {
  /** Map of app IDs to their documentation */
  apps: Record<string, AppDocumentation>;
}

/**
 * Entry in the search index for faster searching
 */
export interface SearchIndexEntry {
  /** ID of the app */
  appId: string;
  /** Display name of the app */
  appName: string;
  /** ID of the category */
  categoryId: string;
  /** Display name of the category */
  categoryName: string;
  /** ID of the entry */
  entryId: string;
  /** Title of the entry */
  entryTitle: string;
  /** Full text content for searching */
  content: string;
  /** Tokenized words for faster search */
  tokens: string[];
}

/**
 * Props for the DocsSidebar component
 */
export interface DocsSidebarProps {
  /** List of apps with documentation status */
  apps: AppDocEntry[];
  /** Currently selected app ID */
  selectedAppId: string | null;
  /** Callback when an app is selected */
  onSelectApp: (appId: string) => void;
  /** Current search query */
  searchQuery: string;
  /** Callback when search query changes */
  onSearchChange: (query: string) => void;
}

/**
 * Props for the DocsContent component
 */
export interface DocsContentProps {
  /** Currently selected app ID */
  appId: string | null;
  /** Content to display */
  content: DocContent | null;
  /** Whether content is loading */
  isLoading: boolean;
  /** Error message if loading failed */
  error: string | null;
  /** Callback for navigation */
  onNavigate: (direction: 'prev' | 'next') => void;
  /** Whether previous navigation is available */
  canNavigatePrev: boolean;
  /** Whether next navigation is available */
  canNavigateNext: boolean;
}

/**
 * Props for the DocsHeader component
 */
export interface DocsHeaderProps {
  /** Currently selected app */
  selectedApp: AppDocEntry | null;
  /** Callback to trigger search */
  onSearch: () => void;
}

/**
 * Props for the DocsTableOfContents component
 */
export interface DocsTableOfContentsProps {
  /** Categories to display */
  categories: DocCategory[];
  /** Currently active category ID */
  activeCategory: string | null;
  /** Callback when a category is selected */
  onSelectCategory: (categoryId: string) => void;
}

/**
 * Props for the DocsSearchResults component
 */
export interface DocsSearchResultsProps {
  /** Search results to display */
  results: SearchResult[];
  /** Callback when a result is selected */
  onSelectResult: (result: SearchResult) => void;
  /** Whether search is in progress */
  isSearching: boolean;
}

/**
 * Props for the MarkdownRenderer component
 */
export interface MarkdownRendererProps {
  /** Markdown content to render */
  content: string;
  /** Callback when code is copied */
  onCopyCode: (code: string) => void;
}

/**
 * Return type for the useDocs hook
 */
export interface UseDocsReturn {
  /** All apps with documentation status */
  apps: AppDocEntry[];
  /** Currently selected app ID */
  selectedAppId: string | null;
  /** Currently selected app */
  selectedApp: AppDocEntry | null;
  /** Current documentation content */
  content: DocContent | null;
  /** Whether content is loading */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Select an app by ID */
  selectApp: (appId: string) => void;
  /** Select a category by ID */
  selectCategory: (categoryId: string) => void;
  /** Select an entry by ID */
  selectEntry: (entryId: string) => void;
  /** Navigate to previous/next entry */
  navigate: (direction: 'prev' | 'next') => void;
  /** Whether previous navigation is available */
  canNavigatePrev: boolean;
  /** Whether next navigation is available */
  canNavigateNext: boolean;
}

/**
 * Return type for the useDocsSearch hook
 */
export interface UseDocsSearchReturn {
  /** Current search query */
  query: string;
  /** Set the search query */
  setQuery: (query: string) => void;
  /** Search results */
  results: SearchResult[];
  /** Whether search is in progress */
  isSearching: boolean;
  /** Clear the search */
  clearSearch: () => void;
}

/**
 * Helper function to get the order for a category
 * Returns the predefined order if known, otherwise returns a high number
 * for alphabetical sorting after known categories
 */
export function getCategoryOrder(categoryId: string): number {
  const normalizedId = categoryId.toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_ORDER[normalizedId as CategoryId] ?? 100;
}

/**
 * Sort categories by their predefined order
 */
export function sortCategories(categories: DocCategory[]): DocCategory[] {
  return [...categories].sort((a, b) => {
    const orderA = getCategoryOrder(a.id);
    const orderB = getCategoryOrder(b.id);
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // If same order (both unknown), sort alphabetically
    return a.name.localeCompare(b.name);
  });
}
