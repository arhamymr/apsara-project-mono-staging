/**
 * Documentation for the Ecommerce App
 */

import type { AppDocumentation } from '../../types';

export const ecommerceDocs: AppDocumentation = {
  id: 'ecommerce',
  name: 'Ecommerce',
  icon: '🛒',
  description: 'A complete ecommerce solution for managing your online store, products, and storefront.',
  categories: [
    {
      id: 'overview',
      name: 'Overview',
      order: 1,
      entries: [
        {
          id: 'introduction',
          title: 'Introduction to Ecommerce',
          slug: 'introduction',
          content: `The Ecommerce app is a comprehensive solution for creating and managing your online store. It provides both a dashboard for managing products and a public storefront for customers.

## Key Features

- **Shop Management**: Create and customize your online shop with branding
- **Product Management**: Add, edit, and organize products with images
- **Banner System**: Create promotional banners for your storefront
- **Shopping Cart**: Built-in cart functionality with WhatsApp checkout
- **Organization Sharing**: Share products across your organization
- **API Integration**: RESTful API for external integrations
- **Responsive Design**: Mobile-friendly storefront and dashboard

## Two Main Components

### 1. Dashboard (Desktop App)
The dashboard is where you manage your store:
- Create and configure your shop
- Add and edit products
- Upload product images
- Manage promotional banners
- Configure shop settings

- Access API documentation

### 2. Storefront (Public Website)
The storefront is your customer-facing online store:
- Browse products with search and filters
- View product details with image galleries
- Add items to cart
- Checkout via WhatsApp
- Responsive mobile design

## Getting Started

1. Click the 🛒 icon in your dock to open the Ecommerce dashboard
2. Create your shop with basic information
3. Add your first product
4. Visit your storefront at \`/ecommerce/[your-shop-slug]\`
`,
        },
      ],
    },
    {
      id: 'getting-started',
      name: 'Getting Started',
      order: 2,
      entries: [
        {
          id: 'creating-shop',
          title: 'Creating Your Shop',
          slug: 'creating-shop',
          content: `Set up your online shop with branding and essential information.

## Initial Setup

When you first open the Ecommerce app, you'll be prompted to create your shop. If not, click the **Shop** button in the toolbar.

## Required Information

### Shop Name
Your shop's display name that appears on the storefront.

**Example**: "Artisan Crafts Store"

### Shop Slug
A URL-friendly identifier for your shop. This becomes part of your storefront URL.

**Example**: \`artisan-crafts\` → \`/ecommerce/artisan-crafts\`

**Rules**:
- Lowercase letters, numbers, and hyphens only
- Must be unique across the platform
- Cannot be changed after creation

### WhatsApp Number
Customer orders are sent to this WhatsApp number for checkout.

**Format**: Include country code (e.g., +1234567890)


## Optional Information

### Shop Description
A brief description of your shop that appears on the storefront.

### Shop Logo
Upload a logo image (recommended: 200x200px, PNG or JPG).

### Currency
Select your shop's currency (default: USD). Options include:
- USD - US Dollar
- EUR - Euro
- GBP - British Pound
- INR - Indian Rupee
- And more...

### Footer Information
Customize your storefront footer with:
- **Email**: Contact email address
- **Phone**: Contact phone number
- **Address**: Physical store address
- **Social Media**: Facebook, Instagram, Twitter, LinkedIn links

## Editing Shop Settings

To update your shop settings later:
1. Click the **Shop** button in the toolbar
2. Modify any fields
3. Click **Save Changes**

## Shop Status

Once created, your shop is immediately active. You'll see:
- Shop name and logo in the header
- Active status indicator (green badge)
- Your storefront URL with quick access buttons
- Product count and currency display
`,
        },
        {
          id: 'adding-products',
          title: 'Adding Products',
          slug: 'adding-products',
          content: `Learn how to add and manage products in your store.

## Creating a Product

1. Click the **New Product** button (or press \`N\`)
2. Fill in the product details
3. Click **Create Product**

## Product Fields

### Required Fields

**Product Name**
The display name of your product.


**Price**
Product price in your shop's currency. Enter numbers only (e.g., 29.99).

**Inventory**
Available stock quantity. Set to 0 to mark as out of stock.

**Status**
- **Draft**: Not visible on storefront (for products in progress)
- **Active**: Visible and purchasable on storefront
- **Archived**: Hidden but preserved in database

### Optional Fields

**Description**
Detailed product description. Supports markdown formatting.

**Category**
Group products by category (e.g., "Electronics", "Clothing", "Home & Garden").

**Tags**
Add searchable tags separated by commas (e.g., "organic, handmade, eco-friendly").

**Product Slug**
Auto-generated URL-friendly identifier. Can be customized.

## Product Images

After creating a product, add images:

1. Click on the product card to edit
2. Go to the **Images** tab
3. Click **Upload Image** or paste an image URL
4. Set one image as primary (shown in product listings)
5. Reorder images by dragging

**Image Tips**:
- Recommended size: 800x800px or larger
- Supported formats: JPG, PNG, WebP
- First image is automatically set as primary
- Use high-quality images for best results

## Editing Products

Click any product card to open the edit window with three tabs:
- **Details**: Edit product information
- **Images**: Manage product photos
- **Advanced**: Additional settings

## Deleting Products

1. Open the product edit window
2. Scroll to the bottom
3. Click **Delete Product**
4. Confirm deletion

**Note**: Deleted products cannot be recovered.
`,
        },
      ],
    },
    {
      id: 'features',
      name: 'Features',
      order: 3,
      entries: [
        {
          id: 'banners',
          title: 'Managing Banners',
          slug: 'banners',
          content: `Create promotional banners to highlight products, sales, or announcements on your storefront.

## Creating a Banner

1. Click the **Banners** button in the toolbar
2. Click **Create Banner**
3. Fill in banner details
4. Click **Create**

## Banner Fields

### Title (Required)
Main heading text displayed on the banner.

**Example**: "Summer Sale - 50% Off!"

### Subtitle (Optional)
Secondary text for additional context.

**Example**: "Limited time offer on selected items"

### Image URL (Required)
URL of the banner background image.

**Recommended Size**: 1920x600px for full-width banners

### Link URL (Optional)
Where users go when clicking the banner (e.g., product page, category).

**Example**: \`/ecommerce/your-shop/product-slug\`

### Status
- **Active**: Visible on storefront
- **Inactive**: Hidden from storefront

### Position
Display order (lower numbers appear first). Drag to reorder in the banner list.

### Date Range (Optional)
Schedule banners to appear only during specific dates:
- **Start Date**: When banner becomes visible
- **End Date**: When banner automatically hides

## Banner Carousel

Multiple active banners automatically create a carousel on your storefront:
- Auto-advances every 5 seconds
- Manual navigation with arrow buttons
- Dot indicators show position
- Responsive on mobile devices

## Best Practices

- Use high-quality, eye-catching images
- Keep text concise and readable
- Test banner links before publishing
- Schedule seasonal promotions in advance
- Limit to 3-5 active banners for best performance


## Editing Banners

1. Open the Banners window
2. Click on any banner card
3. Modify fields
4. Click **Update**

## Deleting Banners

1. Open the banner edit window
2. Click **Delete Banner**
3. Confirm deletion
`,
        },
        {
          id: 'storefront',
          title: 'Storefront Features',
          slug: 'storefront',
          content: `Your storefront is the customer-facing part of your ecommerce shop.

## Accessing Your Storefront

Your storefront URL: \`/ecommerce/[your-shop-slug]\`

**Quick Access**:
- Click the external link icon next to your shop URL in the dashboard
- Copy the full URL with the copy button
- Share the link with customers

## Storefront Components

### Header
- Shop logo and name
- Search bar for finding products
- Category filter dropdown
- Shopping cart icon with item count

### Banner Carousel
- Rotating promotional banners
- Auto-advance with manual controls
- Click banners to navigate to linked pages

### Product Grid
- Responsive grid layout (1-4 columns based on screen size)
- Product images with hover effects
- Product name, price, and stock status
- "Add to Cart" buttons
- "View Details" links

### Product Details Page
- Large image gallery with zoom
- Full product description
- Price and availability
- Quantity selector
- Add to cart functionality
- Related products (if available)

### Shopping Cart
- Slide-out drawer from the right
- List of cart items with images
- Quantity adjustment (+/- buttons)
- Remove item option
- Subtotal calculation
- WhatsApp checkout button

### Footer
- Shop information
- Contact details (email, phone, address)
- Social media links
- Copyright notice


## Search and Filtering

### Search
Customers can search products by:
- Product name
- Description text
- Real-time results as they type

### Category Filter
- Dropdown showing all product categories
- "All Categories" option to view everything
- Automatically populated from your products

### Results Display
Shows count of filtered products vs. total products.

## Shopping Cart Behavior

### Adding Items
- Click "Add to Cart" on product cards or detail pages
- Cart drawer opens automatically
- Toast notification confirms addition
- Cart icon updates with item count

### Cart Persistence
- Cart data stored in browser localStorage
- Persists across page refreshes
- Separate cart per shop
- Clears when switching shops

### Quantity Limits
- Maximum quantity based on available inventory
- Prevents over-ordering out-of-stock items
- Visual feedback when limit reached

## WhatsApp Checkout

When customers click "Checkout via WhatsApp":

1. Cart contents formatted as a message
2. Opens WhatsApp with pre-filled message
3. Message includes:
   - Shop name
   - Each product with quantity and price
   - Total amount
   - Storefront link

**Example Message**:
\`\`\`
Hello! I'd like to order from [Shop Name]:

• Product A x2 - $50.00
• Product B x1 - $25.00

Total: $75.00

Storefront: [link]
\`\`\`

## Mobile Responsiveness

The storefront is fully responsive:
- **Mobile**: Single column, touch-friendly
- **Tablet**: 2-3 columns, optimized spacing
- **Desktop**: 4 columns, full features
`,
        },
        {
          id: 'organization-sharing',
          title: 'Organization Sharing',
          slug: 'organization-sharing',
          content: `Share your shop and products with organization members for collaborative management.

## What is Organization Sharing?

Organization sharing allows you to:
- Share your entire shop with team members
- Grant access to products across your organization
- Collaborate on product management
- View shared products from other members

## Sharing Your Shop

1. Ensure you're part of an organization
2. In the dashboard, click the **Share** button next to the Shop button
3. Select your organization
4. Choose permission level:
   - **View**: Members can see but not edit
   - **Edit**: Members can modify products and settings
5. Click **Share**

## Viewing Shared Products

Shared products appear in your dashboard with a special indicator:
- Badge showing "Shared"
- Different visual styling
- Read-only access (unless granted edit permissions)

## Managing Shared Access

### Check Current Shares
1. Click the **Share** button
2. View list of organizations with access
3. See permission levels

### Revoke Access
1. Open the share dialog
2. Click **Remove** next to the organization
3. Confirm removal

## Permissions

### View Permission
Members can:
- See shop details
- View products and images
- Access product information
- Cannot edit or delete

### Edit Permission
Members can:
- All view permissions
- Edit product details
- Add/remove product images
- Change product status
- Cannot delete shop or products owned by others

## Best Practices

- Only share with trusted organization members
- Use view permission for most team members
- Grant edit permission to managers only
- Regularly review shared access
- Communicate changes with your team
`,
        },
      ],
    },
    {
      id: 'api-reference',
      name: 'API Reference',
      order: 4,
      entries: [
        {
          id: 'api-overview',
          title: 'API Overview',
          slug: 'api-overview',
          content: `The Ecommerce API provides RESTful endpoints for integrating your shop with external applications.

## Accessing API Documentation

1. Click the **Integrate** button in the dashboard
2. View interactive API documentation
3. Copy example code snippets
4. Test endpoints directly

## Base URL

All API endpoints are relative to:
\`\`\`
https://your-domain.com/api/products
\`\`\`

## Authentication

Currently, the API is public for read operations. Future versions will include:
- API key authentication
- Rate limiting
- Webhook support

## Available Endpoints

### List Products by Shop
\`\`\`
GET /api/products/[shopSlug]
\`\`\`

Returns all active products for a shop.

### Get Single Product
\`\`\`
GET /api/products/[shopSlug]/[productSlug]
\`\`\`

Returns detailed information for a specific product.

## Response Format

All responses are in JSON format:

\`\`\`json
{
  "success": true,
  "data": { ... },
  "error": null
}
\`\`\`

## Error Handling

Error responses include:
- HTTP status code
- Error message
- Error type

**Example Error**:
\`\`\`json
{
  "success": false,
  "data": null,
  "error": "Shop not found"
}
\`\`\`

## Rate Limits

Currently no rate limits. Future implementation will include:
- 100 requests per minute per IP
- 1000 requests per hour per IP
- Headers indicating limit status
`,
        },
        {
          id: 'api-endpoints',
          title: 'API Endpoints',
          slug: 'api-endpoints',
          content: `Detailed documentation for all available API endpoints.

## List Products

**Endpoint**: \`GET /api/products/[shopSlug]\`

**Description**: Retrieve all active products for a shop.

**Parameters**:
- \`shopSlug\` (path, required): Shop identifier

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "shop": {
      "_id": "...",
      "name": "My Shop",
      "slug": "my-shop",
      "currency": "USD"
    },
    "products": [
      {
        "_id": "...",
        "name": "Product Name",
        "slug": "product-name",
        "description": "Product description",
        "price": 29.99,
        "inventory": 100,
        "status": "active",
        "category": "Electronics",
        "tags": ["new", "featured"],
        "images": [
          {
            "url": "https://...",
            "isPrimary": true,
            "position": 0
          }
        ]
      }
    ]
  }
}
\`\`\`

**Status Codes**:
- \`200\`: Success
- \`404\`: Shop not found
- \`500\`: Server error

## Get Product Details

**Endpoint**: \`GET /api/products/[shopSlug]/[productSlug]\`

**Description**: Retrieve detailed information for a specific product.

**Parameters**:
- \`shopSlug\` (path, required): Shop identifier
- \`productSlug\` (path, required): Product identifier

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "product": {
      "_id": "...",
      "name": "Product Name",
      "slug": "product-name",
      "description": "Detailed description...",
      "price": 29.99,
      "inventory": 100,
      "status": "active",
      "category": "Electronics",
      "tags": ["new", "featured"],
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    },
    "images": [
      {
        "_id": "...",
        "url": "https://...",
        "isPrimary": true,
        "position": 0
      }
    ],
    "shop": {
      "name": "My Shop",
      "currency": "USD"
    }
  }
}
\`\`\`

**Status Codes**:
- \`200\`: Success
- \`404\`: Product or shop not found
- \`500\`: Server error

## Example Usage

### JavaScript/Fetch
\`\`\`javascript
// List all products
const response = await fetch('/api/products/my-shop');
const { data } = await response.json();
console.log(data.products);

// Get single product
const productResponse = await fetch('/api/products/my-shop/product-slug');
const { data: productData } = await productResponse.json();
console.log(productData.product);
\`\`\`

### cURL
\`\`\`bash
# List products
curl https://your-domain.com/api/products/my-shop

# Get product
curl https://your-domain.com/api/products/my-shop/product-slug
\`\`\`

### Python
\`\`\`python
import requests

# List products
response = requests.get('https://your-domain.com/api/products/my-shop')
data = response.json()
products = data['data']['products']

# Get product
product_response = requests.get('https://your-domain.com/api/products/my-shop/product-slug')
product_data = product_response.json()
product = product_data['data']['product']
\`\`\`
`,
        },
      ],
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      order: 5,
      entries: [
        {
          id: 'common-issues',
          title: 'Common Issues',
          slug: 'common-issues',
          content: `Solutions to frequently encountered problems.

## Shop Creation Issues

### "Slug already exists"
**Problem**: The shop slug you chose is already taken.

**Solution**: 
- Try a different slug
- Add numbers or your business name
- Use hyphens to separate words

### WhatsApp Number Invalid
**Problem**: WhatsApp number format not accepted.

**Solution**:
- Include country code (e.g., +1 for US)
- Remove spaces and special characters
- Format: +1234567890

## Product Issues

### Images Not Uploading
**Problem**: Product images fail to upload or display.

**Solutions**:
- Check image URL is publicly accessible
- Verify image format (JPG, PNG, WebP)
- Ensure image size is under 5MB
- Try a different image hosting service

### Product Not Showing on Storefront
**Problem**: Product created but not visible to customers.

**Checklist**:
- Product status is "Active" (not Draft or Archived)
- Inventory is greater than 0
- Shop is properly configured
- Clear browser cache and refresh

### Price Not Displaying Correctly
**Problem**: Product price shows wrong amount or format.

**Solution**:
- Check shop currency setting
- Verify price is a valid number
- Don't include currency symbols in price field
- Use decimal point (.) not comma (,)

## Cart and Checkout Issues

### Cart Not Persisting
**Problem**: Cart items disappear after page refresh.

**Solutions**:
- Enable browser localStorage
- Check browser privacy settings
- Disable private/incognito mode
- Clear browser cache and try again

### WhatsApp Checkout Not Working
**Problem**: WhatsApp button doesn't open or message is incorrect.

**Checklist**:
- WhatsApp number is correctly formatted
- WhatsApp is installed (mobile) or WhatsApp Web is accessible
- Browser allows opening external apps
- Check popup blocker settings

## Banner Issues

### Banner Not Displaying
**Problem**: Banner created but not showing on storefront.

**Checklist**:
- Banner status is "Active"
- Current date is within banner date range (if set)
- Image URL is valid and accessible
- Clear browser cache

### Banner Image Distorted
**Problem**: Banner image appears stretched or cropped incorrectly.

**Solution**:
- Use recommended size: 1920x600px
- Maintain 16:9 or similar aspect ratio
- Optimize image before uploading
- Test on different screen sizes

## Performance Issues

### Slow Storefront Loading
**Problem**: Storefront takes long to load.

**Solutions**:
- Optimize product images (compress before uploading)
- Limit number of active banners to 3-5
- Reduce number of products per page
- Check internet connection

### Dashboard Lag
**Problem**: Dashboard feels slow or unresponsive.

**Solutions**:
- Close unused browser tabs
- Clear browser cache
- Reduce number of products displayed
- Use search to find specific products

## API Issues

### 404 Not Found
**Problem**: API endpoint returns 404 error.

**Solutions**:
- Verify shop slug is correct
- Check product slug spelling
- Ensure shop and product exist
- Review API documentation for correct endpoint format

### CORS Errors
**Problem**: Cross-origin request blocked.

**Solution**:
- API is designed for same-origin requests
- For external integrations, contact support
- Use server-side requests instead of client-side

## Getting Help

If you continue experiencing issues:

1. Check the API documentation in the Integrate section
2. Review the verification documents in the dashboard
3. Contact support with:
   - Description of the issue
   - Steps to reproduce
   - Screenshots if applicable
   - Browser and device information
`,
        },
      ],
    },
  ],
};
