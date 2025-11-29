import { fetcher } from '@/lib/fetcher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Customer,
  CustomerFilters,
  CustomerFormData,
  PaginatedResponse,
} from '../types/invoice.types';

export const useCustomers = (filters?: CustomerFilters) => {
  const queryClient = useQueryClient();

  const {
    data: customers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['customers', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      const query = params.toString();
      return fetcher<PaginatedResponse<Customer>>(
        `/api/customers${query ? `?${query}` : ''}`,
      );
    },
    staleTime: 30000,
  });

  const { data: allCustomers = [] } = useQuery({
    queryKey: ['customers', 'all'],
    queryFn: () => fetcher<Customer[]>('/api/customers/all'),
    staleTime: 60000,
  });

  const createCustomer = useMutation({
    mutationFn: (data: CustomerFormData) =>
      fetcher<{ customer: Customer }>('/api/customers', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const updateCustomer = useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: CustomerFormData }) =>
      fetcher<{ customer: Customer }>(`/api/customers/${uuid}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: (uuid: string) =>
      fetcher<void>(`/api/customers/${uuid}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return {
    customers: customers ?? null,
    allCustomers,
    isLoading,
    error: error as Error | null,
    refetch,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
