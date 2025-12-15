#!/bin/bash
set -euo pipefail

# =============================================================================
# NGINX CONFIGURATION DEPLOYMENT SCRIPT
# =============================================================================
# This script copies Nginx configuration files from your project directory
# to the system Nginx directory and reloads Nginx. 
#
# Usage:
#   sudo ./scripts/deploy-nginx-config. sh
#
# What it does:
#   1. Backs up existing configs
#   2. Copies new configs from project to /etc/nginx/
#   3. Tests configuration syntax
#   4. Reloads Nginx if test passes
# =============================================================================

echo "=========================================="
echo "Deploying Nginx Configuration"
echo "For: Ecommerce Application"
echo "=========================================="

# -----------------------------------------------------------------------------
# Configuration
# -----------------------------------------------------------------------------
PROJECT_DIR="${PROJECT_DIR:-/opt/app}"
NGINX_PROJECT_DIR="${PROJECT_DIR}/nginx"
NGINX_SYSTEM_DIR="/etc/nginx"
BACKUP_DIR="/etc/nginx/backup-$(date +%Y%m%d-%H%M%S)"

# -----------------------------------------------------------------------------
# Pre-flight checks
# -----------------------------------------------------------------------------
echo "[1/7] Running pre-flight checks..."

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run with sudo"
    echo "   Usage: sudo ./scripts/deploy-nginx-config.sh"
    exit 1
fi

# Check if project directory exists
if [ ! -d "${NGINX_PROJECT_DIR}" ]; then
    echo "❌ Project nginx directory not found: ${NGINX_PROJECT_DIR}"
    echo "   Make sure you're running this from the project root"
    exit 1
fi

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx is not installed"
    echo "   Run: ./scripts/setup-nginx.sh first"
    exit 1
fi

echo "✅ Pre-flight checks passed"

# -----------------------------------------------------------------------------
# Create backup of existing configuration
# -----------------------------------------------------------------------------
echo "[2/7] Creating backup of existing configuration..."

mkdir -p "${BACKUP_DIR}"

# Backup main config if it exists
if [ -f "${NGINX_SYSTEM_DIR}/nginx.conf" ]; then
    cp "${NGINX_SYSTEM_DIR}/nginx.conf" "${BACKUP_DIR}/"
    echo "   Backed up:  nginx.conf"
fi

# Backup conf.d directory if it exists
if [ -d "${NGINX_SYSTEM_DIR}/conf.d" ]; then
    cp -r "${NGINX_SYSTEM_DIR}/conf. d" "${BACKUP_DIR}/"
    echo "   Backed up: conf.d/"
fi

echo "✅ Backup created at:  ${BACKUP_DIR}"

# -----------------------------------------------------------------------------
# Create required directories
# -----------------------------------------------------------------------------
echo "[3/7] Creating required directories..."

# Create conf.d directory if it doesn't exist
mkdir -p "${NGINX_SYSTEM_DIR}/conf.d"

# Create SSL directories if they don't exist
mkdir -p "${NGINX_SYSTEM_DIR}/ssl/self-signed"
mkdir -p "${NGINX_SYSTEM_DIR}/ssl/letsencrypt"

# Create directory for Let's Encrypt ACME challenges
mkdir -p /var/www/certbot

# Create log directory for app-specific logs
mkdir -p /var/log/nginx

echo "✅ Directories created"

# -----------------------------------------------------------------------------
# Copy main Nginx configuration
# -----------------------------------------------------------------------------
echo "[4/7] Copying main Nginx configuration..."

if [ -f "${NGINX_PROJECT_DIR}/nginx.conf" ]; then
    cp "${NGINX_PROJECT_DIR}/nginx.conf" "${NGINX_SYSTEM_DIR}/nginx.conf"
    echo "   Copied: nginx. conf"
else
    echo "   ⚠️  No nginx.conf found in project, using existing"
fi

# -----------------------------------------------------------------------------
# Copy site configurations
# -----------------------------------------------------------------------------
echo "[5/7] Copying site configurations..."

