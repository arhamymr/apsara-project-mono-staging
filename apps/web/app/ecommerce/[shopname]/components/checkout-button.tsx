'use client';

import { Button } from '@workspace/ui/components/button';
import { MessageCircle } from 'lucide-react';
import type { CartItem } from '@/layouts/os/apps/ecommerce/types';

interface CheckoutButtonProps {
  items: CartItem[];
  total: number;
  currency: string;
  whatsappNumber: string;
  shopName: string;
  onCheckoutComplete?: () => void;
}

/**
 * Generates a WhatsApp checkout message and opens WhatsApp with the pre-filled message
 * 
 * Requirements:
 * - 6.1: Generate WhatsApp message on checkout
 * - 6.2: Include all cart items with names and quantities
 * - 6.3: Include total price
 * - 6.4: Include cart ID for reference
 * - 6.5: Open WhatsApp with pre-filled message
 * - 6.6: Send to shop's WhatsApp number
 * - 6.7: Use wa.me/[number]?text=[encoded_message] format
 */
export function CheckoutButton({
  items,
  total,
  currency,
  whatsappNumber,
  shopName,
  onCheckoutComplete,
}: CheckoutButtonProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
    }).format(price / 100);
  };

  const generateCartId = () => {
    // Generate a unique cart ID using timestamp and random string
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `CART-${timestamp}-${random}`.toUpperCase();
  };

  const generateWhatsAppMessage = () => {
    const cartId = generateCartId();
    
    // Build message parts
    const greeting = `Hello! I'd like to place an order from ${shopName}`;
    const separator = '\n' + '─'.repeat(30) + '\n';
    
    // Format cart items
    const itemsList = items.map((item, index) => {
      return `${index + 1}. ${item.name}\n   Qty: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`;
    }).join('\n\n');
    
    // Calculate total
    const totalLine = `\n${separator}Total: ${formatPrice(total)}`;
    
    // Add cart reference
    const reference = `\n\nCart ID: ${cartId}`;
    
    // Combine all parts
    const message = `${greeting}${separator}${itemsList}${totalLine}${reference}`;
    
    return message;
  };

  const handleCheckout = () => {
    // Generate the WhatsApp message
    const message = generateWhatsAppMessage();
    
    // Clean the WhatsApp number (remove any non-digit characters except +)
    const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '');
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Build the WhatsApp URL using wa.me format
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new window/tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    
    // Call the completion callback if provided
    if (onCheckoutComplete) {
      onCheckoutComplete();
    }
  };

  // Disable button if no items
  const isDisabled = items.length === 0;

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleCheckout}
      disabled={isDisabled}
    >
      <MessageCircle className="mr-2 h-5 w-5" />
      Checkout via WhatsApp
    </Button>
  );
}
