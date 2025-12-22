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
import { Calendar } from '@workspace/ui/components/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@workspace/ui/components/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import React from 'react';
import { AssetPicker } from '@/components/asset-picker';

interface BannerFormProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  status: 'active' | 'inactive';
  startDate: Date | undefined;
  endDate: Date | undefined;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onImageUrlChange: (value: string) => void;
  onLinkUrlChange: (value: string) => void;
  onStatusChange: (value: 'active' | 'inactive') => void;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  showCancel?: boolean;
}

export function BannerForm({
  title,
  subtitle,
  imageUrl,
  linkUrl,
  status,
  startDate,
  endDate,
  onTitleChange,
  onSubtitleChange,
  onImageUrlChange,
  onLinkUrlChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  onCancel,
  isSubmitting,
  submitLabel = 'Save',
  showCancel = false,
}: BannerFormProps) {
  const [isPickerOpen, setPickerOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleSelectImage = (url: string) => {
    onImageUrlChange(url);
    setPickerOpen(false);
  };

  const handleRemoveImage = () => {
    onImageUrlChange('');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Banner title"
            maxLength={100}
            required
            disabled={isSubmitting}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            {title.length}/100 characters
          </p>
        </div>

        {/* Subtitle */}
        <div>
          <label className="text-sm font-medium">Subtitle</label>
          <Textarea
            value={subtitle}
            onChange={(e) => onSubtitleChange(e.target.value)}
            placeholder="Banner subtitle or description (optional)"
            maxLength={200}
            rows={3}
            disabled={isSubmitting}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            {subtitle.length}/200 characters
          </p>
        </div>

        {/* Image */}
        <div>
          <label className="text-sm font-medium">
            Banner Image <span className="text-destructive">*</span>
          </label>
          
          {imageUrl ? (
            <div className="mt-2 space-y-2">
              {/* Image Preview */}
              <div className="relative aspect-[16/5] overflow-hidden rounded-lg border bg-muted">
                <img
                  src={imageUrl}
                  alt="Banner preview"
                  className="h-full w-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute right-2 top-2"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Change Image Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPickerOpen(true)}
                disabled={isSubmitting}
              >
                <Upload className="mr-2 h-4 w-4" />
                Change Image
              </Button>
            </div>
          ) : (
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPickerOpen(true)}
                disabled={isSubmitting}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Banner Image
              </Button>
              <p className="text-muted-foreground mt-1 text-xs">
                Recommended size: 1920x600px
              </p>
            </div>
          )}
        </div>

        {/* Link URL */}
        <div>
          <label className="text-sm font-medium">Link URL</label>
          <Input
            value={linkUrl}
            onChange={(e) => onLinkUrlChange(e.target.value)}
            placeholder="https://example.com (optional)"
            type="url"
            disabled={isSubmitting}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Where should the banner link to when clicked?
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium">Status</label>
          <Select
            value={status}
            onValueChange={(v) => onStatusChange(v as 'active' | 'inactive')}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[99999]">
              <SelectGroup>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground mt-1 text-xs">
            Only active banners are displayed on the storefront
          </p>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[99999]" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={onStartDateChange}
                  initialFocus
                />
                {startDate && (
                  <div className="border-t p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => onStartDateChange(undefined)}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-1 text-xs">
              When to start showing (optional)
            </p>
          </div>

          {/* End Date */}
          <div>
            <label className="text-sm font-medium">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[99999]" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={onEndDateChange}
                  initialFocus
                  disabled={(date) =>
                    startDate ? date < startDate : false
                  }
                />
                {endDate && (
                  <div className="border-t p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => onEndDateChange(undefined)}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <p className="text-muted-foreground mt-1 text-xs">
              When to stop showing (optional)
            </p>
          </div>
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
          <Button type="submit" disabled={isSubmitting || !imageUrl}>
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>

      {/* Asset Picker */}
      <AssetPicker
        open={isPickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelectImage}
        kindFilter="image"
      />
    </>
  );
}
