'use client';

import { Button } from '@workspace/ui/components/button';
import { Kbd } from '@workspace/ui/components/kbd';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { useWindowContext } from '@/layouts/os/WindowContext';
import React from 'react';
import { toast } from 'sonner';
import { InvoiceForm } from './invoice/components/invoice-form';
import { useCustomers } from './invoice/hooks/useCustomers';
import { useInvoices } from './invoice/hooks/useInvoices';
import {
  Invoice,
  InvoiceStatus,
  STATUS_CONFIGS,
} from './invoice/types/invoice.types';

export default function InvoiceApp() {
  const { openSubWindow, activeId, closeWindow } = useWindowContext();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const {
    invoices,
    isLoading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    generatePdf,
  } = useInvoices({
    search,
    status:
      statusFilter === 'all' ? undefined : (statusFilter as InvoiceStatus),
  });

  const { allCustomers } = useCustomers();

  // Filter invoices
  const filteredInvoices = React.useMemo(() => {
    if (!invoices?.data) return [];
    return invoices.data;
  }, [invoices]);

  const openCreate = () => {
    if (!activeId) return;
    const subId = openSubWindow(activeId, {
      title: 'New Invoice',
      content: (
        <div className="h-full overflow-auto p-4">
          <InvoiceForm
            customers={allCustomers}
            onSubmit={async (data) => {
              try {
                await createInvoice.mutateAsync(data);
                toast.success('Invoice created successfully');
                if (subId) closeWindow(subId);
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : 'Failed to create invoice',
                );
              }
            }}
            onCancel={() => {
              if (subId) closeWindow(subId);
            }}
          />
        </div>
      ),
      width: 900,
      height: 700,
    });
  };

  const openEdit = (invoice: Invoice) => {
    if (!activeId) return;
    const subId = openSubWindow(activeId, {
      title: `Edit Invoice: ${invoice.invoice_number}`,
      content: (
        <div className="h-full overflow-auto p-4">
          <InvoiceForm
            customers={allCustomers}
            initialData={{
              customer_id: invoice.customer_id,
              invoice_date: invoice.invoice_date,
              due_date: invoice.due_date,
              tax_rate: invoice.tax_rate,
              notes: invoice.notes,
              items: invoice.items.map((item) => ({
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
              })),
              status: invoice.status,
            }}
            onSubmit={async (data) => {
              try {
                await updateInvoice.mutateAsync({ uuid: invoice.uuid, data });
                toast.success('Invoice updated successfully');
                if (subId) closeWindow(subId);
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : 'Failed to update invoice',
                );
              }
            }}
            onCancel={() => {
              if (subId) closeWindow(subId);
            }}
          />
        </div>
      ),
      width: 900,
      height: 700,
    });
  };

  const handleDelete = async (uuid: string, invoiceNumber: string) => {
    const ok = window.confirm(
      `Delete invoice "${invoiceNumber}"? This cannot be undone.`,
    );
    if (!ok) return;
    try {
      await deleteInvoice.mutateAsync(uuid);
      toast.success('Invoice deleted successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete invoice',
      );
    }
  };

  const handleGeneratePdf = async (uuid: string) => {
    try {
      await generatePdf.mutateAsync(uuid);
      toast.success('PDF generated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to generate PDF',
      );
    }
  };

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 flex w-full flex-col items-center justify-between gap-2 border-b px-4 py-3 @md:flex-row">
        <div className="flex w-full flex-col items-center gap-2 @md:w-[540px] @md:flex-row">
          {/* Search */}
          <div className="relative w-full">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice or customer..."
              className="border-border focus:ring-primary h-8 w-full rounded-md border px-3 text-sm focus:ring-1"
            />
            {search && (
              <button
                className="absolute top-1/2 right-1 -translate-y-1/2 rounded px-2 text-xs"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status filter */}
          <div className="hidden items-center gap-2 @md:flex">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="z-[99999]">
                <SelectGroup>
                  <SelectLabel>Filter by Status</SelectLabel>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(STATUS_CONFIGS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 @md:w-[130px]">
          <Button size="sm" onClick={openCreate} className="w-full">
            New Invoice <Kbd className="text-primary-900 bg-black/20">N</Kbd>
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        {/* Status Tabs */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            className={`rounded-sm border px-3 py-1 text-xs ${statusFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          {Object.entries(STATUS_CONFIGS).map(([key, config]) => (
            <button
              key={key}
              className={`rounded-sm border px-3 py-1 text-xs ${statusFilter === key ? 'bg-primary text-primary-foreground border-primary' : 'border-border'}`}
              onClick={() => setStatusFilter(key)}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : !filteredInvoices || filteredInvoices.length === 0 ? (
          <div className="text-muted-foreground text-sm">No invoices yet.</div>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border-border hover:border-primary/50 bg-card rounded-lg border p-4 transition-all hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-base font-semibold">
                        {invoice.invoice_number}
                      </h3>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_CONFIGS[invoice.status].bgColor} ${STATUS_CONFIGS[invoice.status].color}`}
                      >
                        {STATUS_CONFIGS[invoice.status].label}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {invoice.customer?.name}
                    </p>
                    <div className="text-muted-foreground mt-2 flex gap-3 text-xs">
                      <span>Date: {invoice.invoice_date}</span>
                      <span>Due: {invoice.due_date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="mb-3 text-xl font-bold">
                      ${invoice.total.toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleGeneratePdf(invoice.uuid)}
                      >
                        PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(invoice)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleDelete(invoice.uuid, invoice.invoice_number)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
