'use client';

// Component Showcase Page - Main entry point
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Menu } from 'lucide-react';
import * as React from 'react';
import { ComponentDetail } from './_showcase/components/ComponentDetail';
import { ComponentGrid } from './_showcase/components/ComponentGrid';
import { ComponentSidebar } from './_showcase/components/ComponentSidebar';
import { categories } from './_showcase/data/categories';
import { componentRegistry, getComponentById } from './_showcase/data/component-registry';
import type { ShowcaseView } from './_showcase/types';

export default function ComponentShowcasePage() {
  const [view, setView] = React.useState<ShowcaseView>('catalog');
  const [selectedComponentId, setSelectedComponentId] =
    React.useState<string>();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate initial loading (in real app, this would be data fetching)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle component selection
  const handleSelectComponent = (componentId: string) => {
    setSelectedComponentId(componentId);
    setView('detail');
    setIsMobileSidebarOpen(false); // Close mobile sidebar when selecting
  };

  // Handle back to catalog
  const handleBackToCatalog = () => {
    setView('catalog');
    setSelectedComponentId(undefined);
  };

  // Keyboard navigation: Escape to close mobile sidebar
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen]);

  // Get selected component data
  const selectedComponent = selectedComponentId
    ? getComponentById(selectedComponentId)
    : undefined;

  // Handle missing component metadata
  const showComponentNotFound = view === 'detail' && !selectedComponent;

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside
        className="bg-card hidden w-80 border-r lg:block"
        role="navigation"
        aria-label="Component navigation"
      >
        <ComponentSidebar
          categories={categories}
          components={componentRegistry}
          selectedComponent={selectedComponentId}
          onSelectComponent={handleSelectComponent}
        />
      </aside>

      {/* Mobile Sidebar - Sheet/Drawer */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <ComponentSidebar
            categories={categories}
            components={componentRegistry}
            selectedComponent={selectedComponentId}
            onSelectComponent={handleSelectComponent}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <main className="flex flex-1 flex-col overflow-hidden" role="main">
        {/* Mobile Header with Menu Button */}
        <header className="bg-card border-b px-4 py-3 shadow-sm lg:hidden">
          <div className="flex items-center gap-3">
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open component menu"
                aria-expanded={isMobileSidebarOpen}
                className="hover:bg-accent focus-visible:ring-ring focus-visible:ring-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <h1 className="text-foreground text-lg font-semibold">
              UI Components
            </h1>
          </div>
        </header>

        {/* Content - Catalog or Detail View */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <LoadingSkeleton view={view} />
          ) : view === 'catalog' ? (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">
                {/* Desktop Header - Hidden on mobile */}
                <div className="mb-8 hidden lg:block">
                  <h1 className="text-foreground text-3xl font-bold tracking-tight">
                    UI Components
                  </h1>
                  <p className="text-muted-foreground mt-2 text-base">
                    Browse and explore all available UI components
                  </p>
                </div>

                {/* Mobile Description */}
                <p className="text-muted-foreground mb-6 text-sm lg:hidden">
                  Browse and explore all available UI components
                </p>

                <ComponentGrid
                  components={componentRegistry}
                  onSelectComponent={handleSelectComponent}
                />
              </div>
            </div>
          ) : showComponentNotFound ? (
            <ComponentNotFound onBack={handleBackToCatalog} />
          ) : (
            selectedComponent && (
              <ComponentDetail
                component={selectedComponent}
                onBack={handleBackToCatalog}
              />
            )
          )}
        </div>
      </main>
    </div>
  );
}

/**
 * ComponentNotFound displays an error message when component metadata is missing
 */
function ComponentNotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="mx-auto max-w-md text-center">
        <div className="bg-destructive/10 text-destructive dark:bg-destructive/20 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-foreground mb-3 text-2xl font-bold tracking-tight">
          Component Not Found
        </h2>
        <p className="text-muted-foreground mb-8 text-base leading-relaxed">
          The component you're looking for doesn't exist or hasn't been added to
          the registry yet.
        </p>
        <Button
          onClick={onBack}
          variant="default"
          className="shadow-sm transition-shadow hover:shadow-md"
        >
          Back to Catalog
        </Button>
      </div>
    </div>
  );
}


/**
 * LoadingSkeleton displays skeleton loaders while content is loading
 */
function LoadingSkeleton({ view }: { view: ShowcaseView }) {
  if (view === 'catalog') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* Header skeleton */}
          <div className="mb-8 hidden lg:block">
            <Skeleton className="mb-3 h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Mobile header skeleton */}
          <Skeleton className="mb-6 h-4 w-full lg:hidden" />

          {/* Grid skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-card dark:bg-card/50 space-y-3 rounded-lg border p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Detail view skeleton
  return (
    <div className="flex h-full flex-col">
      {/* Header skeleton */}
      <div className="bg-card dark:bg-card/50 border-b px-6 py-5 shadow-sm">
        <div className="flex items-start gap-4">
          <Skeleton className="mt-1 h-9 w-9 shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-full max-w-2xl" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="bg-card dark:bg-card/50 border-b px-6 shadow-sm">
        <div className="flex h-12 items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
