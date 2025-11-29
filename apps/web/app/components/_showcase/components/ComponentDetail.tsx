'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import * as React from 'react';
import type { ComponentDetailProps } from '../types';
import { CodeBlock } from './CodeBlock';
import { ComponentPreview } from './ComponentPreview';
import { PropsTable } from './PropsTable';

type TabValue = 'preview' | 'code' | 'props';

/**
 * ComponentDetail displays detailed information about a component with tabbed navigation
 * between preview, code, and props views
 */
export function ComponentDetail({ component, onBack }: ComponentDetailProps) {
  const [activeTab, setActiveTab] = React.useState<TabValue>('preview');
  const [exampleIndex, setExampleIndex] = React.useState(0);
  const [tabAnnouncement, setTabAnnouncement] = React.useState('');

  // Reset example index when component changes
  React.useEffect(() => {
    setExampleIndex(0);
  }, [component?.id]);

  // Announce tab changes for screen readers
  React.useEffect(() => {
    const tabNames: Record<TabValue, string> = {
      preview: 'Preview',
      code: 'Code',
      props: 'Props',
    };
    setTabAnnouncement(`${tabNames[activeTab]} tab selected`);
  }, [activeTab]);

  // Keyboard navigation for tabs
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Arrow key navigation
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const tabs: TabValue[] = ['preview', 'code'];
        if (component.props && component.props.length > 0) {
          tabs.push('props');
        }

        const currentIndex = tabs.indexOf(activeTab);
        let newIndex: number;

        if (event.key === 'ArrowLeft') {
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        } else {
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        }

        const newTab = tabs[newIndex];
        if (newTab) {
          setActiveTab(newTab);
        }
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, component?.props]);

  // Validate component data after all hooks
  if (!component) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Invalid Component</h2>
          <p className="text-muted-foreground mb-4">
            Component data is missing or invalid.
          </p>
          <Button onClick={onBack} variant="default">
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  const currentExample = component.examples[exampleIndex];
  const hasProps = component.props && component.props.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {tabAnnouncement}
      </div>

      {/* Header with back button and component info */}
      <div className="bg-card dark:bg-card/50 border-b px-6 py-5 shadow-sm">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            aria-label="Back to catalog"
            className="hover:bg-accent focus-visible:ring-ring mt-1 focus-visible:ring-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              {component.name}
            </h1>
            <p className="text-muted-foreground mt-2 text-base leading-relaxed">
              {component.description}
            </p>

            {/* Tags */}
            {component.tags && component.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {component.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-muted dark:bg-muted/50 text-muted-foreground rounded-md px-2.5 py-1 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <div className="bg-card dark:bg-card/50 border-b px-6 shadow-sm">
          <TabsList
            className="h-12 bg-transparent"
            role="tablist"
            aria-label="Component views"
          >
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-background dark:data-[state=active]:bg-background/50 px-5 data-[state=active]:shadow-sm"
              id="preview-tab"
              role="tab"
              aria-controls="preview-panel"
              aria-selected={activeTab === 'preview'}
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="data-[state=active]:bg-background dark:data-[state=active]:bg-background/50 px-5 data-[state=active]:shadow-sm"
              id="code-tab"
              role="tab"
              aria-controls="code-panel"
              aria-selected={activeTab === 'code'}
            >
              Code
            </TabsTrigger>
            {hasProps && (
              <TabsTrigger
                value="props"
                className="data-[state=active]:bg-background dark:data-[state=active]:bg-background/50 px-5 data-[state=active]:shadow-sm"
                id="props-tab"
                role="tab"
                aria-controls="props-panel"
                aria-selected={activeTab === 'props'}
              >
                Props
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent
            value="preview"
            className="mt-0 h-full"
            role="tabpanel"
            id="preview-panel"
            aria-labelledby="preview-tab"
            tabIndex={0}
          >
            <div className="p-6">
              <ComponentPreview
                component={component}
                exampleIndex={exampleIndex}
                onExampleChange={setExampleIndex}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="code"
            className="mt-0 h-full"
            role="tabpanel"
            id="code-panel"
            aria-labelledby="code-tab"
            tabIndex={0}
          >
            <div className="p-6">
              <div className="space-y-8">
                {/* Usage example code */}
                {currentExample && (
                  <div>
                    <h3 className="text-foreground mb-4 text-lg font-semibold tracking-tight">
                      {currentExample.title}
                    </h3>
                    <CodeBlock
                      code={currentExample.code}
                      filename={`${component.id}-example.tsx`}
                    />
                  </div>
                )}

                {/* Import statement */}
                <div>
                  <h3 className="text-foreground mb-4 text-lg font-semibold tracking-tight">
                    Import
                  </h3>
                  <CodeBlock
                    code={`import { ${component.name} } from '@/${component.filePath.replace('.tsx', '')}';`}
                  />
                </div>

                {/* Dependencies */}
                {component.dependencies &&
                  component.dependencies.length > 0 && (
                    <div>
                      <h3 className="text-foreground mb-4 text-lg font-semibold tracking-tight">
                        Dependencies
                      </h3>
                      <div className="bg-muted/30 dark:bg-muted/10 rounded-lg border p-5">
                        <ul className="text-muted-foreground space-y-2 text-sm">
                          {component.dependencies.map((dep) => (
                            <li key={dep} className="font-mono">
                              {dep}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </TabsContent>

          {hasProps && (
            <TabsContent
              value="props"
              className="mt-0 h-full"
              role="tabpanel"
              id="props-panel"
              aria-labelledby="props-tab"
              tabIndex={0}
            >
              <div className="p-6">
                <h3 className="text-foreground mb-5 text-lg font-semibold tracking-tight">
                  Component Props
                </h3>
                <PropsTable props={component.props!} />
              </div>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
}
