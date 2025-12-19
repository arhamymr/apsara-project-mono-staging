import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Query to get chat sessions for a user
export const getUserChatSessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Query to get messages for a chat session
export const getChatMessages = query({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Verify user owns this session
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) return [];

    return await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("asc")
      .collect();
  },
});

// Mutation to create a new chat session
export const createChatSession = mutation({
  args: { title: v.optional(v.string()) },
  handler: async (ctx, { title }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    return await ctx.db.insert("chatSessions", {
      userId,
      title,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation to add a user message
export const addUserMessage = mutation({
  args: { 
    sessionId: v.id("chatSessions"), 
    content: v.string(),
    metadata: v.optional(v.object({
      appIntent: v.optional(v.object({
        type: v.string(),
        appId: v.string(),
        appName: v.string(),
      })),
    })),
  },
  handler: async (ctx, { sessionId, content, metadata }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this session
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    // Check if this is the first message in the session
    const existingMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .collect();

    const messageId = await ctx.db.insert("chatMessages", {
      sessionId,
      userId,
      role: "user",
      content,
      metadata,
      createdAt: Date.now(),
    });

    // If this is the first message, update session title
    if (existingMessages.length === 0) {
      const title = content.length > 50 ? content.substring(0, 47) + "..." : content;
      await ctx.db.patch(sessionId, { 
        title,
        updatedAt: Date.now() 
      });
    } else {
      // Just update timestamp
      await ctx.db.patch(sessionId, { updatedAt: Date.now() });
    }

    return messageId;
  },
});

// Mutation to add an assistant message
export const addAssistantMessage = mutation({
  args: { 
    sessionId: v.id("chatSessions"), 
    content: v.string(),
  },
  handler: async (ctx, { sessionId, content }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this session
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    const messageId = await ctx.db.insert("chatMessages", {
      sessionId,
      userId,
      role: "assistant",
      content,
      createdAt: Date.now(),
    });

    // Update session timestamp
    await ctx.db.patch(sessionId, { updatedAt: Date.now() });

    return messageId;
  },
});

// Mutation to create a streaming assistant message (returns messageId for updates)
export const createStreamingMessage = mutation({
  args: { 
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this session
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    const messageId = await ctx.db.insert("chatMessages", {
      sessionId,
      userId,
      role: "assistant",
      content: "",
      isStreaming: true,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

// Mutation to update streaming message content
export const updateStreamingMessage = mutation({
  args: { 
    messageId: v.id("chatMessages"),
    content: v.string(),
    isComplete: v.optional(v.boolean()),
  },
  handler: async (ctx, { messageId, content, isComplete }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this message
    const message = await ctx.db.get(messageId);
    if (!message || message.userId !== userId) {
      throw new Error("Message not found or access denied");
    }

    await ctx.db.patch(messageId, { 
      content,
      ...(isComplete ? { isStreaming: false } : {}),
    });

    // Update session timestamp
    await ctx.db.patch(message.sessionId, { updatedAt: Date.now() });

    return messageId;
  },
});

// Action to process chat message (calls external API)
export const processChatMessage = action({
  args: { 
    sessionId: v.id("chatSessions"), 
    userMessage: v.string(),
    metadata: v.optional(v.object({
      appIntent: v.optional(v.object({
        type: v.string(),
        appId: v.string(),
        appName: v.string(),
      })),
    })),
  },
  handler: async (ctx, { sessionId, userMessage, metadata }) => {
    // Add user message first
    await ctx.runMutation(api.chat.addUserMessage, {
      sessionId,
      content: userMessage,
      metadata,
    });

    // If there's an app intent, handle it directly
    if (metadata?.appIntent?.type === 'open-app') {
      const reply = `Opening ${metadata.appIntent.appName}...`;
      await ctx.runMutation(api.chat.addAssistantMessage, {
        sessionId,
        content: reply,
      });
      return { success: true, output: reply, hasAppIntent: true, appId: metadata.appIntent.appId };
    }

    try {
      // Call external chatbot API
      const response = await fetch(`${process.env.BACKEND_URL}/api/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantReply = data.output || 'Sorry, I could not process your request.';

      // Add assistant response
      await ctx.runMutation(api.chat.addAssistantMessage, {
        sessionId,
        content: assistantReply,
      });

      return { success: true, output: assistantReply, hasAppIntent: false };
    } catch (error) {
      console.error('Chat processing error:', error);
      const errorMessage = 'Sorry, there was an error processing your message.';
      
      await ctx.runMutation(api.chat.addAssistantMessage, {
        sessionId,
        content: errorMessage,
      });

      return { success: false, output: errorMessage, hasAppIntent: false };
    }
  },
});

// Query to get or create default session for user
export const getOrCreateDefaultSession = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Try to find existing session
    const existingSession = await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    if (existingSession) {
      return existingSession._id;
    }

    // Create new session
    const now = Date.now();
    return await ctx.db.insert("chatSessions", {
      userId,
      title: "Chat Session",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation to create a new chat session (for "New Chat" functionality)
export const createNewChatSession = mutation({
  args: { title: v.optional(v.string()) },
  handler: async (ctx, { title }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    return await ctx.db.insert("chatSessions", {
      userId,
      title: title || `Chat ${new Date().toLocaleString()}`,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation to clear all messages from a chat session
export const clearChatSession = mutation({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this session
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    // Get all messages for this session
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .collect();

    // Delete all messages
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Update session timestamp
    await ctx.db.patch(sessionId, { 
      updatedAt: Date.now(),
      title: `Chat ${new Date().toLocaleString()}` // Reset title
    });

    return { success: true, clearedCount: messages.length };
  },
});

// Mutation to delete a chat session entirely
export const deleteChatSession = mutation({
  args: { sessionId: v.id("chatSessions") },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user owns this session
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    // Get all messages for this session
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .collect();

    // Delete all messages first
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the session
    await ctx.db.delete(sessionId);

    return { success: true, deletedMessages: messages.length };
  },
});