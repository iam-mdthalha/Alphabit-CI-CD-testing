# =============================================================================
# ECOMMERCE FRONTEND - NGINX ONLY (PRODUCTION)
# =============================================================================
# React is built OUTSIDE Docker
# This image only serves static files
# =============================================================================

FROM nginx:stable-alpine

LABEL maintainer="DevOps Team"
LABEL application="ecommerce-frontend"
LABEL description="Ecommerce React Frontend (Prebuilt)"

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default static files
RUN rm -rf /usr/share/nginx/html/*

# Copy React build output
COPY build/ /usr/share/nginx/html/

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
