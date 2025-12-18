import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Board mutations and queries
export const listBoards = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("kanbanBoards")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getBoard = query({
  args: { id: v.id("kanbanBoards") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const board = await ctx.db.get(args.id);
    if (!board || board.userId !== userId) return null;

    // Get columns for this board
    const columns = await ctx.db
      .query("kanbanColumns")
      .withIndex("by_board", (q) => q.eq("boardId", args.id))
      .collect();

    // Get cards for each column
    const columnsWithCards = await Promise.all(
      columns.sort((a, b) => a.position - b.position).map(async (column) => {
        const cards = await ctx.db
          .query("kanbanCards")
          .withIndex("by_column", (q) => q.eq("columnId", column._id))
          .collect();
        return {
          ...column,
          cards: cards.sort((a, b) => a.position - b.position),
        };
      })
    );

    return { ...board, columns: columnsWithCards };
  },
});

export const createBoard = mutation({
  args: { 
    name: v.string(),
    templateColumns: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    const boardId = await ctx.db.insert("kanbanBoards", {
      name: args.name,
      userId,
      createdAt: now,
      updatedAt: now,
    });

    // Create template columns if provided
    if (args.templateColumns && args.templateColumns.length > 0) {
      for (let i = 0; i < args.templateColumns.length; i++) {
        await ctx.db.insert("kanbanColumns", {
          boardId,
          name: args.templateColumns[i],
          position: i,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    return boardId;
  },
});

export const updateBoard = mutation({
  args: { id: v.id("kanbanBoards"), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const board = await ctx.db.get(args.id);
    if (!board || board.userId !== userId) throw new Error("Not authorized");

    return await ctx.db.patch(args.id, {
      name: args.name,
      updatedAt: Date.now(),
    });
  },
});

export const deleteBoard = mutation({
  args: { id: v.id("kanbanBoards") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const board = await ctx.db.get(args.id);
    if (!board || board.userId !== userId) throw new Error("Not authorized");

    // Delete all cards in all columns
    const columns = await ctx.db
      .query("kanbanColumns")
      .withIndex("by_board", (q) => q.eq("boardId", args.id))
      .collect();

    for (const column of columns) {
      const cards = await ctx.db
        .query("kanbanCards")
        .withIndex("by_column", (q) => q.eq("columnId", column._id))
        .collect();
      for (const card of cards) {
        await ctx.db.delete(card._id);
      }
      await ctx.db.delete(column._id);
    }

    return await ctx.db.delete(args.id);
  },
});


// Column mutations
export const createColumn = mutation({
  args: { boardId: v.id("kanbanBoards"), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const board = await ctx.db.get(args.boardId);
    if (!board || board.userId !== userId) throw new Error("Not authorized");

    // Get max position
    const columns = await ctx.db
      .query("kanbanColumns")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();
    const maxPosition = columns.length > 0 ? Math.max(...columns.map((c) => c.position)) + 1 : 0;

    const now = Date.now();
    return await ctx.db.insert("kanbanColumns", {
      boardId: args.boardId,
      name: args.name,
      position: maxPosition,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateColumn = mutation({
  args: {
    id: v.id("kanbanColumns"),
    name: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const column = await ctx.db.get(args.id);
    if (!column) throw new Error("Column not found");

    const board = await ctx.db.get(column.boardId);
    if (!board || board.userId !== userId) throw new Error("Not authorized");

    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteColumn = mutation({
  args: { id: v.id("kanbanColumns") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const column = await ctx.db.get(args.id);
    if (!column) throw new Error("Column not found");

    const board = await ctx.db.get(column.boardId);
    if (!board || board.userId !== userId) throw new Error("Not authorized");

    // Delete all cards in this column
    const cards = await ctx.db
      .query("kanbanCards")
      .withIndex("by_column", (q) => q.eq("columnId", args.id))
      .collect();
    for (const card of cards) {
      await ctx.db.delete(card._id);
    }

    return await ctx.db.delete(args.id);
  },
});

export const reorderColumns = mutation({
  args: {
    boardId: v.id("kanbanBoards"),
    columnPositions: v.array(v.object({ id: v.id("kanbanColumns"), position: v.number() })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const board = await ctx.db.get(args.boardId);
    if (!board || board.userId !== userId) throw new Error("Not authorized");

    for (const { id, position } of args.columnPositions) {
      await ctx.db.patch(id, { position, updatedAt: Date.now() });
    }
  },
});

// Card mutations
export const createCard = mutation({
  args: {
    columnId: v.id("kanbanColumns"),
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const column = await ctx.db.get(args.columnId);
    if (!column) throw new Error("Column not found");

    const board = await ctx.db.get(column.boardId);
    if (!board || board.userId !== userId) throw new Error("Not authorized");

    // Get max position
    const cards = await ctx.db
      .query("kanbanCards")
      .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
      .collect();
    const maxPosition = cards.length > 0 ? Math.max(...cards.map((c) => c.position)) + 1 : 0;

    const now = Date.now();
    return await ctx.db.insert("kanbanCards", {
      columnId: args.columnId,
      title: args.title,
      description: args.description,
      priority: args.priority,
      position: maxPosition,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateCard = mutation({
  args: {
    id: v.id("kanbanCards"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const card = await ctx.db.get(args.id);
    if (!card) throw new Error("Card not found");

    const column = await ctx.db.get(card.columnId);
    if (!column) throw new Error("Column not found");

    const board = await ctx.db.get(column.boardId);
    if (!board || board.userId !== userId) throw new Error("Not authorized");

    const { id, ...updates } = args;
    return await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});

export const deleteCard = mutation({
  args: { id: v.id("kanbanCards") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const card = await ctx.db.get(args.id);
    if (!card) throw new Error("Card not found");

    const column = await ctx.db.get(card.columnId);
    if (!column) throw new Error("Column not found");

    const board = await ctx.db.get(column.boardId);
    if (!board || board.userId !== userId) throw new Error("Not authorized");

    return await ctx.db.delete(args.id);
  },
});

export const moveCard = mutation({
  args: {
    cardId: v.id("kanbanCards"),
    targetColumnId: v.id("kanbanColumns"),
    targetPosition: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const card = await ctx.db.get(args.cardId);
    if (!card) throw new Error("Card not found");

    const targetColumn = await ctx.db.get(args.targetColumnId);
    if (!targetColumn) throw new Error("Target column not found");

    const board = await ctx.db.get(targetColumn.boardId);
    if (!board || board.userId !== userId) throw new Error("Not authorized");

    // Update positions in target column
    const targetCards = await ctx.db
      .query("kanbanCards")
      .withIndex("by_column", (q) => q.eq("columnId", args.targetColumnId))
      .collect();

    const filteredCards = targetCards.filter((c) => c._id !== args.cardId);
    filteredCards.sort((a, b) => a.position - b.position);

    // Reposition cards
    for (let i = 0; i < filteredCards.length; i++) {
      const newPos = i >= args.targetPosition ? i + 1 : i;
      if (filteredCards[i].position !== newPos) {
        await ctx.db.patch(filteredCards[i]._id, { position: newPos });
      }
    }

    // Move the card
    await ctx.db.patch(args.cardId, {
      columnId: args.targetColumnId,
      position: args.targetPosition,
      updatedAt: Date.now(),
    });
  },
});
