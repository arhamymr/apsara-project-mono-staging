'use client';

import { Button } from '@workspace/ui/components/button';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import type { Banner } from '../types';
import type { Id } from '@/convex/_generated/dataModel';
import { useBanners, useUpdateBanner, useDeleteBanner } from '../hooks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';

interface BannerManagerProps {
  onCreateBanner: () => void;
  onEditBanner: (banner: Banner) => void;
}

interface SortableBannerItemProps {
  banner: Banner;
  onToggleStatus: (id: Id<'banners'>, currentStatus: 'active' | 'inactive') => void;
  onDelete: (id: Id<'banners'>) => void;
  onEdit: (banner: Banner) => void;
}

function SortableBannerItem({
  banner,
  onToggleStatus,
  onDelete,
  onEdit,
}: SortableBannerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors"
    >
      {/* Drag Handle */}
      <button
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Banner Image Thumbnail */}
      <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded border bg-muted">
        {banner.imageUrl ? (
          <img
            src={banner.imageUrl}
            alt={banner.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Banner Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{banner.title}</h3>
        {banner.subtitle && (
          <p className="text-sm text-muted-foreground truncate">
            {banner.subtitle}
          </p>
        )}
        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
          <span>Position: {banner.position}</span>
          {banner.startDate && (
            <span>Start: {formatDate(banner.startDate)}</span>
          )}
          {banner.endDate && (
            <span>End: {formatDate(banner.endDate)}</span>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            banner.status === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
          }`}
        >
          {banner.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleStatus(banner._id, banner.status)}
          title={banner.status === 'active' ? 'Deactivate' : 'Activate'}
        >
          {banner.status === 'active' ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(banner)}
          title="Edit banner"
        >
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(banner._id)}
          title="Delete banner"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function BannerManager({ onCreateBanner, onEditBanner }: BannerManagerProps) {
  const banners = useBanners();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Id<'banners'> | null>(null);
  const [localBanners, setLocalBanners] = useState<Banner[]>([]);

  // Update local banners when data changes
  React.useEffect(() => {
    if (banners) {
      // Sort by position
      const sorted = [...banners].sort((a, b) => a.position - b.position);
      setLocalBanners(sorted);
    }
  }, [banners]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = localBanners.findIndex((b) => b._id === active.id);
    const newIndex = localBanners.findIndex((b) => b._id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Optimistically update local state
    const reordered = arrayMove(localBanners, oldIndex, newIndex);
    setLocalBanners(reordered);

    // Update positions in the database
    try {
      for (let i = 0; i < reordered.length; i++) {
        const banner = reordered[i];
        if (banner) {
          await updateBanner({
            id: banner._id,
            position: i,
          });
        }
      }
      toast.success('Banner order updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reorder banners');
      // Revert on error
      if (banners) {
        setLocalBanners([...banners].sort((a, b) => a.position - b.position));
      }
    }
  };

  const handleToggleStatus = async (id: Id<'banners'>, currentStatus: 'active' | 'inactive') => {
    try {
      await updateBanner({
        id,
        status: currentStatus === 'active' ? 'inactive' : 'active',
      });
      toast.success(`Banner ${currentStatus === 'active' ? 'deactivated' : 'activated'}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update banner status');
    }
  };

  const handleDeleteClick = (id: Id<'banners'>) => {
    setBannerToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bannerToDelete) return;

    try {
      await deleteBanner({ id: bannerToDelete });
      toast.success('Banner deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete banner');
    } finally {
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  if (!banners) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading banners...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Banner Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage promotional banners for your storefront (max 10)
          </p>
        </div>
        <Button onClick={onCreateBanner} disabled={banners.length >= 10}>
          <Plus className="mr-2 h-4 w-4" />
          New Banner
        </Button>
      </div>

      {/* Banner Count */}
      <div className="text-sm text-muted-foreground">
        {banners.length} / 10 banners
      </div>

      {/* Banner List */}
      {localBanners.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No banners yet. Create your first banner to get started.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localBanners.map((b) => b._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {localBanners.map((banner) => (
                <SortableBannerItem
                  key={banner._id}
                  banner={banner}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDeleteClick}
                  onEdit={onEditBanner}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this banner? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
