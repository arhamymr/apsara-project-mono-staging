'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';

interface ProductImage {
  _id: string;
  url: string;
  position: number;
  isPrimary: boolean;
}

interface Product {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  price: number;
  inventory: number;
  status: string;
  category?: string;
  tags?: string[];
}

interface ProductDetailProps {
  product: Product;
  images: ProductImage[];
  currency?: string;
  onAddToCart?: (product: Product) => void;
}

function formatPrice(price: number, currency: string = 'USD'): string {
  // Price is stored in smallest unit (cents), convert to dollars
  const amount = price / 100;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

// Helper to optimize image URLs
function optimizeImageUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'images.unsplash.com') {
      const photoId = urlObj.pathname;
      return `https://images.unsplash.com${photoId}?w=1200&q=85&fm=jpg&fit=crop`;
    }
    return url;
  } catch {
    return url;
  }
}

export function ProductDetail({ product, images, currency = 'USD', onAddToCart }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isOutOfStock = product.inventory === 0;

  // Sort images by position
  const sortedImages = [...images].sort((a, b) => a.position - b.position);

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev + 1) % sortedImages.length);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
          {sortedImages.length > 0 ? (
            <>
              <Image
                src={optimizeImageUrl(sortedImages[selectedImageIndex]?.url || '')}
                alt={product.name}
                fill
                className="object-cover"
                priority
                unoptimized={sortedImages[selectedImageIndex]?.url.includes('unsplash.com')}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              
              {/* Navigation Arrows (only show if multiple images) */}
              {sortedImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={goToPrevious}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={goToNext}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="h-24 w-24 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {sortedImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {sortedImages.map((image, index) => (
              <button
                key={image._id}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  'relative aspect-square rounded-md overflow-hidden border-2 transition-all',
                  index === selectedImageIndex
                    ? 'border-primary'
                    : 'border-transparent hover:border-muted-foreground/30'
                )}
              >
                <Image
                  src={optimizeImageUrl(image.url)}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={image.url.includes('unsplash.com')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="space-y-6">
        {/* Category */}
        {product.category && (
          <Badge variant="secondary">{product.category}</Badge>
        )}

        {/* Title */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-3xl font-bold text-primary">
            {formatPrice(product.price, currency)}
          </p>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-2">
          {isOutOfStock ? (
            <Badge variant="destructive">Out of Stock</Badge>
          ) : (
            <>
              <Badge variant="default">In Stock</Badge>
              <span className="text-sm text-muted-foreground">
                {product.inventory} available
              </span>
            </>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Add to Cart Button */}
        {onAddToCart && (
          <Button
            size="lg"
            className="w-full md:w-auto"
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        )}
      </div>
    </div>
  );
}
