import { v } from "convex/values";
import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// Helper function to generate URL-safe slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Helper function to ensure slug uniqueness per shop
async function ensureUniqueSlug(
  ctx: QueryCtx | MutationCtx,
  shopId: Id<"shops">,
  baseSlug: string,
  excludeProductId?: Id<"products">
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await ctx.db
      .query("products")
      .withIndex("by_shop_slug", (q) => q.eq("shopId", shopId).eq("slug", slug))
      .first();

    // If no existing product or it's the same product we're updating, slug is unique
    if (!existing || (excludeProductId && existing._id === excludeProductId)) {
      return slug;
    }

    // Try next variant
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Create a new product
export const create = mutation({
  args: {
    shopId: v.id("shops"),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    inventory: v.number(),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("archived")),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify shop ownership
    const shop = await ctx.db.get(args.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    // Validate name length (max 200 characters)
    if (args.name.length > 200) {
      throw new Error("NAME_TOO_LONG: Product name must be 200 characters or less");
    }

    // Validate price (must be positive)
    if (args.price <= 0) {
      throw new Error("INVALID_PRICE: Product price must be positive");
    }

    // Validate inventory (must be non-negative)
    if (args.inventory < 0) {
      throw new Error("INVALID_INVENTORY: Product inventory must be non-negative");
    }

    // Generate unique slug
    const baseSlug = generateSlug(args.name);
    const slug = await ensureUniqueSlug(ctx, args.shopId, baseSlug);

    const now = Date.now();
    return await ctx.db.insert("products", {
      ...args,
      slug,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a product
export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    inventory: v.optional(v.number()),
    status: v.optional(v.union(v.literal("draft"), v.literal("active"), v.literal("archived"))),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");

    // Verify shop ownership
    const shop = await ctx.db.get(product.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    // Validate name length if changing
    if (args.name !== undefined && args.name.length > 200) {
      throw new Error("NAME_TOO_LONG: Product name must be 200 characters or less");
    }

    // Validate price if changing
    if (args.price !== undefined && args.price <= 0) {
      throw new Error("INVALID_PRICE: Product price must be positive");
    }

    // Validate inventory if changing
    if (args.inventory !== undefined && args.inventory < 0) {
      throw new Error("INVALID_INVENTORY: Product inventory must be non-negative");
    }

    const { id, ...updates } = args;
    const now = Date.now();

    // If name is changing, regenerate slug
    let slug = product.slug;
    if (args.name !== undefined && args.name !== product.name) {
      const baseSlug = generateSlug(args.name);
      slug = await ensureUniqueSlug(ctx, product.shopId, baseSlug, product._id);
    }

    return await ctx.db.patch(id, {
      ...updates,
      slug,
      updatedAt: now,
    });
  },
});

// Delete a product
export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const product = await ctx.db.get(args.id);
    if (!product) throw new Error("Product not found");

    // Verify shop ownership
    const shop = await ctx.db.get(product.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    // Cascade delete: Remove all associated product images
    const images = await ctx.db
      .query("productImages")
      .withIndex("by_product", (q) => q.eq("productId", args.id))
      .collect();

    for (const image of images) {
      await ctx.db.delete(image._id);
    }

    return await ctx.db.delete(args.id);
  },
});

// List products by shop (requires auth)
export const listByShop = query({
  args: { shopId: v.id("shops") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify shop ownership
    const shop = await ctx.db.get(args.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    return await ctx.db
      .query("products")
      .withIndex("by_shop", (q) => q.eq("shopId", args.shopId))
      .collect();
  },
});

// Get product by ID (requires auth)
export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const product = await ctx.db.get(args.id);
    if (!product) return null;

    // Verify shop ownership
    const shop = await ctx.db.get(product.shopId);
    if (!shop) return null;
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    return product;
  },
});

// Get product by slug (public - only returns active products)
export const getBySlug = query({
  args: {
    shopId: v.id("shops"),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_shop_slug", (q) => q.eq("shopId", args.shopId).eq("slug", args.slug))
      .first();

    // Only return active products for public access
    if (!product || product.status !== "active") {
      return null;
    }

    return product;
  },
});

// Search products (requires auth)
export const search = query({
  args: {
    shopId: v.id("shops"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify shop ownership
    const shop = await ctx.db.get(args.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    // Get all products for the shop
    const products = await ctx.db
      .query("products")
      .withIndex("by_shop", (q) => q.eq("shopId", args.shopId))
      .collect();

    // Filter by search query (case-insensitive search in name and description)
    const searchLower = args.query.toLowerCase();
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(searchLower);
      const descriptionMatch = product.description?.toLowerCase().includes(searchLower) ?? false;
      return nameMatch || descriptionMatch;
    });
  },
});

// List active products by shop (public)
export const listActiveByShop = query({
  args: { shopId: v.id("shops") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_shop_status", (q) => q.eq("shopId", args.shopId).eq("status", "active"))
      .collect();
  },
});

// Bulk update product status
export const bulkUpdateStatus = mutation({
  args: {
    productIds: v.array(v.id("products")),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("archived")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    const results = [];

    for (const productId of args.productIds) {
      const product = await ctx.db.get(productId);
      if (!product) {
        results.push({ id: productId, success: false, error: "Product not found" });
        continue;
      }

      // Verify shop ownership
      const shop = await ctx.db.get(product.shopId);
      if (!shop || shop.ownerId !== userId) {
        results.push({ id: productId, success: false, error: "Not authorized" });
        continue;
      }

      // Update status
      await ctx.db.patch(productId, {
        status: args.status,
        updatedAt: now,
      });

      results.push({ id: productId, success: true });
    }

    return results;
  },
});
