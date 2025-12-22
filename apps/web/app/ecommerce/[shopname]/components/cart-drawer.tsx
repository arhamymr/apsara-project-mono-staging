'use client';

import { X, ShoppingBag } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { CartItem } from './cart-item';
import { CheckoutButton } from './checkout-button';
import { useCart } from '../../components/cart-provider';
import { useEffect } from 'react';

interface CartDrawerProps {
  currency: string;
  whatsappNumber?: string;
  shopName: string;
}

export function CartDrawer({ currency, whatsappNumber, shopName }: CartDrawerProps) {
  const { items, itemCount, total, isOpen, closeCart, updateQuantity, removeItem } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(price / 100);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">
              Shopping Cart
              {itemCount > 0 && (
                <span className="text-muted-foreground ml-2">
                  ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
              )}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="bg-muted rounded-full p-6 mb-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Add some products to get started
              </p>
              <Button onClick={closeCart}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="space-y-0">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  currency={currency}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer with Totals and Checkout */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            {whatsappNumber ? (
              <CheckoutButton
                items={items}
                total={total}
                currency={currency}
                whatsappNumber={whatsappNumber}
                shopName={shopName}
                onCheckoutComplete={() => {
                  // Close the drawer after checkout
                  closeCart();
                }}
              />
            ) : (
              <Button
                className="w-full"
                size="lg"
                disabled
              >
                Checkout Unavailable
              </Button>
            )}

            <p className="text-xs text-center text-muted-foreground">
              You&apos;ll complete your order via WhatsApp
            </p>
          </div>
        )}
      </div>
    </>
  );
}
