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
  { params }: { params: Promise<{ shopname: string; productSlug: string }> }
) {
  try {
    const { shopname, productSlug } = await params;

    // Get shop by slug
    const shop = await fetchQuery(api.shops.getBySlug, { slug: shopname });

    if (!shop) {
      return NextResponse.json(
        { error: 'SHOP_NOT_FOUND', message: 'Shop not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Get product by slug (only returns active products)
    const product = await fetchQuery(api.products.getBySlug, {
      shopId: shop._id as Id<'shops'>,
      slug: productSlug,
    });

    if (!product) {
      return NextResponse.json(
        { error: 'PRODUCT_NOT_FOUND', message: 'Product not found or not active' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Fetch product images
    const images = await fetchQuery(api.productImages.listByProduct, {
      productId: product._id as Id<'products'>,
    });

    // Return product with images
    const productWithImages = {
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

    return NextResponse.json(productWithImages, { headers: corsHeaders });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Product API error:', errorMessage);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Internal server error', details: errorMessage },
      { status: 500, headers: corsHeaders }
    );
  }
}
