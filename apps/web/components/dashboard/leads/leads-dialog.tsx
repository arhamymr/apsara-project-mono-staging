/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import type { Lead, LeadStatus } from './types';

const STATUS_OPTIONS: LeadStatus[] = [
  'captured',
  'contact',
  'response',
  'Done',
];

export function LeadFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  initial?: Partial<Lead>;
  onSubmit?: (payload: Partial<Lead>) => void;
}) {
  const [draft, setDraft] = React.useState<Partial<Lead>>(initial ?? {});
  React.useEffect(() => setDraft(initial ?? {}), [initial]);
  const setField = (key: keyof Lead, value: any) =>
    setDraft((d) => ({ ...d, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial?.id ? 'Edit Lead' : 'New Lead'}</DialogTitle>
          <DialogDescription>Fill in the details below.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Full name</Label>
            <Input
              value={draft.fullname ?? ''}
              onChange={(e) => setField('fullname', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={draft.email ?? ''}
              onChange={(e) => setField('email', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Company</Label>
            <Input
              value={draft.company_name ?? ''}
              onChange={(e) => setField('company_name', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Detail</Label>
            <Textarea
              value={draft.detail ?? ''}
              onChange={(e) => setField('detail', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={draft.status ?? ''}
              onValueChange={(v) => setField('status', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSubmit?.(draft);
              onOpenChange(false);
            }}
          >
            {initial?.id ? 'Save' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
