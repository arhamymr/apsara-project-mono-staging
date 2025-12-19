import { query, mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Helper function to check if user can access a chat session
 * Returns access level: "owner", "edit", "view", or "none"
 */
async function checkSessionAccess(
  ctx: QueryCtx,
  sessionId: Id<"chatSessions">,
  userId: Id<"users">
): Promise<"owner" | "edit" | "view" | "none"> {
  const session = await ctx.db.get(sessionId);
  if (!session) return "none";

  // Check if user is the owner
  if (session.userId === userId) return "owner";

  // Check if session is shared with any organization the user is a member of
  const sharedResources = await ctx.db
    .query("sharedResources")
    .withIndex("by_resource", (q) =>
      q.eq("resourceType", "chatSession").eq("resourceId", sessionId)
    )
    .collect();

  if (sharedResources.length === 0) return "none";

  // Check user's membership in each organization
  let highestAccess: "edit" | "view" | "none" = "none";

  for (const sharedResource of sharedResources) {
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_org_user", (q) =>
        q.eq("organizationId", sharedResource.organizationId).eq("userId", userId)
      )
      .unique();

    if (membership) {
      if (membership.role === "owner" || membership.role === "admin" || membership.role === "editor") {
        highestAccess = "edit";
        break;
      } else if (membership.role === "viewer" && highestAccess === "none") {
        highestAccess = "view";
      }
    }
  }

  return highestAccess;
}

/**
 * Helper function to check if user can edit a session (for mutations)
 */
async function canEditSession(
  ctx: QueryCtx,
  sessionId: Id<"chatSessions">,
  userId: Id<"users">
): Promise<boolean> {
  const accessLevel = await checkSessionAccess(ctx, sessionId, userId);
  return accessLevel === "owner" || accessLevel === "edit";
}

// Create a new vibe-coding session with initial message
export const createVibeCodeSession = mutation({
  args: {
    title: v.optional(v.string()),
    initialMessage: v.string(),
  },
  handler: async (ctx, { title, initialMessage }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();

    const sessionId = await ctx.db.insert("chatSessions", {
      userId,
      title: title || initialMessage.slice(0, 50),
      createdAt: now,
      updatedAt: now,
    });

    // Save the initial message
    await ctx.db.insert("chatMessages", {
      sessionId,
      userId,
      role: "user",
      content: initialMessage,
      metadata: {
        appIntent: {
          type: "vibe-coding",
          appId: "vibe-coding",
          appName: "Vibe Code Agent",
        },
      },
      createdAt: now,
    });

    return sessionId;
  },
});

// Get vibe-coding sessions for the current user (including shared sessions)
export const getVibeCodeSessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Get user's own sessions
    const ownSessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get sessions shared with user through organizations
    const userMemberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const sharedSessionIds = new Set<string>();
    const sharedSessions: typeof ownSessions = [];

    for (const membership of userMemberships) {
      const sharedResources = await ctx.db
        .query("sharedResources")
        .withIndex("by_organization", (q) => q.eq("organizationId", membership.organizationId))
        .collect();

      for (const resource of sharedResources) {
        if (resource.resourceType === "chatSession" && !sharedSessionIds.has(resource.resourceId)) {
          sharedSessionIds.add(resource.resourceId);
          const session = await ctx.db.get(resource.resourceId as Id<"chatSessions">);
          if (session && session.userId !== userId) {
            sharedSessions.push(session);
          }
        }
      }
    }

    // Combine all sessions
    const allSessions = [...ownSessions, ...sharedSessions];

    const vibeCodeSessions = [];
    
    for (const session of allSessions) {
      const firstMessage = await ctx.db
        .query("chatMessages")
        .withIndex("by_session", (q) => q.eq("sessionId", session._id))
        .first();
      
      if (firstMessage?.metadata?.appIntent?.type === 'vibe-coding') {
        const messages = await ctx.db
          .query("chatMessages")
          .withIndex("by_session", (q) => q.eq("sessionId", session._id))
          .collect();
          
        vibeCodeSessions.push({
          ...session,
          messageCount: messages.length
        });
      }
    }

    // Sort by updatedAt
    return vibeCodeSessions.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// Send a message in an existing vibe-coding session (with shared access support)
export const sendVibeCodeMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user can edit this session
    if (!(await canEditSession(ctx, sessionId, userId))) {
      throw new Error("Session not found or access denied");
    }

    const messageId = await ctx.db.insert("chatMessages", {
      sessionId,
      userId,
      role: "user",
      content,
      metadata: {
        appIntent: {
          type: 'vibe-coding',
          appId: 'vibe-coding',
          appName: 'Vibe Code Agent'
        }
      },
      createdAt: Date.now(),
    });

    await ctx.db.patch(sessionId, { updatedAt: Date.now() });

    return messageId;
  },
});

