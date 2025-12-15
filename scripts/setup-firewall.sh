#!/bin/bash
set -euo pipefail

# ===========================================
# UFW FIREWALL CONFIGURATION SCRIPT
# For Ubuntu 22.04 LTS
# ===========================================

echo "=========================================="
echo "Starting Firewall Configuration..."
echo "=========================================="

# ------------------------------------------
# Step 1: Install UFW (if not already installed)
# ------------------------------------------
# UFW = Uncomplicated Firewall
# It's a user-friendly interface for iptables
echo "[1/6] Checking UFW installation..."
if ! command -v ufw &> /dev/null; then
    echo "Installing UFW..."
    sudo apt update
    sudo apt install -y ufw
else
    echo "UFW is already installed"
fi

# ------------------------------------------
# Step 2: Reset UFW to default state
# ------------------------------------------
# This ensures we start with a clean configuration
echo "[2/6] Resetting UFW to defaults..."
sudo ufw --force reset

# ------------------------------------------
# Step 3: Set default policies
# ------------------------------------------
# DEFAULT DENY INCOMING:  Block all incoming traffic by default
# DEFAULT ALLOW OUTGOING: Allow all outgoing traffic (server can reach internet)
# This is the most secure approach - only allow what you explicitly need
echo "[3/6] Setting default policies..."
sudo ufw default deny incoming
sudo ufw default allow outgoing

# ------------------------------------------
# Step 4: Allow required ports
# ------------------------------------------
echo "[4/6] Configuring allowed ports..."

# SSH (Port 22)
# CRITICAL: Always allow SSH first before enabling firewall
# Otherwise you'll lock yourself out of the server! 
echo "  - Allowing SSH (port 22)..."
sudo ufw allow 22/tcp comment 'SSH access'

# HTTP (Port 80)
# Needed for: 
# 1. Redirecting HTTP to HTTPS
# 2. Let's Encrypt certificate verification
echo "  - Allowing HTTP (port 80)..."
sudo ufw allow 80/tcp comment 'HTTP traffic'

# HTTPS (Port 443)
# Main port for secure web traffic
echo "  - Allowing HTTPS (port 443)..."
sudo ufw allow 443/tcp comment 'HTTPS traffic'

# ------------------------------------------
# Step 5: Enable UFW
# ------------------------------------------
# --force flag prevents the confirmation prompt
echo "[5/6] Enabling firewall..."
sudo ufw --force enable

# ------------------------------------------
# Step 6: Display status
# ------------------------------------------
echo "[6/6] Verifying configuration..."
echo ""
echo "=========================================="
echo "Firewall Configuration Complete!"
echo "=========================================="
echo ""
echo "Current UFW Status:"
echo ""
sudo ufw status verbose
echo ""
echo "=========================================="
echo "Allowed Ports:"
echo "  22/tcp  - SSH (remote access)"
echo "  80/tcp  - HTTP (redirects to HTTPS)"
echo "  443/tcp - HTTPS (secure web traffic)"
echo ""
echo "All other incoming ports are BLOCKED"
echo "=========================================="
echo ""
echo "⚠️  IMPORTANT NOTES:"
echo "  1. SSH is allowed - you won't be locked out"
echo "  2. If you add new services, remember to open their ports"
echo "  3. To check status anytime:  sudo ufw status"
echo "  4. To allow a new port: sudo ufw allow <port>/tcp"
echo "=========================================="