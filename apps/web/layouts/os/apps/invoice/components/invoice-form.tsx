import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import { Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useInvoiceCalculations } from '../hooks/useInvoiceCalculations';
import {
  Customer,
  InvoiceFormData,
  InvoiceItemFormData,
} from '../types/invoice.types';

interface InvoiceFormProps {
  customers: Customer[];
  initialData?: Partial<InvoiceFormData>;
  onSubmit: (data: InvoiceFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  customers,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    calculateLineTotal,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
  } = useInvoiceCalculations();

  const [formData, setFormData] = useState<InvoiceFormData>({
    customer_id: initialData?.customer_id || 0,
    invoice_date:
      initialData?.invoice_date || new Date().toISOString().split('T')[0] || '',
    due_date: initialData?.due_date || '',
    tax_rate: initialData?.tax_rate || 0,
    notes: initialData?.notes || '',
    items: initialData?.items || [
      { description: '', quantity: 1, unit_price: 0 },
    ],
    status: initialData?.status || 'draft',
  });

  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

  useEffect(() => {
    const subtotal = calculateSubtotal(
      formData.items.map((item, index) => ({
        ...item,
        line_total: calculateLineTotal(item.quantity, item.unit_price),
        sort_order: index,
      })),
    );
    const tax = calculateTax(subtotal, formData.tax_rate);
    const total = calculateTotal(subtotal, tax);
    setTotals({ subtotal, tax, total });
  }, [
    formData.items,
    formData.tax_rate,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
    calculateLineTotal,
  ]);

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItemFormData,
    value: string | number,
  ) => {
    const newItems = [...formData.items];
    const currentItem = newItems[index];
    if (currentItem) {
      newItems[index] = { ...currentItem, [field]: value } as InvoiceItemFormData;
    }
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: '', quantity: 1, unit_price: 0 },
      ],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    status: 'draft' | 'sent' = 'draft',
  ) => {
    e.preventDefault();
    await onSubmit({ ...formData, status });
  };

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer">Customer</Label>
          <Select
            value={String(formData.customer_id)}
            onValueChange={(value) =>
              setFormData({ ...formData, customer_id: Number(value) })
            }
          >
            <SelectTrigger id="customer">
              <SelectValue placeholder="Select Customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={String(customer.id)}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax_rate">Tax Rate (%)</Label>
          <Input
            id="tax_rate"
            type="number"
            value={formData.tax_rate}
            onChange={(e) =>
              setFormData({ ...formData, tax_rate: Number(e.target.value) })
            }
            min="0"
            max="100"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoice_date">Invoice Date</Label>
          <Input
            id="invoice_date"
            type="date"
            value={formData.invoice_date}
            onChange={(e) =>
              setFormData({ ...formData, invoice_date: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) =>
              setFormData({ ...formData, due_date: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Line Items</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
        <div className="space-y-2">
          {formData.items.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-5">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, 'description', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          'quantity',
                          Number(e.target.value),
                        )
                      }
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={item.unit_price}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          'unit_price',
                          Number(e.target.value),
                        )
                      }
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="bg-muted col-span-2 flex items-center justify-end rounded-md px-3 text-sm font-medium">
                    $
                    {calculateLineTotal(item.quantity, item.unit_price).toFixed(
                      2,
                    )}
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">
                  ${totals.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Tax ({formData.tax_rate}%):
                </span>
                <span className="font-medium">${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total:</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          placeholder="Add any additional notes..."
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={(e) => handleSubmit(e, 'draft')}
          disabled={isLoading}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={(e) => handleSubmit(e, 'sent')}
          disabled={isLoading}
        >
          Save & Send
        </Button>
      </div>
    </form>
  );
};
