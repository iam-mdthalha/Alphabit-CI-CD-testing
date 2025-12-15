# SSL Migration Guide: Self-Signed to Let's Encrypt

This guide explains how to migrate from self-signed SSL certificates to free Let's Encrypt certificates.

## Prerequisites

- Domain DNS must be pointing to your server IP
- Port 80 must be accessible from the internet (for HTTP-01 challenge)
- Server must be publicly accessible

## Important Note

> **Let's Encrypt SSL certificates are FREE for all domains and subdomains. No cost involved.**

## Step 1: Verify DNS Configuration

```bash
#!/bin/bash
set -euo pipefail

DOMAIN="app-ind.u-clo.com"
SERVER_IP="<SERVER_IP>"

# Check DNS resolution
RESOLVED_IP=$(dig +short ${DOMAIN})

if [ "${RESOLVED_IP}" == "${SERVER_IP}" ]; then
    echo "DNS is correctly configured"
else
    echo "DNS not configured.  Expected: ${SERVER_IP}, Got:  ${RESOLVED_IP}"
    exit 1
fi
```

## Step 2: Run Migration Script

```bash
sudo ./scripts/migrate-to-letsencrypt.sh
```

## Step 3: Manual Migration (Alternative)

### Install Certbot

```bash
#!/bin/bash
set -euo pipefail

sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

### Obtain Certificate

```bash
#!/bin/bash
set -euo pipefail

DOMAIN="app-ind. u-clo.com"

sudo certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email <REQUIRED_PLACEHOLDER_MISSING>
```

### Update Nginx Configuration

Edit `/etc/nginx/conf.d/alphabit.conf`:

```nginx
# Comment out self-signed certificates
# ssl_certificate     /etc/nginx/ssl/self-signed/alphabit.crt;
# ssl_certificate_key /etc/nginx/ssl/self-signed/alphabit.key;

# Enable Let's Encrypt certificates
ssl_certificate     /etc/letsencrypt/live/app-ind.u-clo.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/app-ind.u-clo.com/privkey.pem;
```

### Test and Reload Nginx

```bash
#!/bin/bash
set -euo pipefail

sudo nginx -t
sudo systemctl reload nginx
```

## Step 4: Setup Auto-Renewal

### Enable Certbot Timer

```bash
#!/bin/bash
set -euo pipefail

sudo systemctl enable certbot. timer
sudo systemctl start certbot.timer
```

### Verify Timer Status

```bash
sudo systemctl status certbot.timer
```

### Test Renewal

```bash
sudo certbot renew --dry-run
```

## Step 5: Verify SSL

```bash
#!/bin/bash
set -euo pipefail

DOMAIN="app-ind.u-clo.com"

# Check certificate details
echo | openssl s_client -servername ${DOMAIN} -connect ${DOMAIN}:443 2>/dev/null | openssl x509 -noout -dates

# Verify no browser warnings
curl -I https://${DOMAIN}
```

## Certificate Locations

| Type          | Certificate                                             | Private Key                                            |
| ------------- | ------------------------------------------------------- | ------------------------------------------------------ |
| Self-Signed   | `/etc/nginx/ssl/self-signed/alphabit.crt`               | `/etc/nginx/ssl/self-signed/alphabit.key`              |
| Let's Encrypt | `/etc/letsencrypt/live/app-ind.u-clo.com/fullchain.pem` | `/etc/letsencrypt/live/app-ind.u-clo.com/privkey. pem` |

## Rollback to Self-Signed

If you need to rollback:

```bash
#!/bin/bash
set -euo pipefail

# Edit Nginx config
sudo sed -i 's|/etc/letsencrypt/live/app-ind.u-clo.com/fullchain.pem|/etc/nginx/ssl/self-signed/alphabit.crt|g' /etc/nginx/conf. d/alphabit.conf
sudo sed -i 's|/etc/letsencrypt/live/app-ind.u-clo.com/privkey.pem|/etc/nginx/ssl/self-signed/alphabit. key|g' /etc/nginx/conf.d/alphabit. conf

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## Troubleshooting

### Certificate Not Issued

```bash
# Check if port 80 is accessible
sudo ufw status
curl -I http://app-ind.u-clo. com

# Check Certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### Renewal Failed

```bash
# Check timer status
sudo systemctl status certbot.timer

# Manual renewal
sudo certbot renew --force-renewal

# Check certificate expiry
sudo certbot certificates
```

## Checklist

- [ ] DNS pointing to server IP verified
- [ ] Port 80 accessible from internet
- [ ] Certbot installed
- [ ] Certificate obtained successfully
- [ ] Nginx configuration updated
- [ ] Nginx reloaded without errors
- [ ] Auto-renewal timer enabled
- [ ] Dry-run renewal test passed
- [ ] Browser shows valid certificate (no warnings)
