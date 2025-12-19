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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import { Loader2, Mail, ShieldCheck, Pencil, Eye } from 'lucide-react';
import type { InvitationRole } from '../types';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isInviting: boolean;
  onInvite: (email: string, role: InvitationRole) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const roleOptions: { value: InvitationRole; label: string; description: string; icon: React.ElementType }[] = [
  {
    value: 'editor',
    label: 'Editor',
    description: 'Can view and edit shared resources',
    icon: Pencil,
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Can manage members and invitations',
    icon: ShieldCheck,
  },
  {
    value: 'viewer',
    label: 'Viewer',
    description: 'Can only view shared resources',
    icon: Eye,
  },
];

export function InviteMemberDialog({
  open,
  onOpenChange,
  isInviting,
  onInvite,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<InvitationRole>('editor');
  const [error, setError] = useState('');
  const portalContainer = useWindowPortalContainer();

  // Reset form when opening/closing
  useEffect(() => {
    if (open) {
      setEmail('');
      setRole('editor');
      setError('');
    }
  }, [open]);

  const validateEmail = (value: string): boolean => {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setError('Email address is required');
      return false;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validateEmail(email)) return;
    onInvite(email.trim().toLowerCase(), role);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEmail('');
      setRole('editor');
      setError('');
    }
    onOpenChange(newOpen);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Clear error when user starts typing
    if (error && value.trim().length > 0) {
      setError('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]" portalContainer={portalContainer?.current ?? undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invite Member
          </DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization. They&apos;ll receive a notification if they have an account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={handleEmailChange}
              onKeyDown={(e) => e.key === 'Enter' && email.trim() && handleSubmit()}
              autoFocus
              className={error ? 'border-destructive' : ''}
            />
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as InvitationRole)}>
              <SelectTrigger id="invite-role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div>
                          <span className="font-medium">{option.label}</span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            - {option.description}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              {roleOptions.find((r) => r.value === role)?.description}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!email.trim() || isInviting}>
            {isInviting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
