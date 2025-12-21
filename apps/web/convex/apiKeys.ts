import { v } from "convex/values";
import { query, mutation, action, internalMutation, internalQuery } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// Generate a secure random API key
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'pk_live_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Simple hash function for API keys (in production, use crypto.subtle)
async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// List all API keys for the current user
export const listApiKeys = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Don't return the hash, just the display info
    return keys.map(key => ({
      _id: key._id,
      name: key.name,
      keyPrefix: key.keyPrefix,
      permissions: key.permissions,
      rateLimit: key.rateLimit,
      isActive: key.isActive,
      lastUsedAt: key.lastUsedAt,
      expiresAt: key.expiresAt,
      createdAt: key.createdAt,
    }));
  },
});

// Get usage stats for the current user
export const getUsageStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const now = Date.now();
    const todayStart = now - (now % 86400000); // Start of today
    const monthStart = now - (30 * 86400000); // 30 days ago

    // Get usage logs for this user
    const logs = await ctx.db
      .query("apiUsageLogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const requestsToday = logs.filter(l => l.createdAt >= todayStart).length;
    const requestsThisMonth = logs.filter(l => l.createdAt >= monthStart).length;

    // Calculate top endpoints
    const endpointCounts: Record<string, number> = {};
    logs.forEach(log => {
      const key = `${log.method} ${log.endpoint}`;
      endpointCounts[key] = (endpointCounts[key] || 0) + 1;
    });

    const topEndpoints = Object.entries(endpointCounts)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate error rate
    const errorCount = logs.filter(l => l.statusCode >= 400).length;
    const errorRate = logs.length > 0 ? (errorCount / logs.length) * 100 : 0;

    return {
      totalKeys: keys.length,
      activeKeys: keys.filter(k => k.isActive).length,
      requestsToday,
      requestsThisMonth,
      topEndpoints,
      errorRate: Math.round(errorRate * 100) / 100,
    };
  },
});

// Internal mutation to create API key (called from action)
export const createApiKeyInternal = internalMutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    keyHash: v.string(),
    keyPrefix: v.string(),
    permissions: v.array(v.string()),
    rateLimit: v.number(),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("apiKeys", {
      userId: args.userId,
      name: args.name,
      keyHash: args.keyHash,
      keyPrefix: args.keyPrefix,
      permissions: args.permissions,
      rateLimit: args.rateLimit,
      isActive: true,
      expiresAt: args.expiresAt,
      createdAt: Date.now(),
    });
  },
});

// Action to create a new API key (returns the actual key only once)
export const createApiKey = action({
  args: {
    name: v.string(),
    permissions: v.array(v.string()),
    rateLimit: v.number(),
    expiresInDays: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ id: Id<"apiKeys">; key: string; name: string; keyPrefix: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Generate the key
    const apiKey = generateApiKey();
    const keyHash = await hashApiKey(apiKey);
    const keyPrefix = apiKey.substring(0, 12) + '...';

    const expiresAt = args.expiresInDays 
      ? Date.now() + (args.expiresInDays * 86400000)
      : undefined;

    // Store the key
    const keyId: Id<"apiKeys"> = await ctx.runMutation(internal.apiKeys.createApiKeyInternal, {
      userId,
      name: args.name,
      keyHash,
      keyPrefix,
      permissions: args.permissions,
      rateLimit: args.rateLimit,
      expiresAt,
    });

    // Return the actual key (only shown once)
    return {
      id: keyId,
      key: apiKey,
      name: args.name,
      keyPrefix,
    };
  },
});

// Toggle API key active status
export const toggleApiKey = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const key = await ctx.db.get(args.id);
    if (!key || key.userId !== userId) throw new Error("Not authorized");

    return await ctx.db.patch(args.id, {
      isActive: !key.isActive,
    });
  },
});

// Delete an API key
export const deleteApiKey = mutation({
  args: { id: v.id("apiKeys") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const key = await ctx.db.get(args.id);
    if (!key || key.userId !== userId) throw new Error("Not authorized");

    return await ctx.db.delete(args.id);
  },
});

// Update API key settings
export const updateApiKey = mutation({
  args: {
    id: v.id("apiKeys"),
    name: v.optional(v.string()),
    permissions: v.optional(v.array(v.string())),
    rateLimit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const key = await ctx.db.get(args.id);
    if (!key || key.userId !== userId) throw new Error("Not authorized");

    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Internal query to validate API key (used by HTTP endpoints)
export const validateApiKeyInternal = internalQuery({
  args: { keyHash: v.string() },
  handler: async (ctx, args) => {
    const key = await ctx.db
      .query("apiKeys")
      .withIndex("by_key_hash", (q) => q.eq("keyHash", args.keyHash))
      .unique();

    if (!key) return null;
    if (!key.isActive) return null;
    if (key.expiresAt && key.expiresAt < Date.now()) return null;

    return {
      _id: key._id,
      userId: key.userId,
      permissions: key.permissions,
      rateLimit: key.rateLimit,
    };
  },
});

// Internal mutation to log API usage
export const logApiUsage = internalMutation({
  args: {
    apiKeyId: v.id("apiKeys"),
    userId: v.id("users"),
    endpoint: v.string(),
    method: v.string(),
    statusCode: v.number(),
    responseTimeMs: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Update last used timestamp on the key
    await ctx.db.patch(args.apiKeyId, {
      lastUsedAt: Date.now(),
    });

    // Log the usage
    return await ctx.db.insert("apiUsageLogs", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get recent API usage logs
export const getRecentLogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const limit = args.limit || 50;

    const logs = await ctx.db
      .query("apiUsageLogs")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);

    return logs;
  },
});
