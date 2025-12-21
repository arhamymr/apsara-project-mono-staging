import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

/**
 * Helper function to check if user can access a lead pipeline
 * Returns access level: "owner", "edit", "view", or "none"
 */
async function checkPipelineAccess(
  ctx: QueryCtx,
  pipelineId: Id<"leadPipelines">,
  userId: Id<"users">
): Promise<"owner" | "edit" | "view" | "none"> {
  const pipeline = await ctx.db.get(pipelineId);
  if (!pipeline) return "none";

  // Check if user is the owner
  if (pipeline.userId === userId) return "owner";

  // Check if pipeline is shared with any organization the user is a member of
  const sharedResources = await ctx.db
    .query("sharedResources")
    .withIndex("by_resource", (q) =>
      q.eq("resourceType", "leadPipeline").eq("resourceId", pipelineId)
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
 * Helper function to check if user can edit a pipeline (for mutations)
 */
async function canEditPipeline(
  ctx: QueryCtx,
  pipelineId: Id<"leadPipelines">,
  userId: Id<"users">
): Promise<boolean> {
  const accessLevel = await checkPipelineAccess(ctx, pipelineId, userId);
  return accessLevel === "owner" || accessLevel === "edit";
}

// Pipeline queries and mutations
export const listPipelines = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Get user's own pipelines
    const ownPipelines = await ctx.db
      .query("leadPipelines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    // Get pipelines shared with user through organizations
    const userMemberships = await ctx.db
      .query("organizationMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const sharedPipelineIds = new Set<string>();
    const sharedPipelines: typeof ownPipelines = [];

    for (const membership of userMemberships) {
      const sharedResources = await ctx.db
        .query("sharedResources")
        .withIndex("by_organization", (q) => q.eq("organizationId", membership.organizationId))
        .collect();

      for (const resource of sharedResources) {
        if (resource.resourceType === "leadPipeline" && !sharedPipelineIds.has(resource.resourceId)) {
          sharedPipelineIds.add(resource.resourceId);
          const pipeline = await ctx.db.get(resource.resourceId as Id<"leadPipelines">);
          if (pipeline && pipeline.userId !== userId) {
            sharedPipelines.push(pipeline);
          }
        }
      }
    }

    // Combine and sort by updatedAt
    return [...ownPipelines, ...sharedPipelines].sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getPipeline = query({
  args: { id: v.id("leadPipelines") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const pipeline = await ctx.db.get(args.id);
    if (!pipeline) return null;

    // Check access level
    const accessLevel = await checkPipelineAccess(ctx, args.id, userId);
    if (accessLevel === "none") return null;

    // Get columns for this pipeline
    const columns = await ctx.db
      .query("leadColumns")
      .withIndex("by_pipeline", (q) => q.eq("pipelineId", args.id))
      .collect();

    // Get leads for each column
    const columnsWithLeads = await Promise.all(
      columns.sort((a, b) => a.position - b.position).map(async (column) => {
        const leads = await ctx.db
          .query("leads")
          .withIndex("by_column", (q) => q.eq("columnId", column._id))
          .collect();
        
        return {
          ...column,
          leads: leads.sort((a, b) => a.position - b.position),
        };
      })
    );

    return { ...pipeline, columns: columnsWithLeads, accessLevel };
  },
});

export const createPipeline = mutation({
  args: { 
    name: v.string(),
    templateColumns: v.optional(v.array(v.object({
      title: v.string(),
      color: v.string(),
      dotColor: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();
    const pipelineId = await ctx.db.insert("leadPipelines", {
      name: args.name,
      userId,
      createdAt: now,
      updatedAt: now,
    });

    // Create template columns if provided
    if (args.templateColumns && args.templateColumns.length > 0) {
      for (let i = 0; i < args.templateColumns.length; i++) {
        await ctx.db.insert("leadColumns", {
          pipelineId,
          title: args.templateColumns[i].title,
          color: args.templateColumns[i].color,
          dotColor: args.templateColumns[i].dotColor,
          position: i,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    return pipelineId;
  },
});

export const updatePipeline = mutation({
  args: { id: v.id("leadPipelines"), name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const pipeline = await ctx.db.get(args.id);
    if (!pipeline) throw new Error("Pipeline not found");

    // Only owner can update pipeline name
    if (pipeline.userId !== userId) throw new Error("Not authorized");

    return await ctx.db.patch(args.id, {
      name: args.name,
      updatedAt: Date.now(),
    });
  },
});

export const deletePipeline = mutation({
  args: { id: v.id("leadPipelines") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const pipeline = await ctx.db.get(args.id);
    if (!pipeline || pipeline.userId !== userId) throw new Error("Not authorized");

    // Delete all leads in all columns
    const columns = await ctx.db
      .query("leadColumns")
      .withIndex("by_pipeline", (q) => q.eq("pipelineId", args.id))
      .collect();

    for (const column of columns) {
      const leads = await ctx.db
        .query("leads")
        .withIndex("by_column", (q) => q.eq("columnId", column._id))
        .collect();
      for (const lead of leads) {
        await ctx.db.delete(lead._id);
      }
      await ctx.db.delete(column._id);
    }

    return await ctx.db.delete(args.id);
  },
});

// Column mutations
export const createColumn = mutation({
  args: { 
    pipelineId: v.id("leadPipelines"), 
    title: v.string(),
    color: v.string(),
    dotColor: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user can edit this pipeline
    if (!(await canEditPipeline(ctx, args.pipelineId, userId))) {
      throw new Error("Not authorized");
    }

    // Get max position
    const columns = await ctx.db
      .query("leadColumns")
      .withIndex("by_pipeline", (q) => q.eq("pipelineId", args.pipelineId))
      .collect();
    const maxPosition = columns.length > 0 ? Math.max(...columns.map((c) => c.position)) + 1 : 0;

    const now = Date.now();
    return await ctx.db.insert("leadColumns", {
      pipelineId: args.pipelineId,
      title: args.title,
      color: args.color,
      dotColor: args.dotColor,
      position: maxPosition,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateColumn = mutation({
  args: {
    id: v.id("leadColumns"),
    title: v.optional(v.string()),
    color: v.optional(v.string()),
    dotColor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const column = await ctx.db.get(args.id);
    if (!column) throw new Error("Column not found");

    // Check if user can edit this pipeline
    if (!(await canEditPipeline(ctx, column.pipelineId, userId))) {
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
  args: { id: v.id("leadColumns") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const column = await ctx.db.get(args.id);
    if (!column) throw new Error("Column not found");

    // Check if user can edit this pipeline
    if (!(await canEditPipeline(ctx, column.pipelineId, userId))) {
      throw new Error("Not authorized");
    }

    // Delete all leads in this column
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_column", (q) => q.eq("columnId", args.id))
      .collect();
    for (const lead of leads) {
      await ctx.db.delete(lead._id);
    }

    return await ctx.db.delete(args.id);
  },
});

export const reorderColumns = mutation({
  args: {
    pipelineId: v.id("leadPipelines"),
    columnPositions: v.array(v.object({ id: v.id("leadColumns"), position: v.number() })),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user can edit this pipeline
    if (!(await canEditPipeline(ctx, args.pipelineId, userId))) {
      throw new Error("Not authorized");
    }

    for (const { id, position } of args.columnPositions) {
      await ctx.db.patch(id, { position, updatedAt: Date.now() });
    }
  },
});

// Lead mutations
export const createLead = mutation({
  args: {
    columnId: v.id("leadColumns"),
    name: v.string(),
    company: v.optional(v.string()),
    value: v.optional(v.number()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    owner: v.optional(v.string()),
    source: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const column = await ctx.db.get(args.columnId);
    if (!column) throw new Error("Column not found");

    // Check if user can edit this pipeline
    if (!(await canEditPipeline(ctx, column.pipelineId, userId))) {
      throw new Error("Not authorized");
    }

    // Get max position
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
      .collect();
    const maxPosition = leads.length > 0 ? Math.max(...leads.map((l) => l.position)) + 1 : 0;

    const now = Date.now();
    return await ctx.db.insert("leads", {
      columnId: args.columnId,
      name: args.name,
      company: args.company,
      value: args.value,
      email: args.email,
      phone: args.phone,
      owner: args.owner,
      source: args.source,
      notes: args.notes,
      position: maxPosition,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateLead = mutation({
  args: {
    id: v.id("leads"),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
    value: v.optional(v.union(v.number(), v.null())),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    owner: v.optional(v.string()),
    source: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const lead = await ctx.db.get(args.id);
    if (!lead) throw new Error("Lead not found");

    const column = await ctx.db.get(lead.columnId);
    if (!column) throw new Error("Column not found");

    // Check if user can edit this pipeline
    if (!(await canEditPipeline(ctx, column.pipelineId, userId))) {
      throw new Error("Not authorized");
    }

    const { id, ...updates } = args;
    // Handle null value to clear
    const patchData: Record<string, unknown> = { ...updates, updatedAt: Date.now() };
    if (updates.value === null) {
      patchData.value = undefined;
    }
    return await ctx.db.patch(id, patchData);
  },
});

export const deleteLead = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const lead = await ctx.db.get(args.id);
    if (!lead) throw new Error("Lead not found");

    const column = await ctx.db.get(lead.columnId);
    if (!column) throw new Error("Column not found");

    // Check if user can edit this pipeline
    if (!(await canEditPipeline(ctx, column.pipelineId, userId))) {
      throw new Error("Not authorized");
    }

    return await ctx.db.delete(args.id);
  },
});

export const moveLead = mutation({
  args: {
    leadId: v.id("leads"),
    targetColumnId: v.id("leadColumns"),
    targetPosition: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new Error("Lead not found");

    const targetColumn = await ctx.db.get(args.targetColumnId);
    if (!targetColumn) throw new Error("Target column not found");

    // Check if user can edit this pipeline
    if (!(await canEditPipeline(ctx, targetColumn.pipelineId, userId))) {
      throw new Error("Not authorized");
    }

    // Update positions in target column
    const targetLeads = await ctx.db
      .query("leads")
      .withIndex("by_column", (q) => q.eq("columnId", args.targetColumnId))
      .collect();

    const filteredLeads = targetLeads.filter((l) => l._id !== args.leadId);
    filteredLeads.sort((a, b) => a.position - b.position);

    // Reposition leads
    for (let i = 0; i < filteredLeads.length; i++) {
      const newPos = i >= args.targetPosition ? i + 1 : i;
      if (filteredLeads[i].position !== newPos) {
        await ctx.db.patch(filteredLeads[i]._id, { position: newPos });
      }
    }

    // Move the lead
    await ctx.db.patch(args.leadId, {
      columnId: args.targetColumnId,
      position: args.targetPosition,
      updatedAt: Date.now(),
    });
  },
});
