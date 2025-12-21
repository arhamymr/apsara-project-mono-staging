'use client';

import { Plus, Trash2, MoreVertical, Key } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { Switch } from '@workspace/ui/components/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { APIKey } from '../types';
import { PERMISSIONS } from '../constants';
import { Id } from '@/convex/_generated/dataModel';

interface ApiKeysTabProps {
  apiKeys: APIKey[];
  onCreateKey: () => void;
  onToggleKey: (id: Id<'apiKeys'>) => void;
  onDeleteKey: (id: Id<'apiKeys'>) => void;
}

export function ApiKeysTab({ apiKeys, onCreateKey, onToggleKey, onDeleteKey }: ApiKeysTabProps) {
  const getPermissionLabel = (perm: string) => {
    return PERMISSIONS.find(p => p.value === perm)?.label || perm;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">API Keys</h2>
          <p className="text-sm text-muted-foreground">
            Manage API keys for external integrations
          </p>
        </div>
        <Button onClick={onCreateKey} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Key
        </Button>
      </div>

      <div className="space-y-3">
        {apiKeys.map((key) => (
          <Card key={key._id} className={!key.isActive ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-base">{key.name}</CardTitle>
                  <Badge variant={key.isActive ? 'default' : 'secondary'}>
                    {key.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={key.isActive}
                    onCheckedChange={() => onToggleKey(key._id)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="z-[9999]">
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDeleteKey(key._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Key
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Key Identifier - masked, no copy/view */}
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                <code className="rounded bg-muted px-3 py-2 font-mono text-sm text-muted-foreground">
                  {key.keyPrefix}{'•'.repeat(20)}
                </code>
              </div>

              {/* Permissions */}
              <div className="flex flex-wrap gap-1">
                {key.permissions.map((perm) => (
                  <Badge key={perm} variant="outline" className="text-xs">
                    {getPermissionLabel(perm)}
                  </Badge>
                ))}
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Rate limit: {key.rateLimit}/min</span>
                <span>Created: {formatDate(key.createdAt)}</span>
                {key.lastUsedAt && (
                  <span>Last used: {formatRelativeTime(key.lastUsedAt)}</span>
                )}
                {key.expiresAt && (
                  <span className="text-orange-500">
                    Expires: {formatDate(key.expiresAt)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {apiKeys.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No API keys yet</p>
              <Button onClick={onCreateKey} variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create your first key
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
