# =============================================================================
# ECOMMERCE FRONTEND DOCKERFILE
# =============================================================================
# Multi-stage build for React application
# 
# Stage 1 (builder): Installs dependencies and builds the React app
# Stage 2 (production): Serves static files with Nginx
#
# Benefits of multi-stage build:
# - Final image is ~25MB instead of ~1.5GB
# - No source code in production image
# - No node_modules in production image
# - Faster deployment and startup
# =============================================================================

# =============================================================================
# STAGE 1: BUILD STAGE
# =============================================================================
# This stage installs dependencies and creates the production build
# Everything in this stage is discarded after the build files are copied

# Use Node.js 20 LTS on Alpine Linux (small base image)
# Alpine is a minimal Linux distribution (~5MB vs ~100MB for Debian)
FROM node:20-alpine AS builder

# Set working directory inside the container
# All subsequent commands will run from this directory
WORKDIR /app

# Install build dependencies that might be needed for some npm packages
# These are required for packages with native code (like node-sass)
RUN apk add --no-cache \
    python3 \
    make \
    g++

# Copy package files first (for better Docker layer caching)
# Docker caches layers, so if package. json hasn't changed,
# npm ci won't run again (faster builds)
COPY package.json package-lock.json* ./

# Create . npmrc to handle peer dependency conflicts
# This is needed because: 
# - react-scripts@5.0.1 requires TypeScript ^3.2.1 || ^4
# - zod@4 and @mantine/core@7 require TypeScript 5.0+
RUN echo "legacy-peer-deps=true" > .npmrc

# Install dependencies
# Using 'npm ci' instead of 'npm install' because: 
# - It's faster (skips some steps)
# - It's stricter (uses exact versions from package-lock.json)
# - It's more reliable for CI/CD pipelines
# --legacy-peer-deps flag handles TypeScript version conflicts
RUN npm ci --legacy-peer-deps

# Copy all source code to the container
# This happens AFTER npm ci so changes to source code
# don't invalidate the npm ci cache layer
COPY . .

# Set environment variables for the build
# These are used during 'npm run build' only
ARG REACT_APP_API_URL
ARG REACT_APP_ENV=production
ARG CI=false

# Make ARG values available as ENV during build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_ENV=$REACT_APP_ENV
ENV CI=$CI

# Build the React application for production
# This creates optimized static files in the /app/build directory
# CI=false prevents treating warnings as errors
RUN npm run build

# =============================================================================
# STAGE 2: PRODUCTION STAGE
# =============================================================================
# This stage creates the final, minimal image that will run in production
# Only the built files are copied from Stage 1

# Use Nginx on Alpine Linux (stable version for reliability)
# nginx:stable-alpine is ~20MB
FROM nginx:stable-alpine AS production

# Add labels for image metadata
# These help identify the image and its purpose
LABEL maintainer="DevOps Team"
LABEL application="ecommerce-frontend"
LABEL description="Ecommerce React Frontend Application"

# Install curl for health checks
# 'curl' is used to check if the server is responding
RUN apk add --no-cache curl

# Remove default Nginx configuration
# We'll replace it with our custom config for React SPA routing
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx configuration
# This config handles React Router (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
# --from=builder means "copy from the 'builder' stage defined above"
# This is the key to multi-stage builds - only copy what you need
COPY --from=builder /app/build /usr/share/nginx/html

# Set correct ownership for nginx user
# The nginx user (UID 101) needs to read these files
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Create a directory for nginx to store its pid file
# and set correct permissions
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Make nginx configuration directory writable
RUN chmod -R 755 /var/cache/nginx

# Expose port 80
# This is the port Nginx listens on inside the container
# It will be mapped to port 3000 on the host in docker-compose. yml
EXPOSE 80

# Health check - Docker will periodically run this command
# If it fails 3 times in a row, Docker marks the container as unhealthy
# --interval:  Time between checks (30 seconds)
# --timeout: Max time for check to complete (10 seconds)
# --start-period: Grace period for container to start (40 seconds)
# --retries: Number of failures before marking unhealthy (3)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Switch to non-root user for security
# Running as root in containers is a security risk
# The 'nginx' user is created by the nginx base image
USER nginx

# Start Nginx in the foreground
# -g 'daemon off;' prevents Nginx from running as a background daemon
# Docker containers should run processes in the foreground
CMD ["nginx", "-g", "daemon off;"]