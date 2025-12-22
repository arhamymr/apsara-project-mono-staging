'use client';

import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@workspace/ui/components/button';
import type { CartItem as CartItemType } from '@/layouts/os/apps/ecommerce/types';

interface CartItemProps {
  item: CartItemType;
  currency: string;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, currency, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleDecrement = () => {
    onUpdateQuantity(item.productId, item.quantity - 1);
  };

  const handleIncrement = () => {
    if (item.quantity < item.maxQuantity) {
      onUpdateQuantity(item.productId, item.quantity + 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(price / 100);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      {/* Product Image */}
      <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            <span className="text-2xl font-bold">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={() => onRemove(item.productId)}
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={handleIncrement}
              disabled={item.quantity >= item.maxQuantity}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Price */}
          <div className="text-right">
            <p className="text-sm font-semibold">{formatPrice(itemTotal)}</p>
            {item.quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.price)} each
              </p>
            )}
          </div>
        </div>

        {/* Max quantity warning */}
        {item.quantity >= item.maxQuantity && (
          <p className="text-xs text-muted-foreground mt-1">
            Max quantity: {item.maxQuantity}
          </p>
        )}
      </div>
    </div>
  );
}
