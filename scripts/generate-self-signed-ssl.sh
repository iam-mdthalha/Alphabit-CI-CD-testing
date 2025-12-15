#!/bin/bash
set -euo pipefail

# ===========================================
# SELF-SIGNED SSL CERTIFICATE GENERATOR
# For development and testing
# ===========================================

echo "=========================================="
echo "Generating Self-Signed SSL Certificate..."
echo "=========================================="

# ------------------------------------------
# Configuration
# ------------------------------------------
# Replace <SERVER_IP> with your actual EC2 public IP
SERVER_IP="${SERVER_IP:-<SERVER_IP>}"
DOMAIN="${DOMAIN:-app-ind.u-clo.com}"
CERT_DIR="/etc/nginx/ssl/self-signed"
CERT_NAME="alphabit"
DAYS_VALID=365

# Certificate details
COUNTRY="US"
STATE="California"
CITY="San Francisco"
ORGANIZATION="Alphabit"
ORGANIZATIONAL_UNIT="DevOps"

# ------------------------------------------
# Step 1: Create certificate directory
# ------------------------------------------
echo "[1/5] Creating certificate directory..."
sudo mkdir -p ${CERT_DIR}

# ------------------------------------------
# Step 2: Create OpenSSL configuration file
# ------------------------------------------
# This config file allows us to create a certificate
# that's valid for multiple names (localhost, IP, domain)
echo "[2/5] Creating OpenSSL configuration..."

# Create temporary config file
cat > /tmp/openssl-san.cnf << EOF
[req]
default_bits       = 2048
default_md         = sha256
default_keyfile    = ${CERT_NAME}. key
prompt             = no
encrypt_key        = no
distinguished_name = req_distinguished_name
req_extensions     = v3_req
x509_extensions    = v3_ca

[req_distinguished_name]
C  = ${COUNTRY}
ST = ${STATE}
L  = ${CITY}
O  = ${ORGANIZATION}
OU = ${ORGANIZATIONAL_UNIT}
CN = ${DOMAIN}

[v3_req]
basicConstraints     = CA:FALSE
keyUsage             = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName       = @alt_names

[v3_ca]
basicConstraints     = critical, CA:FALSE
keyUsage             = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName       = @alt_names

[alt_names]
DNS.1 = ${DOMAIN}
DNS.2 = localhost
DNS.3 = *.${DOMAIN}
IP.1  = ${SERVER_IP}
IP.2  = 127.0.0.1
EOF

echo "OpenSSL config created with:"
echo "  - Domain: ${DOMAIN}"
echo "  - Server IP: ${SERVER_IP}"
echo "  - Localhost: included"

# ------------------------------------------
# Step 3: Generate private key and certificate
# ------------------------------------------
# openssl req:  Create a certificate request
# -x509: Output a self-signed certificate instead of a request
# -nodes: Don't encrypt the private key (no password needed)
# -days: How long the certificate is valid
# -newkey rsa:2048: Create a new 2048-bit RSA key
# -keyout: Where to save the private key
# -out: Where to save the certificate
echo "[3/5] Generating certificate and private key..."
sudo openssl req -x509 \
    -nodes \
    -days ${DAYS_VALID} \
    -newkey rsa:2048 \
    -keyout ${CERT_DIR}/${CERT_NAME}.key \
    -out ${CERT_DIR}/${CERT_NAME}.crt \
    -config /tmp/openssl-san.cnf

# ------------------------------------------
# Step 4: Set proper permissions
# ------------------------------------------
# Private key should only be readable by root
# Certificate can be readable by all (it's public)
echo "[4/5] Setting file permissions..."
sudo chmod 600 ${CERT_DIR}/${CERT_NAME}.key
sudo chmod 644 ${CERT_DIR}/${CERT_NAME}.crt
sudo chown root:root ${CERT_DIR}/${CERT_NAME}.key
sudo chown root:root ${CERT_DIR}/${CERT_NAME}.crt

# ------------------------------------------
# Step 5: Cleanup and verify
# ------------------------------------------
echo "[5/5] Cleaning up and verifying..."
rm -f /tmp/openssl-san. cnf

# Display certificate information
echo ""
echo "=========================================="
echo "SSL Certificate Generated Successfully!"
echo "=========================================="
echo ""
echo "Certificate files:"
echo "  Certificate: ${CERT_DIR}/${CERT_NAME}.crt"
echo "  Private Key: ${CERT_DIR}/${CERT_NAME}.key"
echo ""
echo "Certificate details:"
sudo openssl x509 -in ${CERT_DIR}/${CERT_NAME}.crt -noout -subject -dates
echo ""
echo "Subject Alternative Names (valid for):"
sudo openssl x509 -in ${CERT_DIR}/${CERT_NAME}.crt -noout -ext subjectAltName
echo ""
echo "=========================================="
echo "⚠️  IMPORTANT NOTES:"
echo ""
echo "1. This is a SELF-SIGNED certificate"
echo "2. Browsers will show a security warning"
echo "3. This is EXPECTED and OK for development"
echo "4. To bypass in Chrome: Type 'thisisunsafe'"
echo "5. For production, migrate to Let's Encrypt"
echo "=========================================="
echo ""
echo "To use this certificate, configure Nginx with:"
echo "  ssl_certificate     ${CERT_DIR}/${CERT_NAME}.crt;"
echo "  ssl_certificate_key ${CERT_DIR}/${CERT_NAME}.key;"
echo "=========================================="