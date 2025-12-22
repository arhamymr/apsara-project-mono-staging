'use client';

import { AssetPicker } from '@/components/asset-picker';
import { toast } from 'sonner';
import * as React from 'react';
import type { Id } from '@/convex/_generated/dataModel';
import { ImageGallery } from './image-gallery';
import {
  useProductImages,
  useAddProductImage,
  useRemoveProductImage,
  useReorderProductImages,
} from '../hooks';

interface ProductImageManagerProps {
  productId: Id<'products'> | undefined;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function ProductImageManager({ productId }: ProductImageManagerProps) {
  const [isPickerOpen, setPickerOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const images = useProductImages(productId);
  const addImage = useAddProductImage();
  const removeImage = useRemoveProductImage();
  const reorderImages = useReorderProductImages();

  const handleAddImage = () => {
    if (!productId) {
      toast.error('Please save the product first before adding images');
      return;
    }
    setPickerOpen(true);
  };

  const validateImageUrl = async (url: string): Promise<boolean> => {
    try {
      // Fetch the image to check its size
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');

      if (contentLength) {
        const sizeInBytes = parseInt(contentLength, 10);
        if (sizeInBytes > MAX_FILE_SIZE_BYTES) {
          toast.error(`Image size must be less than ${MAX_FILE_SIZE_MB}MB. This image is ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB.`);
          return false;
        }
      }

      // Check if it's a valid image format
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.startsWith('image/')) {
        toast.error('Please select a valid image file (JPEG, PNG, WebP, GIF)');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating image:', error);
      // If we can't validate, allow it (might be a CORS issue)
      return true;
    }
  };

  const handleSelectImage = async (url: string) => {
    if (!productId) return;

    setIsLoading(true);
    try {
      // Validate image size and format
      const isValid = await validateImageUrl(url);
      if (!isValid) {
        setIsLoading(false);
        return;
      }

      // Add the image
      await addImage({ productId, url });
      
      toast.success('Image added successfully');
      
      setPickerOpen(false);
    } catch (error) {
      console.error('Error adding image:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to add image';
      
      if (errorMessage.includes('IMAGE_LIMIT_EXCEEDED')) {
        toast.error('You can only add up to 10 images per product');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = async (imageId: Id<'productImages'>) => {
    if (!productId) return;

    setIsLoading(true);
    try {
      await removeImage({ id: imageId });
      
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Error removing image:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove image';
      
      if (errorMessage.includes('LAST_IMAGE')) {
        toast.error('Products must have at least one image');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorderImages = async (imageIds: Id<'productImages'>[]) => {
    if (!productId) return;

    setIsLoading(true);
    try {
      await reorderImages({ productId, imageIds });
      
      toast.success('Images reordered successfully');
    } catch (error) {
      console.error('Error reordering images:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to reorder images';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ImageGallery
        productId={productId}
        images={images || []}
        onAddImage={handleAddImage}
        onRemoveImage={handleRemoveImage}
        onReorderImages={handleReorderImages}
        isLoading={isLoading}
      />

      <AssetPicker
        open={isPickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelectImage}
        kindFilter="image"
      />
    </>
  );
}
