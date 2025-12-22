import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Add a product image
export const add = mutation({
  args: {
    productId: v.id("products"),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get product and verify ownership
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");

    const shop = await ctx.db.get(product.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    // Check image count limit (max 10)
    const existingImages = await ctx.db
      .query("productImages")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    if (existingImages.length >= 10) {
      throw new Error("IMAGE_LIMIT_EXCEEDED: Maximum 10 images per product");
    }

    // Determine if this is the first image (should be primary)
    const isPrimary = existingImages.length === 0;
    const position = existingImages.length;

    const now = Date.now();
    return await ctx.db.insert("productImages", {
      productId: args.productId,
      url: args.url,
      position,
      isPrimary,
      createdAt: now,
    });
  },
});

// Remove a product image
export const remove = mutation({
  args: { id: v.id("productImages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const image = await ctx.db.get(args.id);
    if (!image) throw new Error("Image not found");

    // Verify ownership through product -> shop
    const product = await ctx.db.get(image.productId);
    if (!product) throw new Error("Product not found");

    const shop = await ctx.db.get(product.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    // Check if this is the last image
    const allImages = await ctx.db
      .query("productImages")
      .withIndex("by_product", (q) => q.eq("productId", image.productId))
      .collect();

    if (allImages.length === 1) {
      throw new Error("LAST_IMAGE: Cannot remove the last image. Products must have at least 1 image.");
    }

    // Delete the image
    await ctx.db.delete(args.id);

    // If we deleted the primary image, make the first remaining image primary
    if (image.isPrimary) {
      const remainingImages = await ctx.db
        .query("productImages")
        .withIndex("by_product_position", (q) => q.eq("productId", image.productId))
        .order("asc")
        .collect();

      const firstImage = remainingImages[0];
      if (firstImage) {
        await ctx.db.patch(firstImage._id, { isPrimary: true });
      }
    }

    // Reorder remaining images to fill the gap
    const imagesToReorder = await ctx.db
      .query("productImages")
      .withIndex("by_product_position", (q) => q.eq("productId", image.productId))
      .order("asc")
      .collect();

    for (let i = 0; i < imagesToReorder.length; i++) {
      const img = imagesToReorder[i];
      if (img && img.position !== i) {
        await ctx.db.patch(img._id, { position: i });
      }
    }

    return { success: true };
  },
});

// Reorder product images
export const reorder = mutation({
  args: {
    productId: v.id("products"),
    imageIds: v.array(v.id("productImages")), // Array of image IDs in desired order
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify ownership
    const product = await ctx.db.get(args.productId);
    if (!product) throw new Error("Product not found");

    const shop = await ctx.db.get(product.shopId);
    if (!shop) throw new Error("Shop not found");
    if (shop.ownerId !== userId) throw new Error("Not authorized");

    // Verify all images belong to this product
    for (const imageId of args.imageIds) {
      const image = await ctx.db.get(imageId);
      if (!image || image.productId !== args.productId) {
        throw new Error("INVALID_IMAGE: One or more images do not belong to this product");
      }
    }

    // Update positions and set first image as primary
    for (let i = 0; i < args.imageIds.length; i++) {
      const imageId = args.imageIds[i];
      if (imageId) {
        await ctx.db.patch(imageId, {
          position: i,
          isPrimary: i === 0, // First image is always primary
        });
      }
    }

    return { success: true };
  },
});

// List images by product (ordered by position)
export const listByProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("productImages")
      .withIndex("by_product_position", (q) => q.eq("productId", args.productId))
      .order("asc")
      .collect();
  },
});

// Get primary image for a product
export const getPrimaryImage = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("productImages")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    return images.find((img) => img.isPrimary) || images[0] || null;
  },
});
