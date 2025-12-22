'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { StorefrontHeader } from '../components/storefront-header';
import { ProductDetail } from '../components/product-detail';
import { CartDrawer } from '../components/cart-drawer';
import { useCart } from '../../components/cart-provider';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Button } from '@workspace/ui/components/button';
import { Store, Package, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const shopSlug = params.shopname as string;
  const productSlug = params.productSlug as string;
  const { toast } = useToast();
  const { itemCount, openCart, addItem } = useCart();

  // Fetch shop data
  const shop = useQuery(api.shops.getBySlug, { slug: shopSlug });
  
  // Fetch product data
  const product = useQuery(
    api.products.getBySlug,
    shop ? { shopId: shop._id, slug: productSlug } : 'skip'
  );

  // Fetch product images
  const images = useQuery(
    api.productImages.listByProduct,
    product ? { productId: product._id } : 'skip'
  );

  // Handle add to cart
  const handleAddToCart = () => {
    if (!shop || !product) return;
    
    // Check if product is in stock
    if (product.inventory <= 0) {
      toast({
        title: 'Out of Stock',
        description: `${product.name} is currently out of stock.`,
        variant: 'destructive',
      });
      return;
    }

    // Add to cart
    addItem({
      productId: product._id,
      shopId: shop._id,
      name: product.name,
      price: product.price,
      maxQuantity: product.inventory,
      imageUrl: images?.[0]?.url, // Use first image if available
    });

    // Show success toast
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });

    // Open cart drawer
    openCart();
  };

  // Loading state
  if (shop === undefined || product === undefined || images === undefined) {
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

        {/* Content Skeleton */}
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
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

  // Product not found
  if (product === null) {
    return (
      <div className="min-h-screen bg-background">
        <StorefrontHeader
          shop={{
            name: shop.name,
            description: shop.description,
            logo: shop.logo,
            slug: shop.slug,
          }}
          cartItemCount={0}
          onCartClick={() => console.log('Cart clicked')}
        />
        
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-muted/50 rounded-full p-6 mb-6 inline-flex">
              <Package className="h-16 w-16 text-muted-foreground/60" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product &quot;{productSlug}&quot; doesn&apos;t exist or is no longer available.
            </p>
            <Button asChild>
              <Link href={`/ecommerce/${shopSlug}`}>Back to Shop</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!images) {
    return (
      <div className="min-h-screen bg-background">
        <StorefrontHeader
          shop={{
            name: shop.name,
            description: shop.description,
            logo: shop.logo,
            slug: shop.slug,
          }}
          cartItemCount={0}
          onCartClick={() => console.log('Cart clicked')}
        />
        
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-destructive/10 rounded-full p-6 mb-6 inline-flex">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Something Went Wrong</h1>
            <p className="text-muted-foreground mb-8">
              We encountered an error while loading the product. Please try again later.
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
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

      {/* Product Detail */}
      <main className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
        <ProductDetail
          product={{
            _id: product._id,
            slug: product.slug,
            name: product.name,
            description: product.description,
            price: product.price,
            inventory: product.inventory,
            status: product.status,
            category: product.category,
            tags: product.tags,
          }}
          images={images.map((img) => ({
            _id: img._id,
            url: img.url,
            position: img.position,
            isPrimary: img.isPrimary,
          }))}
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
