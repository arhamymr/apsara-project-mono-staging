'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { BannerForm } from './components/banner-form';
import { useBanner, useUpdateBanner, useDeleteBanner } from './hooks';
import type { Id } from '@/convex/_generated/dataModel';

interface EditBannerWindowProps {
  id: Id<'banners'>;
  onUpdated?: () => void;
  onClose?: () => void;
}

export default function EditBannerWindow({ id, onUpdated, onClose }: EditBannerWindowProps) {
  const banner = useBanner(id);
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('inactive');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form from banner data
  useEffect(() => {
    if (banner) {
      setTitle(banner.title);
      setSubtitle(banner.subtitle || '');
      setImageUrl(banner.imageUrl);
      setLinkUrl(banner.linkUrl || '');
      setStatus(banner.status);
      setStartDate(banner.startDate ? new Date(banner.startDate) : undefined);
      setEndDate(banner.endDate ? new Date(banner.endDate) : undefined);
    }
  }, [banner]);

  const handleUpdate = useCallback(async () => {
    if (isSubmitting || !banner) return;

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

    setIsSubmitting(true);

    try {
      await updateBanner({
        id: banner._id,
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        imageUrl,
        linkUrl: linkUrl.trim() || undefined,
        status,
        startDate: startDate?.getTime(),
        endDate: endDate?.getTime(),
      });

      toast.success('Banner updated successfully');
      onUpdated?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update';
      toast.error(errorMessage);
      console.error('Update banner error:', error);
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
    banner,
    updateBanner,
    onUpdated,
  ]);

  const handleDelete = useCallback(async () => {
    if (!banner) return;

    setIsSubmitting(true);
    try {
      await deleteBanner({ id: banner._id });
      toast.success('Banner deleted');
      onUpdated?.();
      onClose?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [banner, deleteBanner, onUpdated, onClose]);

  if (banner === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (banner === null) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground text-sm">Banner not found</p>
      </div>
    );
  }

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <h2 className="text-base font-semibold">Edit Banner</h2>

        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="destructive" disabled={isSubmitting}>
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="z-[99999]">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{title || 'this banner'}&rdquo;? This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-2xl space-y-8">
          <p className="text-muted-foreground text-sm">
            Make changes and save when ready.
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
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            submitLabel="Save Changes"
          />

          <div className="text-muted-foreground text-xs">
            Last updated: {new Date(banner.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
