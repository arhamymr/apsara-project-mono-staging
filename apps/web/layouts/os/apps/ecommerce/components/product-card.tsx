import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isLowStock = product.inventory < 5 && product.inventory > 0;
  const isOutOfStock = product.inventory === 0;

  return (
    <div
      className="bg-card border-border hover:border-primary group relative cursor-pointer rounded-lg border p-4 transition-colors"
      onClick={onClick}
    >
      <div className="space-y-2">
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
