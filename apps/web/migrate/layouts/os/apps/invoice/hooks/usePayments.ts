import axios from 'axios';
import { useCallback, useState } from 'react';
import { Payment, PaymentFormData } from '../types/invoice.types';

interface UsePaymentsReturn {
  payments: Payment[];
  isLoading: boolean;
  error: Error | null;
  fetchPayments: (invoiceUuid: string) => Promise<void>;
  recordPayment: (
    invoiceUuid: string,
    data: PaymentFormData,
  ) => Promise<Payment>;
  deletePayment: (uuid: string) => Promise<void>;
  refetch: () => void;
}

export const usePayments = (): UsePaymentsReturn => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastInvoiceUuid, setLastInvoiceUuid] = useState<string | null>(null);

  const fetchPayments = useCallback(async (invoiceUuid: string) => {
    setIsLoading(true);
    setError(null);
    setLastInvoiceUuid(invoiceUuid);

    try {
      const response = await axios.get(`/api/invoices/${invoiceUuid}/payments`);
      setPayments(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch payments'),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordPayment = useCallback(
    async (invoiceUuid: string, data: PaymentFormData): Promise<Payment> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          `/api/invoices/${invoiceUuid}/payments`,
          data,
        );
        if (lastInvoiceUuid === invoiceUuid) {
          await fetchPayments(invoiceUuid);
        }
        return response.data.payment;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to record payment');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPayments, lastInvoiceUuid],
  );

  const deletePayment = useCallback(
    async (uuid: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await axios.delete(`/api/payments/${uuid}`);
        if (lastInvoiceUuid) {
          await fetchPayments(lastInvoiceUuid);
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to delete payment');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPayments, lastInvoiceUuid],
  );

  const refetch = useCallback(() => {
    if (lastInvoiceUuid) {
      fetchPayments(lastInvoiceUuid);
    }
  }, [fetchPayments, lastInvoiceUuid]);

  return {
    payments,
    isLoading,
    error,
    fetchPayments,
    recordPayment,
    deletePayment,
    refetch,
  };
};
