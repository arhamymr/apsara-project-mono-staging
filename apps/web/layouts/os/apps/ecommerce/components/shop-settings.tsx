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
import { toast } from 'sonner';
import { useMyShop, useCreateShop, useUpdateShop } from '../hooks';
import type { Shop } from '../types';
import { Loader2, Store, AlertCircle } from 'lucide-react';

interface ShopSettingsProps {
  onSaved?: () => void;
  onCancel?: () => void;
}

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'INR', label: 'INR (₹)' },
];

export function ShopSettings({ onSaved, onCancel }: ShopSettingsProps) {
  const shop = useMyShop();
  const createShop = useCreateShop();
  const updateShop = useUpdateShop();

  const isEditing = shop !== null && shop !== undefined;
  const isLoading = shop === undefined;

  // Form state
  const [name, setName] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [logo, setLogo] = React.useState('');
  const [whatsappNumber, setWhatsappNumber] = React.useState('');
  const [currency, setCurrency] = React.useState('USD');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [slugError, setSlugError] = React.useState('');
  const [slugTouched, setSlugTouched] = React.useState(false);

  // Initialize form with existing shop data
  React.useEffect(() => {
    if (shop) {
      setName(shop.name);
      setSlug(shop.slug);
      setDescription(shop.description || '');
      setLogo(shop.logo || '');
      setWhatsappNumber(shop.whatsappNumber);
      setCurrency(shop.currency || 'USD');
    }
  }, [shop]);

  // Validate slug format
  const validateSlug = (value: string): string => {
    if (!value) {
      return 'Slug is required';
    }
    if (!/^[a-z0-9-]+$/.test(value)) {
      return 'Slug must contain only lowercase letters, numbers, and hyphens';
    }
    if (value.startsWith('-') || value.endsWith('-')) {
      return 'Slug cannot start or end with a hyphen';
    }
    if (value.includes('--')) {
      return 'Slug cannot contain consecutive hyphens';
    }
    return '';
  };

  // Handle slug change with validation
  const handleSlugChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlug(sanitized);
    setSlugTouched(true);
    setSlugError(validateSlug(sanitized));
  };

  // Auto-generate slug from name
  const generateSlugFromName = () => {
    const generated = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(generated);
    setSlugTouched(true);
    setSlugError(validateSlug(generated));
  };

  // Handle WhatsApp number formatting
  const handleWhatsAppChange = (value: string) => {
    // Remove all non-digit characters
    const sanitized = value.replace(/\D/g, '');
    setWhatsappNumber(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!name.trim()) {
      toast.error('Shop name is required');
      return;
    }

    if (!slug.trim()) {
      toast.error('Shop slug is required');
      return;
    }

    const slugValidationError = validateSlug(slug);
    if (slugValidationError) {
      toast.error(slugValidationError);
      setSlugError(slugValidationError);
      return;
    }

    if (!whatsappNumber.trim()) {
      toast.error('WhatsApp number is required');
      return;
    }

    if (whatsappNumber.length < 10) {
      toast.error('WhatsApp number must be at least 10 digits');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && shop) {
        // Update existing shop
        await updateShop({
          id: shop._id,
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || undefined,
          logo: logo.trim() || undefined,
          whatsappNumber: whatsappNumber.trim(),
          currency: currency,
        });
        toast.success('Shop updated successfully');
      } else {
        // Create new shop
        await createShop({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || undefined,
          logo: logo.trim() || undefined,
          whatsappNumber: whatsappNumber.trim(),
          currency: currency,
        });
        toast.success('Shop created successfully');
      }

      onSaved?.();
    } catch (error: any) {
      console.error('Error saving shop:', error);
      
      // Handle specific error cases
      if (error.message?.includes('SLUG_EXISTS')) {
        const existingSlug = error.message.split(':')[1];
        setSlugError(`The slug "${existingSlug}" is already taken`);
        toast.error(`The slug "${existingSlug}" is already taken. Please choose a different one.`);
      } else if (error.message?.includes('INVALID_SLUG')) {
        setSlugError('Invalid slug format');
        toast.error('Invalid slug format. Use only lowercase letters, numbers, and hyphens.');
      } else {
        toast.error(error.message || 'Failed to save shop');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Shop Settings' : 'Create Your Shop'}
          </h2>
        </div>
        {!isEditing && (
          <p className="text-muted-foreground mt-1 text-sm">
            Set up your shop to start selling products
          </p>
        )}
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto p-6">
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
          {/* Shop Name */}
          <div>
            <label className="text-sm font-medium">
              Shop Name <span className="text-destructive">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Shop"
              required
              disabled={isSubmitting}
              maxLength={100}
            />
            <p className="text-muted-foreground mt-1 text-xs">
              This is the display name for your shop
            </p>
          </div>

          {/* Shop Slug */}
          <div>
            <label className="text-sm font-medium">
              Shop URL Slug <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="my-shop"
                  required
                  disabled={isSubmitting}
                  className={slugError && slugTouched ? 'border-destructive' : ''}
                />
                {slugError && slugTouched && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    <span>{slugError}</span>
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={generateSlugFromName}
                disabled={!name || isSubmitting}
                size="sm"
              >
                Generate
              </Button>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Your shop will be available at: /ecommerce/{slug || 'your-slug'}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your shop..."
              rows={3}
              disabled={isSubmitting}
              maxLength={500}
            />
            <p className="text-muted-foreground mt-1 text-xs">
              {description.length}/500 characters
            </p>
          </div>

          {/* Logo URL */}
          <div>
            <label className="text-sm font-medium">Logo URL</label>
            <Input
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="https://example.com/logo.png"
              type="url"
              disabled={isSubmitting}
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Enter a URL to your shop logo image
            </p>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="text-sm font-medium">
              WhatsApp Number <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                +
              </span>
              <Input
                value={whatsappNumber}
                onChange={(e) => handleWhatsAppChange(e.target.value)}
                placeholder="1234567890"
                className="pl-7"
                required
                disabled={isSubmitting}
              />
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Include country code (e.g., 1 for US, 44 for UK). Used for checkout.
            </p>
          </div>

          {/* Currency */}
          <div>
            <label className="text-sm font-medium">Currency</label>
            <Select
              value={currency}
              onValueChange={setCurrency}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[99999]">
                <SelectGroup>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground mt-1 text-xs">
              Currency for product prices
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t pt-4">
            {onCancel && (
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{isEditing ? 'Save Changes' : 'Create Shop'}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
