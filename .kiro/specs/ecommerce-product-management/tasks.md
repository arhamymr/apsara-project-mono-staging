# Implementation Plan: E-commerce Product Management

## Overview

This implementation plan breaks down the e-commerce product management feature into discrete coding tasks. The implementation follows the existing patterns from the blog management feature, using Convex for data persistence, React hooks for state management, and Next.js for the public storefront and API.

## Tasks

- [x] 1. Set up Convex schema and database tables
  - [x] 1.1 Add shops table to Convex schema
    - Define shops table with ownerId, slug, name, description, logo, whatsappNumber, currency fields
    - Add indexes: by_owner, by_slug
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  - [x] 1.2 Add products table to Convex schema
    - Define products table with shopId, slug, name, description, price, inventory, status, category, tags fields
    - Add indexes: by_shop, by_shop_slug, by_shop_status, by_status
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.8, 2.9, 2.10_
  - [x] 1.3 Add productImages table to Convex schema
    - Define productImages table with productId, url, position, isPrimary fields
    - Add indexes: by_product, by_product_position
    - _Requirements: 2.7, 8.4, 8.5_
  - [x] 1.4 Add banners table to Convex schema
    - Define banners table with shopId, title, subtitle, imageUrl, linkUrl, status, position, startDate, endDate fields
    - Add indexes: by_shop, by_shop_status, by_shop_position
    - _Requirements: 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8_
  - [x] 1.5 Update sharedResources to support shop resource type
    - Add "shop" to resourceType union
    - _Requirements: 11.1, 11.2_

- [x] 2. Implement Convex mutations and queries for shops
  - [x] 2.1 Create shop CRUD mutations
    - Implement create, update, delete mutations with validation
    - Validate slug uniqueness and URL-safety
    - _Requirements: 3.2, 3.8_
  - [x] 2.2 Create shop query functions
    - Implement getByOwner, getBySlug queries
    - _Requirements: 3.1, 4.1_
  - [ ]* 2.3 Write property test for shop slug uniqueness
    - **Property 10: Shop Slug Uniqueness and URL-Safety**
    - **Validates: Requirements 3.2, 3.8**

- [x] 3. Implement Convex mutations and queries for products
  - [x] 3.1 Create product CRUD mutations
    - Implement create, update, delete mutations
    - Validate name length (max 200), price (positive), inventory (non-negative)
    - Auto-generate slug from name, ensure uniqueness per shop
    - _Requirements: 1.3, 1.5, 1.6, 2.2, 2.4, 2.5, 2.8_
  - [x] 3.2 Create product query functions
    - Implement listByShop, getById, getBySlug, search queries
    - Filter by status for public queries
    - _Requirements: 1.1, 1.7, 4.3_
  - [x] 3.3 Implement bulk status update mutation
    - Accept array of product IDs and new status
    - _Requirements: 12.4_
  - [ ]* 3.4 Write property tests for product validation
    - **Property 4: Product Name Validation**
    - **Property 5: Product Price Validation**
    - **Property 6: Product Inventory Validation**
    - **Validates: Requirements 2.2, 2.4, 2.5**
  - [ ]* 3.5 Write property test for product CRUD round-trip
    - **Property 1: Product CRUD Round-Trip**
    - **Validates: Requirements 1.3, 1.5**
  - [ ]* 3.6 Write property test for product slug uniqueness
    - **Property 8: Product Slug Uniqueness Per Shop**
    - **Validates: Requirements 2.8**

- [x] 4. Implement Convex mutations and queries for product images
  - [x] 4.1 Create product image CRUD mutations
    - Implement add, remove, reorder mutations
    - Enforce 1-10 image limit per product
    - Auto-set isPrimary for first image
    - _Requirements: 2.7, 8.4, 8.5_
  - [x] 4.2 Create product image query functions
    - Implement listByProduct query ordered by position
    - _Requirements: 2.7_
  - [x] 4.3 Implement cascade delete for product images
    - Delete all images when product is deleted
    - _Requirements: 8.6_
  - [ ]* 4.4 Write property test for image count bounds
    - **Property 7: Product Image Count Bounds**
    - **Validates: Requirements 2.7**
  - [ ]* 4.5 Write property test for image reordering
    - **Property 27: Image Reordering**
    - **Validates: Requirements 8.4, 8.5**


