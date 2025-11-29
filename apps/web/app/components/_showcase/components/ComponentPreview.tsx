'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import * as React from 'react';
import type { ComponentMetadata } from '../types';

interface ComponentPreviewProps {
  component: ComponentMetadata;
  exampleIndex: number;
  onExampleChange?: (index: number) => void;
}

interface PreviewErrorBoundaryProps {
  children: React.ReactNode;
  onError: (error: Error) => void;
}

interface PreviewErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary for catching component preview errors
 */
class PreviewErrorBoundary extends React.Component<
  PreviewErrorBoundaryProps,
  PreviewErrorBoundaryState
> {
  constructor(props: PreviewErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): PreviewErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component preview error:', error, errorInfo);
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

/**
 * ComponentPreview displays a live preview of a component with example selector and variant toggles
 */
export function ComponentPreview({
  component,
  exampleIndex,
  onExampleChange,
}: ComponentPreviewProps) {
  const [error, setError] = React.useState<Error | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedVariants, setSelectedVariants] = React.useState<
    Record<string, string>
  >(() => {
    // Initialize with default variant values
    const defaults: Record<string, string> = {};
    component.variants?.forEach((variant) => {
      defaults[variant.name] = variant.defaultValue;
    });
    return defaults;
  });

  // Get the current example
  const currentExample = component.examples[exampleIndex];

  // Reset error and show loading when example changes
  React.useEffect(() => {
    setError(null);
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [exampleIndex]);

  // Handle variant change
  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: value,
    }));
  };

  // Handle error from error boundary
  const handleError = React.useCallback((err: Error) => {
    setError(err);
  }, []);

  // Render error state
  if (error) {
    return (
      <div className="w-full p-8">
        <Alert variant="destructive" className="dark:bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold">Preview Error</AlertTitle>
          <AlertDescription className="mt-2 space-y-2 text-sm leading-relaxed">
            <p>Failed to render component preview: {error.message}</p>
            <p className="text-xs opacity-90">
              This might be due to missing dependencies or incorrect component
              configuration. Check the console for more details.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render empty state if no examples
  if (!currentExample) {
    return (
      <div className="w-full p-8">
        <Alert className="dark:bg-muted/10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            No Examples Available
          </AlertTitle>
          <AlertDescription className="text-sm leading-relaxed">
            This component does not have any examples configured yet. Examples
            will be added in future updates.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Validate that the example has a component to render
  if (!currentExample.component) {
    return (
      <div className="w-full p-8">
        <Alert variant="destructive" className="dark:bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold">Invalid Example</AlertTitle>
          <AlertDescription className="text-sm leading-relaxed">
            This example is missing a component implementation. Please check the
            example configuration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const hasMultipleExamples = component.examples.length > 1;
  const hasVariants = component.variants && component.variants.length > 0;

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Controls: Example selector and variant toggles */}
      {(hasMultipleExamples || hasVariants) && (
        <div
          className="bg-muted/30 dark:bg-muted/10 flex flex-wrap items-center gap-4 rounded-lg border px-5 py-4"
          role="toolbar"
          aria-label="Component preview controls"
        >
          {/* Example selector */}
          {hasMultipleExamples && (
            <div className="flex items-center gap-3">
              <label
                htmlFor="example-selector"
                className="text-foreground text-sm font-medium"
              >
                Example:
              </label>
              <Select
                value={exampleIndex.toString()}
                onValueChange={(value) =>
                  onExampleChange?.(parseInt(value, 10))
                }
              >
                <SelectTrigger
                  id="example-selector"
                  className="focus-visible:ring-ring w-[200px] focus-visible:ring-2"
                  aria-label="Select example"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {component.examples.map((example, index) => (
                    <SelectItem key={example.id} value={index.toString()}>
                      {example.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Variant toggles */}
          {hasVariants &&
            component.variants!.map((variant) => (
              <div key={variant.name} className="flex items-center gap-3">
                <label
                  htmlFor={`variant-${variant.name}`}
                  className="text-foreground text-sm font-medium capitalize"
                >
                  {variant.name}:
                </label>
                <Select
                  value={selectedVariants[variant.name] || variant.defaultValue}
                  onValueChange={(value) =>
                    handleVariantChange(variant.name, value)
                  }
                >
                  <SelectTrigger
                    id={`variant-${variant.name}`}
                    className="focus-visible:ring-ring w-[150px] focus-visible:ring-2"
                    aria-label={`Select ${variant.name} variant`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {variant.values.map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
        </div>
      )}

      {/* Preview container */}
      <div
        className={cn(
          'bg-background dark:bg-background/50 relative min-h-[300px] w-full rounded-lg border shadow-sm',
          'flex items-center justify-center p-8',
        )}
        role="region"
        aria-label={`Live preview of ${component.name}`}
      >
        {isLoading ? (
          <div className="w-full max-w-2xl space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ) : (
          <PreviewErrorBoundary onError={handleError}>
            <div className="w-full max-w-2xl">
              {/* Render the component with selected variants */}
              <currentExample.component {...selectedVariants} />
            </div>
          </PreviewErrorBoundary>
        )}
      </div>

      {/* Example description */}
      {currentExample.description && (
        <div className="bg-muted/30 dark:bg-muted/10 rounded-lg border p-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {currentExample.description}
          </p>
        </div>
      )}
    </div>
  );
}
