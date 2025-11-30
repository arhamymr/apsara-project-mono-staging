#!/bin/bash

# ===========================================
# Automated Deployment Script for VPS
# ===========================================
# This script handles the full deployment process:
# 1. Pull latest code
# 2. Build new Docker images
# 3. Stop old containers
# 4. Start new containers
# 5. Clean up unused resources
#
# Usage: ./scripts/deploy.sh [--no-cleanup] [--build-only]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Parse arguments
SKIP_CLEANUP=false
BUILD_ONLY=false

for arg in "$@"; do
    case $arg in
        --no-cleanup)
            SKIP_CLEANUP=true
            shift
            ;;
        --build-only)
            BUILD_ONLY=true
            shift
            ;;
    esac
done

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Starting Deployment${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "${BLUE}Project directory: ${PROJECT_DIR}${NC}"

cd "$PROJECT_DIR"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    exit 1
fi


# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Warning: .env file not found. Copying from .env.example${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${YELLOW}Please edit .env with your actual values before running again${NC}"
        exit 1
    else
        echo -e "${RED}Error: .env.example not found${NC}"
        exit 1
    fi
fi

# Step 1: Pull latest code (if git repo)
if [ -d ".git" ]; then
    echo -e "\n${YELLOW}Step 1: Pulling latest code...${NC}"
    git pull origin main || git pull origin master || echo -e "${YELLOW}Could not pull, continuing with local code${NC}"
else
    echo -e "\n${YELLOW}Step 1: Skipping git pull (not a git repository)${NC}"
fi

# Step 2: Build new Docker images
echo -e "\n${YELLOW}Step 2: Building Docker images...${NC}"
docker-compose build --no-cache

if [ "$BUILD_ONLY" == true ]; then
    echo -e "\n${GREEN}Build complete! Skipping container restart (--build-only flag)${NC}"
    exit 0
fi

# Step 3: Stop old containers
echo -e "\n${YELLOW}Step 3: Stopping old containers...${NC}"
docker-compose down || true

# Step 4: Start new containers
echo -e "\n${YELLOW}Step 4: Starting new containers...${NC}"
docker-compose up -d

# Wait for containers to be healthy
echo -e "\n${YELLOW}Waiting for containers to be healthy...${NC}"
sleep 10

# Check container status
echo -e "\n${YELLOW}Container status:${NC}"
docker-compose ps

# Step 5: Cleanup (unless skipped)
if [ "$SKIP_CLEANUP" == false ]; then
    echo -e "\n${YELLOW}Step 5: Running cleanup...${NC}"
    "$SCRIPT_DIR/docker-cleanup.sh"
else
    echo -e "\n${YELLOW}Step 5: Skipping cleanup (--no-cleanup flag)${NC}"
fi

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "${BLUE}Web app:    http://localhost:${WEB_PORT:-3000}${NC}"
echo -e "${BLUE}Mastra API: http://localhost:${MASTRA_PORT:-4111}${NC}"
