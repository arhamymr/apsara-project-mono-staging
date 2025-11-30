# Docker Deployment Guide

This guide explains how to deploy the application on a VPS using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git (for pulling updates)

## Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd <project-directory>

# 2. Copy environment file and configure
cp .env.example .env
# Edit .env with your actual values (API keys, etc.)

# 3. Deploy
./scripts/deploy.sh
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| web | 3000 | Next.js web application |
| mastra | 4111 | Mastra AI backend |

## Manual Commands

### Build Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build web
docker-compose build mastra

# Build without cache (fresh build)
docker-compose build --no-cache
```

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f web
docker-compose logs -f mastra
```


### Check Status

```bash
# View running containers
docker-compose ps

# Check container health
docker-compose ps --format "table {{.Name}}\t{{.Status}}"
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Set to `production` |
| `WEB_PORT` | No | Web app port (default: 3000) |
| `MASTRA_PORT` | No | Mastra port (default: 4111) |
| `OPENAI_API_KEY` | Yes* | OpenAI API key for AI features |

*Required if using AI features

## Storage Cleanup

The VPS storage can fill up with old Docker images. Use the cleanup script:

```bash
# Standard cleanup (removes dangling images, stopped containers)
./scripts/docker-cleanup.sh

# Aggressive cleanup (removes ALL unused images)
./scripts/docker-cleanup.sh --aggressive
```

## Automated Deployment

Use the deploy script for automated deployments:

```bash
# Full deployment (pull, build, restart, cleanup)
./scripts/deploy.sh

# Build only (no restart)
./scripts/deploy.sh --build-only

# Deploy without cleanup
./scripts/deploy.sh --no-cleanup
```

## VPS Setup (First Time)

### 1. Install Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in

# Verify installation
docker --version
docker-compose --version
```

### 2. Clone and Configure

```bash
git clone <your-repo-url>
cd <project-directory>
cp .env.example .env
nano .env  # Edit with your values
```

### 3. Make Scripts Executable

```bash
chmod +x scripts/deploy.sh
chmod +x scripts/docker-cleanup.sh
```

### 4. Deploy

```bash
./scripts/deploy.sh
```

## Reverse Proxy (Optional)

For production, use Nginx as a reverse proxy with SSL:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/mastra {
        proxy_pass http://localhost:4111;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs web
docker-compose logs mastra

# Check if port is in use
sudo lsof -i :3000
sudo lsof -i :4111
```

### Out of disk space

```bash
# Run aggressive cleanup
./scripts/docker-cleanup.sh --aggressive

# Check disk usage
df -h
docker system df
```

### Build fails

```bash
# Clear build cache and rebuild
docker builder prune -f
docker-compose build --no-cache
```
