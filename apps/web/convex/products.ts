import { v } from "convex/values";
import { query, mutation, QueryCtx, MutationCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// Helper function to check if user can access a shop (owner or org member)
async function canAccessShop(
  ctx: QueryCtx | MutationCtx,
  shopId: Id<"shops">,
  userId: Id<"users">
): Promise<boolean> {
  const shop = await ctx.db.get(shopId);
  if (!shop) return false;

  // Check if user is the owner
  if (shop.ownerId === userId) return true;

  // Check if shop is shared with any organization the user is a member of
  const sharedResources = await ctx.db
    .query("sharedResources")
    .withIndex("by_resource", (q) =>
      q.eq("resourceType", "shop").eq("resourceId", shopId)
    )
    .collect();

  for (const sharedResource of sharedResources) {
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", sharedResource.organizationId).eq("userId", userId)
      )
      .unique();

    if (membership) {
      // Any organization member can access (view/edit based on role)
      return true;
    }
  }

  return false;
}

// Helper function to check if user can edit a shop (owner or org editor/admin/owner)
async function canEditShop(
  ctx: QueryCtx | MutationCtx,
  shopId: Id<"shops">,
  userId: Id<"users">
): Promise<boolean> {
  const shop = await ctx.db.get(shopId);
  if (!shop) return false;

  // Check if user is the owner
  if (shop.ownerId === userId) return true;

  // Check if shop is shared with any organization where user has edit permissions
  const sharedResources = await ctx.db
    .query("sharedResources")
    .withIndex("by_resource", (q) =>
      q.eq("resourceType", "shop").eq("resourceId", shopId)
    )
    .collect();

  for (const sharedResource of sharedResources) {
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", sharedResource.organizationId).eq("userId", userId)
      )
      .unique();

    if (membership && (membership.role === "owner" || membership.role === "admin" || membership.role === "editor")) {
      return true;
    }
  }

  return false;
}

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

    // Check if user can edit this shop (owner or org member with edit permissions)
    const canEdit = await canEditShop(ctx, args.shopId, userId);
    if (!canEdit) throw new Error("Not authorized");

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
      lastModifiedBy: userId,
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

    // Check if user can edit this shop (owner or org member with edit permissions)
    const canEdit = await canEditShop(ctx, product.shopId, userId);
    if (!canEdit) throw new Error("Not authorized");

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
      lastModifiedBy: userId,
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

    // Check if user can edit this shop (owner or org member with edit permissions)
    const canEdit = await canEditShop(ctx, product.shopId, userId);
    if (!canEdit) throw new Error("Not authorized");

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

    // Check if user can access this shop (owner or org member)
    const canAccess = await canAccessShop(ctx, args.shopId, userId);
    if (!canAccess) throw new Error("Not authorized");

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

    // Check if user can access this shop (owner or org member)
    const canAccess = await canAccessShop(ctx, product.shopId, userId);
    if (!canAccess) throw new Error("Not authorized");

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

    // Check if user can access this shop (owner or org member)
    const canAccess = await canAccessShop(ctx, args.shopId, userId);
    if (!canAccess) throw new Error("Not authorized");

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

      // Check if user can edit this shop (owner or org member with edit permissions)
      const canEdit = await canEditShop(ctx, product.shopId, userId);
      if (!canEdit) {
        results.push({ id: productId, success: false, error: "Not authorized" });
        continue;
      }

      // Update status
      await ctx.db.patch(productId, {
        status: args.status,
        updatedAt: now,
        lastModifiedBy: userId,
      });

      results.push({ id: productId, success: true });
    }

    return results;
  },
});

// Get products from shared shops (for displaying shared products)
export const listFromSharedShops = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Get all organizations the user is a member of
    const memberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const orgIds = memberships.map((m) => m.organizationId);

    // Get all shared shop resources for these organizations
    const sharedShopIds: Id<"shops">[] = [];

    for (const orgId of orgIds) {
      // Use by_organization index and filter by resourceType
      const sharedResources = await ctx.db
        .query("sharedResources")
        .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
        .filter((q) => q.eq(q.field("resourceType"), "shop"))
        .collect();

      for (const resource of sharedResources) {
        const shop = await ctx.db.get(resource.resourceId as Id<"shops">);
        if (shop && shop.ownerId !== userId) {
          // Only include shops not owned by the user
          sharedShopIds.push(shop._id);
        }
      }
    }

    // Remove duplicates
    const uniqueShopIds = [...new Set(sharedShopIds)];

    // Get all products from these shops
    const products = [];
    for (const shopId of uniqueShopIds) {
      const shopProducts = await ctx.db
        .query("products")
        .withIndex("by_shop", (q) => q.eq("shopId", shopId))
        .collect();
      products.push(...shopProducts);
    }

    return products;
  },
});