- [x] 5. Implement Convex mutations and queries for banners
  - [x] 5.1 Create banner CRUD mutations
    - Implement create, update, delete mutations
    - Validate title (max 100), subtitle (max 200)
    - Enforce 10 banner limit per shop
    - _Requirements: 13.2, 13.3, 13.13_
  - [x] 5.2 Create banner query functions
    - Implement listByShop, listActiveByShop queries
    - Filter by status and date range for active banners
    - _Requirements: 13.1, 13.9, 13.10, 13.11_
  - [x] 5.3 Implement banner auto-deactivation
    - Query for banners with past endDate and deactivate
    - Can be called via scheduled function or on query
    - _Requirements: 13.14_
  - [ ]* 5.4 Write property tests for banner validation
    - **Property 39: Banner Title Validation**
    - **Property 40: Banner Subtitle Validation**
    - **Property 42: Banner Count Limit**
    - **Validates: Requirements 13.2, 13.3, 13.13**

- [x] 6. Checkpoint - Ensure all Convex functions work
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Create Product Manager app structure
  - [x] 7.1 Create app directory and types
    - Create apps/web/layouts/os/apps/ecommerce/ directory
    - Define TypeScript interfaces in types.ts
    - _Requirements: 1.1_
  - [x] 7.2 Create React hooks for Convex integration
    - Implement useMyShop, useMyProducts, useProduct, useSearchProducts hooks
    - Implement useCreateProduct, useUpdateProduct, useDeleteProduct mutation hooks
    - _Requirements: 1.1, 1.3, 1.5, 1.6, 1.7_
  - [x] 7.3 Create main Product Manager index component
    - Display product grid with search
    - Add "New Product" button
    - Integrate with WindowContext for sub-windows
    - _Requirements: 1.1, 1.2, 1.7_

- [x] 8. Implement product creation and editing
  - [x] 8.1 Create product form component
    - Form fields: name, description, price, inventory, status, category, tags
    - Validation for required fields and constraints
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.9_
  - [x] 8.2 Create product create window component
    - Wrap form in sub-window
    - Handle form submission and success callback
    - _Requirements: 1.2, 1.3_
  - [x] 8.3 Create product edit window component
    - Load existing product data
    - Handle updates and deletion
    - _Requirements: 1.4, 1.5, 1.6_
  - [x] 8.4 Create product card component
    - Display product image, name, price, status badge, inventory
    - Show low stock warning for inventory < 5
    - _Requirements: 9.4, 12.5_

- [x] 9. Implement image gallery component
  - [x] 9.1 Create image gallery component
    - Display product images in grid
    - Support drag-and-drop reordering
    - Show primary image indicator
    - _Requirements: 2.7, 8.4, 8.5_
  - [x] 9.2 Integrate with Finder/storage for uploads
    - Use existing asset picker component
    - Validate file size (max 5MB)
    - _Requirements: 8.1, 8.2, 8.7_
  - [ ]* 9.3 Write property test for image file size validation
    - **Property 26: Image File Size Validation**
    - **Validates: Requirements 8.2**

- [x] 10. Implement shop settings
  - [x] 10.1 Create shop settings component
    - Form for shop name, slug, description, logo, WhatsApp number, currency
    - Slug validation and uniqueness check
    - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  - [x] 10.2 Create shop setup flow for first-time users
    - Detect if user has no shop
    - Prompt to create shop before adding products
    - _Requirements: 3.1_

- [ ] 11. Implement banner management
  - [ ] 11.1 Create banner manager component
    - List all banners with drag-and-drop reordering
    - Status toggle and delete actions
    - _Requirements: 13.1, 13.6, 13.7_
  - [ ] 11.2 Create banner form component
    - Form fields: title, subtitle, image, link URL, status, start/end dates
    - Image upload integration
    - _Requirements: 13.2, 13.3, 13.4, 13.5, 13.8_

