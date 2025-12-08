'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AlertCircle } from 'lucide-react';
import * as React from 'react';

interface ReactPreviewWrapperProps {
  files: Record<string, string>;
}

export function ReactPreviewWrapper({ files }: ReactPreviewWrapperProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cssContent, setCssContent] = useState<string>('');

  useEffect(() => {
    const loadComponent = async () => {
      try {
        // Extract CSS files
        const cssFiles = Object.keys(files).filter((f) => f.endsWith('.css'));
        const css = cssFiles.map((f) => files[f]).join('\n');
        setCssContent(css);

        // Find the main component file
        const mainFile = Object.keys(files).find(
          (f) =>
            f.includes('App.') ||
            f.includes('app.') ||
            f.includes('index.') ||
            f.endsWith('.tsx') ||
            f.endsWith('.jsx'),
        );

        if (!mainFile) {
          setError('No React component file found');
          return;
        }

        const code = files[mainFile];
        if (!code) {
          setError('Component file is empty');
          return;
        }

        // Transform the code to work in our environment
        const transformedCode = transformCode(code);

        // Try to evaluate the component
        const GeneratedComponent = await evaluateComponent(transformedCode);

        setComponent(() => GeneratedComponent);
        setError(null);
      } catch (err) {
        console.error('Preview error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render component');
      }
    };

    loadComponent();
  }, [files]);

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading component...</div>
      </div>
    );
  }

  return (
    <>
      {cssContent && <style dangerouslySetInnerHTML={{ __html: cssContent }} />}
      <div className="h-full w-full overflow-auto p-4">
        <Component />
      </div>
    </>
  );
}

async function evaluateComponent(code: string): Promise<React.ComponentType> {
  // Create a data URL with the component code
  const blob = new Blob(
    [
      `
      import * as React from 'react';
      const { useState, useEffect, useRef, useCallback, useMemo, useContext, useReducer } = React;
      
      ${code}
      
      export default App || Component || (() => React.createElement('div', null, 'No component exported'));
    `,
    ],
    { type: 'text/javascript' },
  );

  const url = URL.createObjectURL(blob);

  try {
    const module = await import(/* @vite-ignore */ url);
    return module.default;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function transformCode(code: string): string {
  // Remove import statements
  code = code.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');

  // Remove export default
  code = code.replace(/export\s+default\s+/g, '');

  // Remove export keyword from function declarations
  code = code.replace(/export\s+function\s+/g, 'function ');
  code = code.replace(/export\s+const\s+/g, 'const ');

  // If it's a function component, ensure it's named App
  if (!code.includes('function App') && !code.includes('const App')) {
    // Try to find the main function and rename it to App
    code = code.replace(/function\s+(\w+)\s*\(/, (match, name) => {
      if (name !== 'App') {
        return 'function App(';
      }
      return match;
    });

    // Try to find arrow function component
    code = code.replace(/const\s+(\w+)\s*=\s*\(/, (match, name) => {
      if (name !== 'App') {
        return 'const App = (';
      }
      return match;
    });
  }

  return code;
}
