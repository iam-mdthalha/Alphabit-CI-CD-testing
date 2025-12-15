#!/bin/bash
set -euo pipefail

# ===========================================
# LET'S ENCRYPT SSL MIGRATION SCRIPT
# Migrates from self-signed to free Let's Encrypt SSL
# ===========================================

echo "=========================================="
echo "Let's Encrypt SSL Migration"
echo "=========================================="
echo ""
echo "ℹ️  Let's Encrypt SSL certificates are FREE"
echo "   for all domains and subdomains."
echo "   No cost involved."
echo ""
echo "=========================================="

# ------------------------------------------
# Configuration
# ------------------------------------------
DOMAIN="${DOMAIN:-app-ind.u-clo.com}"
EMAIL="${LETSENCRYPT_EMAIL:-<REQUIRED_PLACEHOLDER_MISSING>}"
SERVER_IP="${SERVER_IP:-<SERVER_IP>}"

# ------------------------------------------
# Pre-flight checks
# ------------------------------------------
echo "[1/7] Running pre-flight checks..."

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "Please run with sudo:  sudo $0"
    exit 1
fi

# Check if domain is configured
if [ "${DOMAIN}" == "app-ind.u-clo.com" ]; then
    echo ""
    echo "⚠️  Using default domain: ${DOMAIN}"
    echo "   Make sure DNS is configured before proceeding."
    echo ""
fi

# Check if email is configured
if [ "${EMAIL}" == "<REQUIRED_PLACEHOLDER_MISSING>" ]; then
    echo ""
    echo "❌ ERROR: Email address not configured"
    echo ""
    echo "Please set LETSENCRYPT_EMAIL environment variable:"
    echo "  export LETSENCRYPT_EMAIL=your-email@example.com"
    echo "  sudo -E ./migrate-to-letsencrypt.sh"
    echo ""
    exit 1
fi

# ------------------------------------------
# Step 2: Check DNS configuration
# ------------------------------------------
echo "[2/7] Checking DNS configuration..."

# Get the IP that the domain resolves to
RESOLVED_IP=$(dig +short ${DOMAIN} | tail -n1)

if [ -z "${RESOLVED_IP}" ]; then
    echo ""
    echo "❌ ERROR: Domain ${DOMAIN} does not resolve to any IP"
    echo ""
    echo "Please configure DNS before running this script:"
    echo "  1. Go to your DNS provider"
    echo "  2. Add an A record:  ${DOMAIN} -> ${SERVER_IP}"
    echo "  3. Wait for DNS propagation (5-30 minutes)"
    echo "  4. Run this script again"
    echo ""
    exit 1
fi

echo "Domain ${DOMAIN} resolves to:  ${RESOLVED_IP}"

# Warn if IP doesn't match (but don't fail - user might know what they're doing)
if [ "${RESOLVED_IP}" != "${SERVER_IP}" ]; then
    echo ""
    echo "⚠️  WARNING: Domain resolves to ${RESOLVED_IP}"
    echo "   but SERVER_IP is set to ${SERVER_IP}"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# ------------------------------------------
# Step 3: Install Certbot
# ------------------------------------------
echo "[3/7] Installing Certbot..."

apt update
apt install -y certbot python3-certbot-nginx

echo "Certbot version:"
certbot --version

# ------------------------------------------
# Step 4: Stop Nginx temporarily (for standalone mode)
# ------------------------------------------
echo "[4/7] Preparing for certificate request..."

# Test if port 80 is available
if lsof -Pi :80 -sTCP: LISTEN -t >/dev/null 2>&1; then
    echo "Port 80 is in use (probably by Nginx)"
    echo "Using Nginx plugin for certificate request"
    CERTBOT_MODE="nginx"
else
    echo "Port 80 is free, using standalone mode"
    CERTBOT_MODE="standalone"
fi

# ------------------------------------------
# Step 5: Obtain certificate
# ------------------------------------------
echo "[5/7] Requesting SSL certificate..."

if [ "${CERTBOT_MODE}" == "nginx" ]; then
    certbot --nginx \
        -d ${DOMAIN} \
        --non-interactive \
        --agree-tos \
        --email ${EMAIL} \
        --redirect
else
    # Stop nginx temporarily
    systemctl stop nginx
    
    certbot certonly \
        --standalone \
        -d ${DOMAIN} \
        --non-interactive \
        --agree-tos \
        --email ${EMAIL}
    
    # Start nginx again
    systemctl start nginx
fi

# ------------------------------------------
# Step 6: Setup auto-renewal
# ------------------------------------------
echo "[6/7] Setting up auto-renewal..."

# Enable certbot timer (for automatic renewal)
systemctl enable certbot.timer
systemctl start certbot.timer

# Verify timer is active
echo "Certbot timer status:"
systemctl status certbot. timer --no-pager

# ------------------------------------------
# Step 7: Test renewal
# ------------------------------------------
echo "[7/7] Testing certificate renewal..."

certbot renew --dry-run

# ------------------------------------------
# Summary
# ------------------------------------------
echo ""
echo "=========================================="
echo "Let's Encrypt Migration Complete!"
echo "=========================================="
echo ""
echo "Certificate files:"
echo "  Certificate:  /etc/letsencrypt/live/${DOMAIN}/fullchain.pem"
echo "  Private Key: /etc/letsencrypt/live/${DOMAIN}/privkey.pem"
echo ""
echo "Certificate details:"
openssl x509 -in /etc/letsencrypt/live/${DOMAIN}/fullchain.pem -noout -subject -dates
echo ""
echo "Auto-renewal:  ENABLED"
echo "  Certificates will renew automatically before expiry"
echo "  Certbot timer checks twice daily"
echo ""
echo "=========================================="
echo "Nginx Configuration Updated:"
echo ""
echo "Your Nginx config should now contain:"
echo "  ssl_certificate     /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;"
echo "  ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;"
echo "=========================================="
echo ""
echo "To verify SSL, visit: https://${DOMAIN}"
echo "Browser should show a valid certificate (green padlock)"
echo "=========================================="