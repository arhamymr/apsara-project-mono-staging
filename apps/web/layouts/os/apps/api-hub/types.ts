import { Id } from '@/convex/_generated/dataModel';

export interface APIKey {
  _id: Id<'apiKeys'>;
  name: string;
  key?: string; // Only shown on creation
  keyPrefix: string; // First 12 chars for display (e.g., "pk_live_xxxx...")
  permissions: string[];
  rateLimit: number;
  isActive: boolean;
  lastUsedAt?: number;
  expiresAt?: number;
  createdAt: number;
}

export type Permission = 
  | 'blogs:read'
  | 'blogs:write'
  | 'leads:read'
  | 'leads:write'
  | 'analytics:read';

export interface APIUsageStats {
  totalRequests: number;
  requestsToday: number;
  requestsThisMonth: number;
  topEndpoints: { endpoint: string; count: number }[];
  errorRate: number;
}

export interface EndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requiredPermission: Permission;
  requestBody?: {
    type: string;
    properties: Record<string, { type: string; required?: boolean; description?: string }>;
  };
  responseExample: unknown;
}