// Save generated artifact from coding agent (creates new version) - with shared access support
export const saveGeneratedArtifact = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    messageId: v.optional(v.id("chatMessages")),
    name: v.string(),
    description: v.optional(v.string()),
    files: v.string(),
    metadata: v.optional(v.object({
      framework: v.optional(v.string()),
      language: v.optional(v.string()),
      dependencies: v.optional(v.array(v.string())),
    })),
  },
  handler: async (ctx, { sessionId, messageId, name, description, files, metadata }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user can edit this session
    if (!(await canEditSession(ctx, sessionId, userId))) {
      throw new Error("Session not found or access denied");
    }

    // Get the latest version number for this session
    const latestArtifact = await ctx.db
      .query("artifacts")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("desc")
      .first();

    // Version starts from 0 (first artifact is v0)
    const nextVersion = latestArtifact?.version !== undefined ? latestArtifact.version + 1 : 0;
    const now = Date.now();

    const artifactId = await ctx.db.insert("artifacts", {
      sessionId,
      userId,
      messageId,
      name,
      description,
      files,
      version: nextVersion,
      metadata,
      createdAt: now,
      updatedAt: now,
    });

    return { artifactId, version: nextVersion };
  },
});

// Get all artifact versions for a session (version history) - with shared access support
export const getSessionArtifacts = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Check if user has access to this session
    const accessLevel = await checkSessionAccess(ctx, sessionId, userId);
    if (accessLevel === "none") return [];

    const artifacts = await ctx.db
      .query("artifacts")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("desc")
      .collect();

    return artifacts.map(artifact => ({
      ...artifact,
      files: JSON.parse(artifact.files),
    }));
  },
});

// Get the latest artifact for a session - with shared access support
export const getLatestArtifact = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Check if user has access to this session
    const accessLevel = await checkSessionAccess(ctx, sessionId, userId);
    if (accessLevel === "none") return null;

    const artifact = await ctx.db
      .query("artifacts")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("desc")
      .first();

    if (artifact) {
      return {
        ...artifact,
        files: JSON.parse(artifact.files),
      };
    }

    return null;
  },
});

// Get a specific artifact version - with shared access support
export const getArtifactByVersion = query({
  args: { 
    sessionId: v.id("chatSessions"),
    version: v.number(),
  },
  handler: async (ctx, { sessionId, version }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Check if user has access to this session
    const accessLevel = await checkSessionAccess(ctx, sessionId, userId);
    if (accessLevel === "none") return null;

    const artifact = await ctx.db
      .query("artifacts")
      .withIndex("by_session_version", (q) => 
        q.eq("sessionId", sessionId).eq("version", version)
      )
      .first();

    if (artifact) {
      return {
        ...artifact,
        files: JSON.parse(artifact.files),
      };
    }

    return null;
  },
});

// Get version history summary (lightweight - without file contents) - with shared access support
export const getVersionHistory = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Check if user has access to this session
    const accessLevel = await checkSessionAccess(ctx, sessionId, userId);
    if (accessLevel === "none") return [];

    const artifacts = await ctx.db
      .query("artifacts")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("desc")
      .collect();

    // Return lightweight version info without file contents
    return artifacts.map(artifact => {
      const files = JSON.parse(artifact.files);
      return {
        _id: artifact._id,
        version: artifact.version,
        description: artifact.description,
        messageId: artifact.messageId,
        fileCount: Object.keys(files).length,
        filePaths: Object.keys(files),
        createdAt: artifact.createdAt,
      };
    });
  },
});


// Update a single file in the latest artifact (for manual edits) - with shared access support
export const updateArtifactFile = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    filePath: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, filePath, content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user can edit this session
    if (!(await canEditSession(ctx, sessionId, userId))) {
      throw new Error("Session not found or access denied");
    }

    // Get the latest artifact
    const latestArtifact = await ctx.db
      .query("artifacts")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("desc")
      .first();

    if (!latestArtifact) {
      throw new Error("No artifact found for this session");
    }

    // Parse existing files, update the specific file, and save
    const files = JSON.parse(latestArtifact.files);
    files[filePath] = content;

    await ctx.db.patch(latestArtifact._id, {
      files: JSON.stringify(files),
      updatedAt: Date.now(),
    });

    return { success: true, artifactId: latestArtifact._id };
  },
});
