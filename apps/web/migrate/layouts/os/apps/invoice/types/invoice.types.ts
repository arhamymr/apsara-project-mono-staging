// Core types
export interface Invoice {
  id: number;
  uuid: string;
  user_id: number;
  customer_id: number;
  customer?: Customer;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: InvoiceStatus;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  sent_at?: string;
  items: InvoiceItem[];
  payments: Payment[];
  total_paid?: number;
  balance?: number;
  created_at: string;
  updated_at: string;
}

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'cancelled';

export interface InvoiceItem {
  id?: number;
  invoice_id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  sort_order: number;
}

export interface Customer {
  id: number;
  uuid: string;
  user_id: number;
  name: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  notes?: string;
  invoices_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  uuid: string;
  invoice_id: number;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod =
  | 'cash'
  | 'check'
  | 'bank_transfer'
  | 'credit_card'
  | 'other';

// Form data types
export interface InvoiceFormData {
  customer_id: number;
  invoice_date: string;
  due_date: string;
  tax_rate: number;
  notes?: string;
  items: InvoiceItemFormData[];
  status?: InvoiceStatus;
}

export interface InvoiceItemFormData {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface CustomerFormData {
  name: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  notes?: string;
}

export interface PaymentFormData {
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  notes?: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface InvoiceStatistics {
  total_outstanding: number;
  total_paid: number;
  total_overdue: number;
  invoice_count_by_status: {
    draft: number;
    sent: number;
    paid: number;
    partially_paid: number;
    overdue: number;
    cancelled: number;
  };
  recent_revenue: RevenueData[];
}

export interface RevenueData {
  period: string;
  amount: number;
}

// Filter types
export interface InvoiceFilters {
  status?: InvoiceStatus;
  customer_id?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  per_page?: number;
}

export interface CustomerFilters {
  search?: string;
  per_page?: number;
}

// Status badge configuration
export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
}

export const STATUS_CONFIGS: Record<InvoiceStatus, StatusConfig> = {
  draft: {
    label: 'Draft',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
  sent: {
    label: 'Sent',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  paid: {
    label: 'Paid',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  partially_paid: {
    label: 'Partially Paid',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  overdue: {
    label: 'Overdue',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
};

// Payment method labels
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  check: 'Check',
  bank_transfer: 'Bank Transfer',
  credit_card: 'Credit Card',
  other: 'Other',
};
