# Ecommerce App Architecture

## System Overview

The Ecommerce app is a full-stack application built with Next.js, React, and Convex. It consists of three main layers:

1. **Frontend** - Dashboard (desktop app) and Storefront (public website)
2. **Backend** - Convex database and serverless functions
3. **API** - RESTful endpoints for external integrations

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
├──────────────────────────┬──────────────────────────────────┤
│   Dashboard (Desktop)    │    Storefront (Public Web)       │
│   /layouts/os/apps/      │    /app/ecommerce/[shopname]/    │
│   ecommerce/             │                                   │
│                          │                                   │
│   - Shop Management      │    - Product Browsing            │
│   - Product CRUD         │    - Shopping Cart               │
│   - Image Management     │    - WhatsApp Checkout           │
│   - Banner Management    │    - Search & Filter             │
│   - Settings             │    - Responsive Design           │
└──────────────────────────┴──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Layer (Convex)                  │
├─────────────────────────────────────────────────────────────┤
│   Database Tables:                                           │
│   - shops              (shop configuration)                  │
│   - products           (product catalog)                     │
│   - productImages      (product photos)                      │
│   - banners            (promotional banners)                 │
│                                                              │
│   Serverless Functions:                                      │
│   - shops.ts           (shop CRUD)                          │
│   - products.ts        (product CRUD)                       │
│   - productImages.ts   (image management)                   │
│   - banners.ts         (banner CRUD)                        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (REST)                        │
├─────────────────────────────────────────────────────────────┤
│   /app/api/products/                                         │
│   - GET /[shopSlug]              (list products)            │
│   - GET /[shopSlug]/[productSlug] (get product)             │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Components**: Custom UI components from `@workspace/ui`
- **State Management**: React Context + Hooks
- **Real-time Data**: Convex React hooks

### Backend
- **Database**: Convex (serverless, real-time)
- **Functions**: Convex serverless functions
- **Schema**: TypeScript-based schema definitions
- **Authentication**: Convex auth integration

### API
- **Type**: RESTful
- **Format**: JSON
- **Endpoints**: Next.js API routes

## Data Model

### Entity Relationship Diagram

```
┌──────────────┐
│    Users     │
└──────┬───────┘
       │ 1
       │
       │ N
┌──────▼───────┐         ┌──────────────┐
│    Shops     │◄────────┤ Organizations│
└──────┬───────┘  N:M    └──────────────┘
       │ 1                (via sharing)
       │
       ├─────────────┬──────────────┐
       │ N           │ N            │ N
┌──────▼───────┐ ┌──▼──────────┐ ┌─▼────────┐
│   Products   │ │   Banners   │ │  Footer  │
└──────┬───────┘ └─────────────┘ └──────────┘
       │ 1                        (embedded)
       │
       │ N
┌──────▼──────────┐
│ Product Images  │
└─────────────────┘
```

### Table Schemas

#### Shops
```typescript
{
  _id: Id<"shops">,
  ownerId: Id<"users">,
  slug: string,              // Unique, indexed
  name: string,
  description?: string,
  logo?: string,
  whatsappNumber: string,
  currency: string,
  // Footer fields
  footerEmail?: string,
  footerPhone?: string,
  footerAddress?: string,
  footerFacebook?: string,
  footerInstagram?: string,
  footerTwitter?: string,
  footerLinkedin?: string,
  createdAt: number,
  updatedAt: number
}
```

#### Products
```typescript
{
  _id: Id<"products">,
  shopId: Id<"shops">,       // Indexed
  slug: string,              // Indexed
  name: string,
  description?: string,
  price: number,
  inventory: number,
  status: "draft" | "active" | "archived",
  category?: string,
  tags?: string[],
  createdAt: number,
  updatedAt: number
}
```

#### Product Images
```typescript
{
  _id: Id<"productImages">,
  productId: Id<"products">, // Indexed
  url: string,
  position: number,
  isPrimary: boolean,
  createdAt: number
}
```

