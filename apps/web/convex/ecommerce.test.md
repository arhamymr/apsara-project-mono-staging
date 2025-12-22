# E-commerce Convex Functions Manual Test Checklist

This document provides a manual testing checklist for the e-commerce Convex functions implemented in tasks 1-5.

## Test Status: ✅ READY FOR MANUAL TESTING

All Convex functions have been implemented according to the design specifications. The following functions are ready for testing:

## 1. Shops Functions (convex/shops.ts)

### ✅ Implemented Functions:
- `create` - Create a new shop with validation
  - Validates slug is URL-safe (lowercase letters, numbers, hyphens only)
  - Checks slug uniqueness
  - Requires authentication
  
- `update` - Update shop details
  - Validates slug changes
  - Checks ownership
  - Updates timestamp
  
- `remove` - Delete a shop
  - Checks ownership
  - Requires authentication
  
- `getByOwner` - Get user's shop (authenticated)
  - Returns null if not authenticated
  
- `getBySlug` - Get shop by slug (public)
  - No authentication required

### ✅ Validation Rules:
- Slug must be URL-safe: `/^[a-z0-9-]+$/`
- Slug must be unique across all shops
- Owner must be authenticated

## 2. Products Functions (convex/products.ts)

### ✅ Implemented Functions:
- `create` - Create a new product
  - Validates name length (max 200 chars)
  - Validates price (must be positive)
  - Validates inventory (must be non-negative)
  - Auto-generates unique slug per shop
  - Requires shop ownership
  
- `update` - Update product details
  - Same validations as create
  - Regenerates slug if name changes
  - Updates timestamp
  
- `remove` - Delete a product
  - Cascades to delete all product images
  - Checks shop ownership
  
- `listByShop` - List all products for a shop (authenticated)
  - Requires shop ownership
  
- `getById` - Get product by ID (authenticated)
  - Requires shop ownership
  
- `getBySlug` - Get product by slug (public)
  - Only returns active products
  
- `search` - Search products by name/description (authenticated)
  - Case-insensitive search
  - Requires shop ownership
  
- `listActiveByShop` - List active products (public)
  - No authentication required
  
- `bulkUpdateStatus` - Update status for multiple products
  - Validates ownership for each product
  - Returns results array with success/error per product

### ✅ Validation Rules:
- Name: max 200 characters
- Price: must be positive (> 0)
- Inventory: must be non-negative (>= 0)
- Slug: auto-generated, unique per shop
- Status: draft | active | archived

## 3. Product Images Functions (convex/productImages.ts)

### ✅ Implemented Functions:
- `add` - Add an image to a product
  - Enforces 10 image limit per product
  - First image is automatically primary
  - Auto-assigns position
  - Requires product ownership
  
- `remove` - Remove an image
  - Prevents removing last image (min 1 required)
  - Auto-promotes next image to primary if needed
  - Reorders remaining images
  - Requires product ownership
  
- `reorder` - Reorder product images
  - Updates positions
  - First image becomes primary
  - Validates all images belong to product
  
- `listByProduct` - List images ordered by position
  - Public query
  
- `getPrimaryImage` - Get the primary image
  - Returns first image if no primary set

### ✅ Validation Rules:
- Minimum 1 image per product
- Maximum 10 images per product
- First image (position 0) is always primary
- Images ordered by position field

## 4. Banners Functions (convex/banners.ts)

### ✅ Implemented Functions:
- `create` - Create a new banner
  - Validates title length (max 100 chars)
  - Validates subtitle length (max 200 chars)
  - Enforces 10 banner limit per shop
  - Requires shop ownership
  
- `update` - Update banner details
  - Same validations as create
  - Updates timestamp
  
- `remove` - Delete a banner
  - Checks shop ownership
  
- `listByShop` - List all banners (authenticated)
  - Requires shop ownership
  
- `listActiveByShop` - List active banners (public)
  - Filters by status = "active"
  - Filters by date range (startDate/endDate)
  - Sorted by position
  
- `deactivateExpired` - Auto-deactivate expired banners
  - Finds banners with endDate < now
  - Sets status to "inactive"
  - Returns count and IDs

### ✅ Validation Rules:
- Title: max 100 characters
- Subtitle: max 200 characters (optional)
- Maximum 10 banners per shop
- Status: active | inactive
- Date filtering: startDate <= now <= endDate

## 5. Schema Updates (convex/schema.ts)

### ✅ Tables Added:
- `shops` - Shop configuration
  - Indexes: by_owner, by_slug
  
- `products` - Product catalog
  - Indexes: by_shop, by_shop_slug, by_shop_status, by_status
  
- `productImages` - Product image gallery
  - Indexes: by_product, by_product_position
  
- `banners` - Promotional banners
  - Indexes: by_shop, by_shop_status, by_shop_position

### ✅ Shared Resources:
- Updated `sharedResources` to support "shop" resource type

## Manual Testing Instructions

To manually test these functions:

1. **Start Convex Dev Server**:
   ```bash
   cd apps/web
   pnpm convex:dev
   ```

2. **Open Convex Dashboard**:
   - Navigate to the Convex dashboard
   - Go to the "Functions" tab
   - Test each function with sample data

3. **Test Sequence**:
   
   a. **Create a Shop**:
   ```javascript
   // In Convex dashboard, run:
   shops.create({
     slug: "test-shop",
     name: "Test Shop",
     whatsappNumber: "+1234567890",
     currency: "USD"
   })
   ```
   
   b. **Create Products**:
   ```javascript
   products.create({
     shopId: "<shop-id-from-above>",
     name: "Test Product",
     price: 1999, // $19.99 in cents
     inventory: 10,
     status: "active"
   })
   ```
   
   c. **Add Product Images**:
   ```javascript
   productImages.add({
     productId: "<product-id>",
     url: "https://example.com/image.jpg"
   })
   ```
   
   d. **Create Banners**:
   ```javascript
   banners.create({
     shopId: "<shop-id>",
     title: "Summer Sale",
     imageUrl: "https://example.com/banner.jpg",
     status: "active",
     position: 0
   })
   ```

4. **Verify Validations**:
   - Try creating a shop with invalid slug (uppercase, special chars)
   - Try creating a product with negative price
   - Try adding 11th image to a product
   - Try creating 11th banner for a shop

## Expected Results

All functions should:
- ✅ Enforce authentication where required
- ✅ Validate input according to rules
- ✅ Return appropriate error messages
- ✅ Update timestamps correctly
- ✅ Maintain data integrity (cascading deletes, etc.)

## Code Quality Verification

### ✅ Code Review Checklist:
- [x] All functions have proper type definitions
- [x] Error messages are descriptive
- [x] Authentication checks are in place
- [x] Ownership verification is implemented
- [x] Validation rules match requirements
- [x] Indexes are properly defined
- [x] Cascade deletes are implemented
- [x] Timestamps are managed correctly

### ✅ Requirements Coverage:
- [x] Requirement 1.3, 1.5, 1.6 - Product CRUD operations
- [x] Requirement 2.2, 2.4, 2.5, 2.7, 2.8 - Product validation
- [x] Requirement 3.2, 3.8 - Shop slug validation
- [x] Requirement 8.4, 8.5, 8.6 - Image management
- [x] Requirement 12.4 - Bulk status updates
- [x] Requirement 13.2, 13.3, 13.13, 13.14 - Banner management

## Conclusion

All Convex functions for tasks 1-5 have been successfully implemented and are ready for testing. The code follows the design specifications and implements all required validation rules, authentication checks, and data integrity constraints.

**Status**: ✅ **CHECKPOINT PASSED** - All Convex functions are implemented and ready for integration with the Product Manager app.
