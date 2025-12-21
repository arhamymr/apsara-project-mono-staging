'use client';

import { useState } from 'react';
import { Copy, Check, AlertTriangle, X, Key } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Permission } from '../types';
import { PERMISSIONS } from '../constants';

interface CreateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; permissions: Permission[]; rateLimit: number; expiresIn?: number }) => Promise<unknown>;
  newKeyValue: string | null;
  onClearNewKey: () => void;
}

export function CreateKeyModal({ isOpen, onClose, onCreate, newKeyValue, onClearNewKey }: CreateKeyModalProps) {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>(['blogs:read']);
  const [rateLimit, setRateLimit] = useState(100);
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsCreating(true);
    try {
      await onCreate({
        name: name.trim(),
        permissions,
        rateLimit,
      });
    } catch (error) {
      console.error('Failed to create key:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setName('');
    setPermissions(['blogs:read']);
    setRateLimit(100);
    setCopied(false);
    onClearNewKey();
    onClose();
  };

  const togglePermission = (perm: Permission) => {
    setPermissions(prev =>
      prev.includes(perm)
        ? prev.filter(p => p !== perm)
        : [...prev, perm]
    );
  };

  const copyKey = () => {
    if (newKeyValue) {
      navigator.clipboard.writeText(newKeyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Show key created success view
  if (newKeyValue) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <Card className="w-full max-w-md mx-4 shadow-lg">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" />
              API Key Created
            </CardTitle>
            <CardDescription>
              Copy your API key now. You won&apos;t be able to see it again.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-950">
              <AlertTriangle className="h-5 w-5 shrink-0 text-orange-500" />
              <p className="text-sm text-orange-700 dark:text-orange-300">
                This is the only time you&apos;ll see this key. Store it securely.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <code className="flex-1 break-all rounded bg-muted px-3 py-2 font-mono text-sm">
                {newKeyValue}
              </code>
              <Button variant="outline" size="icon" onClick={copyKey}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>

          <CardFooter>
            <Button onClick={handleClose} className="w-full">Done</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 shadow-lg max-h-[90%] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Create API Key
          </CardTitle>
          <CardDescription>
            Generate a new API key for external integrations
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Key Name</Label>
            <Input
              id="name"
              placeholder="e.g., Production Website"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="space-y-2">
              {PERMISSIONS.map((perm) => (
                <div key={perm.value} className="flex items-start gap-3">
                  <Checkbox
                    id={perm.value}
                    checked={permissions.includes(perm.value)}
                    onCheckedChange={() => togglePermission(perm.value)}
                  />
                  <div className="grid gap-0.5">
                    <Label htmlFor={perm.value} className="cursor-pointer font-medium">
                      {perm.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{perm.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rateLimit">Rate Limit (requests/minute)</Label>
            <Input
              id="rateLimit"
              type="number"
              min={10}
              max={10000}
              value={rateLimit}
              onChange={(e) => setRateLimit(parseInt(e.target.value) || 100)}
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!name.trim() || permissions.length === 0 || isCreating}
            className="flex-1"
          >
            {isCreating ? 'Creating...' : 'Create Key'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
