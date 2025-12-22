import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

auth.addHttpRoutes(http);

// Session validation endpoint for backend services (storage, etc.)
http.route({
  path: "/api/validate-session",
  method: "POST",
  handler: httpAction(async (ctx) => {
    try {
      // Try to get the authenticated user from the request
      const userId = await auth.getUserId(ctx);
      
      if (!userId) {
        return new Response(JSON.stringify({ valid: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Get user details
      const user = await ctx.runQuery(internal.user.getUserById, { userId });

      return new Response(JSON.stringify({
        valid: true,
        userId: userId,
        email: user?.email || null,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({ valid: false }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// API Key validation endpoint for backend
http.route({
  path: "/api/validate-key",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { keyHash } = body as { keyHash: string };

      if (!keyHash) {
        return new Response(JSON.stringify({ error: "keyHash is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log(keyHash, "keyhash from this")
      const validatedKey = await ctx.runQuery(internal.apiKeys.validateApiKeyInternal, { keyHash });

      if (!validatedKey) {
        return new Response(JSON.stringify({ valid: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({
        valid: true,
        keyId: validatedKey._id,
        userId: validatedKey.userId,
        permissions: validatedKey.permissions,
        rateLimit: validatedKey.rateLimit,
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// API usage logging endpoint for backend
http.route({
  path: "/api/log-usage",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { apiKeyId, userId, endpoint, method, statusCode, responseTimeMs, ipAddress, userAgent } = body as {
        apiKeyId: string;
        userId: string;
        endpoint: string;
        method: string;
        statusCode: number;
        responseTimeMs: number;
        ipAddress?: string;
        userAgent?: string;
      };

      await ctx.runMutation(internal.apiKeys.logApiUsage, {
        apiKeyId: apiKeyId as Id<"apiKeys">,
        userId: userId as Id<"users">,
        endpoint,
        method,
        statusCode,
        responseTimeMs,
        ipAddress,
        userAgent,
      });

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// Create lead via API
http.route({
  path: "/api/leads",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { userId, name, email, phone, company, source, notes, columnId, pipelineId } = body as {
        userId: string;
        name: string;
        email: string;
        phone?: string;
        company?: string;
        source?: string;
        notes?: string;
        columnId?: string;
        pipelineId?: string;
      };

      if (!userId || !name || !email) {
        return new Response(JSON.stringify({ error: "userId, name, and email are required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      let targetColumnId: Id<"leadColumns">;

      if (columnId) {
        // Use provided column directly
        targetColumnId = columnId as Id<"leadColumns">;
      } else {
        // Get first column of specified pipeline, or create/use default API pipeline
        const result = await ctx.runMutation(internal.leadManagement.getOrCreateApiPipeline, {
          userId: userId as Id<"users">,
          pipelineId: pipelineId ? pipelineId as Id<"leadPipelines"> : undefined,
        });
        
        if ("error" in result) {
          return new Response(JSON.stringify({ error: result.error }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        
        if (!result.columnId) {
          return new Response(JSON.stringify({ error: "Failed to find or create pipeline" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
        targetColumnId = result.columnId;
      }

      // Create the lead
      const lead = await ctx.runMutation(internal.leadManagement.createLeadViaApi, {
        userId: userId as Id<"users">,
        columnId: targetColumnId,
        name,
        email,
        phone,
        company,
        source,
        notes,
      });

      return new Response(JSON.stringify(lead), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Lead creation error:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// List pipelines via API
http.route({
  path: "/api/pipelines",
  method: "POST", // Using POST to pass userId in body
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { userId } = body as { userId: string };

      if (!userId) {
        return new Response(JSON.stringify({ error: "userId is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const pipelines = await ctx.runQuery(internal.leadManagement.listPipelinesForApi, {
        userId: userId as Id<"users">,
      });

      return new Response(JSON.stringify({ pipelines }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

// Get pipeline columns via API
http.route({
  path: "/api/pipeline-columns",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { userId, pipelineId } = body as { userId: string; pipelineId: string };

      if (!userId || !pipelineId) {
        return new Response(JSON.stringify({ error: "userId and pipelineId are required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const columns = await ctx.runQuery(internal.leadManagement.getPipelineColumnsForApi, {
        userId: userId as Id<"users">,
        pipelineId: pipelineId as Id<"leadPipelines">,
      });

      if (!columns) {
        return new Response(JSON.stringify({ error: "Pipeline not found or access denied" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ columns }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }),
});

export default http;
