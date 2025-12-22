# Products API Documentation

This API provides public access to e-commerce products for external integrations.

## Base URL

```
http://localhost:1234/api/products
```

## Endpoints

### 1. List Products

Get a paginated list of active products for a shop.

**Endpoint:** `GET /api/products/[shopname]`

**Query Parameters:**
- `limit` (optional): Number of products to return (1-100, default: 10)
- `offset` (optional): Number of products to skip (default: 0)
- `category` (optional): Filter by category
- `tags` (optional): Comma-separated list of tags to filter by

**Example Request:**
```bash
curl "http://localhost:1234/api/products/myshop?limit=20&offset=0&category=electronics"
```

**Example Response:**
```json
{
  "products": [
    {
      "id": "j97...",
      "slug": "product-name",
      "name": "Product Name",
      "description": "Product description",
      "price": 2999,
      "inventory": 50,
      "status": "active",
      "category": "electronics",
      "tags": ["featured", "new"],
      "images": [
        {
          "url": "https://...",
          "position": 0,
          "isPrimary": true
        }
      ],
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### 2. Get Single Product

Get detailed information about a specific product.

**Endpoint:** `GET /api/products/[shopname]/[productSlug]`

**Example Request:**
```bash
curl "http://localhost:1234/api/products/myshop/product-name"
```

**Example Response:**
```json
{
  "id": "j97...",
  "slug": "product-name",
  "name": "Product Name",
  "description": "Product description",
  "price": 2999,
  "inventory": 50,
  "status": "active",
  "category": "electronics",
  "tags": ["featured", "new"],
  "images": [
    {
      "url": "https://...",
      "position": 0,
      "isPrimary": true
    },
    {
      "url": "https://...",
      "position": 1,
      "isPrimary": false
    }
  ],
  "createdAt": 1234567890,
  "updatedAt": 1234567890
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "INVALID_LIMIT",
  "message": "Limit must be between 1 and 100"
}
```

### 404 Not Found
```json
{
  "error": "SHOP_NOT_FOUND",
  "message": "Shop not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "INTERNAL_ERROR",
  "message": "Internal server error",
  "details": "Error details..."
}
```

## CORS Support

All endpoints support CORS and can be accessed from any origin. The following headers are included:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Notes

- Only products with status "active" are returned
- Prices are in the smallest currency unit (e.g., cents for USD)
- Images are returned as URLs
- All timestamps are Unix timestamps in milliseconds
- The API does not require authentication
