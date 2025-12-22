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
import { Loader2, Store, AlertCircle, Upload, X, CheckCircle2 } from 'lucide-react';

interface ShopSettingsProps {
  onSaved?: () => void;
}

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'JPY', label: 'JPY (¥)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'IDR', label: 'IDR (Rp)' },
];

export function ShopSettings({ onSaved }: ShopSettingsProps) {
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
  const [footerEmail, setFooterEmail] = React.useState('');
  const [footerPhone, setFooterPhone] = React.useState('');
  const [footerAddress, setFooterAddress] = React.useState('');
  const [footerFacebook, setFooterFacebook] = React.useState('');
  const [footerInstagram, setFooterInstagram] = React.useState('');
  const [footerTwitter, setFooterTwitter] = React.useState('');
  const [footerLinkedin, setFooterLinkedin] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [slugError, setSlugError] = React.useState('');
  const [slugTouched, setSlugTouched] = React.useState(false);
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [logoPreview, setLogoPreview] = React.useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialize form with existing shop data
  React.useEffect(() => {
    if (shop) {
      setName(shop.name);
      setSlug(shop.slug);
      setDescription(shop.description || '');
      setLogo(shop.logo || '');
      setLogoPreview(shop.logo || '');
      setWhatsappNumber(shop.whatsappNumber);
      setCurrency(shop.currency || 'USD');
      setFooterEmail(shop.footerEmail || '');
      setFooterPhone(shop.footerPhone || '');
      setFooterAddress(shop.footerAddress || '');
      setFooterFacebook(shop.footerFacebook || '');
      setFooterInstagram(shop.footerInstagram || '');
      setFooterTwitter(shop.footerTwitter || '');
      setFooterLinkedin(shop.footerLinkedin || '');
    }
  }, [shop]);

  // Handle logo file selection
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setLogoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove logo
  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setLogo('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Convert file to base64 for storage
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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
      // Convert logo file to base64 if a new file was selected
      let logoData = logo.trim() || undefined;
      if (logoFile) {
        logoData = await fileToBase64(logoFile);
      }

      if (isEditing && shop) {
        // Update existing shop
        await updateShop({
          id: shop._id,
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || undefined,
          logo: logoData,
          whatsappNumber: whatsappNumber.trim(),
          currency: currency,
          footerEmail: footerEmail.trim() || undefined,
          footerPhone: footerPhone.trim() || undefined,
          footerAddress: footerAddress.trim() || undefined,
          footerFacebook: footerFacebook.trim() || undefined,
          footerInstagram: footerInstagram.trim() || undefined,
          footerTwitter: footerTwitter.trim() || undefined,
          footerLinkedin: footerLinkedin.trim() || undefined,
        });
        toast.success('Shop updated successfully');
      } else {
        // Create new shop
        await createShop({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || undefined,
          logo: logoData,
          whatsappNumber: whatsappNumber.trim(),
          currency: currency,
          footerEmail: footerEmail.trim() || undefined,
          footerPhone: footerPhone.trim() || undefined,
          footerAddress: footerAddress.trim() || undefined,
          footerFacebook: footerFacebook.trim() || undefined,
          footerInstagram: footerInstagram.trim() || undefined,
          footerTwitter: footerTwitter.trim() || undefined,
          footerLinkedin: footerLinkedin.trim() || undefined,
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
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-muted-foreground" />
            <div>
              <h2 className="text-lg font-semibold">
                {isEditing ? 'Shop Settings' : 'Create Your Shop'}
              </h2>
              {!isEditing && (
                <p className="text-muted-foreground text-sm">
                  Set up your shop to start selling products
                </p>
              )}
            </div>
            {isEditing && (
              <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Shop Active
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              size="sm"
            >
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
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-auto p-6">
        <form id="shop-settings-form" onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
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

          {/* Logo Upload */}
          <div>
            <label className="text-sm font-medium">Shop Logo</label>
            
            {/* Logo Preview */}
            {logoPreview && (
              <div className="mb-3 relative inline-block">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-24 w-24 rounded-lg border object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  disabled={isSubmitting}
                  className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {logoPreview ? 'Change Logo' : 'Upload Logo'}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="hidden"
              />
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Upload an image file (max 5MB). Recommended: square image, at least 200x200px
            </p>

            {/* Optional: URL Input */}
            <div className="mt-3">
              <Input
                value={logo}
                onChange={(e) => {
                  setLogo(e.target.value);
                  if (e.target.value) {
                    setLogoPreview(e.target.value);
                    setLogoFile(null);
                  }
                }}
                placeholder="Or enter logo URL"
                type="url"
                disabled={isSubmitting}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Alternatively, enter a URL to your logo image
              </p>
            </div>
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

          {/* Footer Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-base font-semibold mb-4">Footer Information</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Customize the contact information and social links displayed in your storefront footer
            </p>

            <div className="space-y-6">
              {/* Footer Email */}
              <div>
                <label className="text-sm font-medium">Contact Email</label>
                <Input
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="support@myshop.com"
                  type="email"
                  disabled={isSubmitting}
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  Email address displayed in the footer
                </p>
              </div>

              {/* Footer Phone */}
              <div>
                <label className="text-sm font-medium">Contact Phone</label>
                <Input
                  value={footerPhone}
                  onChange={(e) => setFooterPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                  disabled={isSubmitting}
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  Phone number displayed in the footer
                </p>
              </div>

              {/* Footer Address */}
              <div>
                <label className="text-sm font-medium">Business Address</label>
                <Input
                  value={footerAddress}
                  onChange={(e) => setFooterAddress(e.target.value)}
                  placeholder="123 Shop Street, City, State"
                  disabled={isSubmitting}
                />
                <p className="text-muted-foreground mt-1 text-xs">
                  Physical address displayed in the footer
                </p>
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Social Media Links</h4>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Facebook</label>
                  <Input
                    value={footerFacebook}
                    onChange={(e) => setFooterFacebook(e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    type="url"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Instagram</label>
                  <Input
                    value={footerInstagram}
                    onChange={(e) => setFooterInstagram(e.target.value)}
                    placeholder="https://instagram.com/yourprofile"
                    type="url"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Twitter/X</label>
                  <Input
                    value={footerTwitter}
                    onChange={(e) => setFooterTwitter(e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                    type="url"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">LinkedIn</label>
                  <Input
                    value={footerLinkedin}
                    onChange={(e) => setFooterLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                    type="url"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
