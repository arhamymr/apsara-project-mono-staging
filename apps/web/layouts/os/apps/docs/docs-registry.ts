/**
 * Documentation Registry
 * 
 * Contains static documentation data for all apps and provides
 * functions to access documentation content.
 * 
 * Requirements: 1.1, 4.1, 4.2
 */

import type {
  AppDocEntry,
  AppDocumentation,
  DocContent,
  DocsRegistry,
} from './types';
import { sortCategories } from './types';

// Import documentation content from data files
import {
  finderDocs,
  notesDocs,
  kanbanDocs,
  knowledgeBaseDocs,
  calculatorDocs,
  tasksDocs,
  sketchDocs,
} from './data/app-docs';

/**
 * Static registry of all app documentation
 */
const docsRegistry: DocsRegistry = {
  apps: {
    finder: finderDocs,
    notes: notesDocs,
    kanban: kanbanDocs,
    knowledgebase: knowledgeBaseDocs,
    calculator: calculatorDocs,
    tasks: tasksDocs,
    sketch: sketchDocs,
  },
};

/**
 * List of all apps in the system with their basic info
 * This should match the apps defined in app-definitions.tsx
 */
const allApps: Array<{ id: string; name: string; icon: string }> = [
  { id: 'finder', name: 'Finder', icon: '📁' },
  { id: 'language-convo', name: 'Language Conversation', icon: '🗣️' },
  { id: 'widget-manager', name: 'Widget Manager', icon: '🧩' },
  { id: 'desktop-settings', name: 'Desktop Settings', icon: '🖼️' },
  { id: 'dock-manager', name: 'Manage Docks', icon: '⚙️' },
  { id: 'graphicdesignerai', name: 'Graphic Designer AI', icon: '🎨' },
  { id: 'articles', name: 'Articles', icon: '📰' },
  { id: 'calculator', name: 'Calculator', icon: '🔢' },
  { id: 'notes', name: 'Notes', icon: '📝' },
  { id: 'sketch', name: 'Sketch', icon: '✏️' },
  { id: 'knowledgebase', name: 'Knowledge Base', icon: '📚' },
  { id: 'chatbot', name: 'Chatbot AI', icon: '🤖' },
  { id: 'mail', name: 'Mail', icon: '📫' },
  { id: 'broadcast-email', name: 'Broadcast Email', icon: '📧' },
  { id: 'lead-management', name: 'Lead Management', icon: '👥' },
  { id: 'photos', name: 'Photos', icon: '🖼️' },
  { id: 'tasks', name: 'Tasks', icon: '✅' },
  { id: 'maps', name: 'Maps', icon: '🗺️' },
  { id: 'analytics', name: 'Analytics', icon: '📊' },
  { id: 'vibe-code', name: 'Vibe Code', icon: '⚡' },
  { id: 'invoices', name: 'Invoices', icon: '🧾' },
  { id: 'kanban', name: 'Kanban', icon: '📋' },
  { id: 'organizations', name: 'Organizations', icon: '🏢' },
  { id: 'docs', name: 'Documentation', icon: '📖' },
];

/**
 * Get all apps with their documentation status
 * Returns a list of all apps indicating whether they have documentation available
 * 
 * Requirements: 1.1, 4.1, 4.2
 */
export function getAllAppsWithDocStatus(): AppDocEntry[] {
  return allApps.map((app) => {
    const docs = docsRegistry.apps[app.id];
    const hasDocumentation = docs !== undefined && docs.categories.length > 0;
    
    return {
      id: app.id,
      name: app.name,
      icon: app.icon,
      hasDocumentation,
      categories: hasDocumentation ? sortCategories(docs.categories) : [],
    };
  });
}

/**
 * Get documentation for a specific app
 * Returns the full documentation for an app, or null if not found
 * 
 * Requirements: 1.1, 4.1
 */
export function getAppDocumentation(appId: string): AppDocumentation | null {
  const docs = docsRegistry.apps[appId];
  if (!docs) {
    return null;
  }
  
  return {
    ...docs,
    categories: sortCategories(docs.categories),
  };
}

/**
 * Get a specific documentation entry content
 * Returns the content for display, or null if not found
 */
export function getDocContent(
  appId: string,
  categoryId: string,
  entryId: string
): DocContent | null {
  const docs = docsRegistry.apps[appId];
  if (!docs) {
    return null;
  }
  
  const category = docs.categories.find((c) => c.id === categoryId);
  if (!category) {
    return null;
  }
  
  const entry = category.entries.find((e) => e.id === entryId);
  if (!entry) {
    return null;
  }
  
  return {
    title: entry.title,
    markdown: entry.content,
    category: category.name,
    appId,
  };
}

/**
 * Get the first documentation entry for an app
 * Useful for initial display when selecting an app
 */
export function getFirstDocEntry(appId: string): {
  categoryId: string;
  entryId: string;
} | null {
  const docs = docsRegistry.apps[appId];
  if (!docs || docs.categories.length === 0) {
    return null;
  }
  
  const sortedCategories = sortCategories(docs.categories);
  const firstCategory = sortedCategories[0];
  
  if (!firstCategory || firstCategory.entries.length === 0) {
    return null;
  }
  
  const firstEntry = firstCategory.entries[0];
  if (!firstEntry) {
    return null;
  }
  
  return {
    categoryId: firstCategory.id,
    entryId: firstEntry.id,
  };
}

/**
 * Check if an app has documentation
 */
export function hasDocumentation(appId: string): boolean {
  const docs = docsRegistry.apps[appId];
  return docs !== undefined && docs.categories.length > 0;
}

/**
 * Get all documentation entries for search indexing
 */
export function getAllDocEntries(): Array<{
  appId: string;
  appName: string;
  categoryId: string;
  categoryName: string;
  entryId: string;
  entryTitle: string;
  content: string;
}> {
  const entries: Array<{
    appId: string;
    appName: string;
    categoryId: string;
    categoryName: string;
    entryId: string;
    entryTitle: string;
    content: string;
  }> = [];
  
  for (const [appId, docs] of Object.entries(docsRegistry.apps)) {
    for (const category of docs.categories) {
      for (const entry of category.entries) {
        entries.push({
          appId,
          appName: docs.name,
          categoryId: category.id,
          categoryName: category.name,
          entryId: entry.id,
          entryTitle: entry.title,
          content: entry.content,
        });
      }
    }
  }
  
  return entries;
}

/**
 * Get navigation info for an entry (previous/next entries)
 */
export function getNavigationInfo(
  appId: string,
  categoryId: string,
  entryId: string
): {
  prev: { categoryId: string; entryId: string } | null;
  next: { categoryId: string; entryId: string } | null;
} {
  const docs = docsRegistry.apps[appId];
  if (!docs) {
    return { prev: null, next: null };
  }
  
  const sortedCategories = sortCategories(docs.categories);
  
  // Flatten all entries with their category info
  const allEntries: Array<{ categoryId: string; entryId: string }> = [];
  for (const category of sortedCategories) {
    for (const entry of category.entries) {
      allEntries.push({ categoryId: category.id, entryId: entry.id });
    }
  }
  
  // Find current entry index
  const currentIndex = allEntries.findIndex(
    (e) => e.categoryId === categoryId && e.entryId === entryId
  );
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  const prevEntry = currentIndex > 0 ? allEntries[currentIndex - 1] : null;
  const nextEntry = currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null;
  
  return {
    prev: prevEntry ?? null,
    next: nextEntry ?? null,
  };
}

export { docsRegistry };
