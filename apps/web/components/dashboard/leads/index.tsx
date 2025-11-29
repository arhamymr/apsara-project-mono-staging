// File: LeadsManagementUI.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import { LeadFormDialog } from './leads-dialog';
import { LeadsTable } from './leads-table';
import { Toolbar } from './leads-toolbar';
import type { Lead } from './types';

const SAMPLE: Lead[] = [
  {
    id: '1',
    fullname: 'Jane Doe',
    email: 'jane@acme.com',
    company_name: 'Acme Inc',
    detail: 'Asked about pricing for web builder Pro plan.',
    status: 'captured',
  },
  {
    id: '2',
    fullname: 'Budi Santoso',
    email: 'budi@nusatech.id',
    company_name: 'NusaTech',
    detail: 'Needs multi-tenant marketing site with blog.',
    status: 'contact',
  },
  {
    id: '3',
    fullname: 'Aisha Rahman',
    email: 'aisha@rahmangroup.co',
    company_name: 'Rahman Group',
    detail: 'Follow-up sent with custom template demo.',
    status: 'response',
  },
  {
    id: '4',
    fullname: 'Michael Chan',
    email: 'michael@chanstudio.dev',
    company_name: 'Chan Studio',
    detail: 'Converted to paid — onboarding scheduled.',
    status: 'Done',
  },
];

export default function LeadsManagementUI() {
  const [items, setItems] = React.useState<Lead[]>(SAMPLE);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Lead | undefined>();

  const handleCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setEditing(lead);
    setDialogOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setItems((prev) => prev.filter((x) => x.id !== lead.id));
  };

  const handleSubmit = (payload: Partial<Lead>) => {
    if (editing) {
      setItems((prev) =>
        prev.map((x) => (x.id === editing.id ? { ...x, ...payload } : x)),
      );
    } else {
      const id = String(Date.now());
      setItems((prev) => [
        ...prev,
        {
          id,
          fullname: '',
          email: '',
          company_name: '',
          detail: '',
          status: 'captured',
          ...payload,
        } as Lead,
      ]);
    }
  };

  return (
    <div className="mx-auto w-full">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Leads Management</CardTitle>
          <CardDescription>
            Manage your captured and responded leads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toolbar onCreate={handleCreate} />
          <Separator />
          <LeadsTable
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
      <LeadFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
