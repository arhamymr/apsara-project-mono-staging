#!/bin/bash

# ===========================================
# Deployment Script
# ===========================================
# Usage: ./scripts/deploy.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Docker is not running${NC}"
    exit 1
fi

# Check .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}.env not found, copying from .env.example${NC}"
    cp .env.example .env
    echo -e "${YELLOW}Edit .env with your values and run again${NC}"
    exit 1
fi

# Pull latest (if git repo)
if [ -d ".git" ]; then
    echo -e "${YELLOW}Pulling latest code...${NC}"
    git pull origin main || git pull origin master || true
fi

# Build
echo -e "${YELLOW}Building...${NC}"
docker-compose build --no-cache

# Restart
echo -e "${YELLOW}Restarting services...${NC}"
docker-compose down || true
docker-compose up -d

sleep 5
docker-compose ps

# Cleanup
echo -e "${YELLOW}Cleaning up...${NC}"
docker image prune -f

echo -e "${GREEN}Done!${NC}"
echo -e "Web: http://localhost (port 80)"
echo -e "Backend: http://localhost:8080"
