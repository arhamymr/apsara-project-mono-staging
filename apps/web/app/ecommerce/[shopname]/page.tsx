'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { StorefrontHeader } from './components/storefront-header';
import { BannerCarousel } from './components/banner-carousel';
import { SearchFilter } from './components/search-filter';
import { ProductGrid } from './components/product-grid';
import { CartDrawer } from './components/cart-drawer';
import { useCart } from '../components/cart-provider';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Button } from '@workspace/ui/components/button';
import { Store, AlertCircle } from 'lucide-react';
import Link from 'next/link';
export default function StorefrontPage() {
  const params = useParams();
  const shopSlug = params.shopname as string;
  const { itemCount, openCart, addItem } = useCart();

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch shop data
  const shop = useQuery(api.shops.getBySlug, { slug: shopSlug });
  
  // Fetch products and banners
  const products = useQuery(
    api.products.listActiveByShop,
    shop ? { shopId: shop._id } : 'skip'
  );
  
  const banners = useQuery(
    api.banners.listActiveByShop,
    shop ? { shopId: shop._id } : 'skip'
  );

  // Note: Product images are fetched per-product in the ProductGrid component
  // for better performance with large product catalogs

  // Extract unique categories from products
  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = new Set<string>();
    products.forEach((product) => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [products]);

  // Handle add to cart
  const handleAddToCart = (product: { _id: string; slug: string; name: string; price: number; inventory: number }) => {
    if (!shop) return;
    
    // Check if product is in stock
    if (product.inventory <= 0) {
      return;
    }

    // Add to cart
    addItem({
      productId: product._id,
      shopId: shop._id,
      name: product.name,
      price: product.price,
      maxQuantity: product.inventory,
      imageUrl: undefined, // Images are fetched separately
    });

    // Open cart drawer
    openCart();
  };

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let filtered = products;

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description?.toLowerCase().includes(searchLower) ?? false;
        return nameMatch || descriptionMatch;
      });
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    return filtered;
  }, [products, searchQuery, selectedCategory]);

  // Add primary image to products
  const productsWithImages = useMemo(() => {
    if (!filteredProducts) return [];
    // For now, we'll fetch images per product in the ProductGrid component
    // This is a simplified version - in production, you'd want to batch fetch all images
    return filteredProducts;
  }, [filteredProducts]);

  // Loading state
  if (shop === undefined || products === undefined || banners === undefined) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Skeleton */}
        <div className="border-b bg-background sticky top-0 z-50">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48 hidden sm:block" />
                </div>
              </div>
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>

        {/* Banner Skeleton */}
        <Skeleton className="w-full h-96" />

        {/* Content Skeleton */}
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
          <div className="space-y-4 mb-8">
            <div className="flex gap-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-64" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Shop not found
  if (shop === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-muted/50 rounded-full p-6 mb-6 inline-flex">
            <Store className="h-16 w-16 text-muted-foreground/60" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Shop Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The shop &quot;{shopSlug}&quot; doesn&apos;t exist or is no longer available.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Error state (shouldn't happen with Convex, but good to have)
  if (!products || !banners) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 rounded-full p-6 mb-6 inline-flex">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Something Went Wrong</h1>
          <p className="text-muted-foreground mb-8">
            We encountered an error while loading the shop. Please try again later.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Storefront Header */}
      <StorefrontHeader
        shop={{
          name: shop.name,
          description: shop.description,
          logo: shop.logo,
          slug: shop.slug,
        }}
        cartItemCount={itemCount}
        onCartClick={openCart}
      />

      {/* Banner Carousel */}
      <BannerCarousel
        banners={banners.map((banner) => ({
          _id: banner._id,
          title: banner.title,
          subtitle: banner.subtitle,
          imageUrl: banner.imageUrl,
          linkUrl: banner.linkUrl,
          position: banner.position,
        }))}
        shopName={shop.name}
      />

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categories}
            resultsCount={filteredProducts.length}
            totalCount={products.length}
          />
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={productsWithImages.map((product) => ({
            _id: product._id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            inventory: product.inventory,
            category: product.category,
            primaryImage: undefined, // TODO: Fetch images efficiently
          }))}
          shopSlug={shop.slug}
          currency={shop.currency}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        currency={shop.currency || 'USD'}
        whatsappNumber={shop.whatsappNumber ?? undefined}
        shopName={shop.name}
      />
    </div>
  );
}
