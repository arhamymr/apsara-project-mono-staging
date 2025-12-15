import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

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

// Get vibe-coding sessions for the current user
export const getVibeCodeSessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const vibeCodeSessions = [];
    
    for (const session of sessions) {
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

    return vibeCodeSessions;
  },
});

// Send a message in an existing vibe-coding session
export const sendVibeCodeMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
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

// Save generated artifact from coding agent (creates new version)
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

    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
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

// Get all artifact versions for a session (version history)
export const getSessionArtifacts = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) return [];

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

// Get the latest artifact for a session
export const getLatestArtifact = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) return null;

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

// Get a specific artifact version
export const getArtifactByVersion = query({
  args: { 
    sessionId: v.id("chatSessions"),
    version: v.number(),
  },
  handler: async (ctx, { sessionId, version }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) return null;

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

// Get version history summary (lightweight - without file contents)
export const getVersionHistory = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) return [];

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


// Update a single file in the latest artifact (for manual edits)
export const updateArtifactFile = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    filePath: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { sessionId, filePath, content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
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
