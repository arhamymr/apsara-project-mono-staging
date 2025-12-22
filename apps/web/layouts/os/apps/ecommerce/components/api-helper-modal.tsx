'use client';

import React from 'react';
import { Button } from '@workspace/ui/components/button';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ApiHelperContentProps {
  shopSlug: string;
}

export function ApiHelperContent({ shopSlug }: ApiHelperContentProps) {
  const [copiedEndpoint, setCopiedEndpoint] = React.useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const endpoints = [
    {
      id: 'list-products',
      method: 'GET',
      path: `/api/products/${shopSlug}`,
      description: 'Get all active products for the shop',
      params: [
        { name: 'limit', type: 'number', description: 'Number of products to return (1-100, default: 10)', optional: true },
        { name: 'offset', type: 'number', description: 'Number of products to skip (default: 0)', optional: true },
        { name: 'category', type: 'string', description: 'Filter by category', optional: true },
        { name: 'tags', type: 'string', description: 'Comma-separated tags to filter by', optional: true },
      ],
      exampleRequest: `curl -X GET "${baseUrl}/api/products/${shopSlug}?limit=10&offset=0"`,
      exampleResponse: {
        products: [
          {
            id: 'j97abc123...',
            slug: 'example-product',
            name: 'Example Product',
            description: 'Product description',
            price: 2999,
            inventory: 50,
            status: 'active',
            category: 'Electronics',
            tags: ['featured', 'new'],
            images: [
              {
                url: 'https://example.com/image.jpg',
                position: 0,
                isPrimary: true,
              },
            ],
            createdAt: 1234567890,
            updatedAt: 1234567890,
          },
        ],
        pagination: {
          total: 25,
          limit: 10,
          offset: 0,
          hasMore: true,
        },
      },
    },
    {
      id: 'get-product',
      method: 'GET',
      path: `/api/products/${shopSlug}/[productSlug]`,
      description: 'Get a single product by slug',
      params: [],
      exampleRequest: `curl -X GET "${baseUrl}/api/products/${shopSlug}/example-product"`,
      exampleResponse: {
        id: 'j97abc123...',
        slug: 'example-product',
        name: 'Example Product',
        description: 'Product description',
        price: 2999,
        inventory: 50,
        status: 'active',
        category: 'Electronics',
        tags: ['featured', 'new'],
        images: [
          {
            url: 'https://example.com/image.jpg',
            position: 0,
            isPrimary: true,
          },
        ],
        createdAt: 1234567890,
        updatedAt: 1234567890,
      },
    },
  ];

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(id);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold">API Documentation</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Use these endpoints to integrate your shop with external systems. All endpoints return JSON and support CORS.
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-6">
          {/* Base URL */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Base URL</h3>
            <div className="bg-muted rounded-md p-3 flex items-center justify-between">
              <code className="text-sm">{baseUrl}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(baseUrl, 'base-url')}
              >
                {copiedEndpoint === 'base-url' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Authentication */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Authentication</h3>
            <p className="text-sm text-muted-foreground">
              No authentication required. All endpoints return only active (published) products.
            </p>
          </div>

          {/* Endpoints */}
          {endpoints.map((endpoint) => (
            <div key={endpoint.id} className="border rounded-lg p-4 space-y-4">
              {/* Endpoint Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-mono font-semibold">
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono">{endpoint.path}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`${baseUrl}${endpoint.path}`, endpoint.id)}
                >
                  {copiedEndpoint === endpoint.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Parameters */}
              {endpoint.params.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Query Parameters</h4>
                  <div className="space-y-2">
                    {endpoint.params.map((param) => (
                      <div key={param.name} className="text-sm">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                            {param.name}
                          </code>
                          <span className="text-xs text-muted-foreground">{param.type}</span>
                          {param.optional && (
                            <span className="text-xs text-muted-foreground italic">optional</span>
                          )}
                        </div>
                        <p className="text-muted-foreground ml-1 mt-0.5">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Example Request */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Example Request</h4>
                <div className="bg-muted rounded-md p-3 relative">
                  <pre className="text-xs font-mono overflow-x-auto">
                    {endpoint.exampleRequest}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(endpoint.exampleRequest, `${endpoint.id}-request`)}
                  >
                    {copiedEndpoint === `${endpoint.id}-request` ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Example Response */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Example Response</h4>
                <div className="bg-muted rounded-md p-3 relative">
                  <pre className="text-xs font-mono overflow-x-auto">
                    {JSON.stringify(endpoint.exampleResponse, null, 2)}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        JSON.stringify(endpoint.exampleResponse, null, 2),
                        `${endpoint.id}-response`
                      )
                    }
                  >
                    {copiedEndpoint === `${endpoint.id}-response` ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Try it out */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = endpoint.id === 'list-products'
                      ? `${baseUrl}${endpoint.path}?limit=10`
                      : `${baseUrl}${endpoint.path.replace('[productSlug]', 'example-product')}`;
                    window.open(url, '_blank');
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Try in Browser
                </Button>
              </div>
            </div>
          ))}

          {/* Additional Notes */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="text-sm font-semibold">Additional Notes</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>All prices are in cents (e.g., 2999 = $29.99)</li>
              <li>Timestamps are Unix timestamps in milliseconds</li>
              <li>Only products with status &quot;active&quot; are returned</li>
              <li>CORS is enabled for all origins</li>
              <li>Rate limiting may apply for excessive requests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Legacy modal wrapper for backward compatibility
interface ApiHelperModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shopSlug: string;
}

export function ApiHelperModal({ open, onOpenChange, shopSlug }: ApiHelperModalProps) {
  // This is now just a wrapper that's not used when opened as sub-window
  return null;
}
