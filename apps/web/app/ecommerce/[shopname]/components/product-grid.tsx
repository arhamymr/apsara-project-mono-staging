'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Package } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';

interface Product {
  _id: string;
  slug: string;
  name: string;
  price: number;
  inventory: number;
  category?: string;
  primaryImage?: string;
}

interface ProductGridProps {
  products: Product[];
  shopSlug: string;
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

export function ProductGrid({ products, shopSlug, currency = 'USD', onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-muted/50 rounded-full p-6 mb-6">
          <Package className="h-16 w-16 text-muted-foreground/60" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Check back soon for new products.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const isOutOfStock = product.inventory === 0;

        return (
          <div
            key={product._id}
            className="group relative bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <Link href={`/ecommerce/${shopSlug}/${product.slug}`}>
              {/* Product Image */}
              <div className="relative aspect-square bg-muted overflow-hidden">
                {product.primaryImage ? (
                  <Image
                    src={product.primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}
                
                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="secondary" className="text-sm font-semibold">
                      Out of Stock
                    </Badge>
                  </div>
                )}

                {/* Category Badge */}
                {product.category && !isOutOfStock && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-bold">
                    {formatPrice(product.price, currency)}
                  </span>
                  
                  {!isOutOfStock && (
                    <span className="text-sm text-muted-foreground">
                      {product.inventory} in stock
                    </span>
                  )}
                </div>
              </div>
            </Link>

            {/* Add to Cart Button */}
            {onAddToCart && (
              <div className="p-4 pt-0">
                <Button
                  className="w-full"
                  disabled={isOutOfStock}
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(product);
                  }}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
