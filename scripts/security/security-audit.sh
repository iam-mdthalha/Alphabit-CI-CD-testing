#!/bin/bash
# =============================================================================
# SECURITY AUDIT SCRIPT
# =============================================================================
# Description: Performs comprehensive security audit of the server
# Usage: sudo bash security-audit.sh [--full]
# =============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

FULL_AUDIT="${1:-}"
REPORT_FILE="/var/log/security-audit-$(date +%Y%m%d-%H%M%S).txt"

# -----------------------------------------------------------------------------
# FUNCTIONS
# -----------------------------------------------------------------------------
header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

check_pass() {
    echo -e "  ${GREEN}✅ PASS: ${NC} $1"
}

check_fail() {
    echo -e "  ${RED}❌ FAIL:${NC} $1"
}

check_warn() {
    echo -e "  ${YELLOW}⚠️  WARN:${NC} $1"
}

check_info() {
    echo -e "  ${BLUE}ℹ️  INFO:${NC} $1"
}

# -----------------------------------------------------------------------------
# START AUDIT
# -----------------------------------------------------------------------------
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo " 🔒 SECURITY AUDIT REPORT"
echo " Generated: $(date)"
echo " Server: $(hostname)"
echo "═══════════════════════════════════════════════════════════════"

# -----------------------------------------------------------------------------
# 1. SSH CONFIGURATION
# -----------------------------------------------------------------------------
header "1. SSH CONFIGURATION"

# Check root login disabled
if grep -q "^PermitRootLogin no" /etc/ssh/sshd_config; then
    check_pass "Root login disabled"
else
    check_fail "Root login NOT disabled"
fi

# Check password authentication
if grep -q "^PasswordAuthentication no" /etc/ssh/sshd_config; then
    check_pass "Password authentication disabled"
else
    check_warn "Password authentication may be enabled"
fi

# Check SSH port
SSH_PORT=$(grep "^Port" /etc/ssh/sshd_config | awk '{print $2}' || echo "22")
check_info "SSH Port: $SSH_PORT"

# Check MaxAuthTries
MAX_AUTH=$(grep "^MaxAuthTries" /etc/ssh/sshd_config | awk '{print $2}' || echo "not set")
if [[ "$MAX_AUTH" -le 3 ]] 2>/dev/null; then
    check_pass "MaxAuthTries:  $MAX_AUTH"
else
    check_warn "MaxAuthTries: $MAX_AUTH (recommended: 3 or less)"
fi

# -----------------------------------------------------------------------------
# 2. FIREWALL STATUS
# -----------------------------------------------------------------------------
header "2. FIREWALL STATUS"

if ufw status | grep -q "Status: active"; then
    check_pass "UFW firewall is active"
    echo ""
    ufw status numbered | head -20
else
    check_fail "UFW firewall is NOT active"
fi

# -----------------------------------------------------------------------------
# 3. FAIL2BAN STATUS
# -----------------------------------------------------------------------------
header "3. FAIL2BAN STATUS"

if systemctl is-active fail2ban > /dev/null 2>&1; then
    check_pass "Fail2Ban is running"
    echo ""
    fail2ban-client status
    
    # Check banned IPs
    BANNED=$(fail2ban-client status sshd 2>/dev/null | grep "Currently banned" | awk '{print $NF}')
    check_info "Currently banned IPs (SSH): $BANNED"
else
    check_fail "Fail2Ban is NOT running"
fi

# -----------------------------------------------------------------------------
# 4. SYSTEM UPDATES
# -----------------------------------------------------------------------------
header "4. SYSTEM UPDATES"

# Check for available updates
UPDATES=$(apt list --upgradable 2>/dev/null | grep -c upgradable || echo "0")
if [[ "$UPDATES" -eq 0 ]]; then
    check_pass "System is up to date"
else
    check_warn "$UPDATES packages can be upgraded"
fi

# Check unattended-upgrades
if systemctl is-enabled unattended-upgrades > /dev/null 2>&1; then
    check_pass "Automatic security updates enabled"
else
    check_warn "Automatic security updates NOT enabled"
fi

