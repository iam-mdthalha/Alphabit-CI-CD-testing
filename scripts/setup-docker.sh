#!/bin/bash
set -euo pipefail

# ===========================================
# DOCKER INSTALLATION SCRIPT
# For Ubuntu 22.04 LTS
# ===========================================

echo "=========================================="
echo "Starting Docker Installation..."
echo "=========================================="

# ------------------------------------------
# Step 1: Update system packages
# ------------------------------------------
# 'apt update' refreshes the list of available packages
# 'apt upgrade' installs newer versions of installed packages
echo "[1/7] Updating system packages..."
sudo apt update
sudo apt upgrade -y

# ------------------------------------------
# Step 2: Install required dependencies
# ------------------------------------------
# These packages are needed to download Docker over HTTPS
# - ca-certificates:  SSL/TLS certificates
# - curl:  Tool to download files from URLs
# - gnupg: For verifying package signatures
# - lsb-release:  Provides Linux distribution info
echo "[2/7] Installing dependencies..."
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# ------------------------------------------
# Step 3: Add Docker's official GPG key
# ------------------------------------------
# GPG key verifies that Docker packages are authentic
# This prevents installing malicious software
echo "[3/7] Adding Docker GPG key..."
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# ------------------------------------------
# Step 4: Add Docker repository
# ------------------------------------------
# This tells apt where to download Docker packages from
echo "[4/7] Adding Docker repository..."
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# ------------------------------------------
# Step 5: Install Docker Engine
# ------------------------------------------
# - docker-ce: Docker Community Edition (the main Docker engine)
# - docker-ce-cli: Command-line interface for Docker
# - containerd. io: Container runtime that Docker uses
# - docker-buildx-plugin: For building multi-platform images
# - docker-compose-plugin: Docker Compose v2 (newer, faster)
echo "[5/7] Installing Docker Engine..."
sudo apt update
sudo apt install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

# ------------------------------------------
# Step 6: Add current user to docker group
# ------------------------------------------
# By default, Docker requires sudo for every command
# Adding your user to 'docker' group removes this requirement
# You need to log out and back in for this to take effect
echo "[6/7] Adding user to docker group..."
sudo usermod -aG docker $USER

# ------------------------------------------
# Step 7: Enable Docker to start on boot
# ------------------------------------------
# 'enable' means Docker will automatically start when server boots
# 'start' starts Docker right now
echo "[7/7] Enabling Docker service..."
sudo systemctl enable docker
sudo systemctl start docker

# ------------------------------------------
# Verification
# ------------------------------------------
echo ""
echo "=========================================="
echo "Docker Installation Complete!"
echo "=========================================="
echo ""
echo "Docker version:"
docker --version
echo ""
echo "Docker Compose version:"
docker compose version
echo ""
echo "=========================================="
echo "⚠️  IMPORTANT: Log out and log back in"
echo "   for docker group changes to take effect."
echo ""
echo "   Run: exit"
echo "   Then reconnect via SSH"
echo "=========================================="
echo ""
echo "To verify Docker works without sudo, run:"
echo "   docker run hello-world"
echo "=========================================="