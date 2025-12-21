import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

/**
 * Helper function to check if user can access a lead pipeline
 */
async function checkPipelineAccess(
  ctx: QueryCtx,
  pipelineId: Id<"leadPipelines">,
  userId: Id<"users">
): Promise<"owner" | "edit" | "view" | "none"> {
  const pipeline = await ctx.db.get(pipelineId);
  if (!pipeline) return "none";

  if (pipeline.userId === userId) return "owner";

  const sharedResources = await ctx.db
    .query("sharedResources")
    .withIndex("by_resource", (q) =>
      q.eq("resourceType", "leadPipeline").eq("resourceId", pipelineId)
    )
    .collect();

  if (sharedResources.length === 0) return "none";

  let highestAccess: "edit" | "view" | "none" = "none";

  for (co