# Check last update time
LAST_UPDATE=$(stat -c %Y /var/lib/apt/periodic/update-success-stamp 2>/dev/null || echo "0")
LAST_UPDATE_HUMAN=$(date -d "@$LAST_UPDATE" 2>/dev/null || echo "Unknown")
check_info "Last apt update: $LAST_UPDATE_HUMAN"

# -----------------------------------------------------------------------------
# 5. USER ACCOUNTS
# -----------------------------------------------------------------------------
header "5. USER ACCOUNTS"

# Check for users with empty passwords
EMPTY_PASS=$(awk -F: '($2 == "") {print $1}' /etc/shadow 2>/dev/null)
if [[ -z "$EMPTY_PASS" ]]; then
    check_pass "No users with empty passwords"
else
    check_fail "Users with empty passwords: $EMPTY_PASS"
fi

# Check for users with UID 0 (other than root)
UID_ZERO=$(awk -F: '($3 == 0 && $1 != "root") {print $1}' /etc/passwd)
if [[ -z "$UID_ZERO" ]]; then
    check_pass "No non-root users with UID 0"
else
    check_fail "Non-root users with UID 0: $UID_ZERO"
fi

# List sudo users
SUDO_USERS=$(getent group sudo | cut -d:  -f4)
check_info "Users in sudo group: $SUDO_USERS"

# -----------------------------------------------------------------------------
# 6. FILE PERMISSIONS
# -----------------------------------------------------------------------------
header "6. FILE PERMISSIONS"

# Check /etc/passwd permissions
PASSWD_PERM=$(stat -c %a /etc/passwd)
if [[ "$PASSWD_PERM" == "644" ]]; then
    check_pass "/etc/passwd permissions: $PASSWD_PERM"
else
    check_fail "/etc/passwd permissions: $PASSWD_PERM (should be 644)"
fi

# Check /etc/shadow permissions
SHADOW_PERM=$(stat -c %a /etc/shadow)
if [[ "$SHADOW_PERM" == "640" ]] || [[ "$SHADOW_PERM" == "600" ]]; then
    check_pass "/etc/shadow permissions: $SHADOW_PERM"
else
    check_fail "/etc/shadow permissions: $SHADOW_PERM (should be 640 or 600)"
fi

# Check SSH directory permissions
if [[ -d /root/.ssh ]]; then
    SSH_DIR_PERM=$(stat -c %a /root/.ssh)
    if [[ "$SSH_DIR_PERM" == "700" ]]; then
        check_pass "/root/.ssh permissions: $SSH_DIR_PERM"
    else
        check_warn "/root/.ssh permissions: $SSH_DIR_PERM (should be 700)"
    fi
fi

# Check for world-writable files in /etc
WORLD_WRITABLE=$(find /etc -type f -perm -002 2>/dev/null | wc -l)
if [[ "$WORLD_WRITABLE" -eq 0 ]]; then
    check_pass "No world-writable files in /etc"
else
    check_warn "$WORLD_WRITABLE world-writable files in /etc"
fi

# -----------------------------------------------------------------------------
# 7. LISTENING SERVICES
# -----------------------------------------------------------------------------
header "7. LISTENING SERVICES"

echo ""
echo "TCP Ports:"
ss -tlnp | grep LISTEN
echo ""
echo "UDP Ports:"
ss -ulnp | grep -v "^$" || echo "No UDP listeners"

# -----------------------------------------------------------------------------
# 8. DOCKER SECURITY
# -----------------------------------------------------------------------------
header "8. DOCKER SECURITY"

if command -v docker &> /dev/null; then
    check_info "Docker version: $(docker --version)"
    
    # Check Docker socket permissions
    DOCKER_SOCK_PERM=$(stat -c %a /var/run/docker.sock 2>/dev/null || echo "N/A")
    check_info "Docker socket permissions: $DOCKER_SOCK_PERM"
    
    # Check running containers
    RUNNING_CONTAINERS=$(docker ps -q | wc -l)
    check_info "Running containers: $RUNNING_CONTAINERS"
    
    # Check for containers running as root
    if [[ "$RUNNING_CONTAINERS" -gt 0 ]]; then
        echo ""
        echo "Container Security:"
        docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
    fi
