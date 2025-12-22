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
    color: v.optional(
      v.union(
        v.literal("default"),
        v.literal("red"),
        v.literal("orange"),
        v.literal("yellow"),
        v.literal("green"),
        v.literal("blue"),
        v.literal("purple"),
        v.literal("pink")
      )
    ),
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
    assigneeId: v.optional(v.id("users")),
    position: v.number(),
    isArchived: v.optional(v.boolean()),
    archivedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_column", ["columnId"])
    .index("by_assignee", ["assigneeId"])
    .index("by_archived", ["isArchived"]),

  kanbanComments: defineTable({
    cardId: v.id("kanbanCards"),
    userId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_card", ["cardId"])
    .index("by_user", ["userId"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    message: v.string(),
    icon: v.optional(v.string()),
    actionUrl: v.optional(v.string()),
    actionText: v.optional(v.string()),
    metadata: v.optional(v.any()), // For storing additional data like invitationId
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_user_read", ["userId", "readAt"]),

  // Organization tables
  organizations: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_creator", ["createdBy"]),

  organizationMembers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer")
    ),
    joinedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_org_user", ["organizationId", "userId"]),

  invitations: defineTable({
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.union(
      v.literal("admin"),
      v.literal("editor"),
      v.literal("viewer")
    ),
    invitedBy: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("cancelled")
    ),
    createdAt: v.number(),
    respondedAt: v.optional(v.number()),
  })
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"])
    .index("by_org_email", ["organizationId", "email"])
    .index("by_status", ["status"]),

  sharedResources: defineTable({
    organizationId: v.id("organizations"),
    resourceType: v.union(
      v.literal("kanbanBoard"),
      v.literal("note"),
      v.literal("chatSession"),
      v.literal("artifact"),
      v.literal("leadPipeline"),
      v.literal("blog"),
      v.literal("shop")
    ),
    resourceId: v.string(),
    sharedBy: v.id("users"),
    sharedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_resource", ["resourceType", "resourceId"])
    .index("by_org_resource", ["organizationId", "resourceType", "resourceId"]),

  // Lead Management tables
  leadPipelines: defineTable({
    name: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  leadColumns: defineTable({
    pipelineId: v.id("leadPipelines"),
    title: v.string(),
    color: v.string(), // Tailwind class like 'bg-blue-500/10'
    dotColor: v.string(), // Tailwind class like 'bg-blue-500'
    position: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_pipeline", ["pipelineId"]),

  leads: defineTable({
    columnId: v.id("leadColumns"),
    name: v.string(),
    company: v.optional(v.string()),
    value: v.optional(v.number()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    owner: v.optional(v.string()),
    source: v.optional(v.string()),
    notes: v.optional(v.string()),
    position: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_column", ["columnId"]),

  // API Hub tables
  apiKeys: defineTable({
    userId: v.id("users"),
    name: v.string(),
    keyHash: v.string(), // SHA-256 hash of the actual key
    keyPrefix: v.string(), // First 8 chars for display (e.g., "pk_live_")
    permissions: v.array(v.string()), // e.g., ["blogs:read", "leads:write"]
    rateLimit: v.number(), // Requests per minute
    isActive: v.boolean(),
    lastUsedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_key_hash", ["keyHash"])
    .index("by_active", ["isActive"]),

  apiUsageLogs: defineTable({
    apiKeyId: v.id("apiKeys"),
    userId: v.id("users"),
    endpoint: v.string(),
    method: v.string(),
    statusCode: v.number(),
    responseTimeMs: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_api_key", ["apiKeyId"])
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"])
    .index("by_user_created", ["userId", "createdAt"]),

  // E-commerce tables
  shops: defineTable({
    ownerId: v.id("users"),
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    whatsappNumber: v.string(),
    currency: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_slug", ["slug"]),

  products: defineTable({
    shopId: v.id("shops"),
    slug: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    inventory: v.number(),
    status: v.union(v.literal("draft"), v.literal("active"), v.literal("archived")),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_shop", ["shopId"])
    .index("by_shop_slug", ["shopId", "slug"])
    .index("by_shop_status", ["shopId", "status"])
    .index("by_status", ["status"]),

  productImages: defineTable({
    productId: v.id("products"),
    url: v.string(),
    position: v.number(),
    isPrimary: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_product_position", ["productId", "position"]),

  banners: defineTable({
    shopId: v.id("shops"),
    title: v.string(),
    subtitle: v.optional(v.string()),
    imageUrl: v.string(),
    linkUrl: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    position: v.number(),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_shop", ["shopId"])
    .index("by_shop_status", ["shopId", "status"])
    .index("by_shop_position", ["shopId", "position"]),
});

export default schema;