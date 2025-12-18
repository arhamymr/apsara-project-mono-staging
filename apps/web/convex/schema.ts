import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  blogs: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    authorId: v.id("users"),
    status: v.union(v.literal("draft"), v.literal("published")),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    publishedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_author", ["authorId"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),
  
  chatSessions: defineTable({
    userId: v.id("users"),
    title: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),
  
  chatMessages: defineTable({
    sessionId: v.id("chatSessions"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    isStreaming: v.optional(v.boolean()),
    metadata: v.optional(v.object({
      appIntent: v.optional(v.object({
        type: v.string(),
        appId: v.string(),
        appName: v.string(),
      })),
    })),
    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),
  
  artifacts: defineTable({
    sessionId: v.id("chatSessions"),
    userId: v.id("users"),
    messageId: v.optional(v.id("chatMessages")), // Link to the message that generated this version
    name: v.string(),
    description: v.optional(v.string()),
    // Store files as a JSON string since Convex doesn't support dynamic object keys
    files: v.string(),
    version: v.optional(v.number()), // Version number for this artifact (auto-incremented per session)
    metadata: v.optional(v.object({
      framework: v.optional(v.string()),
      language: v.optional(v.string()),
      dependencies: v.optional(v.array(v.string())),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_session_version", ["sessionId", "version"])
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),

  notes: defineTable({
    title: v.string(),
    content: v.string(), // Lexical editor JSON state
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_updated", ["updatedAt"])
    .index("by_user_updated", ["userId", "updatedAt"]),

  kanbanBoards: defineTable({
    name: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  kanbanColumns: defineTable({
    boardId: v.id("kanbanBoards"),
    name: v.string(),
    position: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_board", ["boardId"]),

  kanbanCards: defineTable({
    columnId: v.id("kanbanColumns"),
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    position: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_column", ["columnId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    icon: v.optional(v.string()),
    actionUrl: v.optional(v.string()),
    actionText: v.optional(v.string()),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_user_read", ["userId", "readAt"]),
});

export default schema;