'use client';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@/lib/utils';
import { GripVertical, Star, Trash2, Upload } from 'lucide-react';
import * as React from 'react';
import type { ProductImage } from '../types';
import type { Id } from '@/convex/_generated/dataModel';

interface ImageGalleryProps {
  productId: Id<'products'> | undefined;
  images: ProductImage[];
  onAddImage: () => void;
  onRemoveImage: (imageId: Id<'productImages'>) => void;
  onReorderImages: (imageIds: Id<'productImages'>[]) => void;
  isLoading?: boolean;
  maxImages?: number;
}

export function ImageGallery({
  productId,
  images,
  onAddImage,
  onRemoveImage,
  onReorderImages,
  isLoading = false,
  maxImages = 10,
}: ImageGalleryProps) {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const canAddMore = images.length < maxImages;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder the images array
    const reorderedImages = [...images];
    const [draggedImage] = reorderedImages.splice(draggedIndex, 1);
    
    // Ensure draggedImage exists before proceeding
    if (!draggedImage) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    
    reorderedImages.splice(dropIndex, 0, draggedImage);

    // Extract IDs in new order
    const newOrder = reorderedImages.map((img) => img._id);
    onReorderImages(newOrder);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  if (!productId) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Save the product first to add images
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Product Images</h3>
          <p className="text-xs text-muted-foreground">
            {images.length}/{maxImages} images • First image is the primary image
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddImage}
          disabled={!canAddMore || isLoading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Add Image
        </Button>
      </div>

      {/* Image Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image._id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                'group relative aspect-square overflow-hidden rounded-lg border bg-muted/30',
                'cursor-move transition-all',
                draggedIndex === index && 'opacity-50',
                dragOverIndex === index && 'ring-2 ring-primary ring-offset-2',
              )}
            >
              {/* Image */}
              <img
                src={image.url}
                alt={`Product image ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                  <Star className="h-3 w-3 fill-current" />
                  Primary
                </div>
              )}

              {/* Drag Handle */}
              <div className="absolute right-2 top-2 rounded-md bg-background/80 p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Delete Button */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveImage(image._id)}
                  disabled={isLoading || images.length === 1}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>

              {/* Position Indicator */}
              <div className="absolute bottom-2 left-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-2 text-sm font-medium">No images yet</p>
          <p className="text-xs text-muted-foreground">
            Add at least one image to display your product
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddImage}
            disabled={isLoading}
            className="mt-4"
          >
            <Upload className="mr-2 h-4 w-4" />
            Add First Image
          </Button>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        Drag and drop images to reorder. The first image will be used as the primary image.
      </p>
    </div>
  );
}
