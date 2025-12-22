#!/bin/bash
set -e

echo "🔐 Creating security directory structure..."

# -------------------------------
# Scripts folder (security)
# -------------------------------
mkdir -p scripts/security

touch scripts/security/harden-ssh.sh
touch scripts/security/setup-fail2ban.sh
touch scripts/security/setup-auto-updates.sh
touch scripts/security/setup-audit-logging.sh
touch scripts/security/harden-kernel.sh
touch scripts/security/setup-intrusion-detection.sh
touch scripts/security/security-audit.sh

# Master security script
touch scripts/security-full-setup.sh

# -------------------------------
# Configs folder (security)
# -------------------------------
mkdir -p configs/security/fail2ban/filter.d
mkdir -p configs/security/auditd
mkdir -p configs/security/sysctl

touch configs/security/sshd_config
touch configs/security/fail2ban/jail.local
touch configs/security/fail2ban/filter.d/nginx-custom.conf
touch configs/security/auditd/audit.rules
touch configs/security/sysctl/99-security.conf

# -------------------------------
# Docs folder
# -------------------------------
mkdir -p docs

touch docs/SECURITY_CHECKLIST.md
touch docs/INCIDENT_RESPONSE.md
touch docs/HARDENING_GUIDE.md

# -------------------------------
# GitHub Actions workflow
# -------------------------------
mkdir -p .github/workflows
touch .github/workflows/security-scan.yml

# -------------------------------
# Make scripts executable
# -------------------------------
chmod +x scripts/security/*.sh
chmod +x scripts/security-full-setup.sh

echo "✅ Security structure created successfully."
