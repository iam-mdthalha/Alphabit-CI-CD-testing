# =============================================================================
# ECOMMERCE BACKEND DOCKERFILE
# =============================================================================
# Multi-stage build for Node.js API application
#
# Stage 1 (builder): Installs dependencies
# Stage 2 (production): Runs the application
#
# Key Features:
# - Uses Node.js 20 LTS (Long Term Support)
# - Non-root user for security
# - Health check endpoint
# - Production-only dependencies
# =============================================================================

# =============================================================================
# STAGE 1: BUILD STAGE
# =============================================================================
# Install dependencies and prepare the application

FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies (needed for some npm packages)
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Copy package files first for better caching
# If package.json hasn't changed, Docker uses cached node_modules
COPY package.json package-lock.json*./

# Install only production dependencies
# --only=production excludes devDependencies (testing tools, etc.)
# This makes the final image smaller
RUN npm ci --only=production

# Copy source code
COPY . .

# =============================================================================
# STAGE 2: PRODUCTION STAGE
# =============================================================================
# Create the minimal production image

FROM node:20-alpine AS production

# Add labels for image metadata
LABEL maintainer="DevOps Team"
LABEL application="ecommerce-backend"
LABEL description="Ecommerce Node.js Backend API"

# Install runtime dependencies
# - curl:  for health checks
# - dumb-init: proper process management (handles signals correctly)
RUN apk add --no-cache \
    curl \
    dumb-init

# Create a non-root user for security
# Running as root is dangerous - if hacker gets in, they have full control
# Using UID 1001 to avoid conflicts with existing users
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy application from builder stage
# --from=builder:  copy from the builder stage
# --chown=appuser: appgroup: set ownership to non-root user
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json
COPY --from=builder --chown=appuser:appgroup /app/src ./src

# Set environment variables
# NODE_ENV=production enables production optimizations in Node.js/Express
ENV NODE_ENV=production
ENV PORT=4000

# Expose the port the app runs on
# This is documentation - the actual port mapping is in docker-compose.yml
EXPOSE 4000

# Health check
# Docker will call this endpoint every 30 seconds
# If it fails 3 times, the container is marked as unhealthy
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:4000/health || exit 1

# Switch to non-root user
USER appuser

# Use dumb-init as the entrypoint
# dumb-init properly handles signals (SIGTERM, SIGINT)
# This ensures graceful shutdown when container is stopped
ENTRYPOINT ["dumb-init", "--"]

# Start the application
# Using node directly instead of npm start for: 
# - Faster startup (no npm overhead)
# - Better signal handling
# - Lower memory usage
CMD ["node", "src/index.js"]