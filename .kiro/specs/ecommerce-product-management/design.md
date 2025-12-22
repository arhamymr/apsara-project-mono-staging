# Design Document: E-commerce Product Management

## Overview

This design document outlines the technical architecture for an e-commerce product management system integrated into the desktop OS environment. The system follows the established patterns from the blog management feature, using Convex for data persistence, React hooks for state management, and Next.js API routes for public API exposure.

The feature consists of:
1. **Product Manager App** - Desktop OS application for managing products, shops, and banners
2. **Public Storefront** - Customer-facing pages at `/ecommerce/[shopname]`
3. **Shopping Cart** - Client-side cart with localStorage persistence
4. **WhatsApp Checkout** - Manual checkout via pre-filled WhatsApp messages
5. **Public API** - REST endpoints for external integrations

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Desktop OS                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Product Manager App                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │ Products │ │  Shop    │ │ Banners  │ │   API    │   │   │
│  │  │   List   │ │ Settings │ │  Manager │ │  Helper  │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Convex Backend                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │  shops   │ │ products │ │ banners  │ │ productImages    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Public Interfaces                             │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │  /ecommerce/[shopname]  │  │  /api/products/[shopname]   │  │
│  │      (Storefront)       │  │       (REST API)            │  │
│  └─────────────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Product Manager App Component Structure

```
apps/web/layouts/os/apps/ecommerce/
├── index.tsx                    # Main app entry (product list)
├── hooks.ts                     # Convex query/mutation hooks
├── types.ts                     # TypeScript interfaces
├── components/
│   ├── product-card.tsx         # Product grid card
│   ├── product-form.tsx         # Create/edit product form
│   ├── shop-settings.tsx        # Shop configuration panel
│   ├── banner-manager.tsx       # Banner CRUD interface
│   ├── banner-form.tsx          # Create/edit banner form
│   ├── image-gallery.tsx        # Multi-image upload/reorder
│   ├── inventory-badge.tsx      # Stock level indicator
│   └── api-helper-modal.tsx     # API integration docs
├── create.tsx                   # Create product window
└── edit.tsx                     # Edit product window
```

### 2. Public Storefront Component Structure

```
apps/web/app/ecommerce/
├── [shopname]/
│   ├── page.tsx                 # Shop storefront page
│   ├── [productSlug]/
│   │   └── page.tsx             # Product detail page
│   └── components/
│       ├── storefront-header.tsx    # Shop branding + cart
│       ├── banner-carousel.tsx      # Hero banner slider
│       ├── product-grid.tsx         # Product listing
│       ├── product-detail.tsx       # Single product view
│       ├── cart-drawer.tsx          # Slide-out cart
│       ├── cart-item.tsx            # Cart line item
│       ├── checkout-button.tsx      # WhatsApp checkout
│       └── search-filter.tsx        # Search and category filter
└── components/
    └── cart-provider.tsx        # Cart context provider
```

### 3. Key Interfaces

```typescript
// Shop Interface
interface Shop {
  _id: Id<"shops">;
  ownerId: Id<"users">;
  slug: string;              // URL-safe unique identifier
  name: string;              // Display name
  description?: string;
  logo?: string;             // Image URL
  whatsappNumber: string;    // For checkout
  currency: string;          // Default: "USD"
  createdAt: number;
  updatedAt: number;
}

// Product Interface
interface Product {
  _id: Id<"products">;
  shopId: Id<"shops">;
  slug: string;              // Unique per shop
  name: string;
  description?: string;      // Rich text (Lexical JSON)
  price: number;             // In smallest currency unit (cents)
  inventory: number;
  status: "draft" | "active" | "archived";
  category?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

// Product Image Interface
interface ProductImage {
  _id: Id<"productImages">;
  productId: Id<"products">;
  url: string;
  position: number;          // For ordering
  isPrimary: boolean;
  createdAt: number;
}

// Banner Interface
interface Banner {
  _id: Id<"banners">;
  shopId: Id<"shops">;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  status: "active" | "inactive";
  position: number;
  startDate?: number;
  endDate?: number;
  createdAt: number;
  updatedAt: number;
}

// Cart Item (Client-side)
interface CartItem {
  productId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  maxQuantity: number;       // Based on inventory
}

// Cart State (localStorage)
interface CartState {
  shopId: string;
  items: CartItem[];
  updatedAt: number;
}
```

## Data Models

### Convex Schema Additions

