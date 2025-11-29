import { useCallback } from 'react';
import { InvoiceItem, Payment } from '../types/invoice.types';

interface UseInvoiceCalculationsReturn {
  calculateLineTotal: (quantity: number, unitPrice: number) => number;
  calculateSubtotal: (items: InvoiceItem[]) => number;
  calculateTax: (subtotal: number, taxRate: number) => number;
  calculateTotal: (subtotal: number, taxAmount: number) => number;
  calculateBalance: (total: number, payments: Payment[]) => number;
}

export const useInvoiceCalculations = (): UseInvoiceCalculationsReturn => {
  const calculateLineTotal = useCallback(
    (quantity: number, unitPrice: number): number => {
      return Math.round(quantity * unitPrice * 100) / 100;
    },
    [],
  );

  const calculateSubtotal = useCallback((items: InvoiceItem[]): number => {
    const subtotal = items.reduce((sum, item) => {
      return sum + item.quantity * item.unit_price;
    }, 0);
    return Math.round(subtotal * 100) / 100;
  }, []);

  const calculateTax = useCallback(
    (subtotal: number, taxRate: number): number => {
      const tax = subtotal * (taxRate / 100);
      return Math.round(tax * 100) / 100;
    },
    [],
  );

  const calculateTotal = useCallback(
    (subtotal: number, taxAmount: number): number => {
      return Math.round((subtotal + taxAmount) * 100) / 100;
    },
    [],
  );

  const calculateBalance = useCallback(
    (total: number, payments: Payment[]): number => {
      const totalPaid = payments.reduce(
        (sum, payment) => sum + payment.amount,
        0,
      );
      return Math.round((total - totalPaid) * 100) / 100;
    },
    [],
  );

  return {
    calculateLineTotal,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
    calculateBalance,
  };
};
