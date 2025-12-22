'use client';

import { Package } from 'lucide-react';
import { ProductCardWithImage } from './product-card-with-image';
import type { Id } from '@/convex/_generated/dataModel';

interface Product {
  _id: Id<'products'>;
  slug: string;
  name: string;
  price: number;
  inventory: number;
  category?: string;
}

interface ProductGridProps {
  products: Product[];
  shopSlug: string;
  currency?: string;
  onAddToCart?: (product: Product) => void;
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
      {products.map((product) => (
        <ProductCardWithImage
          key={product._id}
          product={product}
          shopSlug={shopSlug}
          currency={currency}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
