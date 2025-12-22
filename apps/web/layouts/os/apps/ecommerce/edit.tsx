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
import { ProductForm } from './components/product-form';
import { ProductImageManager } from './components/product-image-manager';
import { useProduct, useUpdateProduct, useDeleteProduct } from './hooks';
import type { Id } from '@/convex/_generated/dataModel';

interface EditProductWindowProps {
  id: Id<'products'>;
  onUpdated?: () => void;
  onClose?: () => void;
}

export default function EditProductWindow({ id, onUpdated, onClose }: EditProductWindowProps) {
  const product = useProduct(id);
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [inventory, setInventory] = useState('');
  const [status, setStatus] = useState<'draft' | 'active' | 'archived'>('draft');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form from product data
  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice((product.price / 100).toFixed(2));
      setInventory(product.inventory.toString());
      setStatus(product.status);
      setCategory(product.category || '');
      setTags(product.tags?.join(', ') || '');
    }
  }, [product]);

  const handleUpdate = useCallback(async () => {
    if (isSubmitting || !product) return;

    // Validation
    if (!name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (name.length > 200) {
      toast.error('Product name must be 200 characters or less');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (!inventory || parseInt(inventory, 10) < 0) {
      toast.error('Inventory must be 0 or greater');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert price to cents (smallest currency unit)
      const priceInCents = Math.round(parseFloat(price) * 100);
      const inventoryCount = parseInt(inventory, 10);

      // Parse tags
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await updateProduct({
        id: product._id,
        name: name.trim(),
        description: description.trim() || undefined,
        price: priceInCents,
        inventory: inventoryCount,
        status,
        category: category.trim() || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      toast.success('Product updated successfully');
      onUpdated?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update';

      // Handle slug already exists error
      if (errorMessage.includes('SLUG_EXISTS')) {
        toast.error('A product with this name already exists in your shop. Please use a different name.');
      } else {
        toast.error(errorMessage);
      }
      console.error('Update product error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    name,
    description,
    price,
    inventory,
    status,
    category,
    tags,
    isSubmitting,
    product,
    updateProduct,
    onUpdated,
  ]);

  const handleDelete = useCallback(async () => {
    if (!product) return;

    setIsSubmitting(true);
    try {
      await deleteProduct({ id: product._id });
      toast.success('Product deleted');
      onUpdated?.();
      onClose?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [product, deleteProduct, onUpdated, onClose]);

  if (product === undefined) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-muted-foreground text-sm">Product not found</p>
      </div>
    );
  }

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <h2 className="text-base font-semibold">Edit Product</h2>

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
                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{name || 'this product'}&rdquo;? This
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

          <ProductForm
            name={name}
            description={description}
            price={price}
            inventory={inventory}
            status={status}
            category={category}
            tags={tags}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            onPriceChange={setPrice}
            onInventoryChange={setInventory}
            onStatusChange={setStatus}
            onCategoryChange={setCategory}
            onTagsChange={setTags}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            submitLabel="Save Changes"
          />

          {/* Image Gallery Section */}
          <div className="border-t pt-8">
            <ProductImageManager productId={product._id} />
          </div>

          <div className="text-muted-foreground text-xs">
            Last updated: {new Date(product.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
