'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { CartItem, CartState } from '@/layouts/os/apps/ecommerce/types';

interface CartContextValue {
  items: CartItem[];
  shopId: string | null;
  itemCount: number;
  total: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'ecommerce_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartState, setCartState] = useState<CartState | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartState;
        setCartState(parsed);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    try {
      if (cartState) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [cartState, isInitialized]);

  // Calculate derived values
  const items = cartState?.items ?? [];
  const shopId = cartState?.shopId ?? null;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Add item to cart
  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    setCartState((prev) => {
      // If cart is empty or from different shop, create new cart
      if (!prev || prev.shopId !== newItem.shopId) {
        return {
          shopId: newItem.shopId,
          items: [{ ...newItem, quantity: 1 }],
          updatedAt: Date.now(),
        };
      }

      // Check if item already exists
      const existingIndex = prev.items.findIndex(
        (item) => item.productId === newItem.productId
      );

      if (existingIndex >= 0) {
        // Update quantity if item exists
        const existingItem = prev.items[existingIndex];
        if (!existingItem) return prev; // Safety check
        
        const newQuantity = Math.min(
          existingItem.quantity + 1,
          existingItem.maxQuantity
        );

        // Don't update if already at max
        if (newQuantity === existingItem.quantity) {
          return prev;
        }

        const newItems = [...prev.items];
        newItems[existingIndex] = { ...existingItem, quantity: newQuantity };

        return {
          ...prev,
          items: newItems,
          updatedAt: Date.now(),
        };
      }

      // Add new item
      return {
        ...prev,
        items: [...prev.items, { ...newItem, quantity: 1 }],
        updatedAt: Date.now(),
      };
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((productId: string) => {
    setCartState((prev) => {
      if (!prev) return prev;

      const newItems = prev.items.filter((item) => item.productId !== productId);

      // Clear cart if no items left
      if (newItems.length === 0) {
        return null;
      }

      return {
        ...prev,
        items: newItems,
        updatedAt: Date.now(),
      };
    });
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartState((prev) => {
      if (!prev) return prev;

      const itemIndex = prev.items.findIndex((item) => item.productId === productId);
      if (itemIndex < 0) return prev;

      const item = prev.items[itemIndex];
      if (!item) return prev; // Safety check

      // Remove item if quantity is 0 or less
      if (quantity <= 0) {
        const newItems = prev.items.filter((_, i) => i !== itemIndex);
        if (newItems.length === 0) {
          return null;
        }
        return {
          ...prev,
          items: newItems,
          updatedAt: Date.now(),
        };
      }

      // Clamp quantity to max
      const clampedQuantity = Math.min(quantity, item.maxQuantity);

      const newItems = [...prev.items];
      newItems[itemIndex] = { ...item, quantity: clampedQuantity };

      return {
        ...prev,
        items: newItems,
        updatedAt: Date.now(),
      };
    });
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartState(null);
  }, []);

  // Open cart drawer
  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close cart drawer
  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value: CartContextValue = {
    items,
    shopId,
    itemCount,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    openCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
