# Storefront and Cart Verification Checklist

## Task 16: Checkpoint - Ensure storefront and cart work

This document provides a manual verification checklist for the storefront and shopping cart functionality.

## ✅ Implementation Status

### Core Components Implemented
- ✅ Storefront page (`/ecommerce/[shopname]`)
- ✅ Product detail page (`/ecommerce/[shopname]/[productSlug]`)
- ✅ Cart Provider (React Context with localStorage persistence)
- ✅ Cart Drawer (slide-out cart UI)
- ✅ Cart Item component (quantity controls, remove)
- ✅ Checkout Button (WhatsApp integration)
- ✅ Storefront Header (shop branding + cart badge)
- ✅ Banner Carousel (hero banners)
- ✅ Product Grid (product listing)
- ✅ Search and Filter (search + category filter)

### TypeScript Compilation
- ✅ No TypeScript errors in any storefront components
- ✅ All types properly defined and imported

## 🧪 Manual Testing Checklist

### 1. Storefront Display (Requirements 4.1-4.8)
- [ ] Navigate to `/ecommerce/[shopname]` with valid shop
- [ ] Verify shop logo and name display in header
- [ ] Verify shop description displays
- [ ] Verify only "active" products are shown
- [ ] Verify products display in responsive grid
- [ ] Verify product cards show: image, name, price, availability
- [ ] Verify "Out of Stock" indicator for inventory = 0
- [ ] Verify 404 page for non-existent shop

### 2. Banner Carousel (Requirements 13.9-13.12)
- [ ] Verify active banners display in carousel
- [ ] Verify carousel auto-rotates every 5 seconds
- [ ] Verify single banner displays as hero image
- [ ] Verify default header when no banners

### 3. Search and Filter (Requirements 10.1-10.6)
- [ ] Enter search query and verify products filter by name
- [ ] Enter search query and verify products filter by description
- [ ] Select category and verify products filter correctly
- [ ] Verify results count displays correctly
- [ ] Verify "no results" message when no matches
- [ ] Verify filters update grid immediately

### 4. Product Detail Page (Requirements 4.6, 9.3)
- [ ] Click product card to navigate to detail page
- [ ] Verify full product information displays
- [ ] Verify image gallery displays all product images
- [ ] Verify "Add to Cart" button is enabled for in-stock products
- [ ] Verify "Add to Cart" button is disabled for out-of-stock products
- [ ] Verify 404 page for non-existent product

### 5. Shopping Cart - Add Items (Requirements 5.1-5.3)
- [ ] Click "Add to Cart" on product
- [ ] Verify cart badge count increases
- [ ] Verify cart drawer opens automatically
- [ ] Verify product appears in cart with correct details
- [ ] Add same product again and verify quantity increases
- [ ] Add different product and verify both items in cart
- [ ] Verify cart persists after page reload (localStorage)

### 6. Shopping Cart - Manage Items (Requirements 5.4-5.8)
- [ ] Open cart drawer by clicking cart icon
- [ ] Verify all cart items display with name, quantity, price
- [ ] Click "+" to increase quantity
- [ ] Click "-" to decrease quantity
- [ ] Verify quantity cannot exceed inventory (maxQuantity)
- [ ] Click "X" to remove item from cart
- [ ] Verify cart updates immediately on all actions
- [ ] Verify subtotal and total calculate correctly

### 7. Shopping Cart - Inventory Constraints (Requirement 5.8)
- [ ] Add product to cart up to max inventory
- [ ] Verify "+" button disables at max quantity
- [ ] Verify "Max quantity: X" message displays
- [ ] Try to add out-of-stock product
- [ ] Verify appropriate error/disabled state

### 8. WhatsApp Checkout (Requirements 6.1-6.7)
- [ ] Add items to cart
- [ ] Click "Checkout via WhatsApp" button
- [ ] Verify WhatsApp opens in new tab
- [ ] Verify message includes all item names and quantities
- [ ] Verify message includes total price
- [ ] Verify message includes cart reference ID
- [ ] Verify message is sent to shop's WhatsApp number
- [ ] Verify URL format: `wa.me/[number]?text=[encoded_message]`
- [ ] Verify cart drawer closes after checkout

### 9. Cart Persistence (Requirement 5.2)
- [ ] Add items to cart
- [ ] Refresh the page
- [ ] Verify cart items persist
- [ ] Verify cart badge count persists
- [ ] Close browser and reopen
- [ ] Verify cart still contains items

### 10. Empty Cart State
- [ ] Remove all items from cart
- [ ] Verify "Your cart is empty" message displays
- [ ] Verify "Continue Shopping" button works
- [ ] Verify checkout button is disabled

### 11. Responsive Design
- [ ] Test on mobile viewport (< 640px)
- [ ] Test on tablet viewport (640px - 1024px)
- [ ] Test on desktop viewport (> 1024px)
- [ ] Verify cart drawer works on all screen sizes
- [ ] Verify product grid adapts to screen size

### 12. Error Handling
- [ ] Test with invalid shop slug
- [ ] Test with invalid product slug
- [ ] Test with missing WhatsApp number
- [ ] Verify appropriate error messages display
- [ ] Verify error states don't break the UI

## 🔍 Code Quality Checks

### TypeScript
- ✅ No compilation errors
- ✅ All types properly defined
- ✅ No `any` types used inappropriately

### Component Structure
- ✅ Components follow established patterns
- ✅ Proper separation of concerns
- ✅ Reusable components extracted

### State Management
- ✅ Cart state managed via React Context
- ✅ localStorage integration for persistence
- ✅ Proper state updates (immutable)

### Performance
- ✅ Images lazy-loaded with Next.js Image
- ✅ Queries optimized with Convex
- ✅ Memoization used where appropriate

## 📝 Known Limitations

1. **Product Images**: Currently fetched per-product in ProductGrid. For large catalogs, consider batch fetching.
2. **Build Warnings**: Windows symlink permission warnings during build (non-critical).
3. **No Unit Tests**: Property-based tests are marked as optional tasks.

## ✅ Verification Result

**Status**: ✅ **READY FOR MANUAL TESTING**

All core components are implemented and TypeScript compilation is successful. The storefront and cart functionality is ready for manual verification by following the checklist above.

### Next Steps
1. Start the development server: `pnpm --filter web dev`
2. Create a test shop with products in the Product Manager app
3. Navigate to `/ecommerce/[shopname]` to test the storefront
4. Follow the manual testing checklist above
5. Report any issues found during testing

### Optional Tasks (Not Required for Checkpoint)
- Task 2.3: Property test for shop slug uniqueness
- Task 3.4-3.6: Property tests for product validation
- Task 4.4-4.5: Property tests for image management
- Task 5.4: Property tests for banner validation
- Task 9.3: Property test for image file size
- Task 13.6: Property test for storefront visibility
- Task 14.5: Property tests for cart operations
- Task 15.2: Property test for WhatsApp message generation

These optional tests can be implemented later if needed.
