import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

/**
 * Helper function to check if user can access a kanban board
 * Returns access level: "owner", "edit", "view", or "none"
 */
async function checkBoardAccess(
  ctx: QueryCtx,
  boardId: Id<"kanbanBoards">,
  userId: Id<"users">
): Promise<"owner" | "edit" | "view" | "none"> {
  const board = await ctx.db.get(boardId);
  if (!board) return "none";

  // Check if user is the owner
  if (board.userId === userId) return "owner";

  // Check if board is shared with any organization the user is a member of
  const sharedResources = await ctx.db
    .query("sharedResources")
    .withIndex("by_resource", (q) =>
      q.eq("resourceType", "kanbanBoard").eq("resourceId", boardId)
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

// Board mutations and queries
export const listBoards = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Get user's own boards
    const ownBoards = await ctx.db
      .query("kanbanBoards")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get boards shared with user through organizations
    const userMemberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const sharedBoardIds = new Set<string>();
    const sharedBoards: typeof ownBoards = [];

    for (const membership of userMemberships) {
      const sharedResources = await ctx.db
        .query("sharedResources")
        .withIndex("by_organization", (q) => q.eq("organizationId", membership.organizationId))
        .collect();

      for (const resource of sharedResources) {
        if (resource.resourceType === "kanbanBoard" && !sharedBoardIds.has(resource.resourceId)) {
          sharedBoardIds.add(resource.resourceId);
          const board = await ctx.db.get(resource.resourceId as Id<"kanbanBoards">);
          if (board && board.userId !== userId) {
            sharedBoards.push(board);
          }
        }
      }
    }

    // Combine and sort by updatedAt
    return [...ownBoards, ...sharedBoards].sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getBoard = query({
  args: { id: v.id("kanbanBoards") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const board = await ctx.db.get(args.id);
    if (!board) return null;

    // Check access level
    const accessLevel = await checkBoardAccess(ctx, args.id, userId);
    if (accessLevel === "none") return null;

    // Get columns for this board
    const columns = await ctx.db
      .query("kanbanColumns")
      .withIndex("by_board", (q) => q.eq("boardId", args.id))
      .collect();

    // Get cards for each column with assignee info (excluding archived)
    const columnsWithCards = await Promise.all(
      columns.sort((a, b) => a.position - b.position).map(async (column) => {
        const cards = await ctx.db
          .query("kanbanCards")
          .withIndex("by_column", (q) => q.eq("columnId", column._id))
          .collect();
        
        // Filter out archived cards
        const activeCards = cards.filter((c) => !c.isArchived);
        
        // Fetch assignee info for each card
        const cardsWithAssignees = await Promise.all(
          activeCards.map(async (card) => {
            if (card.assigneeId) {
              const assignee = await ctx.db.get(card.assigneeId);
              return {
                ...card,
                assignee: assignee ? {
                  _id: assignee._id,
                  name: assignee.name,
                  email: assignee.email,
                  image: assignee.image,
                } : undefined,
              };
            }
            return card;
          })
        );
        
        return {
          ...column,
          cards: cardsWithAssignees.sort((a, b) => a.position - b.position),
        };
      })
    );

    return { ...board, columns: columnsWithCards, accessLevel };
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

/**
 * Helper function to check if user can edit a kanban board (for mutations)
 * Returns true if user is owner or has edit access through shared organizations
 */
async function canEditBoard(
  ctx: QueryCtx,
  boardId: Id<"kanbanBoards">,
  userId: Id<"users">
): Promise<boolean> {
  const accessLevel = await checkBoardAccess(ctx, boardId, userId);
  return accessLevel === "owner" || accessLevel === "edit";
}

export const updateBoard = mutation({
  args: { id: v.id("kanbanBoards"), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const board = await ctx.db.get(args.id);
    if (!board) throw new Error("Board not found");

    // Only owner can update board name
    if (board.userId !== userId) throw new Error("Not authorized");

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

    // Check if user can edit this board (owner or shared with edit access)
    if (!(await canEditBoard(ctx, args.boardId, userId))) {
      throw new Error("Not authorized");
    }

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

    // Check if user can edit this board
    if (!(await canEditBoard(ctx, column.boardId, userId))) {
      throw new Error("Not authorized");
    }

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

    // Check if user can edit this board
    if (!(await canEditBoard(ctx, column.boardId, userId))) {
      throw new Error("Not authorized");
    }

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

    // Check if user can edit this board
    if (!(await canEditBoard(ctx, args.boardId, userId))) {
      throw new Error("Not authorized");
    }

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
    assigneeId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const column = await ctx.db.get(args.columnId);
    if (!column) throw new Error("Column not found");

    // Check if user can edit this board
    if (!(await canEditBoard(ctx, column.boardId, userId))) {
      throw new Error("Not authorized");
    }

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
      assigneeId: args.assigneeId,
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
    assigneeId: v.optional(v.union(v.id("users"), v.null())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const card = await ctx.db.get(args.id);
    if (!card) throw new Error("Card not found");

    const column = await ctx.db.get(card.columnId);
    if (!column) throw new Error("Column not found");

    // Check if user can edit this board
    if (!(await canEditBoard(ctx, column.boardId, userId))) {
      throw new Error("Not authorized");
    }

    const { id, ...updates } = args;
    // Handle null assigneeId to unassign
    const patchData: Record<string, unknown> = { ...updates, updatedAt: Date.now() };
    if (updates.assigneeId === null) {
      patchData.assigneeId = undefined;
    }
    return await ctx.db.patch(id, patchData);
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

    // Check if user can edit this board
    if (!(await canEditBoard(ctx, column.boardId, userId))) {
      throw new Error("Not authorized");
    }

    return await ctx.db.delete(args.id);
  },
});

// Get users who can be assigned to cards on this board
export const getBoardMembers = query({
  args: { boardId: v.id("kanbanBoards") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const board = await ctx.db.get(args.boardId);
    if (!board) return [];

    // Check access
    const accessLevel = await checkBoardAccess(ctx, args.boardId, userId);
    if (accessLevel === "none") return [];

    // Get the board owner
    const owner = await ctx.db.get(board.userId);
    const members: Array<{ _id: Id<"users">; name?: string; email?: string; image?: string }> = [];
    
    if (owner) {
      members.push({
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        image: owner.image,
      });
    }

    // Get members from shared organizations
    const sharedResources = await ctx.db
      .query("sharedResources")
      .withIndex("by_resource", (q) =>
        q.eq("resourceType", "kanbanBoard").eq("resourceId", args.boardId)
      )
      .collect();

    const addedUserIds = new Set<string>([board.userId]);

    for (const resource of sharedResources) {
      const orgMembers = await ctx.db
        .query("organizationMembers")
        .withIndex("by_organization", (q) => q.eq("organizationId", resource.organizationId))
        .collect();

      for (const member of orgMembers) {
        if (!addedUserIds.has(member.userId)) {
          addedUserIds.add(member.userId);
          const user = await ctx.db.get(member.userId);
          if (user) {
            members.push({
              _id: user._id,
              name: user.name,
              email: user.email,
              image: user.image,
            });
          }
        }
      }
    }

    return members;
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

    // Check if user can edit this board
    if (!(await canEditBoard(ctx, targetColumn.boardId, userId))) {
      throw new Error("Not authorized");
    }

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

// Comment queries and mutations
export const getCardComments = query({
  args: { cardId: v.id("kanbanCards") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const card = await ctx.db.get(args.cardId);
    if (!card) return [];

    const column = await ctx.db.get(card.columnId);
    if (!column) return [];

    // Check if user can access this board
    const accessLevel = await checkBoardAccess(ctx, column.boardId, userId);
    if (accessLevel === "none") return [];

    const comments = await ctx.db
      .query("kanbanComments")
      .withIndex("by_card", (q) => q.eq("cardId", args.cardId))
      .collect();

    // Fetch user info for each comment
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
              }
            : undefined,
        };
      })
    );

    return commentsWithUsers.sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const addComment = mutation({
  args: {
    cardId: v.id("kanbanCards"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const card = await ctx.db.get(args.cardId);
    if (!card) throw new Error("Card not found");

    const column = await ctx.db.get(card.columnId);
    if (!column) throw new Error("Column not found");

    // Check if user can access this board (even viewers can comment)
    const accessLevel = await checkBoardAccess(ctx, column.boardId, userId);
    if (accessLevel === "none") throw new Error("Not authorized");

    const now = Date.now();
    return await ctx.db.insert("kanbanComments", {
      cardId: args.cardId,
      userId,
      content: args.content,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateComment = mutation({
  args: {
    id: v.id("kanbanComments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const comment = await ctx.db.get(args.id);
    if (!comment) throw new Error("Comment not found");

    // Only the comment author can edit
    if (comment.userId !== userId) throw new Error("Not authorized");

    return await ctx.db.patch(args.id, {
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

export const deleteComment = mutation({
  args: { id: v.id("kanbanComments") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const comment = await ctx.db.get(args.id);
    if (!comment) throw new Error("Comment not found");

    // Only the comment author can delete
    if (comment.userId !== userId) throw new Error("Not authorized");

    return await ctx.db.delete(args.id);
  },
});


// Archive card mutation
export const archiveCard = mutation({
  args: { id: v.id("kanbanCards") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const card = await ctx.db.get(args.id);
    if (!card) throw new Error("Card not found");

    const column = await ctx.db.get(card.columnId);
    if (!column) throw new Error("Column not found");

    if (!(await canEditBoard(ctx, column.boardId, userId))) {
      throw new Error("Not authorized");
    }

    const now = Date.now();
    return await ctx.db.patch(args.id, {
      isArchived: true,
      archivedAt: now,
      updatedAt: now,
    });
  },
});

// Unarchive card mutation
export const unarchiveCard = mutation({
  args: { id: v.id("kanbanCards") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const card = await ctx.db.get(args.id);
    if (!card) throw new Error("Card not found");

    const column = await ctx.db.get(card.columnId);
    if (!column) throw new Error("Column not found");

    if (!(await canEditBoard(ctx, column.boardId, userId))) {
      throw new Error("Not authorized");
    }

    return await ctx.db.patch(args.id, {
      isArchived: false,
      archivedAt: undefined,
      updatedAt: Date.now(),
    });
  },
});

// Get archived cards for a board
export const getArchivedCards = query({
  args: { boardId: v.id("kanbanBoards") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const accessLevel = await checkBoardAccess(ctx, args.boardId, userId);
    if (accessLevel === "none") return [];

    const columns = await ctx.db
      .query("kanbanColumns")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    const archivedCards: Array<{
      _id: Id<"kanbanCards">;
      columnId: Id<"kanbanColumns">;
      columnName: string;
      title: string;
      description?: string;
      priority: "low" | "medium" | "high";
      assigneeId?: Id<"users">;
      assignee?: { _id: Id<"users">; name?: string; email?: string; image?: string };
      position: number;
      isArchived?: boolean;
      archivedAt?: number;
      createdAt: number;
      updatedAt: number;
    }> = [];

    for (const column of columns) {
      const cards = await ctx.db
        .query("kanbanCards")
        .withIndex("by_column", (q) => q.eq("columnId", column._id))
        .collect();

      const archived = cards.filter((c) => c.isArchived === true);

      for (const card of archived) {
        let assignee;
        if (card.assigneeId) {
          const user = await ctx.db.get(card.assigneeId);
          if (user) {
            assignee = {
              _id: user._id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }
        }
        archivedCards.push({
          ...card,
          columnName: column.name,
          assignee,
        });
      }
    }

    return archivedCards.sort((a, b) => (b.archivedAt || 0) - (a.archivedAt || 0));
  },
});