- [ ] 12. Checkpoint - Ensure Product Manager app works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Create public storefront pages
  - [ ] 13.1 Create storefront layout and header
    - Shop branding (logo, name, description)
    - Cart icon with badge
    - _Requirements: 4.7, 5.3_
  - [ ] 13.2 Create banner carousel component
    - Display active banners in carousel
    - Auto-rotate every 5 seconds
    - Single banner displays as hero
    - Default header when no banners
    - _Requirements: 13.9, 13.10, 13.11, 13.12_
  - [ ] 13.3 Create product grid component
    - Display active products in responsive grid
    - Show image, name, price, availability
    - "Out of Stock" indicator for inventory 0
    - _Requirements: 4.3, 4.4, 4.5, 9.1, 9.2_
  - [ ] 13.4 Create product detail page
    - Full product information with image gallery
    - Add to cart button (disabled if out of stock)
    - _Requirements: 4.6, 9.3_
  - [ ] 13.5 Create search and filter component
    - Search input for name/description
    - Category filter dropdown
    - Results count display
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  - [ ]* 13.6 Write property test for storefront product visibility
    - **Property 11: Product Visibility Based on Status**
    - **Validates: Requirements 4.3, 12.1, 12.2, 12.3**

- [ ] 14. Implement shopping cart
  - [ ] 14.1 Create cart context provider
    - Cart state management with React context
    - LocalStorage persistence
    - _Requirements: 5.2_
  - [ ] 14.2 Create cart drawer component
    - Slide-out drawer showing cart contents
    - Item list with quantity controls
    - Subtotal and total display
    - _Requirements: 5.4, 5.5_
  - [ ] 14.3 Create cart item component
    - Product name, image, price, quantity
    - Quantity increment/decrement with inventory limit
    - Remove item button
    - _Requirements: 5.5, 5.6, 5.7, 5.8_
  - [ ] 14.4 Implement add to cart functionality
    - Add product to cart with inventory check
    - Update badge count
    - _Requirements: 5.1, 5.3_
  - [ ]* 14.5 Write property tests for cart operations
    - **Property 14: Cart Add Operation**
    - **Property 15: Cart LocalStorage Persistence Round-Trip**
    - **Property 18: Cart Total Calculation**
    - **Property 19: Cart Item Removal**
    - **Property 20: Cart Inventory Constraint**
    - **Validates: Requirements 5.1, 5.2, 5.6, 5.7, 5.8, 5.9**

- [ ] 15. Implement WhatsApp checkout
  - [ ] 15.1 Create checkout button component
    - Generate WhatsApp message with cart contents
    - Include item names, quantities, total, cart ID
    - Open wa.me URL with encoded message
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_
  - [ ]* 15.2 Write property test for WhatsApp message generation
    - **Property 21: WhatsApp Checkout Message Generation**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.6, 6.7**

- [ ] 16. Checkpoint - Ensure storefront and cart work
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 17. Create public API endpoints
  - [ ] 17.1 Create products API route
    - GET /api/products/[shopname] endpoint
    - Return only active products
    - Support pagination (limit, offset)
    - Support category and tag filtering
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [ ] 17.2 Create single product API route
    - GET /api/products/[shopname]/[productSlug] endpoint
    - Include product images as URLs
    - _Requirements: 7.6_
  - [ ] 17.3 Add CORS headers
    - Configure CORS for cross-origin requests
    - _Requirements: 7.7_
  - [ ]* 17.4 Write property tests for API
    - **Property 22: API Returns Only Active Products**
    - **Property 23: API Pagination**
    - **Property 24: API Category and Tag Filtering**
    - **Validates: Requirements 7.2, 7.3, 7.4**

- [ ] 18. Implement API helper modal
  - [ ] 18.1 Create API helper modal component
    - Display API documentation
    - Show example requests and responses
    - Copy-to-clipboard for endpoints
    - _Requirements: 7.1_

- [ ] 19. Implement organization sharing
  - [ ] 19.1 Add shop sharing functionality
    - Share shop with organization using existing infrastructure
    - Grant access to all org members
    - _Requirements: 11.1, 11.2_
  - [ ] 19.2 Display shared indicator
    - Show shared badge on products from shared shops
    - _Requirements: 11.3_
  - [ ] 19.3 Track product changes by user
    - Record userId on product updates
    - _Requirements: 11.5_
  - [ ]* 19.4 Write property test for organization sharing
    - **Property 33: Organization Sharing Access**
    - **Validates: Requirements 11.1, 11.4**

- [ ] 20. Register app in desktop OS
  - [ ] 20.1 Add Product Manager to app definitions
    - Register in app-definitions.tsx
    - Add icon and metadata
    - _Requirements: 1.1_

- [ ] 21. Final checkpoint - Full integration testing
  - Ensure all tests pass, ask the user if questions arise.
  - Test complete flow: create shop → add products → view storefront → add to cart → checkout

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- The implementation follows existing patterns from the blog management feature