else
    check_info "Docker not installed"
fi

# -----------------------------------------------------------------------------
# 9. SSL/TLS CERTIFICATES
# -----------------------------------------------------------------------------
header "9. SSL/TLS CERTIFICATES"

# Check self-signed cert expiry
if [[ -f /etc/nginx/ssl/self-signed/ecommerce.crt ]]; then
    CERT_EXPIRY=$(openssl x509 -enddate -noout -in /etc/nginx/ssl/self-signed/ecommerce.crt | cut -d= -f2)
    check_info "Self-signed cert expires: $CERT_EXPIRY"
fi

# Check Let's Encrypt certs
if [[ -d /etc/letsencrypt/live ]]; then
    for cert_dir in /etc/letsencrypt/live/*/; do
        if [[ -f "${cert_dir}cert.pem" ]]; then
            DOMAIN=$(basename "$cert_dir")
            EXPIRY=$(openssl x509 -enddate -noout -in "${cert_dir}cert.pem" | cut -d= -f2)
            check_info "Let's Encrypt cert ($DOMAIN) expires: $EXPIRY"
        fi
    done
fi

# -----------------------------------------------------------------------------
# 10. NGINX SECURITY
# -----------------------------------------------------------------------------
header "10. NGINX SECURITY"

if command -v nginx &> /dev/null; then
    # Check Nginx version disclosure
    if grep -q "server_tokens off" /etc/nginx/nginx.conf 2>/dev/null; then
        check_pass "Nginx version hidden"
    else
        check_warn "Nginx version may be exposed"
    fi
    
    # Check Nginx status
    if systemctl is-active nginx > /dev/null 2>&1; then
        check_pass "Nginx is running"
    else
        check_fail "Nginx is NOT running"
    fi
    
    # Test Nginx config
    if nginx -t 2>/dev/null; then
        check_pass "Nginx configuration valid"
    else
        check_fail "Nginx configuration invalid"
    fi
else
    check_info "Nginx not installed"
fi

# -----------------------------------------------------------------------------
# 11. AUDIT LOGGING
# -----------------------------------------------------------------------------
header "11. AUDIT LOGGING"

if systemctl is-active auditd > /dev/null 2>&1; then
    check_pass "Audit daemon is running"
    AUDIT_RULES=$(auditctl -l 2>/dev/null | wc -l)
    check_info "Active audit rules: $AUDIT_RULES"
else
    check_warn "Audit daemon is NOT running"
fi

# -----------------------------------------------------------------------------
# 12. KERNEL SECURITY
# -----------------------------------------------------------------------------
header "12. KERNEL SECURITY"

# Check ASLR
ASLR=$(cat /proc/sys/kernel/randomize_va_space)
if [[ "$ASLR" -eq 2 ]]; then
    check_pass "ASLR fully enabled"
else
    check_warn "ASLR not fully enabled (value: $ASLR)"
fi

# Check SYN cookies
SYN_COOKIES=$(cat /proc/sys/net/ipv4/tcp_syncookies)
if [[ "$SYN_COOKIES" -eq 1 ]]; then
    check_pass "SYN cookies enabled"
else
    check_warn "SYN cookies not enabled"
fi

# Check IP forwarding
IP_FORWARD=$(cat /proc/sys/net/ipv4/ip_forward)
if [[ "$IP_FORWARD" -eq 0 ]]; then
    check_pass "IP forwarding disabled"
else
    check_warn "IP forwarding is enabled"
fi

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
header "AUDIT SUMMARY"

echo ""
echo "Audit completed at:  $(date)"
echo "Report saved to: $REPORT_FILE"
echo ""
echo "Recommended actions:"
echo "  1. Review any FAIL or WARN items above"
echo "  2. Run 'sudo lynis audit system' for deeper analysis"
echo "  3. Check logs in /var/log/auth.log and /var/log/fail2ban.log"
echo "  4. Review firewall rules with 'sudo ufw status verbose'"
echo ""

# Save report
exec > >(tee -a "$REPORT_FILE") 2>&1