#### Banners
```typescript
{
  _id: Id<"banners">,
  shopId: Id<"shops">,       // Indexed
  title: string,
  subtitle?: string,
  imageUrl: string,
  linkUrl?: string,
  status: "active" | "inactive",
  position: number,
  startDate?: number,
  endDate?: number,
  createdAt: number,
  updatedAt: number
}
```

## Component Architecture

### Dashboard Components

```
index.tsx (Main Dashboard)
├── ShopSettings
│   └── Form with validation
├── ProductCard
│   ├── ProductImage
│   └── ProductActions
├── CreateProductWindow
│   └── ProductForm
│       ├── DetailsTab
│       └── ValidationLogic
├── EditProductWindow
│   └── ProductForm
│       ├── DetailsTab
│       ├── ImagesTab
│       │   ├── ProductImageManager
│       │   └── ImageGallery
│       └── AdvancedTab
├── BannersWindow
│   └── BannerManager
│       ├── BannerCard
│       ├── CreateBannerWindow
│       └── EditBannerWindow
└── ApiHelperModal
    └── API Documentation
```

### Storefront Components

```
page.tsx (Shop Homepage)
├── StorefrontHeader
│   ├── Logo & Name
│   ├── SearchBar
│   ├── CategoryFilter
│   └── CartIcon
├── BannerCarousel
│   ├── BannerSlide[]
│   └── Navigation
├── ProductGrid
│   └── ProductCardWithImage[]
│       ├── ProductImage
│       ├── ProductInfo
│       └── AddToCartButton
├── CartDrawer
│   ├── CartItem[]
│   │   ├── ItemImage
│   │   ├── QuantityControls
│   │   └── RemoveButton
│   ├── Subtotal
│   └── CheckoutButton
└── StorefrontFooter
    ├── ShopInfo
    ├── ContactInfo
    └── SocialLinks

[productSlug]/page.tsx (Product Detail)
├── StorefrontHeader
├── ProductDetail
│   ├── ImageGallery
│   ├── ProductInfo
│   ├── QuantitySelector
│   └── AddToCartButton
├── CartDrawer
└── StorefrontFooter
```

## State Management

### Dashboard State

#### Window Context
```typescript
// Manages sub-windows for create/edit operations
const { 
  openSubWindow,
  closeWindow,
  windows,
  activeId 
} = useWindowContext();
```

#### Custom Hooks
```typescript
// hooks.ts
useMyShop()           // Current user's shop
useMyProducts()       // User's products
useSharedProducts()   // Organization shared products
useSearchProducts()   // Search results
useProductImages()    // Product images
useMyBanners()        // Shop banners
```

### Storefront State

#### Cart Context
```typescript
// components/cart-provider.tsx
const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  isOpen: false,
  addItem: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  openCart: () => {},
  closeCart: () => {}
});
```

#### Local State
```typescript
// Search and filter state
const [searchQuery, setSearchQuery] = useState('');
const [selectedCategory, setSelectedCategory] = useState('all');

// Filtered products (computed)
const filteredProducts = useMemo(() => {
  // Filter logic
}, [products, searchQuery, selectedCategory]);
```

## Data Flow

### Dashboard Flow

```
User Action
    │
    ▼
React Component
    │
    ▼
Convex Mutation
    │
    ▼
Database Update
    │
    ▼
Convex Subscription (useQuery)
    │
    ▼
Component Re-render
    │
    ▼
UI Update
```

### Storefront Flow

```
Page Load
    │
    ▼
Fetch Shop (useQuery)
    │
    ├─► Fetch Products (conditional)
    │
    └─► Fetch Banners (conditional)
    │
    ▼
Render Storefront
    │
    ▼
User Interaction
    │
    ├─► Search/Filter → Update State → Re-render
    │
    └─► Add to Cart → Update Context → Update localStorage
```

### Cart Flow

```
Add to Cart
    │
    ▼
Cart Context (addItem)
    │
    ├─► Update State
    │
    ├─► Save to localStorage
    │
    └─► Open Cart Drawer
    │
    ▼
Checkout
    │
    ▼
Format WhatsApp Message
    │
    ▼
Open WhatsApp
```

