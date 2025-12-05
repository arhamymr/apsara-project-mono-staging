import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new blog post
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if slug already exists
    const existing = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) throw new Error("Slug already exists");

    const now = Date.now();
    return await ctx.db.insert("blogs", {
      ...args,
      authorId: userId,
      createdAt: now,
      updatedAt: now,
      publishedAt: args.status === "published" ? now : undefined,
    });
  },
});

// Get a single blog by ID
export const getById = query({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get a single blog by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// List all published blogs
export const listPublished = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("blogs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit);
  },
});

// List blogs by author (requires auth)
export const listByAuthor = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const limit = args.limit ?? 50;
    return await ctx.db
      .query("blogs")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .order("desc")
      .take(limit);
  },
});

// Update a blog post
export const update = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const blog = await ctx.db.get(args.id);
    if (!blog) throw new Error("Blog not found");
    if (blog.authorId !== userId) throw new Error("Not authorized");

    // Check slug uniqueness if changing
    if (args.slug && args.slug !== blog.slug) {
      const existing = await ctx.db
        .query("blogs")
        .withIndex("by_slug", (q) => q.eq("slug", args.slug))
        .first();
      if (existing) throw new Error("Slug already exists");
    }

    const { id, ...updates } = args;
    const now = Date.now();

    // Set publishedAt if publishing for first time
    const publishedAt =
      args.status === "published" && blog.status !== "published"
        ? now
        : blog.publishedAt;

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: now,
      publishedAt,
    });
  },
});

// Delete a blog post
export const remove = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const blog = await ctx.db.get(args.id);
    if (!blog) throw new Error("Blog not found");
    if (blog.authorId !== userId) throw new Error("Not authorized");

    return await ctx.db.delete(args.id);
  },
});

// Search blogs by title or content
export const search = query({
  args: {
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const searchTerm = args.query.toLowerCase();

    const blogs = await ctx.db
      .query("blogs")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();

    return blogs
      .filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm) ||
          blog.content.toLowerCase().includes(searchTerm)
      )
      .slice(0, limit);
  },
});
