import React from 'react';
import { Users, Image as ImageIcon } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  isShared?: boolean;
  imageUrl?: string;
}

export function ProductCard({ product, onClick, isShared = false, imageUrl }: ProductCardProps) {
  const isLowStock = product.inventory < 5 && product.inventory > 0;
  const isOutOfStock = product.inventory === 0;

  return (
    <div
      className="bg-card border-border hover:border-primary group relative cursor-pointer rounded-lg border overflow-hidden transition-colors"
      onClick={onClick}
    >
      {/* Shared badge */}
      {isShared && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">
          <Users className="h-3 w-3" />
          <span>Shared</span>
        </div>
      )}
      
      {/* Product Image */}
      <div className="aspect-square w-full bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium line-clamp-2">{product.name}</h3>
        <p className="text-muted-foreground text-sm">
          ${(product.price / 100).toFixed(2)}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">
              Stock: {product.inventory}
            </span>
            {isLowStock && (
              <span className="text-orange-600 text-xs font-medium">
                Low stock
              </span>
            )}
            {isOutOfStock && (
              <span className="text-red-600 text-xs font-medium">
                Out of stock
              </span>
            )}
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              product.status === 'active'
                ? 'bg-green-100 text-green-700'
                : product.status === 'draft'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {product.status}
          </span>
        </div>
      </div>
    </div>
  );
}
