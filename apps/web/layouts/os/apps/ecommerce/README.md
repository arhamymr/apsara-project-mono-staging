# Ecommerce App Documentation

## Overview

The Ecommerce app is a complete online store solution with two main components:

1. **Dashboard** (`/layouts/os/apps/ecommerce/`) - Desktop app for managing your store
2. **Storefront** (`/app/ecommerce/[shopname]/`) - Public-facing online store

## Quick Start

1. Open the Ecommerce app from the dock (🛒 icon)
2. Create your shop with basic information
3. Add products with images
4. Visit your storefront at `/ecommerce/[your-shop-slug]`

## Key Features

- ✅ Shop management with branding
- ✅ Product management with multiple images
- ✅ Banner carousel for promotions
- ✅ Shopping cart with WhatsApp checkout
- ✅ Organization sharing for team collaboration
- ✅ RESTful API for integrations
- ✅ Responsive mobile design

## Documentation

Full documentation is available in the **Docs app** (📖 icon in dock):

### Getting Started
- Creating Your Shop
- Adding Products

### Features
- Managing Banners
- Storefront Features
- Organization Sharing

### API Reference
- API Overview
- API Endpoints

### Troubleshooting
- Common Issues

## File Structure

### Dashboard (`/layouts/os/apps/ecommerce/`)
```
index.tsx              # Main dashboard component
create.tsx             # Create product window
edit.tsx               # Edit product window
banners.tsx            # Banner management
banner-create.tsx      # Create banner window
banner-edit.tsx        # Edit banner window
types.ts               # TypeScript interfaces
hooks.ts               # Custom React hooks
components/
  ├── product-form.tsx
  ├── product-card.tsx
  ├── product-image-manager.tsx
  ├── image-gallery.tsx
  ├── shop-settings.tsx
  ├── banner-form.tsx
  ├── banner-manager.tsx
  └── api-helper-modal.tsx
```

### Storefront (`/app/ecommerce/[shopname]/`)
```
page.tsx               # Main storefront page
[productSlug]/
  └── page.tsx         # Product detail page
components/
  ├── storefront-header.tsx
  ├── storefront-footer.tsx
  ├── banner-carousel.tsx
  ├── product-grid.tsx
  ├── product-card-with-image.tsx
  ├── product-detail.tsx
  ├── search-filter.tsx
  ├── cart-drawer.tsx
  ├── cart-item.tsx
  └── checkout-button.tsx
```

### Backend (`/convex/`)
```
shops.ts               # Shop CRUD operations
products.ts            # Product CRUD operations
productImages.ts       # Product image management
banners.ts             # Banner CRUD operations
schema.ts              # Database schema
```

### API (`/app/api/products/`)
```
[shopname]/
  ├── route.ts         # List products endpoint
  └── [productSlug]/
      └── route.ts     # Get product endpoint
```

## Database Schema

### Shops Table
- `_id`: Unique identifier
- `ownerId`: User who created the shop
- `slug`: URL-friendly identifier
- `name`: Shop display name
- `description`: Shop description
- `logo`: Logo image URL
- `whatsappNumber`: Contact number for orders
- `currency`: Shop currency (USD, EUR, etc.)
- `footer*`: Footer customization fields
- `createdAt`, `updatedAt`: Timestamps

### Products Table
- `_id`: Unique identifier
- `shopId`: Reference to shop
- `slug`: URL-friendly identifier
- `name`: Product name
- `description`: Product description
- `price`: Product price
- `inventory`: Available stock
- `status`: draft | active | archived
- `category`: Product category
- `tags`: Array of tags
- `createdAt`, `updatedAt`: Timestamps

### Product Images Table
- `_id`: Unique identifier
- `productId`: Reference to product
- `url`: Image URL
- `position`: Display order
- `isPrimary`: Primary image flag
- `createdAt`: Timestamp

### Banners Table
- `_id`: Unique identifier
- `shopId`: Reference to shop
- `title`: Banner title
- `subtitle`: Banner subtitle
- `imageUrl`: Banner image URL
- `linkUrl`: Click destination URL
- `status`: active | inactive
- `position`: Display order
- `startDate`, `endDate`: Optional date range
- `createdAt`, `updatedAt`: Timestamps

## API Endpoints

### List Products
```
GET /api/products/[shopSlug]
```
Returns all active products for a shop with images.

### Get Product
```
GET /api/products/[shopSlug]/[productSlug]
```
Returns detailed product information with images.

## Cart System

The shopping cart uses browser localStorage for persistence:

```typescript
interface CartState {
  shopId: string;
  items: CartItem[];
  updatedAt: number;
}

interface CartItem {
  productId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  maxQuantity: number;
}
```

## Organization Sharing

Shops and products can be shared with organization members:

- Share entire shop with view or edit permissions
- Shared products appear in dashboard with indicator
- Manage access through share dialog
- Permissions: view (read-only) or edit (full access)

## WhatsApp Integration

Checkout sends formatted order to WhatsApp:

```
Hello! I'd like to order from [Shop Name]:

• Product A x2 - $50.00
• Product B x1 - $25.00

Total: $75.00

Storefront: [link]
```

## Development

### Adding New Features

1. Update schema in `convex/schema.ts`
2. Add Convex functions in appropriate file
3. Create/update React components
4. Update TypeScript types in `types.ts`
5. Test in both dashboard and storefront

### Testing

- Dashboard: Open Ecommerce app from dock
- Storefront: Visit `/ecommerce/[shop-slug]`
- API: Use Integrate button for interactive docs

## Related Documentation

- `STOREFRONT_FOOTER_DEFAULTS.md` - Footer customization guide
- `ORGANIZATION_SHARING_GUIDE.md` - Organization sharing details
- `apps/web/app/api/products/README.md` - API documentation
- `apps/web/app/ecommerce/STOREFRONT_VERIFICATION.md` - Storefront testing

## Support

For issues or questions:
1. Check the Troubleshooting section in Docs app
2. Review verification documents
3. Check API documentation in Integrate section
