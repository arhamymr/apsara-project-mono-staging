# Ecommerce Storefront

## Overview

The storefront is the customer-facing part of the ecommerce system. It provides a complete shopping experience with product browsing, cart management, and WhatsApp checkout.

## URL Structure

```
/ecommerce/[shopname]              # Shop homepage
/ecommerce/[shopname]/[productSlug] # Product detail page
```

## Components

### Main Pages

#### Shop Homepage (`page.tsx`)
- Displays all active products
- Banner carousel
- Search and category filtering
- Shopping cart integration

#### Product Detail Page (`[productSlug]/page.tsx`)
- Large image gallery
- Full product description
- Add to cart functionality
- Quantity selector

### Header (`components/storefront-header.tsx`)
- Shop logo and name
- Search bar
- Category filter dropdown
- Cart icon with item count

### Banner Carousel (`components/banner-carousel.tsx`)
- Auto-rotating banners
- Manual navigation controls
- Click-through to linked pages
- Responsive design

### Product Grid (`components/product-grid.tsx`)
- Responsive grid layout (1-4 columns)
- Product cards with images
- Add to cart buttons
- Out of stock indicators

### Product Card (`components/product-card-with-image.tsx`)
- Product image with hover effect
- Product name and price
- Stock status
- Quick add to cart

### Product Detail (`components/product-detail.tsx`)
- Image gallery with zoom
- Full description
- Price and availability
- Quantity selector
- Add to cart button

### Shopping Cart (`components/cart-drawer.tsx`)
- Slide-out drawer from right
- Cart items list
- Quantity adjustment
- Remove items
- Subtotal calculation
- WhatsApp checkout button

### Cart Item (`components/cart-item.tsx`)
- Product image and name
- Price display
- Quantity controls (+/-)
- Remove button
- Subtotal per item

### Checkout Button (`components/checkout-button.tsx`)
- Formats cart as WhatsApp message
- Opens WhatsApp with pre-filled order
- Handles mobile and desktop

### Footer (`components/storefront-footer.tsx`)
- Shop information
- Contact details
- Social media links
- Copyright notice

### Search & Filter (`components/search-filter.tsx`)
- Real-time search
- Category filtering
- Results count display

## Features

### Search
- Searches product names and descriptions
- Real-time results as you type
- Case-insensitive matching

### Category Filtering
- Dropdown with all categories
- "All Categories" option
- Auto-populated from products

### Shopping Cart
- Persistent across page refreshes (localStorage)
- Separate cart per shop
- Quantity limits based on inventory
- Visual feedback for actions

### WhatsApp Checkout
- Formats order details
- Includes product names, quantities, prices
- Adds total amount
- Includes storefront link
- Opens WhatsApp app or web

### Responsive Design
- **Mobile**: Single column, touch-friendly
- **Tablet**: 2-3 columns
- **Desktop**: 4 columns, full features

## Data Flow

### Loading Shop Data
```typescript
// Fetch shop by slug
const shop = useQuery(api.shops.getBySlug, { slug: shopSlug });

// Fetch active products
const products = useQuery(
  api.products.listActiveByShop,
  shop ? { shopId: shop._id } : 'skip'
);

// Fetch active banners
const banners = useQuery(
  api.banners.listActiveByShop,
  shop ? { shopId: shop._id } : 'skip'
);
```

### Cart Management
```typescript
// Cart context provides:
const { 
  items,           // Current cart items
  itemCount,       // Total items in cart
  addItem,         // Add item to cart
  updateQuantity,  // Update item quantity
  removeItem,      // Remove item from cart
  clearCart,       // Clear all items
  openCart,        // Open cart drawer
  closeCart        // Close cart drawer
} = useCart();
```

### Product Images
```typescript
// Images fetched separately per product
const images = useQuery(
  api.productImages.listByProduct,
  { productId: product._id }
);

// Primary image for listings
const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
```

## Cart Storage

Cart data is stored in browser localStorage:

```typescript
// Storage key format
const CART_KEY = `cart_${shopId}`;

// Cart structure
interface CartState {
  shopId: string;
  items: CartItem[];
  updatedAt: number;
}
```

## Loading States

### Shop Loading
Shows skeleton UI while fetching shop data.

### Shop Not Found
Displays friendly error message with link to home.

### Products Loading
Shows skeleton grid while fetching products.

### No Products
Displays empty state with encouragement message.

## Error Handling

### Shop Not Found (404)
- Friendly error message
- Shop name displayed
- Link back to home

### API Errors
- Generic error message
- Retry button
- Maintains user's cart

### Image Loading Errors
- Fallback placeholder image
- Graceful degradation

## Performance Optimizations

### Image Loading
- Lazy loading for product images
- Optimized image sizes
- WebP format support

### Data Fetching
- Conditional queries (skip when no shop)
- Efficient Convex subscriptions
- Minimal re-renders

### Cart Operations
- Debounced localStorage writes
- Optimistic UI updates
- Efficient state management

## Styling

Uses Tailwind CSS with custom design system:

- **Colors**: Theme-aware (light/dark mode)
- **Spacing**: Consistent padding/margins
- **Typography**: Readable font sizes
- **Shadows**: Subtle depth effects
- **Animations**: Smooth transitions

## Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly
- Focus indicators

## Mobile Considerations

### Touch Targets
- Minimum 44x44px for buttons
- Adequate spacing between elements
- Large tap areas for cart controls

### Viewport
- Responsive meta tag
- Fluid typography
- Flexible images

### Performance
- Optimized images for mobile
- Minimal JavaScript
- Fast initial load

## Integration with Dashboard

The storefront displays data managed in the dashboard:

- Shop settings (name, logo, description)
- Products (name, price, images, status)
- Banners (title, image, link)
- Footer content (contact info, social links)

## Testing Checklist

### Shop Display
- [ ] Shop name and logo display correctly
- [ ] Shop description shows (if set)
- [ ] Currency displays properly
- [ ] Footer information appears

### Products
- [ ] All active products visible
- [ ] Product images load correctly
- [ ] Prices display in correct currency
- [ ] Out of stock items marked correctly

### Search & Filter
- [ ] Search returns relevant results
- [ ] Category filter works
- [ ] Results count updates
- [ ] Clear search works

### Cart
- [ ] Add to cart works
- [ ] Quantity controls work
- [ ] Remove item works
- [ ] Cart persists on refresh
- [ ] Cart icon shows count

### Checkout
- [ ] WhatsApp button works
- [ ] Message format is correct
- [ ] Total calculates properly
- [ ] Opens WhatsApp app/web

### Responsive
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] Touch interactions work

### Banners
- [ ] Banners display correctly
- [ ] Carousel auto-advances
- [ ] Manual navigation works
- [ ] Banner links work

## Related Files

- Dashboard: `/layouts/os/apps/ecommerce/`
- API: `/app/api/products/`
- Backend: `/convex/shops.ts`, `/convex/products.ts`
- Cart Provider: `/app/ecommerce/components/cart-provider.tsx`

## Documentation

Full documentation available in the Docs app (📖):
- Storefront Features
- Shopping Cart
- WhatsApp Checkout
- Troubleshooting
