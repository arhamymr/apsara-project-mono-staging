'use client';

import { Button } from '@workspace/ui/components/button';
import { Kbd } from '@workspace/ui/components/kbd';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { ShoppingBag, Search, Settings, Image, Code, CheckCircle2, Store } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { useMyShop, useMyProducts, useSearchProducts, useSharedProducts } from './hooks';
import type { Id } from '@/convex/_generated/dataModel';
import CreateProductWindow from './create';
import EditProductWindow from './edit';
import BannersWindow from './banners';
import { ProductCard } from './components/product-card';
import { ShopSettings } from './components/shop-settings';
import { ApiHelperModal } from './components/api-helper-modal';

export default function ProductManagerApp() {
  const { openSubWindow, activeId } = useWindowContext();
  const [search, setSearch] = React.useState('');
  const [hasPromptedShopSetup, setHasPromptedShopSetup] = React.useState(false);

  const shop = useMyShop();
  const products = useMyProducts();
  const sharedProducts = useSharedProducts();
  const searchResults = useSearchProducts(search);

  // Combine personal products with shared products, marking shared ones
  const allProducts = React.useMemo(() => {
    const personal = products ?? [];
    const shared = sharedProducts ?? [];
    
    // Create a Set of personal product IDs for quick lookup
    const personalIds = new Set(personal.map(p => p._id));
    
    // Mark shared products and filter out any duplicates
    const markedShared = shared
      .filter(p => !personalIds.has(p._id))
      .map(p => ({ ...p, isShared: true as const }));
    
    // Mark personal products as not shared
    const markedPersonal = personal.map(p => ({ ...p, isShared: false as const }));
    
    return [...markedPersonal, ...markedShared];
  }, [products, sharedProducts]);

  // For search, we only search within personal products (shop-specific)
  const displayProducts = search 
    ? searchResults?.map(p => ({ ...p, isShared: false as const })) 
    : allProducts;
  const isLoading = displayProducts === undefined || (products === undefined && sharedProducts === undefined);
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

  const openBanners = React.useCallback(() => {
    if (!activeId) return;
    if (!hasShop) {
      toast.error('Please create a shop first');
      return;
    }
    openSubWindow(activeId, {
      title: 'Banners',
      content: <BannersWindow />,
      width: 900,
      height: 700,
    });
  }, [activeId, hasShop, openSubWindow]);

  const openApiDocs = React.useCallback(() => {
    if (!activeId) return;
    if (!hasShop || !shop) {
      toast.error('Please create a shop first');
      return;
    }
    openSubWindow(activeId, {
      title: 'API Documentation',
      content: <ApiHelperModal open={true} onOpenChange={() => {}} shopSlug={shop.slug} />,
      width: 1000,
      height: 700,
    });
  }, [activeId, hasShop, shop, openSubWindow]);

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
        {/* Shop Status Indicator */}
        {hasShop && shop && (
          <div className="flex w-full items-center gap-2 rounded-md bg-green-500/10 px-3 py-2 text-sm @md:w-auto">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <div className="flex items-center gap-1.5">
              <Store className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{shop.name}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground text-xs">
                /ecommerce/{shop.slug}
              </span>
            </div>
          </div>
        )}
        
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
          <Button variant="outline" size="sm" onClick={openBanners} disabled={!hasShop}>
            <Image className="mr-1.5 h-4 w-4" />
            Banners
          </Button>
          <Button variant="outline" size="sm" onClick={openApiDocs} disabled={!hasShop}>
            <Code className="mr-1.5 h-4 w-4" />
            API
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
                isShared={product.isShared}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
