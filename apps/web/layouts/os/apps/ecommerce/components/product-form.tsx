'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import React from 'react';
import type { ProductInput } from '../types';

interface ProductFormProps {
  name: string;
  description: string;
  price: string;
  inventory: string;
  status: 'draft' | 'active' | 'archived';
  category: string;
  tags: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onInventoryChange: (value: string) => void;
  onStatusChange: (value: 'draft' | 'active' | 'archived') => void;
  onCategoryChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  showCancel?: boolean;
}

export function ProductForm({
  name,
  description,
  price,
  inventory,
  status,
  category,
  tags,
  onNameChange,
  onDescriptionChange,
  onPriceChange,
  onInventoryChange,
  onStatusChange,
  onCategoryChange,
  onTagsChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = 'Save',
  showCancel = false,
}: ProductFormProps) {
  const handlePriceChange = (value: string) => {
    // Allow only numbers and decimal point
    const sanitized = value.replace(/[^\d.]/g, '');
    // Ensure only one decimal point
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      onPriceChange(parts[0] + '.' + parts.slice(1).join(''));
    } else {
      onPriceChange(sanitized);
    }
  };

  const handleInventoryChange = (value: string) => {
    // Allow only integers
    const sanitized = value.replace(/\D/g, '');
    onInventoryChange(sanitized);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="text-sm font-medium">
          Name <span className="text-destructive">*</span>
        </label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Product name"
          maxLength={200}
          required
          disabled={isSubmitting}
        />
        <p className="text-muted-foreground mt-1 text-xs">
          {name.length}/200 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Product description (optional)"
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      {/* Price and Inventory Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
        <div>
          <label className="text-sm font-medium">
            Price <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0.00"
              className="pl-7"
              required
              disabled={isSubmitting}
            />
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Enter price in dollars (e.g., 19.99)
          </p>
        </div>

        {/* Inventory */}
        <div>
          <label className="text-sm font-medium">
            Inventory <span className="text-destructive">*</span>
          </label>
          <Input
            value={inventory}
            onChange={(e) => handleInventoryChange(e.target.value)}
            placeholder="0"
            required
            disabled={isSubmitting}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Number of items in stock
          </p>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-sm font-medium">Status</label>
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as 'draft' | 'active' | 'archived')}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[99999]">
            <SelectGroup>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <p className="text-muted-foreground mt-1 text-xs">
          Only active products are visible on the storefront
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="text-sm font-medium">Category</label>
        <Input
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          placeholder="e.g., Electronics, Clothing, Books"
          disabled={isSubmitting}
        />
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium">Tags</label>
        <Input
          value={tags}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="e.g., featured, sale, new-arrival (comma separated)"
          disabled={isSubmitting}
        />
        <p className="text-muted-foreground mt-1 text-xs">
          Separate tags with commas
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        {showCancel && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
