#!/bin/bash
set -euo pipefail

# ===========================================
# NGINX INSTALLATION SCRIPT
# For Ubuntu 22.04 LTS
# ===========================================

echo "=========================================="
echo "Starting Nginx Installation..."
echo "=========================================="

# ------------------------------------------
# Step 1: Install dependencies
# ------------------------------------------
echo "[1/8] Installing dependencies..."
sudo apt update
sudo apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring

# ------------------------------------------
# Step 2: Add Nginx official GPG key
# ------------------------------------------
# Official Nginx repo has newer versions than Ubuntu's default
echo "[2/8] Adding Nginx GPG key..."
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
    | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null

# ------------------------------------------
# Step 3: Add Nginx repository
# ------------------------------------------
# 'stable' branch is recommended for production
echo "[3/8] Adding Nginx repository..."
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/ubuntu $(lsb_release -cs) nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list

# ------------------------------------------
# Step 4: Pin Nginx packages
# ------------------------------------------
# This ensures apt prefers Nginx's repo over Ubuntu's
echo "[4/8] Setting repository priority..."
echo -e "Package: *\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" \
    | sudo tee /etc/apt/preferences.d/99nginx

# ------------------------------------------
# Step 5: Install Nginx
# ------------------------------------------
echo "[5/8] Installing Nginx..."
sudo apt update
sudo apt install -y nginx

# ------------------------------------------
# Step 6: Create required directories
# ------------------------------------------
# These directories will store our SSL certificates and configs
echo "[6/8] Creating directories..."

# Main Nginx directories (usually already exist)
sudo mkdir -p /etc/nginx/conf.d
sudo mkdir -p /etc/nginx/snippets

# SSL certificate directories
sudo mkdir -p /etc/nginx/ssl/self-signed
sudo mkdir -p /etc/nginx/ssl/letsencrypt

# Log directories for our apps
sudo mkdir -p /var/log/nginx

# ------------------------------------------
# Step 7: Set permissions
# ------------------------------------------
# Nginx runs as 'nginx' user, so it needs read access to certs
echo "[7/8] Setting permissions..."
sudo chown -R root:root /etc/nginx/ssl
sudo chmod 755 /etc/nginx/ssl
sudo chmod 755 /etc/nginx/ssl/self-signed
sudo chmod 755 /etc/nginx/ssl/letsencrypt

# ------------------------------------------
# Step 8: Enable and start Nginx
# ------------------------------------------
echo "[8/8] Enabling Nginx service..."
sudo systemctl enable nginx
sudo systemctl start nginx

# ------------------------------------------
# Verification
# ------------------------------------------
echo ""
echo "=========================================="
echo "Nginx Installation Complete!"
echo "=========================================="
echo ""
echo "Nginx version:"
nginx -v
echo ""
echo "Nginx status:"
sudo systemctl status nginx --no-pager -l
echo ""
echo "=========================================="
echo "Directory structure created:"
echo "  /etc/nginx/conf. d/        - Site configurations"
echo "  /etc/nginx/ssl/self-signed/ - Self-signed certificates"
echo "  /etc/nginx/ssl/letsencrypt/ - Let's Encrypt certificates"
echo "  /var/log/nginx/           - Log files"
echo "=========================================="
echo ""
echo "To test Nginx is working, open in browser:"
echo "   http://<SERVER_IP>"
echo ""
echo "You should see 'Welcome to nginx!' page"
echo "=========================================="