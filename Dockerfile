# ================================
# Stage 1: Base image with pnpm
# ================================
FROM node:20-alpine AS base

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Set working directory
WORKDIR /app

# ================================
# Stage 2: Install dependencies
# ================================
FROM base AS deps

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# ================================
# Stage 3: Build the application
# ================================
FROM base AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules

# Copy source code
COPY . .

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm turbo build --filter=web

# ================================
# Stage 4: Production runner
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build output
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set hostname to listen on all interfaces
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start the application
CMD ["node", "apps/web/server.js"]