## API Architecture

### Endpoint Structure

```
/app/api/products/
├── [shopname]/
│   ├── route.ts           # GET /api/products/[shopname]
│   └── [productSlug]/
│       └── route.ts       # GET /api/products/[shopname]/[productSlug]
```

### Request Flow

```
HTTP Request
    │
    ▼
Next.js API Route
    │
    ▼
Convex Query
    │
    ▼
Database Fetch
    │
    ▼
Data Transformation
    │
    ▼
JSON Response
```

### Response Format

```typescript
// Success
{
  success: true,
  data: { ... },
  error: null
}

// Error
{
  success: false,
  data: null,
  error: "Error message"
}
```

## Security

### Authentication
- Dashboard: Requires authenticated user
- Storefront: Public access
- API: Public read access (future: API keys)

### Authorization
- Shop owners can manage their shops
- Organization members can view/edit shared shops
- Products inherit shop permissions

### Data Validation
- Input validation on client and server
- Type safety with TypeScript
- Convex schema validation

### XSS Prevention
- React auto-escapes content
- Sanitized user inputs
- Safe markdown rendering

## Performance Optimizations

### Frontend
- Code splitting (Next.js automatic)
- Image lazy loading
- Debounced search
- Memoized computed values
- Optimistic UI updates

### Backend
- Indexed database queries
- Efficient Convex subscriptions
- Minimal data fetching
- Cached query results

### Images
- Optimized image sizes
- WebP format support
- CDN delivery (if configured)
- Lazy loading

## Scalability Considerations

### Database
- Convex handles scaling automatically
- Indexed queries for performance
- Efficient data model

### Frontend
- Static generation where possible
- Client-side caching
- Efficient re-renders

### API
- Stateless design
- Cacheable responses
- Rate limiting (future)

## Error Handling

### Frontend Errors
- Try-catch blocks for async operations
- Error boundaries for React errors
- Toast notifications for user feedback
- Graceful degradation

### Backend Errors
- Convex error handling
- Validation errors
- Not found errors
- Server errors

### API Errors
- HTTP status codes
- Structured error responses
- Logging (future)

## Testing Strategy

### Unit Tests
- Component logic
- Utility functions
- Data transformations

### Integration Tests
- Convex functions
- API endpoints
- Component interactions

### E2E Tests
- User workflows
- Dashboard operations
- Storefront shopping flow

## Deployment

### Build Process
```bash
# Install dependencies
pnpm install

# Build application
pnpm build

# Deploy to Convex
npx convex deploy

# Deploy to hosting (Vercel, etc.)
# Automatic via git push
```

### Environment Variables
```
CONVEX_DEPLOYMENT=...
NEXT_PUBLIC_CONVEX_URL=...
```

## Future Enhancements

### Planned Features
- [ ] Payment gateway integration
- [ ] Order management system
- [ ] Inventory tracking
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] Product reviews
- [ ] Discount codes
- [ ] Multi-currency support
- [ ] Advanced search (filters, sorting)
- [ ] Product variants (size, color)

### API Enhancements
- [ ] Authentication with API keys
- [ ] Rate limiting
- [ ] Webhooks
- [ ] Bulk operations
- [ ] GraphQL endpoint

### Performance
- [ ] Image optimization service
- [ ] CDN integration
- [ ] Server-side caching
- [ ] Database query optimization

## Documentation

- **User Docs**: Available in Docs app (📖)
- **API Docs**: Available via Integrate button
- **Code Docs**: Inline comments and JSDoc
- **Architecture**: This document

## Related Documents

- `README.md` - Quick start guide
- `STOREFRONT_FOOTER_DEFAULTS.md` - Footer customization
- `ORGANIZATION_SHARING_GUIDE.md` - Sharing features
- `apps/web/app/api/products/README.md` - API documentation
- `apps/web/app/ecommerce/README.md` - Storefront guide
