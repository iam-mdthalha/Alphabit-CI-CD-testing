#!/bin/bash
set -euo pipefail

# ===========================================
# HEALTH CHECK SCRIPT
# Verifies all services are running correctly
# ===========================================

echo "=========================================="
echo "Running Health Checks..."
echo "=========================================="

# ------------------------------------------
# Configuration
# ------------------------------------------
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
BACKEND_URL="${BACKEND_URL:-http://localhost:4000}"
MAX_RETRIES=5
RETRY_DELAY=5

# ------------------------------------------
# Helper function for health checks
# ------------------------------------------
check_health() {
    local service_name=$1
    local url=$2
    local retries=0
    
    echo ""
    echo "Checking ${service_name}..."
    echo "  URL: ${url}"
    
    while [ $retries -lt $MAX_RETRIES ]; do
        if curl -sf "${url}" > /dev/null 2>&1; then
            echo "  ✅ ${service_name} is healthy"
            return 0
        fi
        
        retries=$((retries + 1))
        echo "  ⏳ Attempt ${retries}/${MAX_RETRIES} failed, waiting ${RETRY_DELAY}s..."
        sleep $RETRY_DELAY
    done
    
    echo "  ❌ ${service_name} is NOT healthy after ${MAX_RETRIES} attempts"
    return 1
}

# ------------------------------------------
# Track overall status
# ------------------------------------------
FAILED=0

# ------------------------------------------
# Check Frontend
# ------------------------------------------
if !  check_health "Alphabit Frontend" "${FRONTEND_URL}"; then
    FAILED=1
fi

# ------------------------------------------
# Check Backend Health Endpoint
# ------------------------------------------
if !  check_health "Alphabit Backend" "${BACKEND_URL}/health"; then
    FAILED=1
fi

# ------------------------------------------
# Optional: Check Backend API Response
# ------------------------------------------
echo ""
echo "Checking Backend Health Response..."
HEALTH_RESPONSE=$(curl -sf "${BACKEND_URL}/health" 2>/dev/null || echo "FAILED")

if [ "${HEALTH_RESPONSE}" != "FAILED" ]; then
    echo "  Response: ${HEALTH_RESPONSE}"
    
    # Check if response contains "ok" status
    if echo "${HEALTH_RESPONSE}" | grep -q '"status".*"ok"'; then
        echo "  ✅ Backend health response is valid"
    else
        echo "  ⚠️  Backend responded but status is not 'ok'"
    fi
else
    echo "  ❌ Could not get health response"
fi

# ------------------------------------------
# Check Docker containers (if Docker is available)
# ------------------------------------------
if command -v docker &> /dev/null; then
    echo ""
    echo "Checking Docker container status..."
    echo ""
    
    # List running containers
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(alphabit|NAMES)" || echo "No alphabit containers running"
fi

# ------------------------------------------
# Check Nginx status
# ------------------------------------------
echo ""
echo "Checking Nginx status..."
if systemctl is-active --quiet nginx; then
    echo "  ✅ Nginx is running"
else
    echo "  ❌ Nginx is NOT running"
    FAILED=1
fi

# ------------------------------------------
# Summary
# ------------------------------------------
echo ""
echo "=========================================="
if [ $FAILED -eq 0 ]; then
    echo "✅ All health checks passed!"
    echo "=========================================="
    exit 0
else
    echo "❌ Some health checks failed!"
    echo "=========================================="
    echo ""
    echo "Troubleshooting steps:"
    echo "  1. Check Docker logs: docker logs alphabit-frontend"
    echo "  2. Check Docker logs: docker logs alphabit-backend"
    echo "  3. Check Nginx logs: sudo tail -f /var/log/nginx/error.log"
    echo "  4. Check container status: docker ps -a"
    echo "  5. Restart services: docker compose restart"
    echo ""
    exit 1
fi