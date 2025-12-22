'use client';

import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { BannerForm } from './components/banner-form';
import { useMyShop, useCreateBanner, useBanners } from './hooks';

interface CreateBannerWindowProps {
  onCreated?: () => void;
}

export default function CreateBannerWindow({ onCreated }: CreateBannerWindowProps) {
  const shop = useMyShop();
  const createBanner = useCreateBanner();
  const banners = useBanners();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('inactive');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    // Validation
    if (!title.trim()) {
      toast.error('Banner title is required');
      return;
    }

    if (title.length > 100) {
      toast.error('Title must be 100 characters or less');
      return;
    }

    if (subtitle.length > 200) {
      toast.error('Subtitle must be 200 characters or less');
      return;
    }

    if (!imageUrl) {
      toast.error('Banner image is required');
      return;
    }

    if (!shop) {
      toast.error('Shop not found. Please create a shop first.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate position (add to end)
      const position = banners ? banners.length : 0;

      await createBanner({
        shopId: shop._id,
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        imageUrl,
        linkUrl: linkUrl.trim() || undefined,
        status,
        position,
        startDate: startDate?.getTime(),
        endDate: endDate?.getTime(),
      });

      toast.success('Banner created successfully');
      onCreated?.();

      // Reset form
      setTitle('');
      setSubtitle('');
      setImageUrl('');
      setLinkUrl('');
      setStatus('inactive');
      setStartDate(undefined);
      setEndDate(undefined);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(errorMessage || 'Failed to create banner. Please try again.');
      console.error('Create banner error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    title,
    subtitle,
    imageUrl,
    linkUrl,
    status,
    startDate,
    endDate,
    isSubmitting,
    shop,
    banners,
    createBanner,
    onCreated,
  ]);

  if (!shop) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Shop not found</p>
          <p className="text-muted-foreground text-sm">Please create a shop first</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <h2 className="text-base font-semibold">Create Banner</h2>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-2xl">
          <p className="text-muted-foreground mb-4 text-sm">
            Create a promotional banner for your storefront. Banners can be scheduled and reordered.
          </p>

          <BannerForm
            title={title}
            subtitle={subtitle}
            imageUrl={imageUrl}
            linkUrl={linkUrl}
            status={status}
            startDate={startDate}
            endDate={endDate}
            onTitleChange={setTitle}
            onSubtitleChange={setSubtitle}
            onImageUrlChange={setImageUrl}
            onLinkUrlChange={setLinkUrl}
            onStatusChange={setStatus}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Banner"
          />
        </div>
      </div>
    </div>
  );
}