# Remove default config if it exists (it conflicts with our config)
if [ -f "${NGINX_SYSTEM_DIR}/conf.d/default.conf" ]; then
    rm "${NGINX_SYSTEM_DIR}/conf. d/default.conf"
    echo "   Removed: default. conf (conflicts with our config)"
fi

# Copy all . conf files from project conf.d to system conf.d
if [ -d "${NGINX_PROJECT_DIR}/conf.d" ]; then
    for conf_file in "${NGINX_PROJECT_DIR}/conf.d"/*. conf; do
        if [ -f "$conf_file" ]; then
            cp "$conf_file" "${NGINX_SYSTEM_DIR}/conf.d/"
            echo "   Copied: $(basename $conf_file)"
        fi
    done
else
    echo "   ⚠️  No conf.d directory found in project"
fi

# -----------------------------------------------------------------------------
# Set proper permissions
# -----------------------------------------------------------------------------
echo "[6/7] Setting permissions..."

# Set ownership
chown -R root:root "${NGINX_SYSTEM_DIR}/conf.d"
chown -R root:root "${NGINX_SYSTEM_DIR}/nginx.conf" 2>/dev/null || true

# Set file permissions
chmod 644 "${NGINX_SYSTEM_DIR}/nginx.conf" 2>/dev/null || true
chmod 644 "${NGINX_SYSTEM_DIR}/conf.d"/*. conf 2>/dev/null || true

# SSL directory permissions
chmod 755 "${NGINX_SYSTEM_DIR}/ssl"
chmod 755 "${NGINX_SYSTEM_DIR}/ssl/self-signed"
chmod 755 "${NGINX_SYSTEM_DIR}/ssl/letsencrypt"

echo "✅ Permissions set"

# -----------------------------------------------------------------------------
# Test and reload Nginx
# -----------------------------------------------------------------------------
echo "[7/7] Testing and reloading Nginx..."

# Test configuration syntax
echo "   Testing configuration syntax..."
if nginx -t; then
    echo "   ✅ Configuration syntax is valid"
    
    # Reload Nginx
    echo "   Reloading Nginx..."
    systemctl reload nginx
    
    echo "   ✅ Nginx reloaded successfully"
else
    echo ""
    echo "   ❌ Configuration syntax error!"
    echo ""
    echo "   Restoring backup..."
    
    # Restore backup
    if [ -f "${BACKUP_DIR}/nginx. conf" ]; then
        cp "${BACKUP_DIR}/nginx. conf" "${NGINX_SYSTEM_DIR}/nginx.conf"
    fi
    if [ -d "${BACKUP_DIR}/conf.d" ]; then
        rm -rf "${NGINX_SYSTEM_DIR}/conf. d"
        cp -r "${BACKUP_DIR}/conf.d" "${NGINX_SYSTEM_DIR}/"
    fi
    
    echo "   ✅ Backup restored"
    echo ""
    echo "   Please fix the configuration errors and try again."
    exit 1
fi

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
echo ""
echo "=========================================="
echo "Nginx Configuration Deployed Successfully!"
echo "=========================================="
echo ""
echo "Configuration files:"
echo "  Main config: ${NGINX_SYSTEM_DIR}/nginx.conf"
echo "  Site config: ${NGINX_SYSTEM_DIR}/conf.d/ecommerce.conf"
echo ""
echo "Backup location: ${BACKUP_DIR}"
echo ""
echo "Nginx status:"
systemctl status nginx --no-pager -l | head -5
echo ""
echo "=========================================="
echo "Next steps:"
echo "  1. Make sure SSL certificates exist:"
echo "     ls -la /etc/nginx/ssl/self-signed/"
echo ""
echo "  2. If no SSL certs, generate them:"
echo "     export SERVER_IP=\"your-ec2-ip\""
echo "     sudo -E ./scripts/generate-self-signed-ssl.sh"
echo ""
echo "  3. Test HTTPS access:"
echo "     curl -k https://localhost"
echo "     (Or open https://<SERVER_IP> in browser)"
echo "=========================================="