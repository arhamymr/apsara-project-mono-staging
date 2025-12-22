# Blog Backend Integration

## Overview
The blog system has been fully integrated with the backend API. The frontend now fetches blog posts from the Go backend via the Next.js API routes.

## Architecture

### Backend (Go)
- **Endpoint**: `/api/v1/blogs` - List blogs with pagination
- **Endpoint**: `/api/v1/blogs/:slug` - Get individual blog post
- **Authentication**: API Key required (Bearer token)
- **Location**: `apps/backend/internal/handler/api_hub.go`

### Frontend (Next.js)

#### API Routes
- **`apps/web/app/api/blogs/route.ts`** - Proxy for listing blogs
  - Forwards requests to backend with API key
  - Handles pagination (page, limit)
  - Caches responses for 60 seconds

- **`apps/web/app/api/blogs/[slug]/route.ts`** - Proxy for individual blog posts
  - Fetches blog by slug from backend
  - Caches responses for 60 seconds

#### Custom Hook
- **`apps/web/hooks/useBlog.ts`** - React Query hooks
  - `useBlogs(page, limit)` - Fetch paginated blog list
  - `useBlog(slug)` - Fetch individual blog post
  - Automatic caching and refetching

#### Pages
- **`apps/web/app/blog/page.tsx`** - Blog listing page
  - Uses `useBlogs()` hook
  - Displays loading skeletons
  - Shows error state
  - Renders blog cards with metadata

- **`apps/web/app/blog/[slug]/blog-detail-client.tsx`** - Blog detail page
  - Uses `useBlog(slug)` hook
  - Displays full blog content
  - Shows author, date, tags
  - Loading and error states

## Data Flow

```
Frontend Page
    ↓
useBlogs/useBlog Hook (React Query)
    ↓
/api/blogs or /api/blogs/[slug] (Next.js Route)
    ↓
Backend API (/api/v1/blogs)
    ↓
Convex Database
```

## Environment Variables Required

```env
API_URL=http://localhost:1234  # Backend URL
API_HUB_KEY=your-api-key       # API key for backend authentication
```

## Features

- ✅ Server-side caching (60 seconds)
- ✅ Client-side caching (React Query)
- ✅ Loading states with skeletons
- ✅ Error handling
- ✅ Pagination support
- ✅ Responsive design
- ✅ SEO metadata (via Next.js metadata API)

## Usage

### List Blogs
```tsx
import { useBlogs } from '@/hooks/useBlog';

export function BlogList() {
  const { data, isLoading, error } = useBlogs(1, 10);
  // Use data.data for blog posts
}
```

### Get Single Blog
```tsx
import { useBlog } from '@/hooks/useBlog';

export function BlogDetail({ slug }: { slug: string }) {
  const { data: post, isLoading, error } = useBlog(slug);
  // Use post for blog content
}
```

## Integration Points

1. **Home Page Blog Section** - `apps/web/components/home/sections/Blog.tsx`
   - Already refactored to use React Query
   - Fetches from `/api/blogs`

2. **Blog Listing Page** - `/blog`
   - Displays all published blogs
   - Pagination ready

3. **Blog Detail Page** - `/blog/[slug]`
   - Shows full blog post with content
   - Author and date information

## Next Steps

- Add pagination controls to blog listing page
- Implement search/filter functionality
- Add related posts section
- Implement blog comments (if needed)
- Add social sharing features
