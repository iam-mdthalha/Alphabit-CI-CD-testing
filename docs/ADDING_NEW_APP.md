# Adding a New Application

This guide explains how to add a new frontend/backend application pair to the infrastructure.

## Port Assignment

| App Number   | Frontend Port | Backend Port |
| ------------ | ------------- | ------------ |
| 1 (Alphabit) | 3000          | 4000         |
| 2            | 3001          | 4001         |
| 3            | 3002          | 4002         |
| 4            | 3003          | 4003         |
| 5            | 3004          | 4004         |
| 6            | 3005          | 4005         |

## Step 1: Create Directory Structure

```bash
#!/bin/bash
set -euo pipefail

APP_NAME="newapp"

mkdir -p ${APP_NAME}-frontend/src
mkdir -p ${APP_NAME}-backend/src
mkdir -p logs/${APP_NAME}-frontend
mkdir -p logs/${APP_NAME}-backend
```

## Step 2: Copy Dockerfile Templates

```bash
#!/bin/bash
set -euo pipefail

APP_NAME="newapp"

cp alphabit-frontend/Dockerfile ${APP_NAME}-frontend/Dockerfile
cp alphabit-frontend/. env.example ${APP_NAME}-frontend/.env.example
cp alphabit-frontend/nginx.conf ${APP_NAME}-frontend/nginx.conf

cp alphabit-backend/Dockerfile ${APP_NAME}-backend/Dockerfile
cp alphabit-backend/. env.example ${APP_NAME}-backend/.env.example
cp alphabit-backend/package.json ${APP_NAME}-backend/package. json
cp alphabit-backend/src/index.js ${APP_NAME}-backend/src/index. js
```

## Step 3: Update Environment Files

Edit `${APP_NAME}-frontend/.env.example`:

```env
REACT_APP_API_URL=https://<new-app-domain>/api
REACT_APP_ENV=production
PORT=<NEW_FRONTEND_PORT>
```

Edit `${APP_NAME}-backend/.env.example`:

```env
PORT=<NEW_BACKEND_PORT>
NODE_ENV=production
API_PREFIX=/api
```

## Step 4: Update docker-compose.yml

Add the following services to `docker-compose.yml`:

```yaml
newapp-frontend:
  build:
    context: ./newapp-frontend
    dockerfile: Dockerfile
  container_name: newapp-frontend
  ports:
    - "3001:80"
  env_file:
    - ./newapp-frontend/.env
  networks:
    - app-network
  restart: unless-stopped
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:80"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s

newapp-backend:
  build:
    context: ./newapp-backend
    dockerfile: Dockerfile
  container_name: newapp-backend
  ports:
    - "4001:4001"
  env_file:
    - ./newapp-backend/. env
  networks:
    - app-network
  restart: unless-stopped
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:4001/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

## Step 5: Add Nginx Server Block

Create or update `/etc/nginx/conf.d/newapp.conf`:

```nginx
server {
    listen 80;
    server_name newapp.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name newapp.example.com;

    ssl_certificate     /etc/nginx/ssl/self-signed/newapp.crt;
    ssl_certificate_key /etc/nginx/ssl/self-signed/newapp.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    access_log /var/log/nginx/newapp-access.log;
    error_log /var/log/nginx/newapp-error.log;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:4001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        proxy_pass http://localhost:4001/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

## Step 6: Generate SSL Certificate

```bash
#!/bin/bash
set -euo pipefail

APP_NAME="newapp"
DOMAIN="newapp.example. com"

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/self-signed/${APP_NAME}.key \
    -out /etc/nginx/ssl/self-signed/${APP_NAME}. crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=${DOMAIN}" \
    -addext "subjectAltName=DNS:${DOMAIN},DNS:localhost,IP: <SERVER_IP>"

sudo chmod 600 /etc/nginx/ssl/self-signed/${APP_NAME}.key
sudo chmod 644 /etc/nginx/ssl/self-signed/${APP_NAME}.crt
```

## Step 7: Update CI/CD Matrix

Edit `.github/workflows/ci.yml`:

```yaml
strategy:
  matrix:
    app: [alphabit-frontend, alphabit-backend, newapp-frontend, newapp-backend]
```

## Step 8: Update Health Check Script

Edit `scripts/health-check.sh`:

```bash
# Add new app health checks
curl -f http://localhost:3001 || exit 1
curl -f http://localhost:4001/health || exit 1
```

## Step 9: Reload Services

```bash
#!/bin/bash
set -euo pipefail

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Build and start new containers
docker compose up -d --build newapp-frontend newapp-backend

# Verify health
curl -f http://localhost:3001
curl -f http://localhost:4001/health
```

## Checklist

- [ ] Created frontend directory with Dockerfile and configs
- [ ] Created backend directory with Dockerfile and configs
- [ ] Updated docker-compose.yml with new services
- [ ] Created Nginx server block configuration
- [ ] Generated SSL certificate for new domain
- [ ] Updated CI matrix in ci.yml
- [ ] Updated health-check. sh script
- [ ] Tested deployment locally
- [ ] Committed and pushed changes
- [ ] Verified CD pipeline deploys new app
