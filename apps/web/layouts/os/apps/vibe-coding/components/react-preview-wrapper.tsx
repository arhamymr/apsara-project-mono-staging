'use client';

import { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AlertCircle } from 'lucide-react';

interface ReactPreviewWrapperProps {
  files: Record<string, string>;
}

export function ReactPreviewWrapper({ files }: ReactPreviewWrapperProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

      if (!iframeDoc) {
        setError('Unable to access iframe document');
        return;
      }

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

      const componentCode = files[mainFile];
      if (!componentCode) {
        setError('Component file is empty');
        return;
      }

      // Extract CSS files
      const cssFiles = Object.keys(files).filter((f) => f.endsWith('.css'));
      const cssContent = cssFiles.map((f) => files[f] || '').join('\n');

      // Transform the code
      const transformedCode = transformCode(componentCode);

      // Build the HTML with React
      const htmlContent = buildReactHTML(transformedCode, cssContent);

      // Write to iframe
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      setError(null);
    } catch (err) {
      console.error('Preview error:', err);
      setError(err instanceof Error ? err.message : 'Failed to render component');
    }
  }, [files]);

  return (
    <div className="relative h-full w-full">
      {error && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <iframe
        ref={iframeRef}
        className="h-full w-full border-0 bg-white"
        sandbox="allow-scripts allow-same-origin"
        title="React Preview"
      />
    </div>
  );
}

function transformCode(code: string): string {
  // Remove import statements
  code = code.replace(/import\s+.*?from\s+['"].*?['"];?\n?/g, '');

  // Remove export default
  code = code.replace(/export\s+default\s+/g, '');

  // Remove export keyword
  code = code.replace(/export\s+function\s+/g, 'function ');
  code = code.replace(/export\s+const\s+/g, 'const ');

  // Ensure component is named App
  if (!code.includes('function App') && !code.includes('const App')) {
    code = code.replace(/function\s+(\w+)\s*\(/, 'function App(');
    code = code.replace(/const\s+(\w+)\s*=\s*\(/, 'const App = (');
  }

  return code;
}

function buildReactHTML(componentCode: string, cssContent: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      margin: 0; 
      padding: 16px; 
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    * { box-sizing: border-box; }
    ${cssContent}
  </style>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script>
    // Console interceptor
    (function() {
      const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info
      };
      
      ['log', 'warn', 'error', 'info'].forEach(level => {
        console[level] = function(...args) {
          originalConsole[level].apply(console, args);
          window.parent.postMessage({
            type: 'console',
            level: level,
            message: args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ')
          }, '*');
        };
      });
      
      window.addEventListener('error', (e) => {
        console.error(e.message + ' at ' + e.filename + ':' + e.lineno);
      });
    })();
  </script>
  <script type="text/babel">
    const { useState, useEffect, useRef, useCallback, useMemo, useContext, useReducer } = React;
    
    ${componentCode}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>`;
}
