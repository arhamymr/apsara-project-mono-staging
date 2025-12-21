'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight, BookOpen, Code2 } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { API_ENDPOINTS, CODE_EXAMPLES } from '../constants';
import { cn } from '@workspace/ui/lib/utils';

export function DocsTab() {
  const [activeSubTab, setActiveSubTab] = useState<string>('quickstart');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set(['GET /api/v1/blogs']));

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleEndpoint = (path: string) => {
    setExpandedEndpoints(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'POST':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'PUT':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'DELETE':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return '';
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Sub-tab navigation */}
      <div className="border-b border-border px-4 py-2">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSubTab('quickstart')}
            className={cn(
              'gap-2 rounded-lg',
              activeSubTab === 'quickstart' && 'bg-muted'
            )}
          >
            <BookOpen className="h-4 w-4" />
            Quick Start
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveSubTab('endpoints')}
            className={cn(
              'gap-2 rounded-lg',
              activeSubTab === 'endpoints' && 'bg-muted'
            )}
          >
            <Code2 className="h-4 w-4" />
            API Endpoints
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSubTab === 'quickstart' && (
          <QuickStartContent copiedCode={copiedCode} copyCode={copyCode} />
        )}
        {activeSubTab === 'endpoints' && (
          <EndpointsContent
            expandedEndpoints={expandedEndpoints}
            toggleEndpoint={toggleEndpoint}
            getMethodColor={getMethodColor}
          />
        )}
      </div>
    </div>
  );
}

// Quick Start sub-tab content
function QuickStartContent({
  copiedCode,
  copyCode,
}: {
  copiedCode: string | null;
  copyCode: (code: string, id: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Base URL */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Base URL</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="rounded bg-muted px-3 py-2 font-mono text-sm">
            https://api.yourapp.com
          </code>
          <p className="mt-3 text-sm text-muted-foreground">
            All API requests should include your API key in the Authorization header:
          </p>
          <code className="mt-2 block rounded bg-muted px-3 py-2 font-mono text-sm">
            Authorization: Bearer YOUR_API_KEY
          </code>
        </CardContent>
      </Card>

      {/* Quick Examples */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="curl">
            <TabsList>
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            
            <TabsContent value="curl" className="space-y-4 mt-4">
              <CodeExample
                title="Fetch Blogs"
                code={CODE_EXAMPLES.curl.blogs}
                id="curl-blogs"
                copiedCode={copiedCode}
                copyCode={copyCode}
              />
              <CodeExample
                title="Submit Lead"
                code={CODE_EXAMPLES.curl.lead}
                id="curl-lead"
                copiedCode={copiedCode}
                copyCode={copyCode}
              />
            </TabsContent>

            <TabsContent value="javascript" className="space-y-4 mt-4">
              <CodeExample
                title="Fetch Blogs"
                code={CODE_EXAMPLES.javascript.blogs}
                id="js-blogs"
                copiedCode={copiedCode}
                copyCode={copyCode}
              />
              <CodeExample
                title="Submit Lead"
                code={CODE_EXAMPLES.javascript.lead}
                id="js-lead"
                copiedCode={copiedCode}
                copyCode={copyCode}
              />
            </TabsContent>

            <TabsContent value="python" className="space-y-4 mt-4">
              <CodeExample
                title="Fetch Blogs"
                code={CODE_EXAMPLES.python.blogs}
                id="py-blogs"
                copiedCode={copiedCode}
                copyCode={copyCode}
              />
              <CodeExample
                title="Submit Lead"
                code={CODE_EXAMPLES.python.lead}
                id="py-lead"
                copiedCode={copiedCode}
                copyCode={copyCode}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// Code example component
function CodeExample({
  title,
  code,
  id,
  copiedCode,
  copyCode,
}: {
  title: string;
  code: string;
  id: string;
  copiedCode: string | null;
  copyCode: (code: string, id: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyCode(code, id)}
        >
          {copiedCode === id ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded bg-muted p-3 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Endpoints sub-tab content
function EndpointsContent({
  expandedEndpoints,
  toggleEndpoint,
  getMethodColor,
}: {
  expandedEndpoints: Set<string>;
  toggleEndpoint: (path: string) => void;
  getMethodColor: (method: string) => string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">API Endpoints</h2>
        <p className="text-sm text-muted-foreground">
          Complete reference for all available API endpoints
        </p>
      </div>

      <div className="space-y-2">
        {API_ENDPOINTS.map((endpoint) => {
          const key = `${endpoint.method} ${endpoint.path}`;
          const isExpanded = expandedEndpoints.has(key);

          return (
            <Card key={key}>
              <button
                className="flex w-full items-center justify-between p-4 text-left"
                onClick={() => toggleEndpoint(key)}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cn('font-mono', getMethodColor(endpoint.method))}>
                    {endpoint.method}
                  </Badge>
                  <code className="font-mono text-sm">{endpoint.path}</code>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <CardContent className="border-t pt-4">
                  <p className="mb-4 text-sm text-muted-foreground">{endpoint.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-xs font-medium text-muted-foreground">Required Permission:</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {endpoint.requiredPermission}
                    </Badge>
                  </div>

                  {endpoint.requestBody && (
                    <div className="mb-4">
                      <span className="text-xs font-medium text-muted-foreground">Request Body:</span>
                      <div className="mt-2 space-y-1">
                        {Object.entries(endpoint.requestBody.properties).map(([name, prop]) => (
                          <div key={name} className="flex items-center gap-2 text-sm">
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{name}</code>
                            <span className="text-muted-foreground">{prop.type}</span>
                            {prop.required && <Badge variant="destructive" className="text-[10px]">required</Badge>}
                            {prop.description && (
                              <span className="text-xs text-muted-foreground">- {prop.description}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Response Example:</span>
                    <pre className="mt-2 overflow-x-auto rounded bg-muted p-3 text-xs">
                      <code>{JSON.stringify(endpoint.responseExample, null, 2)}</code>
                    </pre>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