```typescript
// shops table
shops: defineTable({
  ownerId: v.id("users"),
  slug: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  logo: v.optional(v.string()),
  whatsappNumber: v.string(),
  currency: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_owner", ["ownerId"])
  .index("by_slug", ["slug"]),

// products table
products: defineTable({
  shopId: v.id("shops"),
  slug: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  price: v.number(),
  inventory: v.number(),
  status: v.union(v.literal("draft"), v.literal("active"), v.literal("archived")),
  category: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_shop", ["shopId"])
  .index("by_shop_slug", ["shopId", "slug"])
  .index("by_shop_status", ["shopId", "status"])
  .index("by_status", ["status"]),

// productImages table
productImages: defineTable({
  productId: v.id("products"),
  url: v.string(),
  position: v.number(),
  isPrimary: v.boolean(),
  createdAt: v.number(),
})
  .index("by_product", ["productId"])
  .index("by_product_position", ["productId", "position"]),

// banners table
banners: defineTable({
  shopId: v.id("shops"),
  title: v.string(),
  subtitle: v.optional(v.string()),
  imageUrl: v.string(),
  linkUrl: v.optional(v.string()),
  status: v.union(v.literal("active"), v.literal("inactive")),
  position: v.number(),
  startDate: v.optional(v.number()),
  endDate: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_shop", ["shopId"])
  .index("by_shop_status", ["shopId", "status"])
  .index("by_shop_position", ["shopId", "position"]),
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*



### Property 1: Product CRUD Round-Trip
*For any* valid product data, creating a product and then retrieving it should return equivalent data. Similarly, updating a product and retrieving it should reflect the changes.
**Validates: Requirements 1.3, 1.5**

### Property 2: Product Deletion Removes Product
*For any* product, deleting it should result in the product no longer being retrievable from the catalog.
**Validates: Requirements 1.6**

### Property 3: Product Search Returns Matching Results
*For any* search query and product set, the search results should only contain products whose name or description contains the search term.
**Validates: Requirements 1.7, 10.2**

### Property 4: Product Name Validation
*For any* string over 200 characters, product creation should fail. For any non-empty string of 200 characters or less, product creation should succeed (given other valid fields).
**Validates: Requirements 2.2**

### Property 5: Product Price Validation
*For any* non-positive price value, product creation should fail. For any positive price, product creation should succeed.
**Validates: Requirements 2.4**

### Property 6: Product Inventory Validation
*For any* negative inventory value, product creation should fail. For any non-negative integer, product creation should succeed.
**Validates: Requirements 2.5**

### Property 7: Product Image Count Bounds
*For any* product, the number of associated images should be between 1 and 10 inclusive.
**Validates: Requirements 2.7**

### Property 8: Product Slug Uniqueness Per Shop
*For any* shop, creating two products with the same slug should fail. Products in different shops may have the same slug.
**Validates: Requirements 2.8**

### Property 9: Product Timestamps Update Correctly
*For any* product creation, createdAt and updatedAt should be set. For any product update, updatedAt should be greater than or equal to the previous value.
**Validates: Requirements 2.10**

### Property 10: Shop Slug Uniqueness and URL-Safety
*For any* shop slug, it should only contain URL-safe characters (lowercase letters, numbers, hyphens). Creating a shop with an existing slug should fail.
**Validates: Requirements 3.2, 3.8**

### Property 11: Product Visibility Based on Status
*For any* shop's storefront, only products with status "active" should be displayed. Products with status "draft" or "archived" should not appear on the storefront but should remain in the database.
**Validates: Requirements 4.3, 12.1, 12.2, 12.3**

### Property 12: Storefront Product Display Contains Required Fields
*For any* product displayed on the storefront, the rendered output should include the product's image, name, price, and availability status.
**Validates: Requirements 4.5**

### Property 13: Storefront Shop Branding Display
*For any* shop with a logo and description, the storefront should display both elements.
**Validates: Requirements 4.7**

### Property 14: Cart Add Operation
*For any* product with available inventory, adding it to the cart should increase the cart item count by one (or increase quantity if already in cart).
**Validates: Requirements 5.1**

### Property 15: Cart LocalStorage Persistence Round-Trip
*For any* cart state, saving to localStorage and then retrieving should return an equivalent cart state.
**Validates: Requirements 5.2**

### Property 16: Cart Badge Count Accuracy
*For any* cart state, the badge count should equal the sum of quantities of all items in the cart.
**Validates: Requirements 5.3**

### Property 17: Cart Display Contains Required Fields
*For any* cart with items, the rendered cart should display each item's name, quantity, price, and the cart subtotal.
**Validates: Requirements 5.5**

### Property 18: Cart Total Calculation
*For any* cart, the total price should equal the sum of (price × quantity) for all items in the cart.
**Validates: Requirements 5.6, 5.9**

### Property 19: Cart Item Removal
*For any* cart item, removing it should result in the cart no longer containing that item.
**Validates: Requirements 5.7**

### Property 20: Cart Inventory Constraint
*For any* product with inventory N, the cart should not allow adding more than N items of that product.
**Validates: Requirements 5.8**

### Property 21: WhatsApp Checkout Message Generation
*For any* cart, the generated WhatsApp message should include all item names and quantities, the total price, a cart reference ID, use the shop's WhatsApp number, and follow the format `wa.me/[number]?text=[encoded_message]`.
**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.6, 6.7**

### Property 22: API Returns Only Active Products
*For any* API call to `/api/products/[shopname]`, the response should only contain products with status "active".
**Validates: Requirements 7.2**

### Property 23: API Pagination
*For any* limit and offset parameters, the API should return the correct subset of products.
**Validates: Requirements 7.3**

### Property 24: API Category and Tag Filtering
*For any* category or tag filter, the API should return only products matching the filter criteria.
**Validates: Requirements 7.4**

### Property 25: API Response Includes Image URLs
*For any* product with images in the API response, the images should be included as valid URLs.
**Validates: Requirements 7.6**

### Property 26: Image File Size Validation
*For any* image upload over 5MB, the upload should fail with an appropriate error.
**Validates: Requirements 8.2**

### Property 27: Image Reordering
*For any* image reorder operation, the position values should update correctly and the first image (position 0) should be marked as primary.
**Validates: Requirements 8.4, 8.5**

### Property 28: Product Deletion Cascades to Images
*For any* product deletion, all associated product images should also be deleted.
**Validates: Requirements 8.6**

### Property 29: Out of Stock Behavior
*For any* product with inventory 0, it should display as "Out of Stock" on the storefront and the "Add to Cart" button should be disabled.
**Validates: Requirements 9.1, 9.2, 9.3**

### Property 30: Low Stock Warning
*For any* product with inventory less than 5, the Product Manager should display a low stock warning.
**Validates: Requirements 9.4**

### Property 31: Inventory Adjustment Persistence
*For any* inventory adjustment, the new inventory value should persist correctly.
**Validates: Requirements 9.5**

### Property 32: Search Results Count Accuracy
*For any* search or filter operation, the displayed result count should match the actual number of results.
**Validates: Requirements 10.5**

### Property 33: Organization Sharing Access
*For any* shop shared with an organization, all organization members should have access to view and edit products.
**Validates: Requirements 11.1, 11.4**

### Property 34: Shared Product Indicator
*For any* product from a shared shop, the UI should indicate that it is shared.
**Validates: Requirements 11.3**

### Property 35: Product Change Tracking
*For any* product update, the system should record which user made the change.
**Validates: Requirements 11.5**

### Property 36: Bulk Status Change
*For any* selection of products, a bulk status change should update all selected products to the new status.
**Validates: Requirements 12.4**

### Property 37: Status Badge Accuracy
*For any* product card, the status badge should accurately reflect the product's current status.
**Validates: Requirements 12.5**

### Property 38: Banner List Display
*For any* shop with banners, the banner management view should display all banners for that shop.
**Validates: Requirements 13.1**

### Property 39: Banner Title Validation
*For any* banner title over 100 characters, banner creation should fail.
**Validates: Requirements 13.2**

### Property 40: Banner Subtitle Validation
*For any* banner subtitle over 200 characters, banner creation should fail.
**Validates: Requirements 13.3**

### Property 41: Banner Ordering
*For any* set of banners, they should be orderable by position and the order should persist.
**Validates: Requirements 13.7**

### Property 42: Banner Count Limit
*For any* shop, creating more than 10 banners should fail.
**Validates: Requirements 13.13**

### Property 43: Banner Auto-Deactivation
*For any* banner with an end date in the past, the banner should be automatically deactivated (not displayed on storefront).
**Validates: Requirements 13.14**

## Error Handling

### Client-Side Errors
- **Form Validation**: Display inline errors for invalid inputs (empty required fields, invalid formats)
- **Network Errors**: Show toast notifications with retry options
- **Cart Errors**: Display inventory-related errors when adding items exceeds stock
- **Image Upload Errors**: Show specific error messages for file size/format issues

### Server-Side Errors
- **Authentication Errors**: Return 401 for unauthenticated requests to protected endpoints
- **Authorization Errors**: Return 403 when user doesn't own the shop/product
- **Not Found Errors**: Return 404 for non-existent shops/products
- **Validation Errors**: Return 400 with specific field errors
- **Conflict Errors**: Return 409 for duplicate slugs

### Error Response Format
```typescript
interface ErrorResponse {
  error: string;           // Error code (e.g., "SLUG_EXISTS")
  message: string;         // Human-readable message
  field?: string;          // Field that caused the error
  details?: unknown;       // Additional error details
}
```

## Testing Strategy

### Unit Tests
- Product validation functions (name length, price validation, inventory validation)
- Slug generation and uniqueness checking
- Cart total calculation
- WhatsApp message generation
- Image position management

### Property-Based Tests
Using a property-based testing library (e.g., fast-check for TypeScript), each correctness property above should be implemented as a property test with minimum 100 iterations.

**Test Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with: **Feature: ecommerce-product-management, Property {number}: {property_text}**

### Integration Tests
- Product CRUD operations via Convex
- Shop creation and configuration
- Banner management
- API endpoint responses
- Cart persistence across page reloads

### E2E Tests
- Complete product creation flow
- Storefront browsing and filtering
- Add to cart and checkout flow
- Banner carousel functionality
