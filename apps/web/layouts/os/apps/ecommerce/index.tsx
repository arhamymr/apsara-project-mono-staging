'use client';

import { Button } from '@workspace/ui/components/button';
import { Kbd } from '@workspace/ui/components/kbd';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { ShoppingBag, Search, Settings } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { useMyShop, useMyProducts, useSearchProducts } from './hooks';
import type { Id } from '@/convex/_generated/dataModel';
import CreateProductWindow from './create';
import EditProductWindow from './edit';
import { ProductCard } from './components/product-card';
import { ShopSettings } from './components/shop-settings';

export default function ProductManagerApp() {
  const { openSubWindow, activeId } = useWindowContext();
  const [search, setSearch] = React.useState('');
  const [hasPromptedShopSetup, setHasPromptedShopSetup] = React.useState(false);

  const shop = useMyShop();
  const products = useMyProducts();
  const searchResults = useSearchProducts(search);

  const displayProducts = search ? searchResults : products;
  const isLoading = displayProducts === undefined;
  const hasShop = shop !== undefined && shop !== null;

  const openCreate = () => {
    if (!activeId) return;
    if (!hasShop) {
      toast.error('Please create a shop first');
      return;
    }
    openSubWindow(activeId, {
      title: 'New Product',
      content: <CreateProductWindow onCreated={() => {}} />,
      width: 720,
      height: 600,
    });
  };

  const openEdit = (id: Id<"products">, name?: string) => {
    if (!activeId) return;
    openSubWindow(activeId, {
      title: name ? `Edit: ${name}` : 'Edit Product',
      content: <EditProductWindow id={id} onUpdated={() => {}} />,
      width: 820,
      height: 600,
    });
  };

  const openShopSettings = React.useCallback(() => {
    if (!activeId) return;
    openSubWindow(activeId, {
      title: hasShop ? 'Shop Settings' : 'Create Shop',
      content: <ShopSettings onSaved={() => {}} onCancel={() => {}} />,
      width: 700,
      height: 650,
    });
  }, [activeId, hasShop, openSubWindow]);

  // Auto-open shop settings for first-time users
  React.useEffect(() => {
    if (shop === null && !hasPromptedShopSetup && activeId) {
      setHasPromptedShopSetup(true);
      // Small delay to ensure the window is ready
      setTimeout(() => {
        openShopSettings();
      }, 300);
    }
  }, [shop, hasPromptedShopSetup, activeId, openShopSettings]);

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 flex w-full flex-col items-center justify-between gap-2 border-b px-4 py-3 @md:flex-row">
        <div className="flex w-full flex-col items-center gap-2 @md:w-[540px] @md:flex-row">
          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="border-border focus:ring-primary h-8 w-full rounded-md border pl-9 pr-3 text-sm focus:ring-1"
              disabled={!hasShop}
            />
            {search && (
              <button
                className="absolute top-1/2 right-1 -translate-y-1/2 rounded px-2 text-xs"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="flex w-full items-center gap-2 @md:w-auto">
          <Button variant="outline" size="sm" onClick={openShopSettings}>
            <Settings className="mr-1.5 h-4 w-4" />
            Shop
          </Button>
          <Button size="sm" onClick={openCreate} disabled={!hasShop}>
            New Product <Kbd className="text-primary-900 bg-black/20">N</Kbd>
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        {!hasShop ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="bg-muted/50 rounded-full p-4">
              <ShoppingBag className="text-muted-foreground/60 h-10 w-10" />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground font-medium">No shop yet</p>
              <p className="text-muted-foreground/70 text-sm">
                Create your shop to start adding products
              </p>
            </div>
            <Button size="sm" onClick={openShopSettings} variant="outline" className="mt-2">
              Create Shop
            </Button>
          </div>
        ) : isLoading ? (
          <div className="text-muted-foreground text-sm">Loading…</div>
        ) : !displayProducts || displayProducts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="bg-muted/50 rounded-full p-4">
              <ShoppingBag className="text-muted-foreground/60 h-10 w-10" />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground font-medium">No products yet</p>
              <p className="text-muted-foreground/70 text-sm">
                Create your first product to get started
              </p>
            </div>
            <Button size="sm" onClick={openCreate} variant="outline" className="mt-2">
              Create Product
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 @lg:grid-cols-3 @xl:grid-cols-5">
            {displayProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => openEdit(product._id, product.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
