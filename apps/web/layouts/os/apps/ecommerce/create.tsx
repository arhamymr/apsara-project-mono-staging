'use client';

import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ProductForm } from './components/product-form';
import { useMyShop, useCreateProduct } from './hooks';

interface CreateProductWindowProps {
  onCreated?: () => void;
}

export default function CreateProductWindow({ onCreated }: CreateProductWindowProps) {
  const shop = useMyShop();
  const createProduct = useCreateProduct();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [inventory, setInventory] = useState('');
  const [status, setStatus] = useState<'draft' | 'active' | 'archived'>('draft');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

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

    if (!shop) {
      toast.error('Shop not found. Please create a shop first.');
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

      await createProduct({
        shopId: shop._id,
        name: name.trim(),
        description: description.trim() || undefined,
        price: priceInCents,
        inventory: inventoryCount,
        status,
        category: category.trim() || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      toast.success('Product created successfully');
      onCreated?.();

      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setInventory('');
      setStatus('draft');
      setCategory('');
      setTags('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Handle slug already exists error
      if (errorMessage.includes('SLUG_EXISTS')) {
        toast.error('A product with this name already exists in your shop. Please use a different name.');
      } else {
        toast.error('Failed to create product. Please try again.');
      }
      console.error('Create product error:', error);
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
    shop,
    createProduct,
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
        <h2 className="text-base font-semibold">Create Product</h2>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-2xl">
          <p className="text-muted-foreground mb-4 text-sm">
            Fill in the details to add a new product to your shop. You can add images after creating the product.
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
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Create Product"
          />
        </div>
      </div>
    </div>
  );
}
