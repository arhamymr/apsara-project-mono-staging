import { NextRequest, NextResponse } from 'next/server';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shopname: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const { shopname } = await params;

    // Get pagination parameters
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Get filter parameters
    const category = searchParams.get('category');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'INVALID_LIMIT', message: 'Limit must be between 1 and 100' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: 'INVALID_OFFSET', message: 'Offset must be non-negative' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Get shop by slug
    const shop = await fetchQuery(api.shops.getBySlug, { slug: shopname });

    if (!shop) {
      return NextResponse.json(
        { error: 'SHOP_NOT_FOUND', message: 'Shop not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Get all active products for the shop
    let products = await fetchQuery(api.products.listActiveByShop, {
      shopId: shop._id as Id<'shops'>,
    });

    // Apply category filter
    if (category) {
      products = products.filter((p) => p.category === category);
    }

    // Apply tags filter (product must have at least one of the specified tags)
    if (tags && tags.length > 0) {
      products = products.filter((p) => {
        if (!p.tags || p.tags.length === 0) return false;
        return tags.some((tag) => p.tags?.includes(tag));
      });
    }

    // Get total count before pagination
    const total = products.length;

    // Apply pagination
    const paginatedProducts = products.slice(offset, offset + limit);

    // Fetch images for each product
    const productsWithImages = await Promise.all(
      paginatedProducts.map(async (product) => {
        const images = await fetchQuery(api.productImages.listByProduct, {
          productId: product._id as Id<'products'>,
        });

        return {
          id: product._id,
          slug: product.slug,
          name: product.name,
          description: product.description,
          price: product.price,
          inventory: product.inventory,
          status: product.status,
          category: product.category,
          tags: product.tags,
          images: images.map((img) => ({
            url: img.url,
            position: img.position,
            isPrimary: img.isPrimary,
          })),
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        };
      })
    );

    return NextResponse.json(
      {
        products: productsWithImages,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Products API error:', errorMessage);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Internal server error', details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
