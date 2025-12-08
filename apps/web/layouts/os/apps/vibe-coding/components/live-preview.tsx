'use client';

import { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { AlertCircle } from 'lucide-react';
import { ReactPreviewWrapper } from './react-preview-wrapper';

interface LivePreviewProps {
  files: Record<string, string>;
  framework?: string;
}

export function LivePreview({ files, framework }: LivePreviewProps) {
  // Use React wrapper for React components
  if (framework === 'React' || framework === 'react') {
    return (
      <div className="relative h-full w-full bg-background">
        <ReactPreviewWrapper files={files} />
      </div>
    );
  }

  // Use iframe for vanilla HTML/CSS/JS
  return <VanillaPreview files={files} />;
}

function VanillaPreview({ files }: { files: Record<string, string> }) {
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

      // Build the HTML content for vanilla JS
      const htmlContent = buildVanillaPreview(files);

      // Write to iframe
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      setError(null);
    } catch (err) {
      console.error('Preview error:', err);
      setError(err instanceof Error ? err.message : 'Failed to render preview');
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
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin"
        title="Live Preview"
      />
    </div>
  );
}

function buildVanillaPreview(files: Record<string, string>): string {
  // Find HTML, CSS, and JS files
  const htmlFile = Object.keys(files).find((f) => f.endsWith('.html'));
  const cssFiles = Object.keys(files).filter((f) => f.endsWith('.css'));
  const jsFiles = Object.keys(files).filter((f) => f.endsWith('.js'));

  let html = htmlFile && files[htmlFile] ? files[htmlFile] : '<div id="root"></div>';

  // Inject CSS
  const cssContent = cssFiles.map((f) => files[f] || '').join('\n');
  if (cssContent && html.includes('</head>')) {
    html = html.replace('</head>', `<style>${cssContent}</style></head>`);
  }

  // Console interceptor script
  const consoleInterceptor = `
    <script>
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
  `;

  // Inject JS
  const jsContent = jsFiles.map((f) => files[f] || '').join('\n');
  if (jsContent && html.includes('</body>')) {
    html = html.replace(
      '</body>',
      `${consoleInterceptor}<script>${jsContent}</script></body>`,
    );
  }

  // Add base styling if no head tag exists
  if (!html.includes('<head>')) {
    html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; }
    ${cssContent}
  </style>
</head>
<body>
  ${html}
  ${consoleInterceptor}
  <script>${jsContent}</script>
</body>
</html>`;
  }

  return html;
}




