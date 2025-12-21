'use client';

import { useState, useEffect } from 'react';
import { Play, Loader2, Copy, Check, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { Badge } from '@workspace/ui/components/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import { cn } from '@workspace/ui/lib/utils';
import { API_ENDPOINTS } from '../constants';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestHeader {
  key: string;
  value: string;
  enabled: boolean;
}

interface ApiResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  time: number;
}

const STORAGE_KEY = 'api-hub-testing-config';

interface StoredConfig {
  baseUrl: string;
  apiKey: string;
  method: HttpMethod;
  endpoint: string;
  requestBody: string;
  headers: RequestHeader[];
  selectedPipelineId: string;
}

const getStoredConfig = (): Partial<StoredConfig> => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveConfig = (config: StoredConfig) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Storage full or unavailable
  }
};

export function TestingTab() {
  const stored = getStoredConfig();
  
  const [baseUrl, setBaseUrl] = useState(stored.baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:1323');
  const [apiKey, setApiKey] = useState(stored.apiKey ?? '');
  const [method, setMethod] = useState<HttpMethod>(stored.method ?? 'GET');
  const [endpoint, setEndpoint] = useState(stored.endpoint ?? '/api/v1/blogs');
  const [requestBody, setRequestBody] = useState(stored.requestBody ?? '');
  const [headers, setHeaders] = useState<RequestHeader[]>(
    stored.headers ?? [{ key: 'Content-Type', value: 'application/json', enabled: true }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [headersOpen, setHeadersOpen] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(stored.selectedPipelineId ?? '');
  const [showApiKey, setShowApiKey] = useState(false);

  // Persist config whenever it changes
  useEffect(() => {
    saveConfig({ baseUrl, apiKey, method, endpoint, requestBody, headers, selectedPipelineId });
  }, [baseUrl, apiKey, method, endpoint, requestBody, headers, selectedPipelineId]);

  // Fetch user's pipelines from Convex
  const pipelines = useQuery(api.leadManagement.listPipelines);

  const getMethodColor = (m: HttpMethod) => {
    switch (m) {
      case 'GET': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'POST': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'PUT': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'DELETE': return 'bg-red-500/10 text-red-600 border-red-500/20';
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-500/10';
    if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-500/10';
    if (status >= 500) return 'text-red-600 bg-red-500/10';
    return 'text-muted-foreground bg-muted';
  };

  const selectEndpoint = (path: string) => {
    const ep = API_ENDPOINTS.find(e => e.path === path);
    if (ep) {
      setMethod(ep.method);
      setEndpoint(ep.path);
      if (ep.requestBody) {
        const sampleBody: Record<string, unknown> = {};
        Object.entries(ep.requestBody.properties).forEach(([key, prop]) => {
          if (prop.type === 'string') sampleBody[key] = '';
          else if (prop.type === 'number') sampleBody[key] = 0;
          else if (prop.type === 'object') sampleBody[key] = {};
        });
        // Auto-fill pipelineId if a pipeline is selected and this is the leads endpoint
        if (path === '/api/v1/leads' && selectedPipelineId) {
          sampleBody['pipelineId'] = selectedPipelineId;
        }
        setRequestBody(JSON.stringify(sampleBody, null, 2));
      } else {
        setRequestBody('');
      }
    }
  };

  // Update request body when pipeline selection changes
  useEffect(() => {
    if (endpoint === '/api/v1/leads' && selectedPipelineId && requestBody) {
      try {
        const body = JSON.parse(requestBody);
        body.pipelineId = selectedPipelineId;
        setRequestBody(JSON.stringify(body, null, 2));
      } catch {
        // Invalid JSON, ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPipelineId]);

  const sendRequest = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const startTime = Date.now();

    try {
      const url = `${baseUrl}${endpoint}`;
      const requestHeaders: Record<string, string> = {};
      
      headers.filter(h => h.enabled && h.key).forEach(h => {
        requestHeaders[h.key] = h.value;
      });

      if (apiKey) {
        requestHeaders['Authorization'] = `Bearer ${apiKey}`;
      }

      const options: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (['POST', 'PUT'].includes(method) && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const endTime = Date.now();

      let body: unknown;
      const contentType = res.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = await res.json();
      } else {
        body = await res.text();
      }

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body,
        time: endTime - startTime,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.body, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const updateHeader = (index: number, field: keyof RequestHeader, value: string | boolean) => {
    const newHeaders = [...headers];
    const header = newHeaders[index];
    if (header) {
      if (field === 'enabled') {
        header.enabled = value as boolean;
      } else {
        header[field] = value as string;
      }
    }
    setHeaders(newHeaders);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  return (
    <div className="flex h-full flex-col gap-4 p-4 overflow-y-auto">
      {/* Configuration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Request Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Base URL & API Key */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.yourapp.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="pk_live_..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Select Endpoint */}
          <div className="space-y-2">
            <Label>Quick Select Endpoint</Label>
            <Select onValueChange={selectEndpoint}>
              <SelectTrigger>
                <SelectValue placeholder="Select an endpoint..." />
              </SelectTrigger>
              <SelectContent>
                {API_ENDPOINTS.map((ep) => (
                  <SelectItem key={`${ep.method}-${ep.path}`} value={ep.path}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn('text-xs', getMethodColor(ep.method))}>
                        {ep.method}
                      </Badge>
                      <span>{ep.path}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pipeline Selector (for leads endpoint) */}
          {endpoint === '/api/v1/leads' && pipelines && pipelines.length > 0 && (
            <div className="space-y-2">
              <Label>Target Pipeline (for leads)</Label>
              <Select value={selectedPipelineId} onValueChange={setSelectedPipelineId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a pipeline..." />
                </SelectTrigger>
                <SelectContent>
                  {pipelines.map((pipeline) => (
                    <SelectItem key={pipeline._id} value={pipeline._id}>
                      {pipeline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Lead will be added to the first column of this pipeline
              </p>
            </div>
          )}

          {/* Method & Endpoint */}
          <div className="flex gap-2">
            <Select value={method} onValueChange={(v) => setMethod(v as HttpMethod)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/api/v1/blogs"
              className="flex-1 font-mono"
            />
            <Button onClick={sendRequest} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Send
            </Button>
          </div>

          {/* Headers */}
          <Collapsible open={headersOpen} onOpenChange={setHeadersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronDown className={cn('h-4 w-4 transition-transform', headersOpen && 'rotate-180')} />
                Headers ({headers.filter(h => h.enabled).length})
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Input
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    placeholder="Header name"
                    className="flex-1"
                  />
                  <Input
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1"
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeHeader(index)}>
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addHeader}>
                Add Header
              </Button>
            </CollapsibleContent>
          </Collapsible>

          {/* Request Body */}
          {['POST', 'PUT'].includes(method) && (
            <div className="space-y-2">
              <Label>Request Body (JSON)</Label>
              <Textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder='{"key": "value"}'
                className="min-h-32 font-mono text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Response</CardTitle>
            {response && (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={getStatusColor(response.status)}>
                  {response.status} {response.statusText}
                </Badge>
                <span className="text-xs text-muted-foreground">{response.time}ms</span>
                <Button variant="ghost" size="sm" onClick={copyResponse}>
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {response && !isLoading && (
            <pre className="max-h-96 overflow-auto rounded bg-muted p-4 text-sm">
              <code>{JSON.stringify(response.body, null, 2)}</code>
            </pre>
          )}

          {!response && !isLoading && !error && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <p>No response yet</p>
              <p className="text-sm">Configure your request and click Send</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
