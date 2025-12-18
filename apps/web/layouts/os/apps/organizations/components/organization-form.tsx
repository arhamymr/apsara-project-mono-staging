'use client';

import { useState, useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import { Loader2 } from 'lucide-react';
import type { Organization, OrganizationId } from '../types';

interface OrganizationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organization?: Organization | null;
  mode: 'create' | 'edit';
  isCreating: boolean;
  onCreateOrg: (name: string, description?: string) => void;
  onUpdateOrg: (id: OrganizationId, name: string, description?: string) => void;
}

export function OrganizationForm({
  open,
  onOpenChange,
  organization,
  mode,
  isCreating,
  onCreateOrg,
  onUpdateOrg,
}: OrganizationFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const portalContainer = useWindowPortalContainer();

  // Reset form when opening/closing or when organization changes
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && organization) {
        setName(organization.name);
        setDescription(organization.description || '');
      } else {
        setName('');
        setDescription('');
      }
      setError('');
    }
  }, [open, mode, organization]);

  const validateName = (value: string): boolean => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setError('Organization name is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validateName(name)) return;

    const trimmedName = name.trim();
    const trimmedDescription = description.trim() || undefined;

    if (mode === 'edit' && organization) {
      onUpdateOrg(organization._id, trimmedName, trimmedDescription);
    } else {
      onCreateOrg(trimmedName, trimmedDescription);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName('');
      setDescription('');
      setError('');
    }
    onOpenChange(newOpen);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    // Clear error when user starts typing
    if (error && value.trim().length > 0) {
      setError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]" portalContainer={portalContainer?.current ?? undefined}>
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Organization' : 'Create Organization'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Update your organization details.'
              : 'Create a new organization to collaborate with others.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="org-name">
              Organization Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="org-name"
              placeholder="My Organization"
              value={name}
              onChange={handleNameChange}
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && handleSubmit()}
              autoFocus
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="org-description">Description (optional)</Label>
            <Textarea
              id="org-description"
              placeholder="What is this organization for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'edit' ? 'Saving...' : 'Creating...'}
              </>
            ) : mode === 'edit' ? (
              'Save Changes'
            ) : (
              'Create Organization'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
