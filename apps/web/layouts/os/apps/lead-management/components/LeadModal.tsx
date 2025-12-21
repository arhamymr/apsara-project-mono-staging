'use client';

import { Building2, DollarSign, Mail, Phone, User, X } from 'lucide-react';
import * as React from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Textarea } from '@workspace/ui/components/textarea';
import type { Lead } from '../types';

interface LeadModalProps {
  lead: Lead | null;
  isNew: boolean;
  onSave: (data: Partial<Lead>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function LeadModal({ lead, isNew, onSave, onDelete, onClose }: LeadModalProps) {
  const [form, setForm] = React.useState<Partial<Lead>>({});

  React.useEffect(() => {
    setForm(lead ?? {});
  }, [lead]);

  if (!lead) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-background border-border relative z-10 mx-4 w-full max-w-md rounded-lg border shadow-xl">
        <div className="border-border flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold">{isNew ? 'Add New Lead' : 'Edit Lead'}</h2>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Lead name or project"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <div className="relative">
              <Building2 className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                id="company"
                className="pl-9"
                value={form.company ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="Company name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  className="pl-9"
                  value={form.email ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="phone"
                  className="pl-9"
                  value={form.phone ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <div className="relative">
                <User className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="owner"
                  className="pl-9"
                  value={form.owner ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={form.source ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                placeholder="e.g. Ads, Referral"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value (IDR)</Label>
            <div className="relative">
              <DollarSign className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                id="value"
                type="number"
                className="pl-9"
                value={form.value ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) || undefined }))}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={form.notes ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Additional notes..."
            />
          </div>
        </div>

        <div className="border-border flex items-center justify-between border-t px-4 py-3">
          {!isNew && lead.id ? (
            <Button variant="destructive" size="sm" onClick={() => onDelete(lead.id)}>
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => onSave(form)}>
              {isNew ? 'Add Lead' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
