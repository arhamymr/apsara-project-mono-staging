import { fetcher } from '@/lib/fetcher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Invoice,
  InvoiceFilters,
  InvoiceFormData,
  InvoiceStatus,
  PaginatedResponse,
} from '../types/invoice.types';

export const useInvoices = (filters?: InvoiceFilters) => {
  const queryClient = useQueryClient();

  const {
    data: invoices,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      const query = params.toString();
      return fetcher<PaginatedResponse<Invoice>>(
        `/api/invoices${query ? `?${query}` : ''}`,
      );
    },
    staleTime: 30000,
  });

  const createInvoice = useMutation({
    mutationFn: (data: InvoiceFormData) =>
      fetcher<{ invoice: Invoice }>('/api/invoices', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const updateInvoice = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: InvoiceFormData }) =>
      fetcher<{ invoice: Invoice }>(`/api/invoices/${uuid}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const deleteInvoice = useMutation({
    mutationFn: (uuid: string) =>
      fetcher<void>(`/api/invoices/${uuid}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ uuid, status }: { uuid: string; status: InvoiceStatus }) =>
      fetcher<{ invoice: Invoice }>(`/api/invoices/${uuid}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  const generatePdf = useMutation({
    mutationFn: async (uuid: string) => {
      const response = await fetch(`/api/invoices/${uuid}/pdf`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          Accept: 'application/pdf',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${uuid}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });

  return {
    invoices: invoices ?? null,
    isLoading,
    error: error as Error | null,
    refetch,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateStatus,
    generatePdf,
  };
};
